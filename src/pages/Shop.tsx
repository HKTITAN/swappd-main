
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGrid from "@/components/shop/ProductGrid";
import SwipeView from "@/components/shop/SwipeView";
import CategoryGrid from "@/components/shop/CategoryGrid";
import RequestProduct from "@/components/shop/RequestProduct";
import { Search, Heart, LayoutList, GridIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
}

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  
  const handleSaveItem = (product: Product) => {
    // Retrieve existing saved items
    const savedItemsJSON = localStorage.getItem('savedItems');
    let savedItems = savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
    
    // Check if item already exists in saved items
    const itemExists = savedItems.some((item: Product) => item.id === product.id);
    
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
  
  const handleDiscardItem = (product: Product) => {
    // Optional: you could log discarded items or implement other functionality
    console.log("Discarded:", product.name);
  };
  
  return (
    <div className="py-12 bg-gradient-to-b from-white to-monochrome-100/30">
      <div className="container px-4 md:px-6">
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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-monochrome-600 font-medium">Categories:</span>
              <Button 
                variant={activeCategory === "All" ? "default" : "outline"} 
                onClick={() => setActiveCategory("All")}
                className="rounded-full text-sm h-8 px-4 shadow-sm"
              >
                All
              </Button>
              <Button 
                variant={activeCategory === "Tops" ? "default" : "outline"} 
                onClick={() => setActiveCategory("Tops")}
                className="rounded-full text-sm h-8 px-4 shadow-sm"
              >
                Tops
              </Button>
              <Button 
                variant={activeCategory === "Bottoms" ? "default" : "outline"} 
                onClick={() => setActiveCategory("Bottoms")}
                className="rounded-full text-sm h-8 px-4 shadow-sm"
              >
                Bottoms
              </Button>
              <Button 
                variant={activeCategory === "Dresses" ? "default" : "outline"} 
                onClick={() => setActiveCategory("Dresses")}
                className="rounded-full text-sm h-8 px-4 shadow-sm"
              >
                Dresses
              </Button>
              <Button 
                variant={activeCategory === "Outerwear" ? "default" : "outline"} 
                onClick={() => setActiveCategory("Outerwear")}
                className="rounded-full text-sm h-8 px-4 shadow-sm"
              >
                Outerwear
              </Button>
            </div>
          </div>
          
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="bg-monochrome-200 rounded-full p-1 shadow-inner">
              <TabsTrigger value="swipe" onClick={() => setViewMode("swipe")} className="rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all">
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Swipe</span>
              </TabsTrigger>
              <TabsTrigger value="grid" onClick={() => setViewMode("grid")} className="rounded-full data-[state=active]:bg-monochrome-900 data-[state=active]:text-white transition-all">
                <GridIcon className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Grid</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Separator className="my-6" />
        
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
