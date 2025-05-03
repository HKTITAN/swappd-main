import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define data types for our analytics data
type UserGrowthEntry = { date: string; count: number };
type ItemsByCategoryEntry = { category: string; count: number };
type TransactionVolumeEntry = { date: string; volume: number };
type UserActivityEntry = { date: string; active_users: number };

export interface AnalyticsData {
  userGrowth: UserGrowthEntry[];
  itemsByCategory: ItemsByCategoryEntry[];
  transactionVolume: TransactionVolumeEntry[];
  userActivity: UserActivityEntry[];
  loading: boolean;
  error: string | null;
}

export const useAnalyticsData = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userGrowth: [],
    itemsByCategory: [],
    transactionVolume: [],
    userActivity: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setAnalyticsData(prev => ({ ...prev, loading: true }));
        
        // User Growth - Get monthly user signups
        const { data: userData, error: userError } = await supabase.rpc(
          'get_monthly_user_growth', 
          { months_back: 12 } // Last 12 months
        );

        if (userError) throw userError;

        // Items by Category
        const { data: categoryData, error: categoryError } = await supabase.rpc(
          'get_items_by_category'
        );

        if (categoryError) throw categoryError;

        // Transaction Volume
        const { data: volumeData, error: volumeError } = await supabase.rpc(
          'get_monthly_transaction_volume',
          { months_back: 12 } // Last 12 months
        );

        if (volumeError) throw volumeError;

        // User Activity - Daily active users for last 30 days
        const { data: activityData, error: activityError } = await supabase.rpc(
          'get_daily_active_users',
          { days_back: 30 } // Last 30 days
        );

        if (activityError) throw activityError;

        // Update state with real data
        setAnalyticsData({
          userGrowth: Array.isArray(userData) ? userData as UserGrowthEntry[] : [],
          itemsByCategory: Array.isArray(categoryData) ? categoryData as ItemsByCategoryEntry[] : [],
          transactionVolume: Array.isArray(volumeData) ? volumeData as TransactionVolumeEntry[] : [],
          userActivity: Array.isArray(activityData) ? activityData as UserActivityEntry[] : [],
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setAnalyticsData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load analytics data'
        }));
      }
    };

    fetchAnalyticsData();

    // Set up a refresh interval - analytics data doesn't need to be real-time
    // but refreshed periodically (every 5 minutes here)
    const intervalId = setInterval(fetchAnalyticsData, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return analyticsData;
};