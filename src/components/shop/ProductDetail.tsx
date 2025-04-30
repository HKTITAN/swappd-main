
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ChevronLeft } from "lucide-react";

// Mock product data - would come from API in real implementation
const products = [
  {
    id: "1",
    name: "Vintage Denim Jacket",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    ],
    category: "Outerwear",
    size: "Medium",
    condition: "Good",
    description: "A classic vintage denim jacket with subtle distressing. Perfect for layering in almost any season. Shows minimal signs of wear with no major flaws.",
    originalPrice: 200
  },
  {
    id: "2",
    name: "Monochrome Striped Shirt",
    price: 75,
    images: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    ],
    category: "Tops",
    size: "Large",
    condition: "Like New",
    description: "Minimalist black and white striped button-up shirt. Relaxed fit with clean lines. Barely worn, in excellent condition.",
    originalPrice: 120
  },
  {
    id: "3",
    name: "Classic Black Jeans",
    price: 90,
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    ],
    category: "Bottoms",
    size: "32",
    condition: "Good",
    description: "Timeless black jeans in a straight-leg cut. Versatile staple for any wardrobe. Shows light fading but no rips or tears.",
    originalPrice: 150
  },
  {
    id: "4",
    name: "Minimalist Wool Coat",
    price: 185,
    images: [
      "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    ],
    category: "Outerwear",
    size: "Small",
    condition: "Like New",
    description: "Elegant wool coat in a clean, minimalist design. Subtle texture and excellent warmth. Only worn a handful of times, in excellent condition.",
    originalPrice: 320
  }
];

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const product = products.find((p) => p.id === productId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart`,
    });
  };
  
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <p className="mb-4">Product not found</p>
        <Link to="/shop">
          <Button variant="outline" className="rounded-full">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }
  
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  return (
    <div className="container py-12">
      <Link to="/shop" className="inline-flex items-center mb-6 text-monochrome-600 hover:text-monochrome-900">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Shop
      </Link>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl shadow-md">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 shadow-sm transition-all
                    ${currentImageIndex === index 
                      ? "border-monochrome-900 ring-2 ring-monochrome-200" 
                      : "border-transparent hover:border-monochrome-300"}`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <p className="text-sm inline-flex bg-monochrome-100 text-monochrome-500 px-3 py-1 rounded-full">{product.category}</p>
            <h1 className="mt-2 text-2xl font-medium sm:text-3xl">{product.name}</h1>
            <div className="mt-4 flex items-center">
              <span className="mr-2 font-mono text-xl font-bold">{product.price} coins</span>
              <span className="text-sm text-monochrome-500 line-through">{product.originalPrice} coins</span>
              <span className="ml-2 rounded-full bg-monochrome-900 px-2 py-0.5 text-xs font-medium text-white">
                {discount}% OFF
              </span>
            </div>
          </div>
          
          <div className="space-y-2 bg-monochrome-50 p-4 rounded-xl">
            <p className="font-medium">Details</p>
            <div className="grid grid-cols-2 text-sm">
              <div className="space-y-2">
                <p className="text-monochrome-500">Size</p>
                <p className="text-monochrome-500">Condition</p>
              </div>
              <div className="space-y-2">
                <p>{product.size}</p>
                <p>{product.condition}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Description</p>
            <p className="text-monochrome-600">{product.description}</p>
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            className="mt-8 w-full rounded-full py-6 h-auto font-medium text-base shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
