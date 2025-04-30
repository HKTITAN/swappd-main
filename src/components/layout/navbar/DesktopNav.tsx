
import { Link } from "react-router-dom";

interface DesktopNavProps {
  isAdmin: boolean;
  isMobile: boolean;
}

export const DesktopNav = ({ isAdmin, isMobile }: DesktopNavProps) => {
  if (isMobile) return null;

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      <Link to="/shop" className="text-sm font-medium transition-colors hover:text-monochrome-900">
        Shop
      </Link>
      <Link to="/how-it-works" className="text-sm font-medium text-monochrome-600 transition-colors hover:text-monochrome-900">
        How It Works
      </Link>
      <Link to="/swap" className="text-sm font-medium text-monochrome-600 transition-colors hover:text-monochrome-900">
        Swap Now
      </Link>
      {isAdmin && (
        <Link to="/admin" className="text-sm font-medium text-monochrome-600 transition-colors hover:text-monochrome-900">
          Admin
        </Link>
      )}
    </nav>
  );
};
