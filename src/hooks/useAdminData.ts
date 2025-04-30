
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserWithProfile = {
  id: string;
  email: string;
  created_at: string;
  profile: {
    username: string | null;
    swapcoins: number;
    avatar_url: string | null;
  };
};

type ItemType = {
  id: string;
  title: string;
  category: string;
  condition: string;
  status: string;
  swapcoins: number;
  created_at: string;
  user_id: string;
};

type ReportType = {
  total_users: number;
  total_items: number;
  total_swapcoins: number;
};

export const useAdminData = (searchQuery: string) => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [reports, setReports] = useState<ReportType>({
    total_users: 0,
    total_items: 0,
    total_swapcoins: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        const userProfiles = profiles.map((profile) => ({
          id: profile.id,
          email: profile.username || '',
          created_at: profile.created_at,
          profile: {
            username: profile.username,
            swapcoins: profile.swapcoins,
            avatar_url: profile.avatar_url
          }
        }));

        setUsers(userProfiles);

        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false });

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        setReports({
          total_users: userProfiles.length,
          total_items: itemsData?.length || 0,
          total_swapcoins: userProfiles.reduce((acc, user) => acc + (user.profile.swapcoins || 0), 0)
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.profile.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    filteredUsers,
    filteredItems,
    reports
  };
};
