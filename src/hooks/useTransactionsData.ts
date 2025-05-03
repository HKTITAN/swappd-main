import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
  status: string;
  username: string;
}

export const useTransactionsData = (searchQuery: string = "") => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Fetching transactions with join to get usernames
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            profiles:user_id (username)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match Transaction interface
        const formattedTransactions: Transaction[] = data.map((transaction: any) => ({
          id: transaction.id,
          user_id: transaction.user_id,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          created_at: transaction.created_at,
          status: transaction.status,
          username: transaction.profiles?.username || 'Unknown User'
        }));

        setTransactions(formattedTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Optional: Set up real-time subscription
    const transactionsSubscription = supabase
      .channel('transactions_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          fetchTransactions(); // Refetch all transactions on change
        }
      )
      .subscribe();

    return () => {
      transactionsSubscription.unsubscribe();
    };
  }, []);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    transactions: filteredTransactions,
    loading,
    error
  };
};