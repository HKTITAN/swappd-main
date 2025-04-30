
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const RequestProduct = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - would connect to backend in real implementation
    setTimeout(() => {
      toast({
        title: "Request submitted!",
        description: "We'll notify you when similar items become available.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-monochrome-400 mb-4" />
      <h3 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
      <p className="text-monochrome-600 mb-8">
        Let us know what you're searching for and we'll notify you when it becomes available.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="item-type">What are you looking for?</Label>
          <Input
            id="item-type"
            placeholder="e.g. Black Levi's 501 Jeans"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Preferred Size</Label>
          <Input
            id="size"
            placeholder="e.g. Medium, 32, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Additional Details</Label>
          <Textarea
            id="details"
            placeholder="Any specific brand, color, or style preferences?"
            className="min-h-[100px]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
};

export default RequestProduct;
