import { useState, useMemo, useEffect, useRef } from "react";
import tulipLogo from "@/assets/new-logo.png";
import { motion, useInView } from "framer-motion";
import { ClipboardCheck, ChevronDown } from "lucide-react";
import PipelineAssessmentQuiz from "./PipelineAssessmentQuiz";
import DiscoveryPackagesModal from "./DiscoveryPackagesModal";
import QuoteRequestModal from "./QuoteRequestModal";
import CalendlyModal from "./CalendlyModal";
import { useServiceSelection } from "@/context/ServiceSelectionContext";

interface ServiceOption {
  id: string;
  label: string;
  description: string;
  minUSD: number; maxUSD: number;
  minCAD: number; maxCAD: number;
  minEUR: number; maxEUR: number;
}

const serviceOptions: ServiceOption[] = [
  { id: "research",      label: "GenAI Research",          description: "Identify pipeline pain points & opportunities\nEmbed AI tools and solve vendor integration bottlenecks with our research & game engineers", minUSD: 20571, maxUSD: 75000,  minCAD: 28153, maxCAD: 102645, minEUR: 17434, maxEUR: 63563  },
  { id: "benchmarking",  label: "Tool Benchmarking",        description: "Test & validate AI tools in sandbox environments",                                                              minUSD: 15000, maxUSD: 130000, minCAD: 20529, maxCAD: 177918, minEUR: 12713, maxEUR: 110175 },
  { id: "demos",         label: "Demos & Sandboxes",        description: "Hands-on prototypes tailored to your pipeline",                                                                minUSD: 3000,  maxUSD: 120000, minCAD: 4106,  maxCAD: 164232, minEUR: 2543,  maxEUR: 101700 },
  { id: "architecture",  label: "Architecture Blueprint",   description: "Full GenAI architecture including LLM training",                                                               minUSD: 12000, maxUSD: 350000, minCAD: 16423, maxCAD: 479010, minEUR: 10170, maxEUR: 296625 },
  { id: "integration",   label: "Adoption & Integration",   description: "End-to-end AI integration into your workflows",                                                               minUSD: 20000, maxUSD: 600000, minCAD: 27372, maxCAD: 821160, minEUR: 16950, maxEUR: 508500 },
  { id: "workshops",     label: "Workshops & Education",    description: "Led by certified Unreal Educators or VFX/Game-Developers",                                                    minUSD: 3000,  maxUSD: 85000,  minCAD: 4106,  maxCAD: 116331, minEUR: 2543,  maxEUR: 72038  },
];

type ScaleKey = "indie" | "midsize" | "aaa";

const scaleOptions: { id: ScaleKey; name: string; desc: string; multiplier: number }[] = [
  { id: "indie",   name: "Indie / Small Studio",  desc: "1–20 people, focused scope",        multiplier: 0.6 },
  { id: "midsize", name: "Mid-Size Studio",        desc: "20–100 people, multi-department",   multiplier: 1.0 },
  { id: "aaa",     name: "AAA / Enterprise",       desc: "100+ people, full pipeline",        multiplier: 1.8 },
];

const currencySymbols: Record<string, string> = { USD: "$", CAD: "C$", EUR: "€" };

const formatAmt = (n: number, curr: string) =>
  `${currencySymbols[curr]}${n.toLocaleString()}`;

