import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, RefreshCcw, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  const [activeUsers, setActiveUsers] = useState(0);
  const [todaySwaps, setTodaySwaps] = useState(0);
  const [itemsSaved, setItemsSaved] = useState(0);
  
  useEffect(() => {
    // Animate the counters on load
    const targetUsers = 528; // Example number
    const targetSwaps = 47; // Example number
    const targetSaved = 1245; // Example number for items saved from landfill
    
    let userCounter = 0;
    let swapCounter = 0;
    let savedCounter = 0;
    
    const userInterval = setInterval(() => {
      userCounter += Math.ceil(targetUsers / 30);
      if (userCounter >= targetUsers) {
        setActiveUsers(targetUsers);
        clearInterval(userInterval);
      } else {
        setActiveUsers(userCounter);
      }
    }, 50);
    
    const swapInterval = setInterval(() => {
      swapCounter += Math.ceil(targetSwaps / 30);
      if (swapCounter >= targetSwaps) {
        setTodaySwaps(targetSwaps);
        clearInterval(swapInterval);
      } else {
        setTodaySwaps(swapCounter);
      }
    }, 50);
    
    const savedInterval = setInterval(() => {
      savedCounter += Math.ceil(targetSaved / 30);
      if (savedCounter >= targetSaved) {
        setItemsSaved(targetSaved);
        clearInterval(savedInterval);
      } else {
        setItemsSaved(savedCounter);
      }
    }, 50);
    
    // Clean up on unmount
    return () => {
      clearInterval(userInterval);
      clearInterval(swapInterval);
      clearInterval(savedInterval);
    };
  }, []);
  
  return <section className={`${isMobile ? 'pt-0 pb-12' : 'py-10 md:py-24'} bg-monochrome-900 text-white`}>
      {isMobile ? (
        // Completely redesigned mobile hero
        <>
          {/* Full-bleed hero image for mobile */}
          <div className="relative w-full h-[55vh] mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-monochrome-900 z-10"></div>
            <img 
              alt="Monochrome clothing collection" 
              src="/lovable-uploads/bcb5b824-ef81-4743-9390-c502135544a5.png" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container px-5">
            {/* Overlay positioning for main headline with repositioned sustainable fashion badge */}
            <div className="relative -mt-24 mb-10 z-20">
              <div className="flex justify-center mb-3">
                <div className="bg-white text-monochrome-900 px-4 py-1 rounded-full text-sm font-bold">
                  Sustainable Fashion
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter leading-none text-center">
                SWAP <span className="text-monochrome-400">DON'T</span> SHOP
              </h1>
              <p className="text-monochrome-300 text-center mt-4 text-lg">
                Trade your pre-owned clothes for Swapcoins. Shop quality second-hand fashion that doesn't cost the Earth.
              </p>
            </div>
            
            {/* Main CTAs with sticky positioning */}
            <div className="sticky top-2 z-30 bg-monochrome-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg mb-8">
              <div className="flex flex-col gap-3">
                <Link to="/swap" className="w-full">
                  <Button size="lg" className="cta-button w-full py-5 text-base">
                    START SWAPPING
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/shop" className="w-full">
                  <Button variant="outline" size="lg" className="font-bold border-2 border-white hover:bg-white rounded-full px-8 w-full text-black py-5 text-base">
                    BROWSE COLLECTION
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Stats section - improved visualization */}
            <h3 className="font-bold text-lg mb-2 text-center">Our Impact</h3>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {/* First stat card */}
              <Card className="border-none rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-monochrome-800 to-monochrome-900">
                <div className="p-3 flex flex-col items-center text-center">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm mb-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{activeUsers}</p>
                  <p className="text-monochrome-300 text-[10px] uppercase font-semibold tracking-wider mt-1">Active Swappers</p>
                </div>
              </Card>
              
              {/* Second stat card */}
              <Card className="border-none rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-monochrome-800 to-monochrome-900" style={{ animationDelay: "0.2s" }}>
                <div className="p-3 flex flex-col items-center text-center">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm mb-2">
                    <RefreshCcw className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{todaySwaps}</p>
                  <p className="text-monochrome-300 text-[10px] uppercase font-semibold tracking-wider mt-1">Swaps Today</p>
                </div>
              </Card>
              
              {/* Third stat card */}
              <Card className="border-none rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-monochrome-800 to-monochrome-900" style={{ animationDelay: "0.4s" }}>
                <div className="p-3 flex flex-col items-center text-center">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm mb-2">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{itemsSaved}</p>
                  <p className="text-monochrome-300 text-[10px] uppercase font-semibold tracking-wider mt-1">Items Saved</p>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        // Desktop layout (unchanged)
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-block bg-white text-monochrome-900 px-4 py-1 rounded-full text-sm font-bold">
                  Sustainable Fashion Revolution
                </div>
                <h1 className="big-heading">
                  SWAP <span className="text-monochrome-400">DON'T</span> SHOP
                </h1>
                <p className="max-w-[600px] text-monochrome-300 text-lg md:text-xl">
                  Trade your pre-owned clothes for Swapcoins. <br className="hidden sm:inline" />
                  Shop quality second-hand fashion that doesn't cost the Earth.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/swap" className="w-full sm:w-auto">
                  <Button size="lg" className="cta-button w-full">
                    START SWAPPING
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/shop" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="font-bold border-2 border-white hover:bg-white rounded-full px-8 w-full text-black">
                    BROWSE COLLECTION
                  </Button>
                </Link>
              </div>
              
              {/* Stats boxes */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mt-4 md:mt-6">
                {/* First stat card */}
                <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden">
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div>
                      <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Active Swappers</p>
                      <p className="text-3xl md:text-4xl font-bold text-white">{activeUsers}</p>
                    </div>
                    <div className="bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-sm">
                      <Users className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                </Card>
                
                {/* Second stat card */}
                <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: "0.2s" }}>
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div>
                      <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Swaps Today</p>
                      <p className="text-3xl md:text-4xl font-bold text-white">{todaySwaps}</p>
                    </div>
                    <div className="bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-sm">
                      <RefreshCcw className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                </Card>
                
                {/* Third stat card */}
                <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: "0.4s" }}>
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div>
                      <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Items Saved</p>
                      <p className="text-3xl md:text-4xl font-bold text-white">{itemsSaved}</p>
                    </div>
                    <div className="bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-sm">
                      <Award className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Image container */}
            <div className="overflow-hidden rounded-2xl mt-8 lg:mt-0">
              <img 
                alt="Monochrome clothing collection" 
                src="/lovable-uploads/bcb5b824-ef81-4743-9390-c502135544a5.png" 
                className="w-full h-auto rotate-1 hover:-rotate-1 transition-all duration-500 object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>;
};

export default Hero;
