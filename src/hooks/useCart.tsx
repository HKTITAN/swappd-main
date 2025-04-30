
import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define a type that includes the joined item data
interface CartItemWithItem extends Tables<"cart_items"> {
  item: Tables<"items"> | null;
}

interface CartStore {
  items: CartItemWithItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      set({ isLoading: false });
      return;
    }
    
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, item:items(*)")
      .eq("user_id", userData.user.id);
    
    if (!error) {
      set({ items: (data as CartItemWithItem[]) || [] });
    }
    set({ isLoading: false });
  },

  addToCart: async (itemId: string, quantity: number = 1) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from("cart_items")
      .upsert({ 
        item_id: itemId, 
        quantity: quantity,
        user_id: userData.user.id
      });

    if (!error) {
      get().fetchCart();
    }
  },

  removeFromCart: async (itemId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("item_id", itemId)
      .eq("user_id", userData.user.id);

    if (!error) {
      get().fetchCart();
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("item_id", itemId)
      .eq("user_id", userData.user.id);

    if (!error) {
      get().fetchCart();
    }
  },

  clearCart: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userData.user.id);

    if (!error) {
      set({ items: [] });
    }
  },
}));
