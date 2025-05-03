import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";

const HowItWorks = () => {
  const isMobile = useIsMobile();
  const steps = [
    {
      number: "01",
      title: "Upload Photos",
      description: "Take clear photos of your clean, gently-used clothing items and submit them through our platform.",
      icon: "📸",
      hoverDetail: "Natural lighting works best. Show front, back, and any details that highlight the condition."
    },
    {
      number: "02",
      title: "We Handle Pickup",
      description: "Schedule a convenient pickup time, and we'll collect your items directly from your doorstep.",
      icon: "🚚",
      hoverDetail: "Our pickup team operates 7 days a week. You'll receive a confirmation text 30 minutes before arrival."
    },
    {
      number: "03",
      title: "Quality Check",
      description: "Our experts evaluate each item for quality, condition, brand, and current market demand.",
      icon: "✓",
      hoverDetail: "Every item is inspected for wear, damage, and authenticity by our team of fashion experts."
    },
    {
      number: "04",
      title: "Earn Swapcoins",
      description: "Once approved, we'll credit your account with Swapcoins based on the item's assessed value.",
      icon: "💰",
      hoverDetail: "Premium brands and like-new items earn more Swapcoins. Check your balance instantly in your account."
    }
  ];

  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Enhanced background with decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-monochrome-100/80 via-white to-monochrome-100/50"></div>
        <div className="hidden md:block absolute -right-24 top-0 w-96 h-96 rounded-full bg-monochrome-200/30 blur-3xl"></div>
        <div className="hidden md:block absolute -left-24 bottom-24 w-80 h-80 rounded-full bg-monochrome-200/40 blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center mb-10 md:mb-16">
          <div className="inline-block bg-monochrome-900 text-white px-4 py-1 rounded-full text-sm font-bold mb-1 md:mb-2 animate-fade-in">
            The Swapping Process
          </div>
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-monochrome-900 to-monochrome-700 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="mx-auto max-w-[700px] text-monochrome-600 text-base md:text-xl/relaxed">
              Turn your unused clothes into shopping credit with our simple 4-step process
            </p>
          </div>
        </div>
        
        {/* Mobile view: Enhanced Carousel layout */}
        <div className="block md:hidden">
          <Carousel className="w-full mb-8">
            <CarouselContent className="-ml-2 md:-ml-4">
              {steps.map((step) => (
                <CarouselItem key={step.number} className="pl-2 md:pl-4 basis-[90%] sm:basis-[85%]">
                  <Card className="overflow-hidden border-none bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group h-full">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col gap-3 md:gap-4 mb-2 md:mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-monochrome-900 text-white font-mono text-lg md:text-xl font-bold shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                            {step.number}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold">{step.title}</h3>
                        </div>
                        <div className="pl-[3rem]">
                          <p className="text-monochrome-600 text-base md:text-lg">{step.description}</p>
                          
                          <div className="mt-4 md:mt-6 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                            {step.icon}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
              <CarouselPrevious className="relative transform-none mx-0 bg-monochrome-900 text-white hover:bg-monochrome-800 shadow-md h-8 w-8 md:h-10 md:w-10" />
              <div className="text-xs text-monochrome-500">Swipe or use arrows</div>
              <CarouselNext className="relative transform-none mx-0 bg-monochrome-900 text-white hover:bg-monochrome-800 shadow-md h-8 w-8 md:h-10 md:w-10" />
            </div>
          </Carousel>
        </div>
        
        {/* Desktop view: Connected steps layout */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 left-[4.5rem] right-[4.5rem] h-0.5 bg-monochrome-900/20 z-0"></div>
            
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <HoverCard key={step.number} openDelay={300} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <div className="relative z-10">
                      <Card className="overflow-hidden border-none bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group h-full">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monochrome-900 text-white font-mono text-2xl font-bold shrink-0 shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
                              {step.number}
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-monochrome-600">{step.description}</p>
                            
                            <div className="mt-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                              {step.icon}
                            </div>
                            
                            {index < steps.length - 1 && (
                              <div className="absolute -right-4 top-24 w-8 h-8 bg-monochrome-900 rounded-full flex items-center justify-center text-white z-20 shadow-md">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 shadow-lg rounded-xl border-none bg-monochrome-900 text-white">
                    <div className="space-y-2">
                      <h4 className="font-bold">{step.title} - Tips</h4>
                      <p className="text-sm text-white/80">{step.hoverDetail}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-10 md:mt-16 flex justify-center">
          <Link to="/how-it-works">
            <Button className={`rounded-full bg-monochrome-900 hover:bg-monochrome-800 text-white shadow-md border-none ${isMobile ? 'px-6 py-5 text-base' : 'px-8 py-6 text-lg'} h-auto font-medium transition-all duration-300 hover:shadow-lg`}>
              Learn the Full Process
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
