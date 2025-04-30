
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const SwapForm = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission - would connect to backend in a real implementation
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission received!",
        description: "We'll review your item and get back to you shortly.",
      });
      // Reset form
      setImages([]);
      setPreviewUrls([]);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  
  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="item-photos">Upload Photos</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Image preview cards */}
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
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <span className="text-white">Remove</span>
                </button>
              </div>
            ))}
            
            {/* Upload button */}
            {images.length < 5 && (
              <div className="aspect-square rounded-md border border-monochrome-200 border-dashed flex flex-col items-center justify-center p-4">
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
                    Upload Photo {images.length > 0 ? `(${images.length}/5)` : ""}
                  </span>
                </Label>
              </div>
            )}
          </div>
          <p className="text-xs text-monochrome-500">
            Upload up to 5 clear photos of your item. Include front, back and any details or imperfections.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="item-name">Item Name</Label>
          <Input id="item-name" placeholder="e.g. Black Levi's 501 Jeans" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" placeholder="e.g. Levi's" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input id="size" placeholder="e.g. Medium, 32, etc." required />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select 
            id="category" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Select a category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="accessories">Accessories</option>
            <option value="shoes">Shoes</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <select 
            id="condition" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Select condition</option>
            <option value="new_with_tags">New with tags</option>
            <option value="like_new">Like new</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe your item, including any wear or imperfections" 
            className="min-h-[100px]"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full rounded-full"
          disabled={images.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit for Review"}
        </Button>
      </form>
    </div>
  );
};

export default SwapForm;
