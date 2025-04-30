
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowRight, Upload, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ItemForm from "./ItemForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ItemData {
  id: string;
  images: File[];
  previewUrls: string[];
}

const MultiItemUpload = () => {
  const [items, setItems] = useState<ItemData[]>([{ 
    id: '1', 
    images: [], 
    previewUrls: [] 
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const addNewItem = () => {
    if (items.length >= 5) {
      toast({
        title: "Maximum items reached",
        description: "You can upload up to 5 items at once",
      });
      return;
    }
    
    setItems([...items, { 
      id: (items.length + 1).toString(),
      images: [],
      previewUrls: []
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one item",
      });
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Mock submission - would connect to backend in a real implementation
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      toast({
        title: "Items submitted successfully!",
        description: "We'll review your items and get back to you shortly.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <div key={item.id} className="relative bg-white rounded-lg p-6 shadow-sm border border-monochrome-200">
          <div className="mb-4 flex items-center justify-between border-b border-monochrome-200 pb-3">
            <h3 className="font-semibold text-lg">Item {index + 1}</h3>
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            )}
          </div>
          <ItemForm />
        </div>
      ))}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {items.length < 5 && (
          <Button
            onClick={addNewItem}
            variant="outline"
            className="py-6 border-dashed hover:bg-monochrome-50 hover:border-primary"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Another Item
          </Button>
        )}
        
        <Button 
          onClick={() => setShowSubmitDialog(true)}
          className="py-6 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Submit Items for Review <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <div className="mt-8 p-6 border border-monochrome-200 rounded-lg bg-monochrome-50">
        <h3 className="font-bold text-xl mb-6 text-center">How It Works</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="font-semibold mb-1">1. Upload</h4>
            <p className="text-sm text-monochrome-600">Add photos and details of your items</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <ArrowRight className="h-6 w-6" />
            </div>
            <h4 className="font-semibold mb-1">2. Pickup</h4>
            <p className="text-sm text-monochrome-600">We'll collect your items from your doorstep</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-semibold mb-1">3. Quality Check</h4>
            <p className="text-sm text-monochrome-600">Items undergo careful inspection</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m8 12 3 3 5-5"></path>
              </svg>
            </div>
            <h4 className="font-semibold mb-1">4. Earn SwapCoins</h4>
            <p className="text-sm text-monochrome-600">Get SwapCoins based on item quality</p>
          </div>
        </div>
      </div>
      
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your items?</DialogTitle>
            <DialogDescription>
              You're about to submit {items.length} item(s) for review. Our team will contact you to arrange pickup once approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Confirm Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiItemUpload;
