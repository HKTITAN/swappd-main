import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useShopProducts, ShopProduct } from "@/hooks/useShopProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Share2, X, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

type ProductGridProps = {
  category?: string;
  searchQuery?: string;
  emptyStateComponent?: React.ReactNode;
};

type MenuAction = 'save' | 'cart' | 'share' | 'close' | 'view' | null;

// Function to lock/unlock body scroll
const useBodyScrollLock = () => {
  const lockScroll = () => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Add styles to body to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  };

  const unlockScroll = () => {
    // Get the scroll position from the body's top property
    const scrollY = document.body.style.top;
    
    // Reset body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Scroll back to saved position
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  return { lockScroll, unlockScroll };
};

const ProductCard = ({ product }: { product: ShopProduct }) => {
  const [showPopMenu, setShowPopMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeAction, setActiveAction] = useState<MenuAction>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { lockScroll, unlockScroll } = useBodyScrollLock();
  
  // Save positions for drag tracking
  const dragStartPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const touchMoveDetected = useRef(false);
  const significantMovement = useRef(false);
  
  // Threshold for movement to be considered a swipe rather than a hold (in pixels)
  const MOVE_THRESHOLD = 10;
  
  // References to each button element
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Function to handle adding item to cart
  const handleAddToCart = () => {
    // Retrieve existing cart items
    const cartItemsJSON = localStorage.getItem('cartItems');
    let cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
    
    // Check if item already exists in cart
    const itemExists = cartItems.some((item: any) => item.id === product.id);
    
    if (!itemExists) {
      // Add new item to cart
      cartItems = [...cartItems, { ...product, quantity: 1 }];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      });
    }
    
    resetMenuState();
  };

  // Function to handle saving item
  const handleSaveItem = () => {
    // Retrieve existing saved items
    const savedItemsJSON = localStorage.getItem('savedItems');
    let savedItems = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
    
    // Check if item already exists in saved items
    const itemExists = savedItems.some((item: any) => item.id === product.id);
    
    if (!itemExists) {
      // Add new item to saved items
      savedItems = [...savedItems, product];
      localStorage.setItem('savedItems', JSON.stringify(savedItems));
      toast({
        title: "Item saved!",
        description: `${product.name} has been added to your saved items.`,
      });
    } else {
      toast({
        title: "Already saved",
        description: `${product.name} is already in your saved items.`,
      });
    }
    
    resetMenuState();
  };

  // Function to handle share
  const handleShare = () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on Swappd!`,
        url: window.location.origin + `/shop/product/${product.id}`,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/shop/product/${product.id}`
      ).then(() => {
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard.",
        });
      });
    }
    
    resetMenuState();
  };
  
  // Function to handle view details
  const handleViewDetails = () => {
    window.location.href = `/shop/product/${product.id}`;
    resetMenuState();
  };

  const resetMenuState = () => {
    setShowPopMenu(false);
    setIsDragging(false);
    setActiveAction(null);
    unlockScroll();
    touchMoveDetected.current = false;
    significantMovement.current = false;
  };

  // Calculate the distance moved since touch start
  const getMovementDistance = (currX: number, currY: number): number => {
    const deltaX = currX - dragStartPos.current.x;
    const deltaY = currY - dragStartPos.current.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  // Handle long press start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Store initial position
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    currentPos.current = { x: e.clientX, y: e.clientY };
    touchMoveDetected.current = false;
    significantMovement.current = false;
    
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    
    longPressTimeout.current = setTimeout(() => {
      // Only trigger menu if no significant movement has occurred
      if (!significantMovement.current) {
        setShowPopMenu(true);
        setIsDragging(true);
        
        // Lock scrolling when menu appears
        lockScroll();
        
        // Prevent default navigation or text selection during drag
        e.preventDefault();
      }
    }, 500); // 500ms for long press
  };

  // Handle touch start for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Store initial position
    dragStartPos.current = { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
    currentPos.current = { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
    touchMoveDetected.current = false;
    significantMovement.current = false;
    
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    
    longPressTimeout.current = setTimeout(() => {
      // Only trigger menu if no significant movement has occurred
      if (!significantMovement.current) {
        setShowPopMenu(true);
        setIsDragging(true);
        
        // Lock scrolling when menu appears
        lockScroll();
        
        // Prevent scrolling during drag
        e.preventDefault();
      }
    }, 500); // 500ms for long press
  };

  // Cancel the long press if there's significant movement
  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimeout.current) {
      // Mark that movement has occurred
      touchMoveDetected.current = true;
      
      // Update current position
      const touch = e.touches[0];
      currentPos.current = { x: touch.clientX, y: touch.clientY };
      
      // Calculate distance moved
      const distance = getMovementDistance(touch.clientX, touch.clientY);
      
      // If moved beyond threshold, consider it a swipe and cancel the long press
      if (distance > MOVE_THRESHOLD) {
        significantMovement.current = true;
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
    }
    
    // If menu is already showing, prevent scrolling and check which item is being hovered
    if (showPopMenu) {
      e.preventDefault();
      checkActiveAction(currentPos.current.x, currentPos.current.y);
    }
  };

  // Similar handling for mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (longPressTimeout.current) {
      // Update current position
      currentPos.current = { x: e.clientX, y: e.clientY };
      
      // Calculate distance moved
      const distance = getMovementDistance(e.clientX, e.clientY);
      
      // If moved beyond threshold, consider it a swipe and cancel the long press
      if (distance > MOVE_THRESHOLD) {
        significantMovement.current = true;
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
    }
    
    // If menu is already showing, handle dragging to select
    if (showPopMenu && isDragging) {
      checkActiveAction(e.clientX, e.clientY);
    }
  };

  // Handle mouse move during drag
  const handleMouseMoveDuringDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    
    currentPos.current = { x: e.clientX, y: e.clientY };
    
    // Check which action button (if any) the pointer is over
    checkActiveAction(currentPos.current.x, currentPos.current.y);
  };

  // Handle touch move during drag
  const handleTouchMoveDuringDrag = (e: TouchEvent) => {
    if (!isDragging) return;
    
    currentPos.current = { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
    
    // Check which action button (if any) the pointer is over
    checkActiveAction(currentPos.current.x, currentPos.current.y);
    
    // Prevent scrolling during drag
    if (showPopMenu) {
      e.preventDefault();
    }
  };

  // Check which menu item is currently being hovered/touched
  const checkActiveAction = (x: number, y: number) => {
    // Check if pointer is inside any of the action buttons
    if (isPointInsideElement(x, y, saveButtonRef.current)) {
      setActiveAction('save');
    } else if (isPointInsideElement(x, y, cartButtonRef.current)) {
      setActiveAction('cart');
    } else if (isPointInsideElement(x, y, shareButtonRef.current)) {
      setActiveAction('share');
    } else if (isPointInsideElement(x, y, viewButtonRef.current)) {
      setActiveAction('view');
    } else if (isPointInsideElement(x, y, closeButtonRef.current)) {
      setActiveAction('close');
    } else if (menuRef.current && !isPointInsideElement(x, y, menuRef.current)) {
      // If outside the menu area, set to null
      setActiveAction(null);
    }
  };

  // Helper to check if a point is inside an element
  const isPointInsideElement = (
    x: number, 
    y: number, 
    element: HTMLElement | null
  ): boolean => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  };

  // Handle mouse up / touch end to execute selected action
  const handleDragEnd = () => {
    // Cancel the long press timeout if it's still running
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    
    // Only process if we were dragging and have an active menu
    if (isDragging && showPopMenu) {
      // Execute the action that was active when released
      switch (activeAction) {
        case 'save':
          handleSaveItem();
          break;
        case 'cart':
          handleAddToCart();
          break;
        case 'share':
          handleShare();
          break;
        case 'view':
          handleViewDetails();
          break;
        case 'close':
          resetMenuState();
          break;
        default:
          // If released on nothing, just close the menu
          resetMenuState();
          break;
      }
    } else {
      // If no dragging was happening, just reset
      resetMenuState();
    }
  };

  // Set up event listeners and clean up
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMoveDuringDrag(e);
      }
    };
    
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleTouchMoveDuringDrag(e);
      }
    };
    
    const handleGlobalMouseUp = () => {
      handleDragEnd();
    };
    
    const handleGlobalTouchEnd = () => {
      handleDragEnd();
    };
    
    // Add event listeners if the menu is open
    if (showPopMenu) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      
      // Make sure to unlock scroll when component unmounts if menu was open
      if (showPopMenu) {
        unlockScroll();
      }
    };
  }, [showPopMenu, isDragging]);
  
  // Helper function to get label based on action
  const getActionLabel = (action: MenuAction): string => {
    switch(action) {
      case 'save': return 'Save';
      case 'cart': return 'Add to Cart';
      case 'share': return 'Share';
      case 'view': return 'View Details';
      case 'close': return 'Close';
      default: return '';
    }
  };

  return (
    <div className="relative" ref={cardRef}>
      <Link 
        to={`/shop/product/${product.id}`}
        onClick={(e) => {
          // Only navigate if we were not dragging
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <Card 
          className="overflow-hidden border-transparent transition-all product-card-hover rounded-2xl shadow-md hover:shadow-xl relative h-full"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onContextMenu={(e) => {
            e.preventDefault(); // Prevent default context menu
            setShowPopMenu(true);
            lockScroll();
          }}
        >
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden rounded-t-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                draggable={false}
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-monochrome-500 bg-monochrome-100 px-2 py-1 rounded-full truncate max-w-[120px]">{product.category}</p>
                <p className="text-sm font-mono font-semibold whitespace-nowrap">{product.price} coins</p>
              </div>
              <h3 className="mt-2 font-medium text-base line-clamp-2">{product.name}</h3>
              <div className="flex items-center mt-2">
                <p className="text-xs text-monochrome-500">{product.brand}</p>
                <span className="mx-2 text-xs text-monochrome-300">•</span>
                <p className="text-xs text-monochrome-500">{product.condition}</p>
                <span className="mx-2 text-xs text-monochrome-300">•</span>
                <p className="text-xs text-monochrome-500">Size: {product.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Pinterest-style side action menu with curved shape */}
      <AnimatePresence>
        {showPopMenu && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetMenuState}
              style={{ touchAction: 'none' }}
            />
            
            {/* Highlight the current card */}
            <motion.div
              className="absolute inset-0 z-40 rounded-2xl ring-2 ring-white ring-offset-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Side menu */}
            <motion.div 
              className="absolute -right-3 top-1/3 bottom-1/3 flex items-center z-50"
              initial={{ x: 70, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 70, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              ref={menuRef}
            >
              <div className="flex flex-col gap-3 bg-white rounded-2xl shadow-xl p-3 relative">
                {/* Curved notch pointing to product */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full" />
                
                <div className="flex flex-col gap-3 relative z-10">
                  {/* Save button */}
                  <div className="relative group">
                    <Button 
                      ref={saveButtonRef}
                      size="icon" 
                      variant="ghost" 
                      className={`h-12 w-12 rounded-full transition-all duration-200 ${
                        activeAction === 'save' 
                          ? 'bg-monochrome-100 ring-2 ring-monochrome-900 ring-offset-2 scale-110' 
                          : 'hover:bg-monochrome-100'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${activeAction === 'save' ? 'text-red-500' : 'text-monochrome-900'}`} />
                    </Button>
                    
                    {activeAction === 'save' && (
                      <span className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 bg-monochrome-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                        Save
                      </span>
                    )}
                  </div>
                  
                  {/* Cart button */}
                  <div className="relative group">
                    <Button 
                      ref={cartButtonRef}
                      size="icon" 
                      variant="ghost" 
                      className={`h-12 w-12 rounded-full transition-all duration-200 ${
                        activeAction === 'cart' 
                          ? 'bg-monochrome-100 ring-2 ring-monochrome-900 ring-offset-2 scale-110' 
                          : 'hover:bg-monochrome-100'
                      }`}
                    >
                      <ShoppingCart className={`h-5 w-5 ${activeAction === 'cart' ? 'text-blue-500' : 'text-monochrome-900'}`} />
                    </Button>
                    
                    {activeAction === 'cart' && (
                      <span className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 bg-monochrome-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                        Add to Cart
                      </span>
                    )}
                  </div>
                  
                  {/* View details button */}
                  <div className="relative group">
                    <Button 
                      ref={viewButtonRef}
                      size="icon" 
                      variant="ghost" 
                      className={`h-12 w-12 rounded-full transition-all duration-200 ${
                        activeAction === 'view' 
                          ? 'bg-monochrome-100 ring-2 ring-monochrome-900 ring-offset-2 scale-110' 
                          : 'hover:bg-monochrome-100'
                      }`}
                    >
                      <Info className={`h-5 w-5 ${activeAction === 'view' ? 'text-green-500' : 'text-monochrome-900'}`} />
                    </Button>
                    
                    {activeAction === 'view' && (
                      <span className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 bg-monochrome-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                        View Details
                      </span>
                    )}
                  </div>
                  
                  {/* Share button */}
                  <div className="relative group">
                    <Button 
                      ref={shareButtonRef}
                      size="icon" 
                      variant="ghost" 
                      className={`h-12 w-12 rounded-full transition-all duration-200 ${
                        activeAction === 'share' 
                          ? 'bg-monochrome-100 ring-2 ring-monochrome-900 ring-offset-2 scale-110' 
                          : 'hover:bg-monochrome-100'
                      }`}
                    >
                      <Share2 className={`h-5 w-5 ${activeAction === 'share' ? 'text-purple-500' : 'text-monochrome-900'}`} />
                    </Button>
                    
                    {activeAction === 'share' && (
                      <span className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 bg-monochrome-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                        Share
                      </span>
                    )}
                  </div>
                  
                  <div className="border-t border-monochrome-200 my-1"></div>
                  
                  {/* Close button */}
                  <div className="relative group">
                    <Button 
                      ref={closeButtonRef}
                      size="icon" 
                      variant="ghost" 
                      className={`h-12 w-12 rounded-full transition-all duration-200 ${
                        activeAction === 'close' 
                          ? 'bg-monochrome-100 ring-2 ring-monochrome-900 ring-offset-2 scale-110' 
                          : 'hover:bg-monochrome-100'
                      }`}
                    >
                      <X className={`h-5 w-5 ${activeAction === 'close' ? 'text-red-500' : 'text-monochrome-900'}`} />
                    </Button>
                    
                    {activeAction === 'close' && (
                      <span className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 bg-monochrome-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                        Close
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductGrid = ({ category, searchQuery, emptyStateComponent }: ProductGridProps) => {
  const { products, isLoading } = useShopProducts(category, searchQuery);
  const isMobile = useIsMobile();

  // Loading state
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {Array(isMobile ? 6 : 8).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden border-transparent">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // No results state
  if (products.length === 0) {
    if (emptyStateComponent) {
      return <>{emptyStateComponent}</>;
    }
    
    return (
      <div className="py-16 text-center">
        <div className="col-span-full py-12 text-center">
          <p className="text-monochrome-500">No products found matching your criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
