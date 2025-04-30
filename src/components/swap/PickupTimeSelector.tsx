
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PickupTimeSelectorProps {
  pickupTime: string;
  setPickupTime: (time: string) => void;
}

const PickupTimeSelector = ({ pickupTime, setPickupTime }: PickupTimeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="pickup-time">Select Pickup Time</Label>
      <Input
        id="pickup-time"
        type="datetime-local"
        value={pickupTime}
        onChange={(e) => setPickupTime(e.target.value)}
        className="w-full"
        min={new Date().toISOString().slice(0, 16)}
        required
      />
    </div>
  );
};

export default PickupTimeSelector;
