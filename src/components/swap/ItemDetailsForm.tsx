
import { Shirt, ArrowUp, BookOpen, Umbrella, Scissors } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ItemDetailsFormProps {
  index: number;
  item: {
    id: string;
    category: string;
    size: string;
    brand: string;
    condition: string;
    purchasePrice: string;
    estimatedSwapcoins: number;
  };
  updateItemDetail: (field: string, value: string) => void;
  totalItems: number;
}

const ItemDetailsForm = ({ index, item, updateItemDetail, totalItems }: ItemDetailsFormProps) => {
  const categoryOptions = [
    { value: "tshirt", label: "T-shirt", icon: <Shirt className="h-4 w-4" /> },
    { value: "top", label: "Top", icon: <ArrowUp className="h-4 w-4" /> },
    { value: "dress", label: "Dress", icon: <Scissors className="h-4 w-4" /> },
    { value: "trousers", label: "Trousers", icon: <BookOpen className="h-4 w-4" /> },
    { value: "skirt", label: "Skirt", icon: <Umbrella className="h-4 w-4" /> },
  ];

  const sizeOptions = [
    { value: "xxs", label: "XXS" },
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ];

  const conditionOptions = [
    { value: "new_with_tags", label: "New with tags", icon: "✨" },
    { value: "like_new", label: "Like new", icon: "👌" },
    { value: "good", label: "Good", icon: "👍" },
    { value: "fair", label: "Fair", icon: "🤏" },
  ];

  return (
    <div className="border border-monochrome-200 rounded-md p-6 bg-white">
      <h4 className="font-medium text-lg mb-4 pb-2 border-b border-monochrome-100">
        Item {index + 1} of {totalItems}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor={`category-${item.id}`}>Category</Label>
          <Select 
            value={item.category} 
            onValueChange={(value) => updateItemDetail("category", value)}
          >
            <SelectTrigger id={`category-${item.id}`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`size-${item.id}`}>Size</Label>
          <Select 
            value={item.size} 
            onValueChange={(value) => updateItemDetail("size", value)}
          >
            <SelectTrigger id={`size-${item.id}`}>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`brand-${item.id}`}>Brand</Label>
          <Input 
            id={`brand-${item.id}`}
            value={item.brand}
            onChange={(e) => updateItemDetail("brand", e.target.value)}
            placeholder="e.g. Levi's, Nike"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`condition-${item.id}`}>Condition</Label>
          <Select 
            value={item.condition} 
            onValueChange={(value) => updateItemDetail("condition", value)}
          >
            <SelectTrigger id={`condition-${item.id}`}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`price-${item.id}`}>Purchase Price (optional)</Label>
          <Input 
            id={`price-${item.id}`}
            value={item.purchasePrice}
            onChange={(e) => updateItemDetail("purchasePrice", e.target.value)}
            type="number"
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`swapcoins-${item.id}`}>Estimated Swapcoins</Label>
          <div className="flex items-center h-10 px-3 py-2 rounded-md border border-input bg-background/50">
            <span className="text-muted-foreground">
              {item.estimatedSwapcoins || "Enter details to calculate"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Value to be determined by our formula
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsForm;
