
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Camera, Truck, Search, Coins } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const HowItWorksPage = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Photos",
      description: "Take clear photos of your clean, gently-used clothing items and submit them through our platform. We recommend photographing your items in natural light from multiple angles.",
      image: "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-monochrome-900"
    }, 
    {
      number: "02",
      title: "We Handle Pickup",
      description: "Schedule a convenient pickup time, and we'll collect your items directly from your doorstep. Our logistics team will ensure a smooth and hassle-free experience.",
      image: "/lovable-uploads/00586714-7d0c-4c3a-b98a-5b35398b159f.png",
      icon: <Truck className="w-6 h-6" />,
      color: "bg-monochrome-800"
    }, 
    {
      number: "03",
      title: "Quality Check",
      description: "Our experts evaluate each item for quality, condition, brand, and current market demand. We carefully inspect everything to ensure it meets our standards.",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
      icon: <Search className="w-6 h-6" />,
      color: "bg-monochrome-700"
    }, 
    {
      number: "04",
      title: "Earn Swapcoins",
      description: "Once approved, we'll credit your account with Swapcoins based on the item's assessed value. You can check your balance in your account dashboard.",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800",
      icon: <Coins className="w-6 h-6" />,
      color: "bg-monochrome-600"
    }
  ];

  const faqs = [
    {
      question: "What types of items do you accept?",
      answer: "We accept gently used clothing, shoes, and accessories that are clean and in good condition. Items should be current within the last 5 years and from respected brands."
    }, 
    {
      question: "How many Swapcoins will I receive for my items?",
      answer: "The number of Swapcoins varies based on the item's brand, condition, age, and current market demand. Designer items typically earn more Swapcoins than fast fashion pieces."
    }, 
    {
      question: "What happens if you reject my items?",
      answer: "If we cannot accept your items, we'll notify you and offer to return them at no cost or donate them to charity on your behalf."
    }, 
    {
      question: "How long does the quality check process take?",
      answer: "Typically, our quality check process takes 3-5 business days from the time we receive your items."
    }, 
    {
      question: "What can I do with my Swapcoins?",
      answer: "Swapcoins can be used to purchase any item in our shop. They have a 1-to-1 value ratio with our pricing."
    }
  ];

  const benefits = [
    {
      title: "Sustainability",
      description: "Extend the life of clothing items to reduce waste and environmental impact",
      icon: "🌱"
    },
    {
      title: "Affordability",
      description: "Refresh your wardrobe at a fraction of retail prices",
      icon: "💰"
    },
    {
      title: "Discovery",
      description: "Find unique pieces you won't see everywhere else",
      icon: "✨"
    },
    {
      title: "Community",
      description: "Join thousands of conscious consumers choosing sustainable fashion",
      icon: "👥"
    }
  ];

  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-monochrome-100 to-white py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-monochrome-200/50 blur-3xl"></div>
          <div className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-monochrome-200/30 blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-monochrome-900 to-monochrome-700 bg-clip-text text-transparent"
            >
              How Swappd Works
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-monochrome-600"
            >
              Our streamlined process makes swapping and shopping sustainable fashion effortless
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Process Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Our Simple 4-Step Process</h2>
          
          <div className="relative">
            {/* Timeline connector - desktop only */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-monochrome-300 transform -translate-x-1/2"></div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-16 md:space-y-24 relative"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={item}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12`}
                >
                  {/* Timeline dot - desktop only */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2" style={{ top: `${index * 25 + 6}%` }}>
                    <div className={`h-6 w-6 rounded-full ${step.color} border-4 border-white shadow-lg`}></div>
                  </div>
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="flex items-center gap-4 mb-4 md:mb-6 text-xl font-bold">
                      <div className={`flex md:hidden items-center justify-center h-12 w-12 rounded-full ${step.color} text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-monochrome-600 text-lg">{step.description}</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-[1.02] group">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="bg-monochrome-100 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Why Choose Swappd?</h2>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-monochrome-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-monochrome-200 overflow-hidden">
              <Accordion type="single" collapsible className="w-full divide-y divide-monochrome-200">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-medium p-6 hover:bg-monochrome-50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0 text-monochrome-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="mt-16 text-center">
              <p className="mb-6 text-xl text-monochrome-600">Ready to start swapping?</p>
              <Link to="/swap">
                <Button size="lg" className="font-medium rounded-full px-10 py-6 h-auto text-lg bg-monochrome-900 hover:bg-monochrome-800 shadow-md">
                  Swap Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