const CostEstimator = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { addService, removeService, setStudioScale: setContextScale } = useServiceSelection();
  const [studioScale, setStudioScale] = useState<ScaleKey>("midsize");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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
    const openCalendlyHandler = () => setCalendlyOpen(true);
    window.addEventListener("tulip:select-service", selectServiceHandler);
    window.addEventListener("tulip:open-calendly", openCalendlyHandler);
    return () => {
      window.removeEventListener("tulip:select-service", selectServiceHandler);
      window.removeEventListener("tulip:open-calendly", openCalendlyHandler);
    };
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      // sync label (not id) into context for Notion submission
      const label = serviceOptions.find(s => s.id === id)?.label ?? id;
      prev.includes(id) ? removeService(label) : addService(label);
      return next;
    });
  };

  const tier = useMemo(() => {
    const serviceWeights: Record<string, number> = {
      research: 1, benchmarking: 1, demos: 1, architecture: 2, integration: 3, workshops: 1,
    };
    const totalWeight = selectedServices.reduce((sum, id) => sum + (serviceWeights[id] ?? 0), 0);
    const multiplier = scaleOptions.find(s => s.id === studioScale)?.multiplier ?? 1.0;
    const rates: Record<string, number> = { USD: 1.0, CAD: 1.35, EUR: 0.92 };
    const rate = rates[currency] ?? 1.0;

    let baseMin = 40000, baseMax = 80000;
    let name = "discovery", label = "Discovery & Validation Tier";
    if (totalWeight >= 6) { baseMin = 200000; baseMax = 500000; name = "enterprise"; label = "Enterprise Deployment Tier"; }
    else if (totalWeight >= 3) { baseMin = 100000; baseMax = 250000; name = "integration"; label = "Integration Ready Tier"; }

    return {
      name, label,
      min: Math.round(baseMin * multiplier * rate),
      max: Math.round(baseMax * multiplier * rate),
      avg: Math.round((baseMin + baseMax) / 2 * multiplier * rate),
    };
  }, [selectedServices, studioScale, currency]);

  const selectedServiceLabels = selectedServices.map(id => serviceOptions.find(s => s.id === id)?.label ?? id);
  const estimateRangeStr = selectedServices.length > 0
    ? `${formatAmt(tier.min, currency)} – ${formatAmt(tier.max, currency)} ${currency}`
    : "";

  const sym = currencySymbols[currency];

  return (
    <section id="estimator" className="bg-black text-white">
      <div ref={ref}>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center py-16 px-8"
        >
          <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-4">Cost Estimator</p>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Build your <span className="text-gradient-gold">quote</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Select your services and studio scale for an instant budget range.
          </p>
          <p className="text-xl text-gray-400 mb-6">Not sure what you need?</p>
          <button
            data-assessment-trigger
            onClick={() => document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 text-lg rounded-full border-0 hover:opacity-90 transition-opacity inline-flex items-center justify-center"
            style={{ background: "linear-gradient(to right, #E5B4E2, #D4A5D4, #C8B5E8)" }}
          >
            <span className="text-[#4A1942] font-semibold flex items-center gap-2">
              📋 Workflow & Cost Analyzer
            </span>
          </button>
        </motion.div>

        {/* CURRENCY */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center mb-16 px-8"
        >
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={tulipLogo} alt="Tulip" className="w-16 h-16 object-cover" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Choose Your Currency</h2>
          <div className="flex gap-4">
            {(["USD", "CAD", "EUR"] as const).map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-8 py-3 text-lg rounded-full transition-all ${
                  currency === curr ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </motion.div>

        {/* MAIN */}
        <div className="max-w-6xl mx-auto px-8 pb-16">

          {/* Studio Scale */}
          <h2 className="text-3xl font-semibold mb-6">Studio Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {scaleOptions.map(s => (
              <button
                key={s.id}
                onClick={() => { setStudioScale(s.id); setContextScale(s.name); }}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  studioScale === s.id ? "border-[#8FD5A6] bg-[#8FD5A6]/10" : "border-white/20 hover:border-white/40"
                }`}
              >
                <div className="text-2xl font-semibold mb-2">{s.name}</div>
                <div className="text-base text-gray-400">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Services */}
          <h2 className="text-3xl font-semibold mb-6">Select Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {serviceOptions.map(svc => {
              const selected = selectedServices.includes(svc.id);
              const isResearch = svc.id === "research";
              return (
                <button
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`p-8 rounded-2xl border-2 transition-all text-left ${
                    selected ? "border-[#8FD5A6] bg-[#8FD5A6]/10" : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? "border-[#8FD5A6] bg-[#8FD5A6]" : "border-white/40"
                    }`}>
                      {selected && (
                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-semibold mb-3">{svc.label}</div>
                      <div className="text-base text-gray-400 whitespace-pre-line leading-relaxed">{svc.description}</div>
                      {isResearch && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDiscoveryOpen(true); }}
                          className="mt-4 px-6 py-3 text-base rounded-full border-2 border-white/20 hover:border-white/40 transition-colors"
                        >
                          Discovery Packages
                        </button>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mb-12 p-8 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl">
            <div className="flex gap-4">
              <svg className="w-7 h-7 text-amber-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400 mb-4">Important Disclaimer</h3>
                <div className="text-base text-gray-300 space-y-3 leading-relaxed">
                  <p>The investment range shown below is an <strong>educational estimate</strong> and is <strong>NOT a binding quote or contractual commitment</strong>.</p>
                  <p>Actual pricing depends on:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Detailed scope definition in discovery meeting</li>
                    <li>Your existing infrastructure and integrations</li>
                    <li>Team size, skill levels, and readiness</li>
                    <li>Timeline, deliverables, and support requirements</li>
                    <li>Third-party tool licensing and hosting costs</li>
                  </ul>
                  <p className="pt-2"><strong>Final proposals may vary significantly from this estimate.</strong> This tool is for planning purposes only.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Tier */}
          <div className="mb-12 p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
            <div className="text-center mb-8">
              <div className="text-base text-gray-400 mb-3">Based on your selections, your project falls within:</div>
              <h2 className="text-4xl font-bold text-[#8FD5A6] mb-6">{tier.label}</h2>
            </div>

            <div className="text-center mb-10">
              <div className="text-xl text-gray-400 mb-4">Typical Investment Range</div>
              <div className="text-7xl font-bold mb-3">
                {selectedServices.length === 0
                  ? `${sym}0`
                  : `${sym}${tier.min.toLocaleString()} – ${sym}${tier.max.toLocaleString()}`}
              </div>
              <div className="text-base text-gray-500">{currency}</div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-5 text-center">This tier typically includes:</h3>

              {tier.name === "enterprise" && (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-300 text-base max-w-3xl">
                    {["Multi-team deployment", "Custom model training", "Change management program", "Production monitoring"].map(item => (
                      <div key={item} className="flex items-center gap-3 justify-start">
                        <div className="w-2 h-2 rounded-full bg-[#8FD5A6] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tier.name === "integration" && (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-300 text-base max-w-3xl">
                    {["Custom integration deployment", "Team training workshops", "Sandbox environments", "Initial production rollout"].map(item => (
                      <div key={item} className="flex items-center gap-3 justify-start">
                        <div className="w-2 h-2 rounded-full bg-[#8FD5A6] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tier.name === "discovery" && (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-300 text-base max-w-3xl">
                    {["Pipeline pain point analysis", "Tool evaluation and recommendations", "Architecture design and planning", "Initial proof of concept"].map(item => (
                      <div key={item} className="flex items-center gap-3 justify-start">
                        <div className="w-2 h-2 rounded-full bg-[#8FD5A6] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ROI Context */}
          <div className="mb-8 flex justify-center">
            <div className="max-w-3xl w-full p-8 bg-[#8FD5A6]/10 border border-[#8FD5A6]/30 rounded-2xl">
              <h3 className="text-3xl font-semibold mb-5">How does this compare to doing nothing?</h3>
              <div className="space-y-4 text-gray-300 text-base">
                <p>Based on your studio scale and selected services:</p>
                <ul className="space-y-3 ml-4">
                  <li>• Current cost of inefficiency: <strong className="text-white">$350K per major rework cycle</strong></li>
                  <li>• Manual review bottlenecks: <strong className="text-white">10–30 dev days lost per iteration</strong></li>
                  <li>• Estimated annual waste: <strong className="text-white">$500K–$1.5M</strong></li>
                </ul>
                <div className="pt-5 mt-5 border-t border-[#8FD5A6]/30">
                  <p className="text-xl">
                    <strong className="text-[#8FD5A6]">Typical ROI timeline:</strong> 3–6 months<br />
                    <strong className="text-[#8FD5A6]">Average client savings:</strong> $800K+ in first year
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-5 mb-12">
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <button
                onClick={() => setCalendlyOpen(true)}
                className="px-16 py-9 text-3xl rounded-full bg-gradient-to-r from-[#D4B86A] to-[#8FD5A6] hover:opacity-90 transition-opacity text-white font-semibold"
              >
                Book Discovery Meeting
              </button>
              <button
                onClick={() => setQuoteOpen(true)}
                className="px-12 py-7 text-2xl rounded-full border-2 border-white/30 hover:border-white/60 transition-colors text-white font-semibold bg-transparent"
              >
                Request Detailed Quote
              </button>
            </div>
            <p className="text-white font-body text-base">No Obligation. The discovery meeting is complimentary.</p>
          </div>

          {/* Breakdown Toggle */}
          <div className="mb-12 flex justify-center">
            <div className="max-w-4xl w-full">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-center gap-2 text-xl text-gray-400 hover:text-white transition-colors mb-8"
              >
                {showBreakdown ? "Hide" : "Show"} what affects your investment
                <svg className={`w-6 h-6 transition-transform ${showBreakdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showBreakdown && (
                <div className="p-8 bg-white/5 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg inline-flex items-center gap-2"><span>📊</span> Discovery Meeting Assessment</h4>
                    <p className="text-base text-gray-300">We'll evaluate your current pipeline, team readiness, and integration requirements to scope precisely.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg inline-flex items-center gap-2"><span>📋</span> Formal Proposal</h4>
                    <p className="text-base text-gray-300">You'll receive a detailed proposal with fixed pricing, deliverables, timeline, and payment terms.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg inline-flex items-center gap-2"><span>🔒</span> No Obligation</h4>
                    <p className="text-base text-gray-300">The discovery meeting is complimentary and carries no commitment to proceed.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-base text-gray-500">
            All estimates are subject to scope confirmation. Final proposals provided after discovery meeting.
          </div>

        </div>
      </div>

      <PipelineAssessmentQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onComplete={(services) => setSelectedServices(services)} />
      <DiscoveryPackagesModal open={discoveryOpen} onClose={() => setDiscoveryOpen(false)} />
      <QuoteRequestModal open={quoteOpen} onClose={() => setQuoteOpen(false)} selectedServices={selectedServiceLabels} estimateRange={estimateRangeStr} onBookMeeting={() => setCalendlyOpen(true)} />
      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
};

export default CostEstimator;
