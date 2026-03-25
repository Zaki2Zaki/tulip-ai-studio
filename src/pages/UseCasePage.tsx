import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCases } from "@/data/useCases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UseCasePage = () => {
  const { slug } = useParams();
  const useCase = useCases.find((uc) => uc.slug === slug);
  const currentIndex = useCases.findIndex((uc) => uc.slug === slug);
  const prev = currentIndex > 0 ? useCases[currentIndex - 1] : null;
  const next = currentIndex < useCases.length - 1 ? useCases[currentIndex + 1] : null;

  if (!useCase) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Service Not Found</h1>
            <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const Icon = useCase.icon;

  const phases = [
    { key: "preProduction", data: useCase.phases.preProduction },
    { key: "production", data: useCase.phases.production },
    { key: "postProduction", data: useCase.phases.postProduction },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm tracking-[0.3em] uppercase text-primary font-body">
                Use Case
              </p>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              {useCase.title}
            </h1>
            <p className="text-xl text-white font-body max-w-3xl mb-2">
              {useCase.tagline}
            </p>
            <p className="text-white font-body max-w-3xl leading-relaxed">
              {useCase.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Phases Tabs */}
      <section className="pb-32">
        <div className="max-w-5xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="preProduction" className="w-full">
              <TabsList className="w-full bg-card/50 border border-border rounded-xl p-1 h-auto flex-wrap">
                {phases.map((phase) => (
                  <TabsTrigger
                    key={phase.key}
                    value={phase.key}
                    className="flex-1 min-w-[140px] py-3 font-display text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                  >
                    {phase.data.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {phases.map((phase) => (
                <TabsContent key={phase.key} value={phase.key} className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-white font-body text-lg mb-8 leading-relaxed">
                      {phase.data.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.data.capabilities.map((cap, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/20 transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-foreground font-body text-sm">{cap}</span>
                        </motion.div>
                      ))}
                    </div>

                    {slug === "ai-operating-system" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 rounded-2xl overflow-hidden border border-border/40"
                      >
                        <img
                          src="/ai-os-wrapper-diagram.png"
                          alt="AI OS Wrapper — The Unified 3D Innovation Workflow"
                          className="w-full h-auto"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Prev/Next Navigation */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-border">
            {prev ? (
              <Link
                to={`/use-cases/${prev.slug}`}
                className="group flex items-center gap-2 text-white hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-body text-sm">{prev.shortTitle}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                to={`/use-cases/${next.slug}`}
                className="group flex items-center gap-2 text-white hover:text-foreground transition-colors"
              >
                <span className="font-body text-sm">{next.shortTitle}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default UseCasePage;
