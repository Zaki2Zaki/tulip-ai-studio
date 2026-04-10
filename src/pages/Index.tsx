import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemCarousel from "@/components/ProblemCarousel";
import WhyTulipSection from "@/components/WhyTulipSection";
import ServicesSection from "@/components/ServicesSection";
import PipelineSection from "@/components/PipelineSection";
import CostEstimator from "@/components/CostEstimator";
import MotionDataSection from "@/components/MotionDataSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingScrollTop from "@/components/FloatingScrollTop";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemCarousel />
      <PipelineSection />
      <WhyTulipSection />
      <ServicesSection />
      <MotionDataSection />
      <CostEstimator />
      <ContactSection />
      <Footer />
      <FloatingScrollTop />
    </main>
  );
};

export default Index;
