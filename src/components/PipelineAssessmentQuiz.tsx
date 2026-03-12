import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Send, Loader2 } from "lucide-react";
import tulipLogo from "@/assets/new-logo.png";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

/* ──────────────────────────────────────────
   Types & constants
   ────────────────────────────────────────── */

interface QuizQuestion {
  id: number;
  description: string;
}

const questions: QuizQuestion[] = [
  { id: 1, description: "Documented stage-gate process (Conception → Pre-Prod → Prod → Ops)" },
  { id: 2, description: "Automated handoffs between departments/tools" },
  { id: 3, description: "Version control + asset tracking across pipeline" },
  { id: 4, description: "Repeatable pipeline across projects" },
  { id: 5, description: "% of 2D-to-3D automated (GenAI tools)" },
  { id: 6, description: "Baking/optimization for dynamic environments (e.g., Shipbreaker-style)" },
  { id: 7, description: "Low time loss on VFX → edit/polish handoffs" },
  { id: 8, description: "Automated render-farm + nightly optimization scripts" },
  { id: 9, description: "Centralized storage for storyboards/VFX breakdowns" },
  { id: 10, description: "Regular workshops/certified training (Unreal/Unity/Blender)" },
  { id: 11, description: "Living 'pipeline bible' + GenAI prompt templates" },
  { id: 12, description: "Tracked performance notes/evaluations pre-iteration" },
  { id: 13, description: "Low # of steps only 1-2 people can perform" },
  { id: 14, description: "Standardized discipline/collaboration/creativity/craft evals" },
  { id: 15, description: "Any team member can step in via documented SOPs" },
  { id: 16, description: "Low reliance on 'hero' artists" },
  { id: 17, description: "Detailed storyboards for key moments" },
  { id: 18, description: "Mandatory pre-vis/concept workshops" },
  { id: 19, description: "Pre-prod budgeting/planning for VFX shots" },
  { id: 20, description: "Deep GenAI usage across full pipeline stages" },
  { id: 21, description: "End-to-end tool integration (Blender/Runway/ElevenLabs/NukeX)" },
  { id: 22, description: "Sandbox testing of new GenAI tools" },
];

const industries = [
  "Game Development",
  "3D Animation",
  "VFX / Post-Production",
  "Architectural Visualization",
  "Advertising / Motion Graphics",
  "Other Creative Production",
];

const studioScales = [
  "Indie/Small Studio (1-20 people)",
  "Mid-Size Studio (20-100 people)",
  "AAA/Enterprise (100+ people)",
];

const categoryDefs = [
  { key: "systemization", label: "Systemization", qs: [1, 2, 3, 4, 20, 21, 22], max: 35 },
  { key: "optimisation", label: "Optimisation & Efficiency", qs: [5, 6, 7, 8], max: 20 },
  { key: "knowledge", label: "Centralised Knowledge", qs: [9, 10, 11, 12], max: 20 },
  { key: "personnel", label: "Hiring & Personnel Dependency", qs: [13, 14, 15, 16], max: 20 },
  { key: "preProd", label: "Business Mgmt & Pre-Prod", qs: [17, 18, 19], max: 15 },
  { key: "genAi", label: "GenAI & Post-Prod Integration", qs: [20, 21, 22], max: 15 },
] as const;

