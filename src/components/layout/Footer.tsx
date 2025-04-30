
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-monochrome-200 bg-monochrome-100">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/e1fbe178-0428-4c6f-95ab-1c9ed9c291e3.png" 
                alt="Swappd Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-monochrome-600">
              Swap your pre-owned clothes for Swapcoins, and shop quality second-hand fashion.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-monochrome-600">
              <li><Link to="/shop/womens" className="transition hover:text-monochrome-900 hover:underline">Women's</Link></li>
              <li><Link to="/shop/mens" className="transition hover:text-monochrome-900 hover:underline">Men's</Link></li>
              <li><Link to="/shop/accessories" className="transition hover:text-monochrome-900 hover:underline">Accessories</Link></li>
              <li><Link to="/shop/new-arrivals" className="transition hover:text-monochrome-900 hover:underline">New Arrivals</Link></li>
              <li><Link to="/saved-items" className="transition hover:text-monochrome-900 hover:underline">Saved Items</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-monochrome-600">
              <li><Link to="/about" className="transition hover:text-monochrome-900 hover:underline">About Us</Link></li>
              <li><Link to="/how-it-works" className="transition hover:text-monochrome-900 hover:underline">How It Works</Link></li>
              <li><Link to="/sustainability" className="transition hover:text-monochrome-900 hover:underline">Sustainability</Link></li>
              <li><Link to="/contact" className="transition hover:text-monochrome-900 hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-monochrome-600">
              <li><Link to="/terms" className="transition hover:text-monochrome-900 hover:underline">Terms of Service</Link></li>
              <li><Link to="/privacy" className="transition hover:text-monochrome-900 hover:underline">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="transition hover:text-monochrome-900 hover:underline">Shipping Policy</Link></li>
              <li><Link to="/faq" className="transition hover:text-monochrome-900 hover:underline">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-monochrome-200 pt-6">
          <p className="text-xs text-monochrome-600">
            &copy; {new Date().getFullYear()} SWAPPD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
