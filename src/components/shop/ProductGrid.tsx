
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

// Mock product data - would come from API in real implementation
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
  },
  {
    id: 5,
    name: "Oversized White T-Shirt",
    price: 50,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops"
  },
  {
    id: 6,
    name: "Graphic Print Hoodie",
    price: 110,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Tops"
  },
  {
    id: 7,
    name: "Pleated Midi Skirt",
    price: 85,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800", 
    category: "Bottoms"
  },
  {
    id: 8,
    name: "Leather Crossbody Bag",
    price: 135,
    image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
    category: "Accessories"
  }
];

type ProductGridProps = {
  category?: string;
  searchQuery?: string;
  emptyStateComponent?: React.ReactNode;
};

const ProductGrid = ({ category, searchQuery, emptyStateComponent }: ProductGridProps) => {
  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0 && emptyStateComponent) {
    return <>{emptyStateComponent}</>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Link key={product.id} to={`/shop/product/${product.id}`}>
            <Card className="overflow-hidden border-transparent transition-all product-card-hover rounded-2xl shadow-md hover:shadow-xl">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-monochrome-500 bg-monochrome-100 px-3 py-1 rounded-full">{product.category}</p>
                    <p className="text-sm font-mono font-semibold">{product.price} coins</p>
                  </div>
                  <h3 className="mt-3 font-medium text-lg">{product.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <div className="col-span-full py-12 text-center">
          <p className="text-monochrome-500">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