const sliderLabels = ["", "Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

const QUESTIONS_PER_PAGE = 5;

/* ──────────────────────────────────────────
   Donut chart (SVG)
   ────────────────────────────────────────── */

const DonutChart = ({ categories, overall }: { categories: { label: string; pct: number; color: string }[]; overall: number }) => {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 95;
  const innerR = 60;
  const gap = 2; // degrees gap between slices
  const total = categories.length;
  const sliceAngle = (360 - gap * total) / total;

  const polarToCartesian = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number, oR: number, iR: number) => {
    const s1 = polarToCartesian(startAngle, oR);
    const e1 = polarToCartesian(endAngle, oR);
    const s2 = polarToCartesian(endAngle, iR);
    const e2 = polarToCartesian(startAngle, iR);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${oR} ${oR} 0 ${large} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${iR} ${iR} 0 ${large} 0 ${e2.x} ${e2.y} Z`;
  };

  let angleOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {categories.map((cat, i) => {
        const startAngle = angleOffset;
        // Scale the arc fill by the category percentage
        const fillAngle = sliceAngle * (cat.pct / 100);
        const fullEndAngle = angleOffset + sliceAngle;
        angleOffset = fullEndAngle + gap;

        return (
          <g key={i}>
            {/* Background arc (muted) */}
            <path d={describeArc(startAngle, fullEndAngle, outerR, innerR)} fill="hsl(var(--muted))" opacity={0.3} />
            {/* Filled arc */}
            {fillAngle > 0.5 && (
              <path d={describeArc(startAngle, startAngle + fillAngle, outerR, innerR)} fill={cat.color} opacity={0.85} />
            )}
          </g>
        );
      })}
      {/* Center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="28" fontWeight="bold" fontFamily="Outfit">
        {Math.round(overall)}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="Space Grotesk">
        Pipeline Health
      </text>
    </svg>
  );
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */

interface PipelineAssessmentQuizProps {
  open: boolean;
  onClose: () => void;
  onComplete: (recommendedServices: string[]) => void;
}

const PipelineAssessmentQuiz = ({ open, onClose, onComplete }: PipelineAssessmentQuizProps) => {
  const [step, setStep] = useState<"intake" | "quiz" | "results">("intake");
  const [quizPage, setQuizPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    questions.forEach((q) => (initial[q.id] = 3));
    return initial;
  });
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", industry: "", studioScale: "" });
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(quizPage * QUESTIONS_PER_PAGE, (quizPage + 1) * QUESTIONS_PER_PAGE);

  const resetQuiz = () => {
    setStep("intake");
    setQuizPage(0);
    const initial: Record<number, number> = {};
    questions.forEach((q) => (initial[q.id] = 3));
    setAnswers(initial);
    setEmailSubmitted(false);
  };

  /* ── Scoring ── */
  const scores = useMemo(() => {
    const cats = categoryDefs.map((cat) => {
      const sum = cat.qs.reduce((a, qId) => a + (answers[qId] || 3), 0);
      return { ...cat, pct: (sum / cat.max) * 100 };
    });
    const overall = cats.reduce((a, c) => a + c.pct, 0) / cats.length;
    return { cats, overall };
  }, [answers]);

  const recommendation = useMemo(() => {
    const o = scores.overall;
    if (o < 40) return { level: "Full" as const, budgetRange: "$250,000 – $384,750", services: ["Architecture Blueprint", "Adoption & Integration", "Workshops & Education", "Demos & Sandboxes"], notes: "Your pipeline has significant gaps across multiple areas. We recommend a comprehensive engagement covering architecture, integration, training, and prototyping." };
    if (o < 65) return { level: "Mid" as const, budgetRange: "$120,000 – $220,000", services: ["Tool Benchmarking", "Demos & Sandboxes", "Adoption & Integration"], notes: "Your pipeline has solid foundations but key areas need attention. A targeted mid-tier engagement will accelerate your pipeline maturity." };
    return { level: "Light" as const, budgetRange: "$48,000 – $95,000", services: ["GenAI Research", "Workshops & Education"], notes: "Your pipeline is well-established. A light engagement focused on research and upskilling will help you stay ahead of the curve." };
  }, [scores]);

  const serviceIdMap: Record<string, string> = {
    "GenAI Research": "research",
    "Tool Benchmarking": "benchmarking",
    "Demos & Sandboxes": "demos",
    "Architecture Blueprint": "architecture",
    "Adoption & Integration": "integration",
    "Workshops & Education": "workshops",
  };

  const handleApplyRecommendations = () => {
    const ids = recommendation.services.map((s) => serviceIdMap[s] || s);
    onComplete(ids);
    onClose();
    resetQuiz();
  };

  /* ── Email submit ── */
  const handleEmailSubmit = async () => {
    if (!user.email) return;
    setSubmitting(true);
    try {
      // Send results to edge function
      await supabase.functions.invoke("paper-chat", {
        body: {
          type: "pipeline-assessment",
          to: "youki@tuliptchnology.studio",
          user,
          scores: scores.cats.map((c) => ({ label: c.label, pct: Math.round(c.pct) })),
          overall: Math.round(scores.overall),
          recommendation,
        },
      });
    } catch (e) {
      // silently continue — email is best-effort
      console.error("Failed to send assessment email:", e);
    }
    setEmailSubmitted(true);
    setSubmitting(false);
  };

  const catColors = [
    "hsl(200 80% 60%)",
    "hsl(260 70% 65%)",
    "hsl(320 65% 60%)",
    "hsl(40 90% 60%)",
    "hsl(160 70% 50%)",
    "hsl(290 60% 55%)",
  ];

  const progress = step === "quiz" ? ((quizPage + 1) / totalPages) * 100 : step === "results" ? 100 : 0;

  const canProceedIntake = user.email && user.industry && user.studioScale;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={tulipLogo} alt="Tulip" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-display font-bold text-xl">Pipeline Health Benchmark</h3>
                <p className="text-sm text-muted-foreground font-body">~2 minute assessment</p>
              </div>
            </div>
            <button onClick={() => { onClose(); resetQuiz(); }} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          {step !== "intake" && (
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: INTAKE ── */}
            {step === "intake" && (
              <motion.div key="intake" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Pipeline Health <span className="text-gradient-gold">Benchmark</span>
                </h2>
                <p className="text-muted-foreground font-body text-base mb-3">
                  Unlock your personalized pipeline health benchmark in under <strong className="text-foreground">2 minutes</strong>.
                </p>
                <p className="text-muted-foreground font-body text-sm mb-8 max-w-md mx-auto">
                  With 22 targeted data points, we assess whether your VFX / animation / game production depends on
                  <span className="text-red-400"> irreplaceable talent</span> or
                  <span className="text-green-400"> robust, repeatable systems</span> – plus your true scalability potential.
                </p>

                <div className="space-y-3 max-w-sm mx-auto text-left">
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">First name</label>
                    <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="First name" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Last name</label>
                    <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="Last name" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Email <span className="text-destructive">*</span></label>
                    <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="you@studio.com" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Industry <span className="text-destructive">*</span></label>
                    <select value={user.industry} onChange={(e) => setUser({ ...user, industry: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors">
                      <option value="">Select your industry</option>
                      {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Studio Scale <span className="text-destructive">*</span></label>
                    <select value={user.studioScale} onChange={(e) => setUser({ ...user, studioScale: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors">
                      <option value="">Select studio size</option>
                      {studioScales.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep("quiz")}
                  disabled={!canProceedIntake}
                  className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Begin Assessment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: SLIDERS ── */}
            {step === "quiz" && (
              <motion.div key={`page-${quizPage}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">Page {quizPage + 1} of {totalPages}</span>
                  <span className="text-xs text-muted-foreground font-body">{Math.min((quizPage + 1) * QUESTIONS_PER_PAGE, questions.length)} / {questions.length} questions</span>
                </div>

                <div className="space-y-8 mt-4">
                  {pageQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground font-body mt-0.5 min-w-[24px]">Q{q.id}</span>
                        <p className="font-body text-sm leading-relaxed">{q.description}</p>
                      </div>
                      <div className="px-2">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[answers[q.id]]}
                          onValueChange={(v) => setAnswers({ ...answers, [q.id]: v[0] })}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground font-body">Strongly Disagree</span>
                          <span className="text-xs font-body font-medium text-primary">{sliderLabels[answers[q.id]]}</span>
                          <span className="text-[10px] text-muted-foreground font-body">Strongly Agree</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => quizPage > 0 ? setQuizPage(quizPage - 1) : setStep("intake")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => quizPage < totalPages - 1 ? setQuizPage(quizPage + 1) : setStep("results")}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    {quizPage < totalPages - 1 ? <>Next <ArrowRight size={14} /></> : <>See Results <CheckCircle2 size={14} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── RESULTS ── */}
            {step === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold mb-2">Your Pipeline Report</h2>
                  <p className="text-muted-foreground font-body text-sm">Based on your {questions.length} responses</p>
                </div>

                {/* Donut + Legend */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <DonutChart
                    categories={scores.cats.map((c, i) => ({ label: c.label, pct: c.pct, color: catColors[i] }))}
                    overall={scores.overall}
                  />
                  <div className="space-y-2 flex-1 w-full">
                    {scores.cats.map((cat, i) => (
                      <div key={cat.key} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: catColors[i] }} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-body">{cat.label}</span>
                            <span className="text-xs font-body font-medium text-muted-foreground">{Math.round(cat.pct)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: catColors[i] }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation panel */}
                <div className={`rounded-2xl border p-6 mb-6 ${
                  recommendation.level === "Full" ? "border-red-500/30 bg-red-500/5" :
                  recommendation.level === "Mid" ? "border-yellow-500/30 bg-yellow-500/5" :
                  "border-green-500/30 bg-green-500/5"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-display font-bold px-3 py-1 rounded-full ${
                      recommendation.level === "Full" ? "bg-red-500/20 text-red-400" :
                      recommendation.level === "Mid" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {recommendation.level} Package Recommended
                    </span>
                    <span className="text-xs font-body text-muted-foreground">{recommendation.budgetRange}</span>
                  </div>
                  <p className="text-sm font-body text-muted-foreground mb-3">{recommendation.notes}</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.services.map((svc) => (
                      <span key={svc} className="text-xs font-body bg-secondary px-3 py-1 rounded-full">{svc}</span>
                    ))}
                  </div>
                </div>

                {/* Email submit */}
                {!emailSubmitted ? (
                  <div className="rounded-2xl border border-border bg-secondary/30 p-5 mb-6">
                    <p className="text-sm font-body text-muted-foreground mb-3">
                      Get a detailed report emailed to <strong className="text-foreground">{user.email || "you"}</strong>
                    </p>
                    {!user.email && (
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors mb-3"
                      />
                    )}
                    <button
                      onClick={handleEmailSubmit}
                      disabled={!user.email || submitting}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-40"
                    >
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Send Report
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5 mb-6 text-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-body text-green-400">Report sent! Check your inbox.</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleApplyRecommendations} className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity">
                    Apply Recommendations to Quote
                  </button>
                  <button onClick={() => { onClose(); resetQuiz(); }} className="btn-chrome-outline px-6 py-3 rounded-full font-display font-semibold text-sm transition-all">
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PipelineAssessmentQuiz;
