import { useState, useRef, useEffect } from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useShopProducts, ShopProduct } from "@/hooks/useShopProducts";
import { Skeleton } from "@/components/ui/skeleton";

interface SwipeViewProps {
  onLike: (product: ShopProduct) => void;
  onDislike: (product: ShopProduct) => void;
  category?: string;
}

const SwipeView = ({ onLike, onDislike, category }: SwipeViewProps) => {
  const { products, isLoading } = useShopProducts(category);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [startPoint, setStartPoint] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const swipeThreshold = 100;
  const noItemsFound = !isLoading && products.length === 0;

  // Reset state when products change
  useEffect(() => {
    if (products.length > 0) {
      setCurrentIndex(0);
      setSwipeDirection(null);
      setOffsetX(0);
    }
  }, [products]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartPoint(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startPoint === null) return;
    const currentPoint = e.touches[0].clientX;
    const diff = currentPoint - startPoint;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (startPoint === null) return;

    if (offsetX > swipeThreshold) {
      setSwipeDirection('right');
      handleLike();
    } else if (offsetX < -swipeThreshold) {
      setSwipeDirection('left');
      handleDislike();
    }

    setStartPoint(null);
    setOffsetX(0);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPoint(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPoint === null) return;
    const currentPoint = e.clientX;
    const diff = currentPoint - startPoint;
    setOffsetX(diff);
  };

  const handleMouseUp = () => {
    if (startPoint === null) return;

    if (offsetX > swipeThreshold) {
      setSwipeDirection('right');
      handleLike();
    } else if (offsetX < -swipeThreshold) {
      setSwipeDirection('left');
      handleDislike();
    }

    setStartPoint(null);
    setOffsetX(0);
  };

  const handleLike = () => {
    if (products.length > 0) {
      const currentProduct = products[currentIndex % products.length];
      onLike(currentProduct);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
      }, 300);
      
      toast({
        title: "Added to saved items",
        description: "This item has been added to your saved items",
      });
    }
  };
  
  const handleDislike = () => {
    if (products.length > 0) {
      onDislike(products[currentIndex % products.length]);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
      }, 300);
    }
  };

  // Function to handle button clicks for liking/disliking
  const handleLikeClick = () => {
    setSwipeDirection('right');
    handleLike();
  };

  const handleDislikeClick = () => {
    setSwipeDirection('left');
    handleDislike();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Discover Your Style</h2>
        <p className="text-center text-monochrome-600 mb-10">
          Swipe right to save items, left to pass. Find your perfect look!
        </p>
        
        <div className="relative mx-auto max-w-md h-[500px] swipe-container">
          <Card className="aspect-[3/4] overflow-hidden shadow-2xl rounded-3xl border-0 mx-auto">
            <div className="h-full flex flex-col">
              <Skeleton className="h-3/4 w-full" />
              <div className="p-6">
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (noItemsFound) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No items found</h2>
        <p className="text-monochrome-600 mb-8">
          We couldn't find any items in the {category || 'selected'} category.
        </p>
        <Button onClick={() => window.location.reload()}>
          View All Items
        </Button>
      </div>
    );
  }

  // Handle case where we've swiped through all products
  if (products.length > 0 && currentIndex >= products.length) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">You've seen all items</h2>
        <p className="text-monochrome-600 mb-8">
          You've gone through all available items in this category.
        </p>
        <Button onClick={() => setCurrentIndex(0)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    );
  }

  const currentProduct = products[currentIndex % products.length];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Discover Your Style</h2>
      <p className="text-center text-monochrome-600 mb-10">
        Swipe right to save items, left to pass. Find your perfect look!
      </p>
      
      <div className="relative mx-auto max-w-md h-[500px] swipe-container">
        <Card 
          className={`${swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''} 
                     aspect-[3/4] overflow-hidden shadow-2xl rounded-3xl border-0 mx-auto`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ 
            touchAction: 'pan-y', 
            height: '100%',
            transform: startPoint !== null ? `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)` : 'none',
            transition: startPoint !== null ? 'none' : 'transform 0.3s'
          }}
        >
          <div className="relative h-full bg-white rounded-3xl overflow-hidden">
            <Badge className="absolute top-4 left-4 z-10 bg-black text-white hover:bg-black/90 px-3 py-1.5 text-xs font-bold">
              {currentProduct.size}
            </Badge>
            <Badge className="absolute top-4 right-4 z-10 bg-white bg-opacity-70 backdrop-blur-sm text-black hover:bg-white/80 px-3 py-1.5 text-xs font-bold">
              {currentProduct.price} coins
            </Badge>
            <img 
              src={currentProduct.image} 
              alt={currentProduct.name}
              className="w-full h-3/4 object-cover" 
              loading="eager"
            />
            <div className="p-6">
              <Badge className="mb-2 bg-monochrome-100 text-monochrome-800 hover:bg-monochrome-200 border-0">
                {currentProduct.category}
              </Badge>
              <h3 className="font-bold text-xl mt-2">{currentProduct.name}</h3>
              {currentProduct.sku && (
                <p className="text-xs text-monochrome-400 mt-1">SKU: {currentProduct.sku}</p>
              )}
            </div>
          </div>
        </Card>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white text-red-500 hover:bg-red-100 shadow-lg"
            onClick={handleDislikeClick}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white text-green-500 hover:bg-green-100 shadow-lg"
            onClick={handleLikeClick}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
