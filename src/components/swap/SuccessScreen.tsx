
import { CalendarCheck, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SuccessScreenProps {
  itemCount: number;
  pickupTime: string;
  estimatedSwapcoins: number;
  onDone: () => void;
}

const SuccessScreen = ({ itemCount, pickupTime, estimatedSwapcoins, onDone }: SuccessScreenProps) => {
  // Format pickup date for display
  const formattedDate = new Date(pickupTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Pickup Scheduled!</h2>
      <p className="text-monochrome-600 mb-6 max-w-md">
        Your pickup has been successfully scheduled. We'll collect your {itemCount} items at the time you selected.
      </p>
      
      <div className="bg-monochrome-50 rounded-lg p-6 mb-8 w-full max-w-md">
        <div className="flex items-center mb-4">
          <CalendarCheck className="h-5 w-5 text-primary mr-3" />
          <span className="font-medium">Pickup Details</span>
        </div>
        
        <div className="space-y-3 text-left">
          <div className="flex justify-between py-2 border-b border-monochrome-100">
            <span className="text-monochrome-500">Date & Time</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-monochrome-100">
            <span className="text-monochrome-500">Items</span>
            <span className="font-medium">{itemCount} items</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-monochrome-500">Estimated Swapcoins</span>
            <span className="font-medium text-primary">{estimatedSwapcoins} SC</span>
          </div>
        </div>
      </div>
      
      <div className="space-x-4">
        <Button 
          onClick={onDone}
          variant="outline"
          className="rounded-full px-6"
        >
          Schedule Another Pickup
        </Button>
        <Button 
          asChild
          className="rounded-full px-6"
        >
          <Link to="/shop">
            Browse Shop <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
