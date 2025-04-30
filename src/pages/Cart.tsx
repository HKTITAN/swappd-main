
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Minus, Plus, Trash } from "lucide-react";

const Cart = () => {
  const { user } = useAuth();
  const { items, isLoading, fetchCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = items.reduce((sum, item) => {
    return sum + (item.item?.swapcoins || 0) * item.quantity;
  }, 0);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Loading cart...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-4">Sign in to view your cart</h1>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>
        
        <div className="space-y-4">
          {items.map((cartItem) => (
            <div key={cartItem.id} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="h-20 w-20 overflow-hidden rounded">
                <img
                  src={cartItem.item?.image_url || "/placeholder.svg"}
                  alt={cartItem.item?.title}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{cartItem.item?.title}</h3>
                <p className="text-sm text-muted-foreground">{cartItem.item?.swapcoins} coins</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(cartItem.item_id, Math.max(1, cartItem.quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{cartItem.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(cartItem.item_id, cartItem.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(cartItem.item_id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">Total: {total} coins</p>
          </div>
          <Button size="lg" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
