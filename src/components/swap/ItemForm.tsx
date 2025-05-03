import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Info, ShoppingBag, Shirt, BookOpen, Scissors, Umbrella, ArrowRight, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ItemFormProps {
  onComplete: () => void;
}

const ItemForm = ({ onComplete }: ItemFormProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState<"photos" | "details" | "description">("photos");
  
  const isPhotosComplete = images.length > 0;
  const isDetailsComplete = brand && size && category && condition;
  const isDescriptionComplete = description.trim().length > 10;
  const isFormComplete = isPhotosComplete && isDetailsComplete && isDescriptionComplete;

  useEffect(() => {
    if (isFormComplete) {
      onComplete();
    }
  }, [isFormComplete, onComplete]);
  
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
    { value: "accessories", label: "Accessories", icon: <ShoppingBag className="h-4 w-4" /> },
  ];

  const conditionOptions = [
    { value: "new_with_tags", label: "New with tags", icon: "✨", color: "bg-green-100 text-green-800" },
    { value: "like_new", label: "Like new", icon: "👌", color: "bg-blue-100 text-blue-800" },
    { value: "good", label: "Good", icon: "👍", color: "bg-yellow-100 text-yellow-800" },
    { value: "fair", label: "Fair", icon: "🤏", color: "bg-orange-100 text-orange-800" },
  ];

  // Navigation functions between steps
  const goToNextStep = () => {
    if (currentStep === "photos" && isPhotosComplete) {
      setCurrentStep("details");
    } else if (currentStep === "details" && isDetailsComplete) {
      setCurrentStep("description");
    }
  };

  const goToStep = (step: "photos" | "details" | "description") => {
    setCurrentStep(step);
  };

  // Form components based on steps
  const renderPhotoUploadStep = () => (
    <div className="space-y-4">
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
      
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-3" : "grid-cols-5"
      )}>
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

      <div className="space-y-2">
        <Label htmlFor="item-name">Item Name</Label>
        <Input 
          id="item-name" 
          placeholder="e.g. Black Levi's 501 Jeans" 
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      
      <Button
        onClick={goToNextStep}
        disabled={!isPhotosComplete}
        className="w-full rounded-full mt-4"
      >
        Continue to Details <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input 
            id="brand" 
            placeholder="e.g. Levi's" 
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input 
            id="size" 
            placeholder="e.g. Medium, 32, etc." 
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Category</Label>
        <div className={cn(
          "grid gap-2",
          isMobile ? "grid-cols-3" : "grid-cols-6"
        )}>
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                category === option.value 
                ? "border-primary bg-primary/10 shadow-sm" 
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
      
      <div className="space-y-3">
        <Label>Condition</Label>
        <div className={cn(
          "grid gap-2",
          isMobile ? "grid-cols-2" : "grid-cols-4" 
        )}>
          {conditionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                condition === option.value 
                ? "border-primary bg-primary/10 shadow-sm" 
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
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => goToStep("photos")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={goToNextStep}
          disabled={!isDetailsComplete}
          className="flex-1 rounded-full"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDescriptionStep = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe your item, including any wear or imperfections" 
          className="min-h-[150px] resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-xs text-monochrome-500">
          {description.length < 10 
            ? `${10 - description.length} more characters needed` 
            : "Description looks good!"
          }
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => goToStep("details")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          disabled={!isDescriptionComplete}
          onClick={onComplete}
          className="flex-1 rounded-full bg-green-600 hover:bg-green-700"
        >
          Complete Item <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Progress bar for the form steps
  const renderProgressBar = () => {
    const steps = [
      { id: "photos", label: "Photos", isComplete: isPhotosComplete },
      { id: "details", label: "Details", isComplete: isDetailsComplete },
      { id: "description", label: "Description", isComplete: isDescriptionComplete }
    ] as const;
    
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm",
                currentStep === step.id
                  ? "bg-primary text-white"
                  : step.isComplete
                    ? "bg-green-500 text-white"
                    : "bg-monochrome-200 text-monochrome-600"
              )}
              onClick={() => {
                // Only allow navigating to completed steps or the current step
                if (step.isComplete || index <= currentStepIndex) {
                  goToStep(step.id);
                }
              }}
            >
              {step.isComplete ? <Check className="h-4 w-4" /> : index + 1}
            </button>
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 w-10 sm:w-20 mx-2",
                index < currentStepIndex || (index === currentStepIndex && steps[index].isComplete)
                  ? "bg-green-500"
                  : "bg-monochrome-200"
              )} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderProgressBar()}
      
      {currentStep === "photos" && renderPhotoUploadStep()}
      {currentStep === "details" && renderDetailsStep()}
      {currentStep === "description" && renderDescriptionStep()}

      {isFormComplete && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <Check className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 text-sm">Item completed! You can add another item or submit now.</span>
        </div>
      )}
    </div>
  );
};

export default ItemForm;
