import { useState, useRef, useEffect } from 'react';
import { X, Heart, RotateCcw, Eye, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useShopProducts, ShopProduct } from "@/hooks/useShopProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

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
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const swipeThreshold = 100;
  const noItemsFound = !isLoading && products.length === 0;
  const cardRef = useRef<HTMLDivElement>(null);

  // Progress calculation
  const progressPercentage = products.length > 0 
    ? Math.min(100, (currentIndex / products.length) * 100) 
    : 0;

  // Reset state when products change
  useEffect(() => {
    if (products.length > 0) {
      setCurrentIndex(0);
      setSwipeDirection(null);
      setOffsetX(0);
    }
  }, [products]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isViewingDetails) return;
      
      if (e.key === 'ArrowRight') {
        handleLikeClick();
      } else if (e.key === 'ArrowLeft') {
        handleDislikeClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, products.length, isViewingDetails]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isViewingDetails) return;
    setStartPoint(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startPoint === null || isViewingDetails) return;
    const currentPoint = e.touches[0].clientX;
    const diff = currentPoint - startPoint;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (startPoint === null || isViewingDetails) return;

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
    if (isViewingDetails) return;
    setStartPoint(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPoint === null || isViewingDetails) return;
    const currentPoint = e.clientX;
    const diff = currentPoint - startPoint;
    setOffsetX(diff);
  };

  const handleMouseUp = () => {
    if (startPoint === null || isViewingDetails) return;

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
    if (isViewingDetails) return;
    setSwipeDirection('right');
    handleLike();
  };

  const handleDislikeClick = () => {
    if (isViewingDetails) return;
    setSwipeDirection('left');
    handleDislike();
  };

  // Toggle view details
  const toggleDetails = () => {
    setIsViewingDetails(!isViewingDetails);
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
          <div className="card-stack">
            <Card className="aspect-[3/4] overflow-hidden shadow-2xl rounded-3xl border-0 mx-auto">
              <div className="h-full flex flex-col">
                <Skeleton className="h-3/4 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
            
            <div className="absolute -bottom-1 left-0 w-full opacity-40 scale-[0.98] -z-10">
              <Card className="aspect-[3/4] overflow-hidden shadow-xl rounded-3xl border-0 mx-auto">
                <div className="h-full flex flex-col">
                  <Skeleton className="h-3/4 w-full" />
                </div>
              </Card>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        <div className="mx-auto max-w-md mt-6">
          <Skeleton className="h-2 w-full rounded-full" />
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
  const nextProduct = products[(currentIndex + 1) % products.length];
  
  // Calculate rotation and opacity based on swipe distance
  const rotation = offsetX * 0.1;
  const opacity = 1 - Math.min(1, Math.abs(offsetX) / 500);
  const scale = Math.max(0.9, 1 - Math.abs(offsetX) / 1000);

  // Determine feedback color on swipe (green for right, red for left)
  const getSwipeFeedbackColor = () => {
    if (offsetX > 50) return 'rgba(34, 197, 94, 0.15)'; // Green tint
    if (offsetX < -50) return 'rgba(239, 68, 68, 0.15)'; // Red tint
    return 'transparent';
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Discover Your Style</h2>
      <p className="text-center text-monochrome-600 mb-10">
        Swipe right to save items, left to pass. Find your perfect look!
      </p>
      
      {/* Progress indicator */}
      <div className="mx-auto max-w-md mb-8">
        <div className="flex justify-between text-xs mb-2">
          <span>Progress</span>
          <span>{currentIndex}/{products.length} items</span>
        </div>
        <Progress value={progressPercentage} className="h-1" />
      </div>
      
      <div className="relative mx-auto max-w-md h-[500px] swipe-container">
        {/* Keyboard navigation hint */}
        <div className="absolute -top-8 left-0 right-0 flex justify-center gap-6 text-xs text-monochrome-500">
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> Pass
          </div>
          <div className="flex items-center gap-1">
            Save <ChevronRight className="h-3 w-3" />
          </div>
        </div>
        
        {/* Card stack effect - shows next card underneath for depth */}
        {products.length > 1 && !isViewingDetails && (
          <div 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[95%] h-[95%] -z-10"
            style={{
              opacity: 0.6,
              transform: `translate(-50%, 1.5%) scale(0.96)`,
            }}
          >
            <Card className="aspect-[3/4] overflow-hidden shadow-xl rounded-3xl border-0 mx-auto h-full">
              <div className="relative h-full bg-white rounded-3xl overflow-hidden">
                <img 
                  src={nextProduct.image} 
                  alt="Next item"
                  className="w-full h-3/4 object-cover opacity-80" 
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
              </div>
            </Card>
          </div>
        )}
        
        <Card 
          ref={cardRef}
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
            transform: startPoint !== null && !isViewingDetails
              ? `translateX(${offsetX}px) rotate(${rotation}deg) scale(${scale})`
              : isViewingDetails 
                ? 'scale(1.02)' 
                : 'none',
            transition: startPoint !== null ? 'none' : 'all 0.3s ease',
            background: getSwipeFeedbackColor(),
          }}
        >
          <div className="relative h-full bg-white rounded-3xl overflow-hidden">
            {/* Like/Dislike indicators that appear during swipe */}
            {offsetX > 50 && !isViewingDetails && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-green-500 bg-opacity-80 rounded-full p-6 rotate-12">
                <Heart className="h-12 w-12 text-white" />
              </div>
            )}
            
            {offsetX < -50 && !isViewingDetails && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-500 bg-opacity-80 rounded-full p-6 -rotate-12">
                <X className="h-12 w-12 text-white" />
              </div>
            )}
          
            <Badge className="absolute top-4 left-4 z-10 bg-black text-white hover:bg-black/90 px-3 py-1.5 text-xs font-bold">
              {currentProduct.size}
            </Badge>
            <Badge className="absolute top-4 right-4 z-10 bg-white bg-opacity-70 backdrop-blur-sm text-black hover:bg-white/80 px-3 py-1.5 text-xs font-bold">
              {currentProduct.price} coins
            </Badge>
            
            {/* View details button */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleDetails}
              className="absolute top-1/2 right-4 z-10 h-8 w-8 rounded-full bg-white shadow-md"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <div className={`relative transition-all duration-500 ${isViewingDetails ? 'h-1/2' : 'h-3/4'}`}>
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-full h-full object-cover" 
                loading="eager"
              />
              {/* Gradients for better text visibility */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/30 to-transparent"></div>
              
              {/* Action buttons inside image area */}
              {!isViewingDetails && (
                <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-4 z-10">
                  <Button 
                    size="icon" 
                    className={`h-14 w-14 rounded-full bg-white text-red-500 hover:bg-red-100 shadow-lg transition-transform ${offsetX < -20 ? 'scale-110' : 'scale-100'}`}
                    onClick={handleDislikeClick}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <Button 
                    size="icon" 
                    className={`h-14 w-14 rounded-full bg-white text-green-500 hover:bg-green-100 shadow-lg transition-transform ${offsetX > 20 ? 'scale-110' : 'scale-100'}`}
                    onClick={handleLikeClick}
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>
              )}
              
              {/* Bottom gradient overlay for better button visibility */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
            
            <div className={`p-6 transition-all duration-500 ${isViewingDetails ? 'h-1/2' : ''}`}>
              <Badge className="mb-2 bg-monochrome-100 text-monochrome-800 hover:bg-monochrome-200 border-0">
                {currentProduct.category}
              </Badge>
              <h3 className="font-bold text-xl mt-2">{currentProduct.name}</h3>
              {currentProduct.sku && (
                <p className="text-xs text-monochrome-400 mt-1 mb-3">SKU: {currentProduct.sku}</p>
              )}
              
              {/* Extended details shown when isViewingDetails is true */}
              {isViewingDetails && (
                <div className="mt-3 animate-fadeIn">
                  <p className="text-sm text-monochrome-700 mb-4">
                    {currentProduct.description || "A beautiful pre-loved item ready for its new home. In excellent condition and perfect for any wardrobe."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-monochrome-500">Brand</p>
                      <p className="font-medium">{currentProduct.brand || "Various"}</p>
                    </div>
                    <div>
                      <p className="text-monochrome-500">Condition</p>
                      <p className="font-medium">{currentProduct.condition || "Good"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={toggleDetails}
                    >
                      Back
                    </Button>
                    <Button 
                      asChild
                      variant="default" 
                      className="flex-1"
                    >
                      <Link to={`/shop/product/${currentProduct.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Stack indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-monochrome-500">
          <Layers className="h-3 w-3" />
          <span>{products.length - currentIndex} more items</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
