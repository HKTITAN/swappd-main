
import { Button } from "@/components/ui/button";
import ItemDetailsForm from "./ItemDetailsForm";

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
  itemCount: number;
  updateItemDetail: (index: number, field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ItemDetailsStep = ({
  items,
  itemCount,
  updateItemDetail,
  onBack,
  onSubmit,
}: ItemDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Step 2: Item Details</h3>
        <Button variant="outline" onClick={onBack}>
          Back to Scheduling
        </Button>
      </div>
      
      {items.map((item, index) => (
        <ItemDetailsForm 
          key={item.id}
          index={index}
          item={item}
          updateItemDetail={(field, value) => updateItemDetail(index, field, value)}
          totalItems={itemCount}
        />
      ))}

      <div className="flex justify-end mt-8">
        <Button 
          onClick={onSubmit}
          className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Schedule Pickup
        </Button>
      </div>
    </div>
  );
};

export default ItemDetailsStep;
