import { Button } from "@/components/ui/button";
import PickupTimeSelector from "./PickupTimeSelector";

interface SchedulingStepProps {
  pickupTime: string;
  setPickupTime: (time: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const SchedulingStep = ({
  pickupTime,
  setPickupTime,
  onBack,
  onSubmit,
}: SchedulingStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Schedule Pickup</h3>
        <Button variant="outline" onClick={onBack}>
          Back to Items
        </Button>
      </div>
      
      <div className="space-y-4">
        <p className="text-monochrome-600">
          Choose a convenient time for us to collect your items. We'll send you a confirmation once your pickup is scheduled.
        </p>
        <PickupTimeSelector pickupTime={pickupTime} setPickupTime={setPickupTime} />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onSubmit}
          disabled={!pickupTime}
          className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Confirm Pickup
        </Button>
      </div>
    </div>
  );
};

export default SchedulingStep;
