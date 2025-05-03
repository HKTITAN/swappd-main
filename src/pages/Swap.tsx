import { useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PickupScheduler from "@/components/swap/PickupScheduler";
import WhatsAppForm from "@/components/swap/WhatsAppForm";

const Swap = () => {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Swap Your Clothes</h1>
        <p className="mt-3 text-monochrome-600">
          Add your items, tell us about them, and earn Swapcoins based on their quality and value.
        </p>
      </div>
      
      <Tabs defaultValue="pickup" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pickup" className="text-base py-3">Swap Now</TabsTrigger>
          <TabsTrigger value="whatsapp" className="text-base py-3">Swap on WhatsApp</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pickup">
          <div className="bg-monochrome-50 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-3">Swap Your Items</h2>
              <p className="text-monochrome-600 max-w-lg mx-auto">
                Tell us about the items you want to swap, and we'll pick them up at a time that works for you.
              </p>
            </div>
            <PickupScheduler />
          </div>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <div className="bg-monochrome-50 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-3">Swap via WhatsApp</h2>
              <p className="text-monochrome-600 max-w-lg mx-auto">
                Prefer to swap through WhatsApp? Enter your details below and we'll send you a message to get started.
                Our team will guide you through the process step by step.
              </p>
            </div>
            <WhatsAppForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Swap;
