
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const Index = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <HowItWorks />
      <FeaturedProducts />
    </div>
  );
};

export default Index;
