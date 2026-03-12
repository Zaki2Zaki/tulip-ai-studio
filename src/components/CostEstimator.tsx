import { useState, useMemo } from "react";
import tulipLogo from "@/assets/new-logo.png";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, ChevronDown, ChevronUp, ClipboardCheck } from "lucide-react";
import PipelineAssessmentQuiz from "./PipelineAssessmentQuiz";
import DiscoveryPackagesModal from "./DiscoveryPackagesModal";

interface ServiceOption {
  id: string;
  label: string;
  description: string;
  minUSD: number;
  maxUSD: number;
  minCAD: number;
  maxCAD: number;
  minEUR: number;
  maxEUR: number;
}

// Rates from OANDA (Feb 25, 2026): USD/CAD = 1.3686, USD/EUR = 0.8475
const serviceOptions: ServiceOption[] = [
{
  id: "research",
  label: "GenAI Research",
  description: "Identify pipeline pain points & opportunities\nAnalysis and Align AI tools seamlessly into your artist's workflows\nAnalysis of your vendor's & research tools friction points to find impactful solutions",
  minUSD: 15000, maxUSD: 110000,
  minCAD: 20529, maxCAD: 150546,
  minEUR: 12713, maxEUR: 93225
},
{
  id: "benchmarking",
  label: "Tool Benchmarking",
  description: "Test & validate AI tools in sandbox environments",
  minUSD: 5000, maxUSD: 130000,
  minCAD: 6843, maxCAD: 177918,
  minEUR: 4238, maxEUR: 110175
},
{
  id: "demos",
  label: "Demos & Sandboxes",
  description: "Hands-on prototypes tailored to your pipeline",
  minUSD: 3000, maxUSD: 120000,
  minCAD: 4106, maxCAD: 164232,
  minEUR: 2543, maxEUR: 101700
},
{
  id: "architecture",
  label: "Architecture Blueprint",
  description: "Full GenAI architecture including LLM training",
  minUSD: 12000, maxUSD: 350000,
  minCAD: 16423, maxCAD: 479010,
  minEUR: 10170, maxEUR: 296625
},
{
  id: "integration",
  label: "Adoption & Integration",
  description: "End-to-end AI integration into your workflows",
  minUSD: 20000, maxUSD: 600000,
  minCAD: 27372, maxCAD: 821160,
  minEUR: 16950, maxEUR: 508500
},
{
  id: "workshops",
  label: "Workshops & Education",
  description: "Led by certified Unreal Educators or VFX/Game-Developers",
  minUSD: 3000, maxUSD: 85000,
  minCAD: 4106, maxCAD: 116331,
  minEUR: 2543, maxEUR: 72038
}];


type ScaleLevel = "small" | "medium" | "large";

