
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SuccessScreen from "./SuccessScreen";
import SchedulingStep from "./SchedulingStep";
import ItemDetailsStep from "./ItemDetailsStep";
import { ItemDetails } from "./types";

const PickupScheduler = () => {
  const { toast } = useToast();
  const [itemCount, setItemCount] = useState(3);
  const [pickupTime, setPickupTime] = useState("");
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleItemCountChange = (value: number[]) => {
    const count = value[0];
    setItemCount(count);
    
    // Adjust the items array based on the new count
    if (count > items.length) {
      // Add new items
      const newItems = [...items];
      for (let i = items.length + 1; i <= count; i++) {
        newItems.push({
          id: i.toString(),
          category: "",
          size: "",
          brand: "",
          condition: "",
          purchasePrice: "",
          estimatedSwapcoins: 0
        });
      }
      setItems(newItems);
    } else if (count < items.length) {
      // Remove items
      setItems(items.slice(0, count));
    }
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

  const handleSubmit = () => {
    if (!pickupTime) {
      toast({
        title: "Please select a pickup time",
        description: "We need to know when to collect your items",
      });
      return;
    }

    // Validate all items have required fields
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

    // Show success screen
    setIsSuccess(true);
  };

  const goToStep = (nextStep: number) => {
    if (nextStep === 2 && !pickupTime) {
      toast({
        title: "Please select a pickup time",
        description: "We need to know when to collect your items",
      });
      return;
    }
    setStep(nextStep);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setStep(1);
    setPickupTime("");
    setItemCount(3);
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

  if (isSuccess) {
    return (
      <SuccessScreen
        itemCount={itemCount}
        pickupTime={pickupTime}
        estimatedSwapcoins={totalEstimatedSwapcoins}
        onDone={resetForm}
      />
    );
  }

  return (
    <div className="space-y-8">
      {step === 1 && (
        <SchedulingStep 
          pickupTime={pickupTime}
          setPickupTime={setPickupTime}
          itemCount={itemCount}
          onItemCountChange={handleItemCountChange}
          onContinue={() => goToStep(2)}
        />
      )}

      {step === 2 && (
        <ItemDetailsStep 
          items={items}
          itemCount={itemCount}
          updateItemDetail={updateItemDetail}
          onBack={() => goToStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default PickupScheduler;
