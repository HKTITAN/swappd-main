
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, RefreshCcw, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const Hero = () => {
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
  
  return <section className="py-16 md:py-24 bg-monochrome-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block bg-white text-monochrome-900 px-4 py-1 rounded-full text-sm font-bold">
                Sustainable Fashion Revolution
              </div>
              <h1 className="big-heading">
                SWAP <span className="text-monochrome-400">DON'T</span> SHOP
              </h1>
              <p className="max-w-[600px] text-monochrome-300 text-xl">
                Trade your pre-owned clothes for Swapcoins. <br className="hidden sm:inline" />
                Shop quality second-hand fashion that doesn't cost the Earth.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/swap">
                <Button size="lg" className="cta-button w-full sm:w-auto">
                  START SWAPPING
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="font-bold border-2 border-white hover:bg-white rounded-full px-8 w-full sm:w-auto text-black">
                  BROWSE COLLECTION
                </Button>
              </Link>
            </div>
            
            {/* Stats boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden">
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Active Swappers</p>
                    <p className="text-4xl font-bold text-white">{activeUsers}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: "0.2s" }}>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Swaps Today</p>
                    <p className="text-4xl font-bold text-white">{todaySwaps}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    <RefreshCcw className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-monochrome-800 to-monochrome-900 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: "0.4s" }}>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-monochrome-300 text-xs uppercase font-semibold tracking-wider mb-1">Items Saved</p>
                    <p className="text-4xl font-bold text-white">{itemsSaved}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl mt-8 lg:mt-0">
            <img alt="Monochrome clothing collection" height="550" width="550" src="/lovable-uploads/bcb5b824-ef81-4743-9390-c502135544a5.png" className="w-full h-auto rotate-1 hover:-rotate-1 transition-all duration-500 object-cover" />
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;
