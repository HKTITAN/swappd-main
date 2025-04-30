import { useState, useRef, useEffect } from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock product data - would come from API in real implementation
const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 120,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Outerwear",
    size: "M"
  },
  {
    id: 2,
    name: "Monochrome Striped Shirt",
    price: 75,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops",
    size: "L"
  },
  {
    id: 3,
    name: "Classic Black Jeans",
    price: 90,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800", 
    category: "Bottoms",
    size: "32"
  },
  {
    id: 4,
    name: "Minimalist Wool Coat",
    price: 185,
    image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Outerwear",
    size: "S"
  },
  {
    id: 5,
    name: "Oversized White T-Shirt",
    price: 50,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops",
    size: "XL"
  },
  {
    id: 6,
    name: "Graphic Print Hoodie",
    price: 110,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops",
    size: "M"
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
}

interface SwipeViewProps {
  onLike: (product: Product) => void;
  onDislike: (product: Product) => void;
  category?: string;
}

const SwipeView = ({ onLike, onDislike, category }: SwipeViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const [noItemsFound, setNoItemsFound] = useState(false);
  const [showLikeOverlay, setShowLikeOverlay] = useState(false);
  const [showDislikeOverlay, setShowDislikeOverlay] = useState(false);

  // Filter products based on category
  const filteredProducts = category 
    ? products.filter(product => product.category === category)
    : products;

  useEffect(() => {
    setNoItemsFound(filteredProducts.length === 0);
    setCurrentIndex(0);
  }, [category, filteredProducts.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Apply rotation and translation directly to the card
    const card = e.currentTarget as HTMLElement;
    const rotate = diff * 0.1; // Adjust rotation intensity
    card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
    
    // Show appropriate overlay based on direction
    if (diff > 50) {
      setShowLikeOverlay(true);
      setShowDislikeOverlay(false);
    } else if (diff < -50) {
      setShowDislikeOverlay(true);
      setShowLikeOverlay(false);
    } else {
      setShowLikeOverlay(false);
      setShowDislikeOverlay(false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || currentX.current === null) return;
    
    const diff = currentX.current - startX.current;
    const card = e.currentTarget as HTMLElement;
    
    // Reset transform to allow animation classes to take effect
    card.style.transform = '';
    
    if (diff > 100) {
      // Swiped right
      setSwipeDirection('right');
      handleLike();
    } else if (diff < -100) {
      // Swiped left
      setSwipeDirection('left');
      handleDislike();
    } else {
      // Not enough movement, reset card position
      card.style.transform = 'translateX(0) rotate(0)';
      setShowLikeOverlay(false);
      setShowDislikeOverlay(false);
    }
    
    startX.current = null;
    currentX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX.current === null) return;
    
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    
    const card = e.currentTarget as HTMLElement;
    const rotate = diff * 0.1;
    card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
    
    // Show appropriate overlay based on direction
    if (diff > 50) {
      setShowLikeOverlay(true);
      setShowDislikeOverlay(false);
    } else if (diff < -50) {
      setShowDislikeOverlay(true);
      setShowLikeOverlay(false);
    } else {
      setShowLikeOverlay(false);
      setShowDislikeOverlay(false);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX.current === null || currentX.current === null) return;
    
    const diff = currentX.current - startX.current;
    const card = e.currentTarget as HTMLElement;
    
    card.style.transform = '';
    
    if (diff > 100) {
      setSwipeDirection('right');
      handleLike();
    } else if (diff < -100) {
      setSwipeDirection('left');
      handleDislike();
    } else {
      card.style.transform = 'translateX(0) rotate(0)';
      setShowLikeOverlay(false);
      setShowDislikeOverlay(false);
    }
    
    startX.current = null;
    currentX.current = null;
  };

  useEffect(() => {
    if (swipeDirection) {
      setShowLikeOverlay(swipeDirection === 'right');
      setShowDislikeOverlay(swipeDirection === 'left');
      
      const timer = setTimeout(() => {
        setSwipeDirection(null);
        setShowLikeOverlay(false);
        setShowDislikeOverlay(false);
        
        if (currentIndex < filteredProducts.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Reset to the beginning when all cards are swiped
          setCurrentIndex(0);
        }
      }, 500); // Match this with the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [swipeDirection, currentIndex, filteredProducts.length]);

  const handleLike = () => {
    if (filteredProducts.length > 0) {
      onLike(filteredProducts[currentIndex % filteredProducts.length]);
      toast({
        title: "Item saved!",
        description: "This item has been added to your saved items",
      });
    }
  };
  
  const handleDislike = () => {
    if (filteredProducts.length > 0) {
      onDislike(filteredProducts[currentIndex % filteredProducts.length]);
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

  if (noItemsFound) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No items found</h2>
        <p className="text-monochrome-600 mb-8">
          We couldn't find any items in the {category} category.
        </p>
        <Button onClick={() => window.location.reload()}>
          View All Items
        </Button>
      </div>
    );
  }

  const currentProduct = filteredProducts[currentIndex % filteredProducts.length];

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
          style={{ touchAction: 'pan-y', height: '100%' }}
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
              <p className="text-monochrome-600 text-sm mt-1">Tap and drag to swipe</p>
            </div>
            
            {/* Like overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 pointer-events-none
                            ${showLikeOverlay ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-green-500 bg-opacity-90 rounded-full p-6 transform scale-110 rotate-12">
                <Heart className="h-12 w-12 text-white" fill="white" />
              </div>
            </div>
            
            {/* Dislike overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 pointer-events-none
                            ${showDislikeOverlay ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-red-500 bg-opacity-90 rounded-full p-6 transform scale-110 -rotate-12">
                <X className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-center gap-6 mt-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-16 h-16 border-2 border-red-500 bg-white hover:bg-red-100 shadow-lg" 
          onClick={handleDislikeClick}
        >
          <X className="h-8 w-8 text-red-500" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-16 h-16 border-2 border-green-500 bg-white hover:bg-green-100 shadow-lg" 
          onClick={handleLikeClick}
        >
          <Heart className="h-8 w-8 text-green-500" />
        </Button>
      </div>
      
      <div className="text-center mt-10">
        <Link to="/saved-items">
          <Button variant="outline" className="rounded-full border-2 border-monochrome-900 font-bold hover:bg-monochrome-900 hover:text-white shadow-md">
            VIEW SAVED ITEMS
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SwipeView;
