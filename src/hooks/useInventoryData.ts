import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type ShopItem = Tables<"items">;

export const useInventoryData = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [submittedItems, setSubmittedItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch both inventory and submitted items on component mount
    fetchInventoryItems();
    fetchSubmittedItems();
    
    // Set up real-time listener for changes to inventory items
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('Inventory change detected:', payload);
          // Refresh all data when changes occur
          fetchInventoryItems();
          fetchSubmittedItems();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch inventory items (shop items)
  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_shop_item", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShopItems(data || []);
    } catch (err: any) {
      console.error("Error fetching inventory items:", err);
      setError(err.message || "Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user submitted items
  const fetchSubmittedItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_shop_item", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmittedItems(data || []);
    } catch (err: any) {
      console.error("Error fetching submitted items:", err);
      setError(err.message || "Failed to load submitted items");
    } finally {
      setLoading(false);
    }
  };

  // Add a new inventory item
  const addInventoryItem = async (item: Partial<ShopItem>, fileUploads?: File[]) => {
    try {
      setLoading(true);
      console.log("Adding inventory item:", item);
      
      // Handle image uploads if needed
      let imageUrls: string[] = [];
      
      // Handle files passed as a separate parameter
      if (fileUploads && fileUploads.length > 0) {
        console.log("Processing image uploads:", fileUploads.length);
        
        // For each image file, upload to storage and get URL
        for (const file of fileUploads) {
          try {
            console.log("Uploading file:", file.name);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `item-images/${fileName}`;
            
            // Convert the file to a blob with the correct content type
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            
            // Upload the file to Supabase Storage
            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('lovable-uploads')
              .upload(filePath, blob, {
                contentType: file.type,
                cacheControl: '3600'
              });
              
            if (uploadError) {
              console.error("File upload error:", uploadError);
              throw uploadError;
            }
            
            console.log("File upload successful:", uploadData);
            
            // Get the public URL after successful upload
            const { data: urlData } = supabase.storage
              .from('lovable-uploads')
              .getPublicUrl(filePath);
              
            if (urlData && urlData.publicUrl) {
              console.log("File public URL:", urlData.publicUrl);
              imageUrls.push(urlData.publicUrl);
            }
          } catch (uploadErr) {
            console.error("Error processing image:", uploadErr);
            // Continue with other images if one fails
          }
        }
      } 
      // Handle images already in the item object (this shouldn't happen anymore with our new approach)
      else if (item.images && Array.isArray(item.images)) {
        console.log("Processing images from item object (legacy method)");
        
        for (const imageFile of item.images) {
          try {
            // Check if imageFile is a File object using type assertion
            if (typeof imageFile !== 'string') {
              console.warn("Found non-string image in item.images - this shouldn't happen with the new approach");
              continue;
            } else {
              // If it's already a string URL, just add it to the array
              imageUrls.push(imageFile);
            }
          } catch (uploadErr) {
            console.error("Error processing image:", uploadErr);
          }
        }
      }

      console.log("Final image URLs:", imageUrls);

      // Create a properly typed item object with all required fields
      const itemToInsert = {
        title: item.title || '',
        category: item.category || '', 
        condition: item.condition || 'new',
        swapcoins: item.swapcoins || 0,
        user_id: 'admin', // Default admin user ID
        is_shop_item: true,
        status: 'active',
        image_url: imageUrls.length > 0 ? imageUrls[0] : null,
        images: imageUrls,
        description: item.description || '',
        stock_quantity: item.stock_quantity || 1,
        sku: item.sku || `SKU-${Date.now().toString().slice(-6)}`,
        price: item.price || 0,
        size: item.size || '',
      };

      console.log("Inserting item:", itemToInsert);

      // Insert the new item with image URLs
      const { data, error } = await supabase
        .from("items")
        .insert(itemToInsert)
        .select();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }
      
      console.log("Item added successfully:", data);
      
      // Refresh the inventory items
      await fetchInventoryItems();
      
      return { success: true, item: data?.[0] };
    } catch (err: any) {
      console.error("Error adding inventory item:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update an inventory item
  const updateInventoryItem = async (id: string, updates: Partial<ShopItem>) => {
    try {
      const { error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      // Refresh the inventory items
      fetchInventoryItems();
      
      return { success: true };
    } catch (err: any) {
      console.error("Error updating inventory item:", err);
      return { success: false, error: err.message };
    }
  };

  // Delete an inventory item
  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Refresh the inventory items
      fetchInventoryItems();
      
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting inventory item:", err);
      return { success: false, error: err.message };
    }
  };

  // Review a user-submitted item (approve or reject)
  const reviewSubmittedItem = async (
    id: string, 
    action: 'approve' | 'reject',
    data: {
      notes?: string;
      swapcoins?: number;
      convertible_to_inventory?: boolean;
      estimated_value?: number;
    }
  ) => {
    try {
      const now = new Date().toISOString();
      const updates: Partial<ShopItem> = {
        approval_status: action,
        review_notes: data.notes || '',
        reviewed_at: now
      };
      
      if (action === 'approve') {
        updates.swapcoins = data.swapcoins || 0;
        updates.convertible_to_inventory = data.convertible_to_inventory || false;
        updates.estimated_value = data.estimated_value || 0;
        
        // If the item is approved, also credit the user with SwapCoins
        if (data.swapcoins && data.swapcoins > 0) {
          // Get the item to find the user_id
          const { data: itemData, error: itemError } = await supabase
            .from("items")
            .select("user_id")
            .eq("id", id)
            .single();
          
          if (itemError) throw itemError;
          
          if (itemData && itemData.user_id) {
            // Credit the user with SwapCoins
            const { error: userError } = await supabase.rpc(
              'increment_swapcoins', 
              { amount: data.swapcoins || 0 }
            );
            
            if (userError) throw userError;
          }
        }
      }
      
      // Update the item with the review information
      const { error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      // Refresh both inventory and submitted items
      fetchSubmittedItems();
      
      return { success: true };
    } catch (err: any) {
      console.error("Error reviewing item:", err);
      return { success: false, error: err.message };
    }
  };

  // Convert a user-submitted item to a shop inventory item
  const convertToInventoryItem = async (id: string) => {
    try {
      // First, get the item details
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();
      
      if (itemError) throw itemError;
      
      if (!itemData) {
        throw new Error("Item not found");
      }
      
      // Create a new inventory item based on the submitted item
      const { error: updateError } = await supabase
        .from("items")
        .update({
          is_shop_item: true,
          status: 'active',
          stock_quantity: 1,
          price: itemData.estimated_value || 0,
          sku: `SKU-${Date.now().toString().slice(-6)}`
        })
        .eq("id", id);
      
      if (updateError) throw updateError;
      
      // Refresh both inventory and submitted items
      fetchInventoryItems();
      fetchSubmittedItems();
      
      return { success: true };
    } catch (err: any) {
      console.error("Error converting item to inventory:", err);
      return { success: false, error: err.message };
    }
  };

  // Batch approve multiple submitted items
  const batchApproveItems = async (itemIds: string[], swapcoins: number) => {
    try {
      const now = new Date().toISOString();
      
      // Update all items in one go
      const { error: updateError } = await supabase
        .from("items")
        .update({
          approval_status: 'approve',
          reviewed_at: now,
          swapcoins: swapcoins
        })
        .in("id", itemIds);
      
      if (updateError) throw updateError;
      
      // For each item, credit the user with SwapCoins
      for (const itemId of itemIds) {
        // Get the item to find the user_id
        const { data: itemData, error: itemError } = await supabase
          .from("items")
          .select("user_id")
          .eq("id", itemId)
          .single();
        
        if (itemError) continue; // Skip this item if there's an error
        
        if (itemData && itemData.user_id) {
          // Credit the user with SwapCoins
          await supabase.rpc(
            'increment_swapcoins',
            { amount: swapcoins }
          );
        }
      }
      
      // Refresh submitted items
      fetchSubmittedItems();
      
      return { success: true };
    } catch (err: any) {
      console.error("Error batch approving items:", err);
      return { success: false, error: err.message };
    }
  };

  // Use the existing method to add a new item
  const addItem = async (item: Partial<ShopItem>) => {
    return addInventoryItem(item);
  };

  // Use the existing methods for basic operations
  const updateItem = updateInventoryItem;
  const deleteItem = deleteInventoryItem;

  return {
    shopItems,
    submittedItems,
    loading,
    error,
    updateItem,
    addItem,
    deleteItem,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    reviewSubmittedItem,
    convertToInventoryItem,
    batchApproveItems,
    fetchInventoryItems,
    fetchSubmittedItems
  };
};