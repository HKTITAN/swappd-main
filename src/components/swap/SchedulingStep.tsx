
import { Button } from "@/components/ui/button";
import PickupTimeSelector from "./PickupTimeSelector";
import ItemCountSelector from "./ItemCountSelector";

interface SchedulingStepProps {
  pickupTime: string;
  setPickupTime: (time: string) => void;
  itemCount: number;
  onItemCountChange: (value: number[]) => void;
  onContinue: () => void;
}

const SchedulingStep = ({
  pickupTime,
  setPickupTime,
  itemCount,
  onItemCountChange,
  onContinue,
}: SchedulingStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Step 1: Schedule a Pickup</h3>
        <PickupTimeSelector pickupTime={pickupTime} setPickupTime={setPickupTime} />
        <div className="mt-6">
          <ItemCountSelector itemCount={itemCount} onItemCountChange={onItemCountChange} />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onContinue}
          className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Continue to Item Details
        </Button>
      </div>
    </div>
  );
};

export default SchedulingStep;
