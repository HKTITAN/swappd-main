import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SuccessScreen from "./SuccessScreen";
import SchedulingStep from "./SchedulingStep";
import ItemDetailsStep from "./ItemDetailsStep";
import { ItemDetails } from "./types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PickupScheduler = () => {
  const { toast } = useToast();
  const [pickupTime, setPickupTime] = useState("");
  const [step, setStep] = useState<"items" | "scheduling" | "success">("items");
  const [items, setItems] = useState<ItemDetails[]>([
    {
      id: "1",
      category: "",
      size: "",
      brand: "",
      condition: "",
      purchasePrice: "",
      estimatedSwapcoins: 0
    }
  ]);

  const addNewItem = () => {
    // Limit to maximum 10 items
    if (items.length >= 10) {
      toast({
        title: "Maximum items reached",
        description: "You can add up to 10 items at a time.",
      });
      return;
    }
    
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        category: "",
        size: "",
        brand: "",
        condition: "",
        purchasePrice: "",
        estimatedSwapcoins: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    // Prevent removing the last remaining item
    if (items.length === 1) {
      toast({
        title: "Cannot remove the last item",
        description: "You must have at least one item to swap.",
      });
      return;
    }
    
    const updatedItems = items.filter((_, i) => i !== index);
    // Renumber the IDs
    updatedItems.forEach((item, i) => {
      item.id = (i + 1).toString();
    });
    
    setItems(updatedItems);
  };

  const updateItemDetail = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      // Update estimated Swapcoins based on condition and purchase price
      estimatedSwapcoins: field === 'condition' || field === 'purchasePrice' 
        ? calculateEstimatedSwapcoins(updatedItems[index].condition, updatedItems[index].purchasePrice)
        : updatedItems[index].estimatedSwapcoins
    };
    setItems(updatedItems);
  };

  const calculateEstimatedSwapcoins = (condition: string, price: string): number => {
    // Simple formula based on condition and purchase price
    const priceValue = parseInt(price) || 0;
    const conditionMultiplier = 
      condition === "new_with_tags" ? 0.8 :
      condition === "like_new" ? 0.6 :
      condition === "good" ? 0.4 :
      condition === "fair" ? 0.2 : 0;
    
    return Math.round(priceValue * conditionMultiplier);
  };

  const proceedToScheduling = () => {
    // Validate all items have required fields before proceeding to scheduling
    const isValid = items.every(item => 
      item.category && item.size && item.brand && item.condition
    );

    if (!isValid) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for each item",
      });
      return;
    }

    setStep("scheduling");
  };

  const handleSubmit = () => {
    if (!pickupTime) {
      toast({
        title: "Please select a pickup time",
        description: "We need to know when to collect your items",
      });
      return;
    }

    // Show success screen
    setStep("success");
  };

  const resetForm = () => {
    setStep("items");
    setPickupTime("");
    setItems([
      {
        id: "1",
        category: "",
        size: "",
        brand: "",
        condition: "",
        purchasePrice: "",
        estimatedSwapcoins: 0
      }
    ]);
  };

  // Calculate total estimated Swapcoins
  const totalEstimatedSwapcoins = items.reduce((sum, item) => sum + item.estimatedSwapcoins, 0);

  if (step === "success") {
    return (
      <SuccessScreen
        itemCount={items.length}
        pickupTime={pickupTime}
        estimatedSwapcoins={totalEstimatedSwapcoins}
        onDone={resetForm}
      />
    );
  }

  return (
    <div className="space-y-8">
      {step === "items" && (
        <div className="space-y-6">
          <ItemDetailsStep 
            items={items}
            updateItemDetail={updateItemDetail}
            onRemoveItem={removeItem}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-6 border-dashed"
              onClick={addNewItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Item ({items.length}/10)
            </Button>
            
            <Button
              type="button"
              className="flex-1 py-6 rounded-full"
              onClick={proceedToScheduling}
            >
              Continue to Schedule Pickup
            </Button>
          </div>
        </div>
      )}

      {step === "scheduling" && (
        <div className="space-y-6">
          <SchedulingStep 
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
            onBack={() => setStep("items")}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default PickupScheduler;
