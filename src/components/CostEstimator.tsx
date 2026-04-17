import { useState, useMemo, useEffect } from "react";
import tulipLogo from "@/assets/new-logo.png";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calculator, ChevronDown, ChevronUp, ClipboardCheck } from "lucide-react";
import PipelineAssessmentQuiz from "./PipelineAssessmentQuiz";
import DiscoveryPackagesModal from "./DiscoveryPackagesModal";
import QuoteRequestModal from "./QuoteRequestModal";
import CalendlyModal from "./CalendlyModal";

interface ServiceOption {
  id: string;
  label: string;
  description: string;
  minUSD: number; maxUSD: number;
  minCAD: number; maxCAD: number;
  minEUR: number; maxEUR: number;
}

const serviceOptions: ServiceOption[] = [
  { id: "research", label: "GenAI Research", description: "Identify pipeline pain points & opportunities\nAnalysis and Align AI tools seamlessly into your artist's workflows\nAnalysis of your vendor's & research tools friction points to find impactful solutions", minUSD: 20571, maxUSD: 75000, minCAD: 28153, maxCAD: 102645, minEUR: 17434, maxEUR: 63563 },
  { id: "benchmarking", label: "Tool Benchmarking", description: "Test & validate AI tools in sandbox environments", minUSD: 15000, maxUSD: 130000, minCAD: 20529, maxCAD: 177918, minEUR: 12713, maxEUR: 110175 },
  { id: "demos", label: "Demos & Sandboxes", description: "Hands-on prototypes tailored to your pipeline", minUSD: 3000, maxUSD: 120000, minCAD: 4106, maxCAD: 164232, minEUR: 2543, maxEUR: 101700 },
  { id: "architecture", label: "Architecture Blueprint", description: "Full GenAI architecture including LLM training", minUSD: 12000, maxUSD: 350000, minCAD: 16423, maxCAD: 479010, minEUR: 10170, maxEUR: 296625 },
  { id: "integration", label: "Adoption & Integration", description: "End-to-end AI integration into your workflows", minUSD: 20000, maxUSD: 600000, minCAD: 27372, maxCAD: 821160, minEUR: 16950, maxEUR: 508500 },
  { id: "workshops", label: "Workshops & Education", description: "Led by certified Unreal Educators or VFX/Game-Developers", minUSD: 3000, maxUSD: 85000, minCAD: 4106, maxCAD: 116331, minEUR: 2543, maxEUR: 72038 },
];

type ScaleLevel = "small" | "medium" | "large";

