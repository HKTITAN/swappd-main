
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Coins } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: User | null;
  profile: Tables<"profiles"> | null;
  isAdmin: boolean;
  handleSignOut: () => Promise<void>;
}

export const MobileMenu = ({ 
  isOpen, 
  setIsMenuOpen, 
  user, 
  profile, 
  isAdmin, 
  handleSignOut 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="container pb-4 pt-2 md:hidden">
      <nav className="flex flex-col space-y-3">
        <Link 
          to="/shop"
          className="text-lg font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Shop
        </Link>
        <Link 
          to="/how-it-works"
          className="text-lg font-medium text-monochrome-600"
          onClick={() => setIsMenuOpen(false)}
        >
          How It Works
        </Link>
        <Link 
          to="/swap"
          className="text-lg font-medium text-monochrome-600"
          onClick={() => setIsMenuOpen(false)}
        >
          Swap Now
        </Link>
        {user && (
          <>
            <Link 
              to="/swapcoins"
              className="text-lg font-medium text-monochrome-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                Buy SwapCoins
              </div>
            </Link>
            <Link 
              to="/profile"
              className="text-lg font-medium text-monochrome-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {isAdmin && (
              <Link 
                to="/admin"
                className="text-lg font-medium text-monochrome-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex items-center py-1">
              <span className="font-mono font-medium">{profile?.swapcoins ?? 0}</span>
              <Coins className="mx-1 h-3 w-3 text-yellow-500" />
              <span className="ml-1 text-monochrome-500">coins</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full justify-center"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        )}
      </nav>
    </div>
  );
};
