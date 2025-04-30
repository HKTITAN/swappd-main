
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SwapCoinsPurchase } from "@/components/shop/SwapCoinsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coins, ArrowLeft, Info } from "lucide-react";

const SwapCoinsPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Buy SwapCoins</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Your Balance
            </CardTitle>
            <CardDescription>Current SwapCoins in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available SwapCoins:</span>
                <span className="text-2xl font-mono font-bold">{profile?.swapcoins || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Select a Package</h2>
          </div>
          <SwapCoinsPurchase />
        </div>

        <Separator />

        <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              SwapCoins can be used to purchase items on the platform or boost your listings.
              Purchased SwapCoins will be instantly added to your account.
            </p>
            <p className="text-sm text-muted-foreground">
              For any issues with your purchase, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapCoinsPage;
