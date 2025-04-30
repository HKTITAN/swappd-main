
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ItemCountSelectorProps {
  itemCount: number;
  onItemCountChange: (value: number[]) => void;
}

const ItemCountSelector = ({ itemCount, onItemCountChange }: ItemCountSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>How many items? ({itemCount})</Label>
        <span className="text-sm text-monochrome-500">Min: 3, Max: 10</span>
      </div>
      <Slider 
        value={[itemCount]} 
        min={3} 
        max={10} 
        step={1} 
        onValueChange={onItemCountChange}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-monochrome-500 px-2">
        {Array.from({length: 8}, (_, i) => i + 3).map(num => (
          <span key={num}>{num}</span>
        ))}
      </div>
    </div>
  );
};

export default ItemCountSelector;
