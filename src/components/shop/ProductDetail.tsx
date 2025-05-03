import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ChevronLeft, Loader2 } from "lucide-react";
import { useShopProducts, ShopProduct } from "@/hooks/useShopProducts";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

// Interface to match the actual database structure
interface SupabaseItem {
  id: string;
  title: string;
  category: string;
  condition: string;
  description: string | null;
  image_url: string | null;
  size: string;
  status: string;
  swapcoins: number;
  user_id: string;
  created_at: string;
  price?: number;
  images?: string[];
  sku?: string;
  stock_quantity?: number;
  is_shop_item?: boolean;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('items')
          .select('*')
          .eq('id', productId)
          .eq('is_shop_item', true)
          .single();

        if (supabaseError) throw supabaseError;
        
        if (!data) {
          setError('Product not found');
          return;
        }

        const item = data as SupabaseItem;
        
        // Transform to ShopProduct type
        setProduct({
          id: item.id,
          name: item.title,
          title: item.title,
          price: item.swapcoins || 0,
          image: item.image_url || '/placeholder.svg',
          images: item.images || [item.image_url || '/placeholder.svg'],
          category: item.category,
          size: item.size || 'N/A',
          condition: item.condition,
          description: item.description || '',
          sku: item.sku || '',
          stock_quantity: item.stock_quantity || 0
        });
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-12">
        <Link to="/shop" className="inline-flex items-center mb-6 text-monochrome-600 hover:text-monochrome-900">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Shop
        </Link>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square overflow-hidden rounded-2xl w-full" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl w-full" />
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-40" />
            </div>
            
            <Skeleton className="h-32 w-full" />
            
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container py-12 text-center">
        <p className="mb-4">Product not found</p>
        <Link to="/shop">
          <Button variant="outline" className="rounded-full">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }
  
  const discount = product.price > 0 
    ? Math.round(((product.price * 1.25 - product.price) / (product.price * 1.25)) * 100) 
    : 0;
  
  return (
    <div className="container py-12">
      <Link to="/shop" className="inline-flex items-center mb-6 text-monochrome-600 hover:text-monochrome-900">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Shop
      </Link>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl shadow-md">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 shadow-sm transition-all
                    ${currentImageIndex === index 
                      ? "border-monochrome-900 ring-2 ring-monochrome-200" 
                      : "border-transparent hover:border-monochrome-300"}`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <p className="text-sm inline-flex bg-monochrome-100 text-monochrome-500 px-3 py-1 rounded-full">{product.category}</p>
            <h1 className="mt-2 text-2xl font-medium sm:text-3xl">{product.name}</h1>
            <div className="mt-4 flex items-center">
              <span className="mr-2 font-mono text-xl font-bold">{product.price} coins</span>
              <span className="text-sm text-monochrome-500 line-through">{Math.round(product.price * 1.25)} coins</span>
              {discount > 0 && (
                <span className="ml-2 rounded-full bg-monochrome-900 px-2 py-0.5 text-xs font-medium text-white">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2 bg-monochrome-50 p-4 rounded-xl">
            <p className="font-medium">Details</p>
            <div className="grid grid-cols-2 text-sm">
              <div className="space-y-2">
                <p className="text-monochrome-500">Size</p>
                <p className="text-monochrome-500">Condition</p>
                {product.sku && <p className="text-monochrome-500">SKU</p>}
                <p className="text-monochrome-500">Stock</p>
              </div>
              <div className="space-y-2">
                <p>{product.size}</p>
                <p>{product.condition}</p>
                {product.sku && <p>{product.sku}</p>}
                <p>{product.stock_quantity} available</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Description</p>
            <p className="text-monochrome-600">{product.description}</p>
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            className="mt-8 w-full rounded-full py-6 h-auto font-medium text-base shadow-md hover:shadow-lg transition-all"
            disabled={isAddingToCart || product.stock_quantity <= 0}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding to Cart...
              </>
            ) : product.stock_quantity <= 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
