
import { 
  ShoppingBag, 
  ShoppingCart, 
  BookOpen, 
  Package, 
  Briefcase, 
  Bookmark,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CategoryGridProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: "All", icon: null },
  { name: "Tops", icon: ShoppingBag },
  { name: "Bottoms", icon: ShoppingCart },
  { name: "Dresses", icon: BookOpen },
  { name: "Outerwear", icon: Package },
  { name: "Accessories", icon: Bookmark },
  { name: "Shoes", icon: Briefcase },
];

const CategoryGrid = ({ activeCategory, onCategoryChange }: CategoryGridProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-8">
      <Button 
        variant="outline" 
        onClick={toggleExpand}
        className="w-full rounded-xl mb-4 flex items-center justify-between border-monochrome-200 hover:bg-monochrome-100"
      >
        <span>Categories: <span className="font-semibold">{activeCategory}</span></span>
        {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
      </Button>
      
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-fade-in">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                className={`
                  h-auto py-4 px-3 w-full flex flex-col items-center gap-2 rounded-xl
                  transition-all duration-200 shadow-sm hover:shadow
                  ${activeCategory === category.name 
                    ? "bg-monochrome-900 text-white" 
                    : "border-monochrome-200 hover:bg-monochrome-100"}
                `}
                onClick={() => {
                  onCategoryChange(category.name);
                  setIsExpanded(false);
                }}
              >
                {Icon && (
                  <div className={`p-2 rounded-full ${activeCategory === category.name 
                    ? "bg-monochrome-800" 
                    : "bg-monochrome-100"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
