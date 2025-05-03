import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCog, Shield, Coins, LogOut, ShoppingCart, Heart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User | null;
  profile: Tables<"profiles"> | null;
  isAdmin: boolean;
  handleSignOut: () => Promise<void>;
  getInitials: () => string;
  navigate: (path: string) => void;
}

export const UserMenu = ({ 
  user, 
  profile, 
  isAdmin, 
  handleSignOut, 
  getInitials,
  navigate 
}: UserMenuProps) => {
  if (!user) return null;

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/swapcoins")} 
        className="hidden md:flex items-center gap-2 border border-monochrome-300 rounded-full px-3 py-1"
      >
        <span className="font-mono font-medium">{profile?.swapcoins ?? 0}</span>
        <Coins className="h-4 w-4 text-yellow-500" />
        <span className="text-xs text-monochrome-500">Add coins</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate("/saved-items")} 
        className="relative"
      >
        <Heart className="h-5 w-5" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
            <UserCog className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/swapcoins')} className="cursor-pointer">
            <Coins className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Buy SwapCoins</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
