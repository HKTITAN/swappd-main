import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
  status: string;
  username: string;
}

interface TransactionsTabProps {
  transactions: Transaction[];
}

export const TransactionsTab = ({ transactions }: TransactionsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      default: return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
    }
  };

  // Calculate transaction metrics
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const creditTransactions = transactions.filter(t => t.type === 'credit');
  const debitTransactions = transactions.filter(t => t.type === 'debit');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Transaction History</h2>
        <p className="text-muted-foreground">View all SwapCoin transactions and platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()} coins</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
            <div className="text-2xl font-bold">{creditTransactions.length.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Debits</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <ArrowDownLeft className="h-4 w-4 text-red-500 mr-2" />
            <div className="text-2xl font-bold">{debitTransactions.length.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-xs">
                  {transaction.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{transaction.username}</TableCell>
                <TableCell>
                  {transaction.type === 'credit' ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                      Credit
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/20">
                      Debit
                    </Badge>
                  )}
                </TableCell>
                <TableCell className={transaction.type === 'credit' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} coins
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(transaction.created_at).toLocaleDateString()} 
                  <div className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};