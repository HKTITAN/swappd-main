import { Button } from "@/components/ui/button";
import ItemDetailsForm from "./ItemDetailsForm";
import { X } from "lucide-react";

interface ItemDetailsStepProps {
  items: Array<{
    id: string;
    category: string;
    size: string;
    brand: string;
    condition: string;
    purchasePrice: string;
    estimatedSwapcoins: number;
  }>;
  updateItemDetail: (index: number, field: string, value: string) => void;
  onRemoveItem?: (index: number) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

const ItemDetailsStep = ({
  items,
  updateItemDetail,
  onRemoveItem,
  onBack,
  onSubmit,
}: ItemDetailsStepProps) => {
  // Get the total estimated Swapcoins
  const totalSwapCoins = items.reduce((sum, item) => sum + item.estimatedSwapcoins, 0);

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Step 2: Item Details</h3>
          <Button variant="outline" onClick={onBack}>
            Back to Scheduling
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Your Items</h3>
        {totalSwapCoins > 0 && (
          <div className="bg-primary/10 text-primary px-4 py-1 rounded-full font-medium">
            Estimated: {totalSwapCoins} SwapCoins
          </div>
        )}
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} className="relative bg-white rounded-lg border border-monochrome-200 p-5">
          <div className="mb-4 flex items-center justify-between border-b border-monochrome-200 pb-3">
            <h3 className="font-semibold">Item {index + 1}</h3>
            {onRemoveItem && items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            )}
          </div>
          <ItemDetailsForm 
            index={index}
            item={item}
            updateItemDetail={(field, value) => updateItemDetail(index, field, value)}
            totalItems={items.length}
          />
          
          {item.estimatedSwapcoins > 0 && (
            <div className="mt-4 text-right text-primary font-medium">
              Estimated value: {item.estimatedSwapcoins} SwapCoins
            </div>
          )}
        </div>
      ))}

      {onSubmit && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={onSubmit}
            className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Schedule Pickup
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsStep;
