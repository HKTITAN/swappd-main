
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";

interface SavedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
}

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState<SavedProduct[]>([]);

  useEffect(() => {
    // Load saved items from localStorage
    const storedItems = localStorage.getItem('savedItems');
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems));
    }
  }, []);

  const removeItem = (id: number) => {
    const updatedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(updatedItems);
    localStorage.setItem('savedItems', JSON.stringify(updatedItems));
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/shop">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Saved Items</h1>
      </div>
      
      {savedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-transparent transition-all product-card-hover">
                <CardContent className="p-0 relative">
                  <button 
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs bg-monochrome-900 text-white px-2 py-0.5 rounded-full">{item.size}</span>
                        <p className="text-sm text-monochrome-500">{item.category}</p>
                      </div>
                      <p className="text-sm font-mono font-bold">{item.price} coins</p>
                    </div>
                    <h3 className="mt-2 font-medium">{item.name}</h3>
                    <Link to={`/shop/product/${item.id}`} className="mt-3 block">
                      <Button variant="outline" size="sm" className="rounded-full w-full border-2 border-monochrome-900 hover:bg-monochrome-900 hover:text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link to="/shop">
              <Button className="cta-button">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-monochrome-400 text-8xl font-bold mb-4">:/</div>
          <h2 className="text-2xl font-bold mb-2">No saved items yet</h2>
          <p className="text-monochrome-600 mb-8">
            Start swiping to discover clothes you'll love
          </p>
          <Link to="/shop">
            <Button className="cta-button">
              START BROWSING
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedItems;
