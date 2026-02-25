import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyTulipSection from "@/components/WhyTulipSection";
import ServicesSection from "@/components/ServicesSection";
import PipelineSection from "@/components/PipelineSection";
import CostEstimator from "@/components/CostEstimator";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhyTulipSection />
      <PipelineSection />
      <ServicesSection />
      <CostEstimator />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
