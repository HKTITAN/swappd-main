import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowRight, Upload, Check, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ItemForm from "./ItemForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ItemData {
  id: string;
  isComplete: boolean;
}

const MultiItemUpload = () => {
  const [items, setItems] = useState<ItemData[]>([{ 
    id: '1', 
    isComplete: false
  }]);
  const [activeItemId, setActiveItemId] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const isMobile = useIsMobile();

  // Mark an item as complete
  const markItemComplete = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isComplete: true } : item
    ));
  };

  // Add a new item and set it as active
  const addNewItem = () => {
    if (items.length >= 10) {
      toast({
        title: "Maximum items reached",
        description: "You can upload up to 10 items at once",
      });
      return;
    }
    
    const newItemId = (items.length + 1).toString();
    setItems([...items, { 
      id: newItemId,
      isComplete: false
    }]);
    setActiveItemId(newItemId);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one item",
      });
      return;
    }

    // If removing the active item, set another item as active
    if (id === activeItemId) {
      const remainingItems = items.filter(item => item.id !== id);
      setActiveItemId(remainingItems[0].id);
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

  const completeItemCount = items.filter(item => item.isComplete).length;
  const canSubmit = completeItemCount > 0;

  return (
    <div className="space-y-6">
      {/* Item Pills Navigation - Desktop shows all, Mobile shows active + add button */}
      <div className={`flex ${isMobile ? 'overflow-x-auto pb-2 gap-2 snap-x' : 'flex-wrap gap-2'}`}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItemId(item.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full ${
              activeItemId === item.id 
                ? 'bg-primary text-white' 
                : item.isComplete
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-monochrome-100 text-monochrome-700 border border-monochrome-200'
            } transition-all ${isMobile ? 'snap-center flex-shrink-0' : ''}`}
          >
            <span className="font-medium">Item {item.id}</span>
            {item.isComplete && <Check className="h-4 w-4 ml-1" />}
          </button>
        ))}
        
        {isMobile && items.length < 10 && (
          <button
            onClick={addNewItem}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-monochrome-100 text-primary border border-dashed border-primary flex-shrink-0 snap-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        )}
      </div>
      
      {/* Active Item Form */}
      <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-monochrome-200">
        <div className="mb-4 flex items-center justify-between border-b border-monochrome-200 pb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Item {activeItemId}
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              items.find(i => i.id === activeItemId)?.isComplete 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
            }`}>
              {items.find(i => i.id === activeItemId)?.isComplete ? 'Completed' : 'In progress'}
            </span>
          </h3>
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(activeItemId)}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          )}
        </div>
        
        <ItemForm onComplete={() => markItemComplete(activeItemId)} />
      </div>
      
      {/* Add New Item - Desktop view only (mobile is in the pills) */}
      {!isMobile && items.length < 10 && (
        <Button
          onClick={addNewItem}
          variant="outline"
          className="w-full py-6 border-dashed hover:bg-monochrome-50 hover:border-primary"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Another Item ({items.length}/10)
        </Button>
      )}
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Items completed</span>
          <span className="text-sm font-medium">{completeItemCount}/{items.length}</span>
        </div>
        <div className="w-full bg-monochrome-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all" 
            style={{ width: `${(completeItemCount / items.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Submit button */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-monochrome-200 -mx-4">
        <Button 
          onClick={() => setShowSubmitDialog(true)}
          disabled={!canSubmit}
          className={`w-full py-6 px-8 rounded-full ${
            canSubmit 
              ? 'bg-primary hover:bg-primary/90 text-white' 
              : 'bg-monochrome-200 text-monochrome-500'
          } font-semibold shadow-md hover:shadow-lg transition-all`}
        >
          Submit {completeItemCount} Item{completeItemCount !== 1 ? 's' : ''} for Review <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-monochrome-500 mt-2">
          {canSubmit 
            ? "We'll arrange pickup after review" 
            : "Please complete at least one item to submit"}
        </p>
      </div>
      
      <div className="mt-8 p-4 sm:p-6 border border-monochrome-200 rounded-lg bg-monochrome-50">
        <h3 className="font-bold text-xl mb-6 text-center">How It Works</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              You're about to submit {completeItemCount} item(s) for review. Our team will contact you to arrange pickup once approved.
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