const scaleMultipliers: Record<ScaleLevel, {min: number;max: number;label: string;desc: string;}> = {
  small: { min: 0.0, max: 0.25, label: "Indie / Small Studio", desc: "1–20 people, focused scope" },
  medium: { min: 0.25, max: 0.6, label: "Mid-Size Studio", desc: "20–100 people, multi-department" },
  large: { min: 0.6, max: 1.0, label: "AAA / Enterprise", desc: "100+ people, full pipeline" }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const CostEstimator = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [scale, setScale] = useState<ScaleLevel>("medium");
  const [currency, setCurrency] = useState<"USD" | "CAD" | "EUR">("USD");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);

  const handleQuizComplete = (recommendedServices: string[]) => {
    setSelectedServices(recommendedServices);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const estimate = useMemo(() => {
    const mult = scaleMultipliers[scale];
    let totalMin = 0;
    let totalMax = 0;

    const breakdown = selectedServices.map((id) => {
      const svc = serviceOptions.find((s) => s.id === id)!;
      const min = currency === "USD" ? svc.minUSD : currency === "CAD" ? svc.minCAD : svc.minEUR;
      const max = currency === "USD" ? svc.maxUSD : currency === "CAD" ? svc.maxCAD : svc.maxEUR;
      const scaledMin = Math.round(min + (max - min) * mult.min);
      const scaledMax = Math.round(min + (max - min) * mult.max);
      totalMin += scaledMin;
      totalMax += scaledMax;
      return { label: svc.label, min: scaledMin, max: scaledMax };
    });

    return { totalMin, totalMax, breakdown };
  }, [selectedServices, scale, currency]);

  return (
    <section id="estimator" className="py-32 section-padding border-none border-0">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">
            Cost Estimator
          </p>
          <h2 className="font-display text-4xl font-bold mb-4 md:text-7xl">
            Build your <span className="text-gradient-gold">quote</span>
          </h2>
          <p className="max-w-xl mx-auto mb-6 text-white text-lg font-sans">
            Select your services and studio scale for an instant budget range based on our consultancy rates.
          </p>
          <p className="mb-3 text-white text-xl font-sans">Not sure what you need?</p>
          <button
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-2.5 btn-chrome-outline px-8 py-4 rounded-full font-display font-semibold text-base transition-all">
            
            <ClipboardCheck size={20} />
            Take the 2-min Assessment
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 relative">

          {/* Tulip Logo + Currency toggle */}
          <div className="mb-10 flex flex-col items-center gap-6">
            <img src={tulipLogo} alt="Tulip Technology logo" className="w-16 h-16 rounded-full object-cover border border-border" />
            <h3 className="font-display text-lg font-semibold">Choose Your Currency</h3>
            <div className="bg-secondary rounded-full p-1 flex border-solid shadow-sm border-2 border-blue-50 text-primary gap-[5px]">
              {(["USD", "CAD", "EUR"] as const).map((c) =>
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                currency === c ?
                "bg-primary text-primary-foreground" :
                "text-muted-foreground hover:text-foreground"}`
                }>
                  {c}
                </button>
              )}
            </div>
          </div>

          {/* Studio Scale */}
          <div className="mb-10">
            <h3 className="font-display text-lg font-semibold mb-4">Studio Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(scaleMultipliers) as ScaleLevel[]).map((key) => {
                const s = scaleMultipliers[key];
                return (
                  <button
                    key={key}
                    onClick={() => setScale(key)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                    scale === key ?
                    "border-primary bg-primary/5 glow-gold" :
                    "border-border hover:border-muted-foreground/30"}`
                    }>

                    <div className="font-display font-semibold text-sm mb-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground font-body">{s.desc}</div>
                  </button>);

              })}
            </div>
          </div>

          {/* Services */}
          <div className="mb-10">
            <h3 className="font-display text-lg font-semibold mb-4">Select Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceOptions.map((svc) => {
                const selected = selectedServices.includes(svc.id);
                const isResearch = svc.id === "research";
                return (
                  <button
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                    selected ?
                    "border-primary bg-primary/5" :
                    "border-border hover:border-muted-foreground/30"}`
                    }>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`
                        }>

                        {selected &&
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="hsl(0 0% 3%)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        }
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-semibold text-sm">{svc.label}</div>
                        <div className="text-xs text-muted-foreground font-body whitespace-pre-line">{svc.description}</div>
                        {isResearch && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiscoveryOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full text-xs font-display font-semibold text-white border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer btn-chrome-outline">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                              <path d="M12 2C10 2 8.5 4 8.5 4C8.5 4 7 6 7 9C7 12 9 14 12 14C15 14 17 12 17 9C17 6 15.5 4 15.5 4C15.5 4 14 2 12 2Z" fill="currentColor" opacity="0.3"/>
                              <path d="M12 3C10.5 3 9.5 4.5 9.5 4.5C9.5 4.5 8 6.5 8 9C8 11.5 9.8 13 12 13C14.2 13 16 11.5 16 9C16 6.5 14.5 4.5 14.5 4.5C14.5 4.5 13.5 3 12 3Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                              <path d="M12 14V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M9.5 18L12 15.5L14.5 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Discovery Packages
                          </span>
                        )}
                      </div>
                    </div>
                  </button>);

              })}
            </div>
          </div>

          {/* Result */}
          <div className="border-t border-border pt-8">
            {selectedServices.length === 0 ?
            <div className="text-center text-muted-foreground font-body py-8">
                <Calculator className="w-10 h-10 mx-auto mb-3 opacity-40" />
                Select services above to see your estimated budget range
              </div> :

            <div>
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground font-body mb-2">Estimated Budget Range</p>
                  <div className="font-display text-4xl md:text-5xl font-bold">
                    <span className="text-gradient-gold">
                      {formatCurrency(estimate.totalMin, currency)}
                    </span>
                    <span className="text-muted-foreground mx-3">–</span>
                    <span className="text-gradient-gold">
                      {formatCurrency(estimate.totalMax, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-2">{currency}</p>
                </div>

                {/* Breakdown toggle */}
                <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors font-body">

                  {showBreakdown ? "Hide" : "Show"} breakdown
                  {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showBreakdown &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 space-y-3">

                    {estimate.breakdown.map((item) =>
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-body">{item.label}</span>
                        <span className="text-sm font-body text-muted-foreground">
                          {formatCurrency(item.min, currency)} – {formatCurrency(item.max, currency)}
                        </span>
                      </div>
                )}
                  </motion.div>
              }

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                  href="#contact"
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-display font-semibold hover:opacity-90 transition-opacity">

                    Request Detailed Quote
                  </a>
                  <a
                  href="#"
                  className="btn-chrome-outline px-8 py-4 rounded-full font-display font-semibold transition-all">

                    Book a 30-minute Discovery Meeting
                  </a>
                </div>
              </div>
            }
          </div>
        </motion.div>

        {/* Payment structure note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
          { pct: "20%", label: "Initial Experiment, Report Scope, Contracts & Deposit" },
          { pct: "25%", label: "Demo Start & Prototype Reviews" },
          { pct: "30%", label: "Polish & 75% Completion" },
          { pct: "25%", label: "Final Delivery, code handover, and client sign-off" }].
          map((step) =>
          <div key={step.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{step.pct}</div>
              <div className="text-xs text-muted-foreground font-body">{step.label}</div>
            </div>
          )}
        </motion.div>
        <p className="text-center text-muted-foreground font-body mt-4 text-lg">*Payment milestone structure. Finalized quotation varies depending on custom prototype requirements.

        </p>
      </div>

      <PipelineAssessmentQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={handleQuizComplete} />

      <DiscoveryPackagesModal
        open={discoveryOpen}
        onClose={() => setDiscoveryOpen(false)} />

    </section>);

};

export default CostEstimator;