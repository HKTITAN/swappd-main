import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define SupabaseRPC types to resolve TypeScript errors
interface DashboardStatsResult {
  total_users: number;
  total_items: number;
  total_swapcoins: number;
  inventory_total_items: number;
  inventory_low_stock_items: number;
  inventory_out_of_stock_items: number;
  inventory_total_value: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalItems: number;
  totalSwapcoins: number;
  inventoryStats: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  };
  loading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalItems: 0,
    totalSwapcoins: 0,
    inventoryStats: {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0
    },
    loading: true,
    error: null
  });

  const fetchDashboardStats = async () => {
    try {
      setDashboardStats(prev => ({ ...prev, loading: true, error: null }));

      // Use Supabase function to get all stats in one call
      // @ts-ignore - Ignore TypeScript errors for Supabase RPC calls
      const result = await supabase.rpc('get_dashboard_stats');

      if (result.error) throw result.error;

      const data = result.data as DashboardStatsResult[];
      
      if (data && data.length > 0) {
        const stats = data[0];
        setDashboardStats({
          totalUsers: stats.total_users || 0,
          totalItems: stats.total_items || 0,
          totalSwapcoins: stats.total_swapcoins || 0,
          inventoryStats: {
            totalItems: stats.inventory_total_items || 0,
            lowStockItems: stats.inventory_low_stock_items || 0,
            outOfStockItems: stats.inventory_out_of_stock_items || 0,
            totalValue: stats.inventory_total_value || 0
          },
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setDashboardStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard statistics'
      }));
    }
  };

  // Function to add new inventory item
  const addInventoryItem = async (item: {
    title: string;
    description: string;
    category: string;
    condition?: string;
    price: number;
    stock_quantity: number;
    images: File[];
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Generate SKU
      const sku = `${item.category.substring(0, 3).toUpperCase()}-${Date.now().toString().substring(9)}`;

      // Create item object with all required fields
      const newItem = {
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition || 'new',
        price: item.price,
        stock_quantity: item.stock_quantity,
        sku: sku,
        is_shop_item: true,
        status: item.stock_quantity > 0 ? (item.stock_quantity < 5 ? 'low_stock' : 'approved') : 'out_of_stock',
        user_id: user.user.id,
        swapcoins: 0,
        size: 'N/A'
      };

      // Insert item into database
      // @ts-ignore - Ignore TypeScript errors for Supabase table operations
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert(newItem)
        .select()
        .single();

      if (itemError) throw itemError;

      // Upload images if any
      if (item.images.length > 0) {
        const imageUrls = await Promise.all(
          item.images.map(async (file, index) => {
            const filePath = `shop-items/${itemData.id}/${index}_${Date.now()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('items')
              .upload(filePath, file);

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              return null;
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
              .from('items')
              .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
          })
        );

        // Filter out any failed uploads
        const successfulUploads = imageUrls.filter(url => url !== null) as string[];

        // Update the item with image URLs
        if (successfulUploads.length > 0) {
          // @ts-ignore - Ignore TypeScript errors for Supabase table operations
          await supabase
            .from('items')
            .update({ 
              image_url: successfulUploads[0], // Primary image
              images: successfulUploads // All images
            })
            .eq('id', itemData.id);
        }
      }

      // Refresh stats
      fetchDashboardStats();
      
      return { success: true, data: itemData };
    } catch (err) {
      console.error('Error adding inventory item:', err);
      return { success: false, error: 'Failed to add inventory item' };
    }
  };

  // Function to remove inventory item
  const removeInventoryItem = async (itemId: string) => {
    try {
      // Delete item from database
      // @ts-ignore - Ignore TypeScript errors for Supabase table operations
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('is_shop_item', true);

      if (error) throw error;

      // Delete associated images
      await supabase.storage
        .from('items')
        .remove([`shop-items/${itemId}`]);

      // Refresh stats
      fetchDashboardStats();

      return { success: true };
    } catch (err) {
      console.error('Error removing inventory item:', err);
      return { success: false, error: 'Failed to remove inventory item' };
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Set up real-time subscription for items table changes
    const itemsSubscription = supabase
      .channel('items_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'items'
        }, 
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    // Set up real-time subscription for profiles table changes
    const profilesSubscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        }, 
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      itemsSubscription.unsubscribe();
      profilesSubscription.unsubscribe();
    };
  }, []);

  return {
    ...dashboardStats,
    addInventoryItem,
    removeInventoryItem,
    refreshStats: fetchDashboardStats
  };
};