const scaleMultipliers: Record<ScaleLevel, { min: number; max: number; label: string; desc: string }> = {
  small: { min: 0.0, max: 0.25, label: "Indie / Small Studio", desc: "1–20 people, focused scope" },
  medium: { min: 0.25, max: 0.6, label: "Mid-Size Studio", desc: "20–100 people, multi-department" },
  large: { min: 0.6, max: 1.0, label: "AAA / Enterprise", desc: "100+ people, full pipeline" },
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
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
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  useEffect(() => {
    const selectServiceHandler = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id) setSelectedServices(prev => prev.includes(id) ? prev : [...prev, id]);
    };
    const openCalendlyHandler = () => {
      setCalendlyOpen(true);
    };

    window.addEventListener("tulip:select-service", selectServiceHandler);
    window.addEventListener("tulip:open-calendly", openCalendlyHandler);
    return () => {
      window.removeEventListener("tulip:select-service", selectServiceHandler);
      window.removeEventListener("tulip:open-calendly", openCalendlyHandler);
    };
  }, []);

  const handleQuizComplete = (recommendedServices: string[]) => {
    setSelectedServices(recommendedServices);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
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

  const selectedServiceLabels = selectedServices.map(id => serviceOptions.find(s => s.id === id)?.label || id);
  const estimateRangeStr = selectedServices.length > 0
    ? `${formatCurrency(estimate.totalMin, currency)} – ${formatCurrency(estimate.totalMax, currency)} ${currency}`
    : "";

  return (
    <section id="estimator" className="pt-6 pb-24 md:pb-32 section-padding">
      <div ref={ref} className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-primary font-body mb-3 font-medium">Cost Estimator</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Build your <span className="text-gradient-gold">quote</span>
          </h2>
          <p className="max-w-md mx-auto mb-5 text-white/80 text-sm font-body">
            Select your services and studio scale for an instant budget range.
          </p>
          <p className="mb-2.5 text-white/70 text-sm font-body">Not sure what you need?</p>
          <button
            data-assessment-trigger
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-2 btn-chrome-outline px-6 py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
          >
            <ClipboardCheck size={16} />
            Take the 2-min Assessment
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card/50 border border-border/60 rounded-2xl p-6 md:p-10"
        >
          {/* Currency */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <img src={tulipLogo} alt="Tulip Technology logo" className="w-12 h-12 rounded-full object-cover border border-border/40" />
            <h3 className="font-display font-semibold text-xl">Choose Your Currency</h3>
            <div className="bg-secondary/60 rounded-full p-0.5 flex border border-border/40 gap-0.5">
              {(["USD", "CAD", "EUR"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all min-h-[36px] ${
                    currency === c ? "bg-primary text-primary-foreground" : "text-white hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Studio Scale */}
          <div className="mb-8">
            <h3 className="font-display font-semibold mb-3 text-base">Studio Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(Object.keys(scaleMultipliers) as ScaleLevel[]).map((key) => {
                const s = scaleMultipliers[key];
                return (
                  <button
                    key={key}
                    onClick={() => setScale(key)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 min-h-[44px] ${
                      scale === key ? "border-primary bg-primary/5" : "border-border/40 hover:border-muted-foreground/25"
                    }`}
                  >
                    <div className="font-display font-semibold text-xs mb-0.5">{s.label}</div>
                    <div className="text-[11px] text-white font-body">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h3 className="font-display font-semibold mb-3 text-base">Select Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {serviceOptions.map((svc) => {
                const selected = selectedServices.includes(svc.id);
                const isResearch = svc.id === "research";
                return (
                  <button
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 min-h-[44px] ${
                      selected ? "border-primary bg-primary/5" : "border-border/40 hover:border-muted-foreground/25"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="hsl(0 0% 3%)" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-semibold text-base">{svc.label}</div>
                        <div className="text-[22px] text-white font-body whitespace-pre-line">{svc.description}</div>
                        {isResearch && (
                          <span
                            onClick={(e) => { e.stopPropagation(); setDiscoveryOpen(true); }}
                            className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full text-[20px] font-display font-semibold text-foreground border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            Discovery Packages
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result */}
          <div className="border-t border-border/30 pt-6">
            {selectedServices.length === 0 ? (
              <div className="text-center text-white font-body py-6">
                <Calculator className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Select services above to see your estimated budget range</p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-5">
                  <p className="mb-1.5 text-white/80 text-sm font-body">Estimated Budget Range</p>
                  <div className="font-display text-2xl md:text-3xl font-bold">
                    <span className="text-gradient-gold">{formatCurrency(estimate.totalMin, currency)}</span>
                    <span className="text-white mx-2">–</span>
                    <span className="text-gradient-gold">{formatCurrency(estimate.totalMax, currency)}</span>
                  </div>
                  <p className="text-[10px] text-white font-body mt-1">{currency}</p>
                </div>

                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center gap-1.5 mx-auto text-xs text-white hover:text-foreground transition-colors font-body min-h-[44px]"
                >
                  {showBreakdown ? "Hide" : "Show"} breakdown
                  {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showBreakdown && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-2">
                    {estimate.breakdown.map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-border/20">
                        <span className="text-xs font-body">{item.label}</span>
                        <span className="text-xs font-body text-white">{formatCurrency(item.min, currency)} – {formatCurrency(item.max, currency)}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setQuoteOpen(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
                  >
                    Request Detailed Quote
                  </button>
                  <button
                    onClick={() => setCalendlyOpen(true)}
                    className="btn-chrome-outline px-6 py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
                  >
                    Book Discovery Meeting
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment structure */}
      </div>

      <PipelineAssessmentQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onComplete={handleQuizComplete} />
      <DiscoveryPackagesModal open={discoveryOpen} onClose={() => setDiscoveryOpen(false)} />
      <QuoteRequestModal open={quoteOpen} onClose={() => setQuoteOpen(false)} selectedServices={selectedServiceLabels} estimateRange={estimateRangeStr} onBookMeeting={() => setCalendlyOpen(true)} />
      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
};

export default CostEstimator;
