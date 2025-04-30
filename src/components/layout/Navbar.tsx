
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { DesktopNav } from "./navbar/DesktopNav";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { MobileMenuButton } from "./navbar/MobileMenuButton";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.username) return profile.username.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "SW";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-monochrome-200 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/e1fbe178-0428-4c6f-95ab-1c9ed9c291e3.png" 
            alt="Swappd Logo" 
            className="h-8 w-auto"
          />
        </Link>

        <DesktopNav isAdmin={isAdmin} isMobile={isMobile} />

        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu 
              user={user}
              profile={profile}
              isAdmin={isAdmin}
              handleSignOut={handleSignOut}
              getInitials={getInitials}
              navigate={navigate}
            />
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full" size="sm">
                Sign In
              </Button>
            </Link>
          )}
          
          <Link to="/cart">
            <Button variant="outline" size="icon" className="rounded-full">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          
          <MobileMenuButton 
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            isMobile={isMobile}
          />
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        profile={profile}
        isAdmin={isAdmin}
        handleSignOut={handleSignOut}
      />
    </header>
  );
};

export default Navbar;
