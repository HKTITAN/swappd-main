import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGrid from "@/components/shop/ProductGrid";
import SwipeView from "@/components/shop/SwipeView";
import CategoryGrid from "@/components/shop/CategoryGrid";
import RequestProduct from "@/components/shop/RequestProduct";
import { Search, Heart, LayoutList, GridIcon, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ShopProduct } from "@/hooks/useShopProducts";
import { useIsMobile } from "@/hooks/use-mobile";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSaveItem = (product: ShopProduct) => {
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
    }
  };
  
  const handleDiscardItem = (product: ShopProduct) => {
    // Optional: you could log discarded items or implement other functionality
    console.log("Discarded:", product.name);
  };
  
  return (
    <div className="py-6 md:py-12 bg-gradient-to-b from-white to-monochrome-100/30">
      <div className="container px-3 md:px-6">
        {/* Mobile header with expandable search */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">Shop</h1>
              
              <div className="flex items-center gap-2">
                {!showSearch && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setShowSearch(true)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                    
                    <Link to="/saved-items">
                      <Button variant="outline" size="icon" className="rounded-full relative shadow-sm hover:shadow-md">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
                
                {showSearch && (
                  <div className="relative flex-1 flex items-center">
                    <Input 
                      type="search"
                      placeholder="Search products..." 
                      className="rounded-full border-monochrome-200 pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 rounded-full"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky top-16 bg-white/90 backdrop-blur-md z-10 py-2 -mx-3 px-3">
              <div className="flex justify-between items-center">
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                  <TabsList className="w-full bg-monochrome-100 rounded-full p-1 shadow-inner">
                    <TabsTrigger 
                      value="grid" 
                      onClick={() => setViewMode("grid")} 
                      className="flex-1 rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all"
                    >
                      <GridIcon className="h-4 w-4 mr-2" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger 
                      value="swipe" 
                      onClick={() => setViewMode("swipe")} 
                      className="flex-1 rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all"
                    >
                      <LayoutList className="h-4 w-4 mr-2" />
                      Swipe
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop header */}
        {!isMobile && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Shop</h1>
            
            <div className="flex items-center gap-3">
              <Link to="/saved-items">
                <Button variant="outline" size="icon" className="rounded-full relative shadow-sm hover:shadow-md">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Saved Items</span>
                </Button>
              </Link>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-monochrome-500" />
                <Input 
                  type="search"
                  placeholder="Search products..." 
                  className="pl-10 rounded-full min-w-[200px] border-monochrome-200 shadow-sm focus-visible:ring-monochrome-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Category navigation - desktop uses regular layout, mobile uses horizontal scroll */}
        <div className={isMobile ? "-mx-3 px-3 mb-4 overflow-x-auto scrollbar-hide" : "mb-6"}>
          <CategoryGrid 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory}
            isMobile={isMobile} 
          />
        </div>
        
        {!isMobile && (
          <div className="flex justify-end mb-6">
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList className="bg-monochrome-200 rounded-full p-1 shadow-inner">
                <TabsTrigger value="swipe" onClick={() => setViewMode("swipe")} className="rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all">
                  <LayoutList className="h-4 w-4" />
                  <span className="ml-2">Swipe</span>
                </TabsTrigger>
                <TabsTrigger value="grid" onClick={() => setViewMode("grid")} className="rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all">
                  <GridIcon className="h-4 w-4" />
                  <span className="ml-2">Grid</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {!isMobile && <Separator className="my-6" />}
        
        <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
          <TabsContent value="swipe" className="mt-0">
            <SwipeView 
              onLike={handleSaveItem}
              onDislike={handleDiscardItem}
              category={activeCategory === "All" ? undefined : activeCategory}
            />
          </TabsContent>
          
          <TabsContent value="grid" className="mt-0">
            <ProductGrid 
              category={activeCategory === "All" ? undefined : activeCategory} 
              searchQuery={searchQuery}
              emptyStateComponent={<RequestProduct />}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
