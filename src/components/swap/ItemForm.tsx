import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Info, ShoppingBag, Shirt, BookOpen, Scissors, Umbrella } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ItemForm = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: File[] = [];
    const newPreviewUrls: string[] = [];
    
    for (let i = 0; i < Math.min(files.length, 5 - images.length); i++) {
      newImages.push(files[i]);
      newPreviewUrls.push(URL.createObjectURL(files[i]));
    }
    
    setImages([...images, ...newImages]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    
    if (images.length + newImages.length >= 5) {
      toast({
        title: "Maximum images reached",
        description: "You can upload up to 5 images per item",
      });
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];
    
    URL.revokeObjectURL(previewUrls[index]);
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const categoryOptions = [
    { value: "tops", label: "Tops", icon: <Shirt className="h-4 w-4" /> },
    { value: "bottoms", label: "Bottoms", icon: <ShoppingBag className="h-4 w-4" /> },
    { value: "dresses", label: "Dresses", icon: <Scissors className="h-4 w-4" /> },
    { value: "outerwear", label: "Outerwear", icon: <Umbrella className="h-4 w-4" /> },
    { value: "shoes", label: "Shoes", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const conditionOptions = [
    { value: "new_with_tags", label: "New with tags", icon: "✨", color: "bg-green-100 text-green-800" },
    { value: "like_new", label: "Like new", icon: "👌", color: "bg-blue-100 text-blue-800" },
    { value: "good", label: "Good", icon: "👍", color: "bg-yellow-100 text-yellow-800" },
    { value: "fair", label: "Fair", icon: "🤏", color: "bg-orange-100 text-orange-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="item-photos" className="flex items-center">
            Upload Photos
            <span className="text-xs text-monochrome-500 ml-2">
              ({images.length}/5 photos)
            </span>
          </Label>
          <div className="text-xs text-monochrome-500 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Best quality = better value
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {previewUrls.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded-md border border-monochrome-200 overflow-hidden group"
            >
              <img 
                src={url} 
                alt={`Item preview ${index + 1}`} 
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-monochrome-800 bg-opacity-70 rounded-full p-1"
              >
                <X className="h-3 w-3 text-white" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          ))}
          
          {images.length < 5 && (
            <div className="aspect-square rounded-md border border-monochrome-200 border-dashed flex flex-col items-center justify-center p-4 hover:bg-monochrome-100 transition-colors">
              <Input
                id="item-photos"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <Label 
                htmlFor="item-photos" 
                className="flex flex-col items-center justify-center cursor-pointer h-full w-full text-center"
              >
                <Upload className="h-6 w-6 text-monochrome-400 mb-2" />
                <span className="text-sm text-monochrome-600">
                  Add Photos
                </span>
              </Label>
            </div>
          )}
        </div>
        <p className="text-xs text-monochrome-500 italic">
          Include front, back, tags, and any imperfections
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input 
            id="brand" 
            placeholder="e.g. Levi's" 
            required 
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input 
            id="size" 
            placeholder="e.g. Medium, 32, etc." 
            required 
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-5 gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                category === option.value 
                ? "border-primary bg-primary/10 shadow-sm transform scale-105" 
                : "border-monochrome-200 hover:border-monochrome-300 hover:bg-monochrome-50"
              }`}
              onClick={() => setCategory(option.value)}
            >
              <div className={`mb-2 p-2 rounded-full ${
                category === option.value ? "bg-primary/10" : "bg-monochrome-100"
              }`}>
                {option.icon}
              </div>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Condition</Label>
        <div className="grid grid-cols-4 gap-2">
          {conditionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                condition === option.value 
                ? "border-primary bg-primary/10 shadow-sm transform scale-105" 
                : "border-monochrome-200 hover:border-monochrome-300 hover:bg-monochrome-50"
              }`}
              onClick={() => setCondition(option.value)}
            >
              <div className={`text-xl mb-2 p-2 rounded-full ${
                condition === option.value 
                ? option.color 
                : "bg-monochrome-100"
              }`}>
                {option.icon}
              </div>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
