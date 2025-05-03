import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import mockClothingItems, { ClothingItem } from '@/data/mockClothesData';

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  size: string;
  condition: string;
  description?: string;
  // Additional fields needed by components
  images?: string[];
  sku?: string;
  stock_quantity?: number;
  title?: string; // Some components use title instead of name
  brand?: string;
  originalPrice?: number;
  color?: string;
  gender?: string;
  tags?: string[];
};

// Convert mock clothing item to shop product format
const mapMockItemToShopProduct = (item: ClothingItem): ShopProduct => ({
  id: item.id,
  name: item.name,
  title: item.name,
  price: item.price,
  image: item.images[0],
  category: item.category,
  subcategory: item.subcategory,
  size: item.size,
  condition: item.condition,
  description: item.description,
  images: item.images,
  sku: `SKU-${item.id}`,
  stock_quantity: 1,
  brand: item.brand,
  originalPrice: item.originalPrice,
  color: item.color,
  gender: item.gender,
  tags: item.tags
});

// Original Supabase mapping function for future use
const mapItemToShopProduct = (item: Tables<"items">): ShopProduct => ({
  id: item.id,
  name: item.title || 'Unnamed Product',
  title: item.title || 'Unnamed Product',
  price: item.swapcoins || 0,
  image: item.image_url || '/placeholder.svg',
  category: item.category || 'uncategorized',
  size: item.size || '',
  condition: item.condition || '',
  description: item.description || '',
  images: item.images || [item.image_url || '/placeholder.svg'],
  sku: item.sku || '',
  stock_quantity: item.stock_quantity || 0
});

export const useShopProducts = (categoryFilter?: string, searchQuery: string = '') => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay for a more realistic experience
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Only use available items
        const availableItems = mockClothingItems.filter(item => item.isAvailable);
        
        // Map mock items to shop product format
        const shopProducts = availableItems.map(mapMockItemToShopProduct);
        
        // Apply category filter if provided
        let filteredProducts = shopProducts;
        if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
          filteredProducts = shopProducts.filter(
            product => product.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }
        
        // Apply search filter if provided
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          );
        }
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error loading mock products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // No need for Supabase channel subscription with mock data
    return () => {};
  }, [categoryFilter, searchQuery]);

  return {
    products,
    isLoading,
    error
  };
};