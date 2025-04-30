
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Coins } from "lucide-react";

interface SwapCoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  mostPopular?: boolean;
}

const swapCoinPackages: SwapCoinPackage[] = [
  {
    id: "basic",
    name: "Starter Pack",
    coins: 100,
    price: 5.99
  },
  {
    id: "standard",
    name: "Regular Pack",
    coins: 500,
    price: 19.99,
    mostPopular: true
  },
  {
    id: "premium",
    name: "Premium Pack",
    coins: 1200,
    price: 39.99
  }
];

export function SwapCoinsPurchase() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please log in to purchase SwapCoins",
      });
      return;
    }

    setIsLoading(packageId);

    try {
      // In a real app, this would connect to a payment processor like Stripe
      // For now, we'll simulate a successful purchase after a delay
      const selectedPackage = swapCoinPackages.find(pkg => pkg.id === packageId);
      
      if (!selectedPackage) {
        throw new Error("Package not found");
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user's SwapCoins
      const newSwapCoins = (profile?.swapcoins || 0) + selectedPackage.coins;
      
      const { error } = await supabase
        .from('profiles')
        .update({ swapcoins: newSwapCoins })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Purchase successful!",
        description: `You've added ${selectedPackage.coins} SwapCoins to your account.`,
      });
    } catch (error) {
      console.error("Error purchasing SwapCoins:", error);
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {swapCoinPackages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={pkg.mostPopular ? "border-2 border-primary relative" : ""}
        >
          {pkg.mostPopular && (
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {pkg.name}
              <Coins className="h-5 w-5 text-yellow-500" />
            </CardTitle>
            <CardDescription>
              {pkg.coins} SwapCoins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${pkg.price.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              One-time purchase
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePurchase(pkg.id)} 
              disabled={isLoading !== null}
              className="w-full"
            >
              {isLoading === pkg.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
