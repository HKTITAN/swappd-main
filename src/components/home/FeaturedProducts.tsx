import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 120,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Outerwear"
  },
  {
    id: 2,
    name: "Monochrome Striped Shirt",
    price: 75,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops"
  },
  {
    id: 3,
    name: "Classic Black Jeans",
    price: 90,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800", 
    category: "Bottoms"
  },
  {
    id: 4,
    name: "Minimalist Wool Coat",
    price: 185,
    image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Outerwear"
  }
];

const ProductCard = ({ product }: { product: typeof products[0] }) => (
  <Link key={product.id} to={`/shop/product/${product.id}`}>
    <Card className="overflow-hidden border-transparent transition-all product-card-hover h-full">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-monochrome-500">{product.category}</p>
            <p className="text-sm font-mono">{product.price} coins</p>
          </div>
          <h3 className="mt-2 font-medium">{product.name}</h3>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const FeaturedProducts = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop With Swapcoins</h2>
            <p className="mx-auto max-w-[700px] text-monochrome-600 text-base md:text-xl/relaxed">
              Discover quality second-hand pieces, curated and quality-checked
            </p>
          </div>
        </div>
        
        {/* Mobile View: Carousel */}
        {isMobile && (
          <div className="mt-8 md:mt-12">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[70%] sm:basis-[50%]">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-3 mt-6">
                <CarouselPrevious className="relative transform-none mx-0 bg-monochrome-900 text-white hover:bg-monochrome-800 shadow-md h-8 w-8" />
                <div className="text-xs text-monochrome-500">Swipe to view more</div>
                <CarouselNext className="relative transform-none mx-0 bg-monochrome-900 text-white hover:bg-monochrome-800 shadow-md h-8 w-8" />
              </div>
            </Carousel>
          </div>
        )}
        
        {/* Desktop View: Grid */}
        {!isMobile && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-10 md:mt-12 flex justify-center">
          <Link to="/shop">
            <Button className={`rounded-full ${isMobile ? 'px-6 py-5 text-base' : 'px-8 py-6 text-lg'} h-auto font-medium transition-all duration-300`}>
              View All Items
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
