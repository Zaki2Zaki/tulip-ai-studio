import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CaseStudiesPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-20 section-padding">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4"
          >
            Case Studies
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Real Results for{" "}
            <span className="text-gradient-gold">Creative Teams</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white font-body max-w-2xl mx-auto"
          >
            Coming soon — detailed breakdowns of how we've helped game studios,
            VFX houses, and animation teams transform their pipelines with AI.
          </motion.p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CaseStudiesPage;
