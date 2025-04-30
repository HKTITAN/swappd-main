
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useState } from "react";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import SavedItems from "./pages/SavedItems";
import Swap from "./pages/Swap";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SwapCoins from "./pages/SwapCoins";
import Cart from "./pages/Cart";

const App = () => {
  // Create a client inside the component 
  const [queryClient] = useState(() => new QueryClient());

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/saved-items" element={<SavedItems />} />
                <Route path="/shop/product/:productId" element={<ProductPage />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/swapcoins" element={<SwapCoins />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
