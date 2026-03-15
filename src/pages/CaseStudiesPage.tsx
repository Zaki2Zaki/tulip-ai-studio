import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingScrollTop from "@/components/FloatingScrollTop";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const studies = [
  {
    title: "Pre-Production Breakthroughs",
    description: "AI storyboard automation, concept generation, and previz pipeline innovations.",
    to: "/case-studies/pre-production",
    status: "Coming Q2 2026",
  },
  {
    title: "Production Pipeline Transformations",
    description: "How Hardspace: Shipbreaker shipped stunning zero-G visuals with Unity artist tools.",
    to: "/case-studies/production",
    status: "Live",
  },
  {
    title: "Post-Production Polish Innovations",
    description: "AI render polish, smart compositing, and adaptive color grading breakthroughs.",
    to: "/case-studies/post-production",
    status: "Coming Q2 2026",
  },
  {
    title: "Steam Game Delays — Empirical Insights",
    description: "48% of 23,485 titles delayed (median 14 days) — AI prevents it. Release ranges beat specific dates.",
    to: "/case-studies/steam-delays",
    status: "Live",
    citation: "Grewal et al. (2022) arXiv:2204.11191v1",
  },
];

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
            className="text-lg text-muted-foreground font-body max-w-2xl mx-auto mb-16"
          >
            Detailed breakdowns of how we've helped game studios,
            VFX houses, and animation teams transform their pipelines with AI.
          </motion.p>

          {/* Case study cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {studies.map((study, i) => (
              <motion.div
                key={study.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Link
                  to={study.to}
                  className="group block p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-8px_hsl(260_80%_70%/0.2)] h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-body font-semibold px-2.5 py-1 rounded-full ${
                      study.status === "Live"
                        ? "bg-[hsl(160_60%_30%/0.3)] text-[hsl(160_60%_70%)]"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {study.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    {study.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-body text-primary group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <FloatingScrollTop />
    </main>
  );
};

export default CaseStudiesPage;
