import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import tulipLogo from "@/assets/new-logo.png";

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  /** Which service IDs this question's score maps to */
  services: string[];
}

const quizQuestions: QuizQuestion[] = [
  // Systems vs Personnel (general scalability) — maps to multiple
  { id: 1, category: "Operations", question: "If a key team member left tomorrow, could your pipeline continue running smoothly without them?", services: ["research", "architecture"] },
  { id: 2, category: "Operations", question: "Are your production workflows documented in a way that any new hire could follow?", services: ["research", "workshops"] },
  { id: 3, category: "Scalability", question: "Could your current pipeline handle 3× the workload without significant restructuring?", services: ["architecture", "integration"] },
  { id: 4, category: "Scalability", question: "Do you have automated systems for repetitive tasks rather than relying on manual effort?", services: ["integration", "architecture"] },

  // GenAI Research
  { id: 5, category: "AI Awareness", question: "Does your team actively track new GenAI tools and research relevant to your industry?", services: ["research"] },
  { id: 6, category: "AI Awareness", question: "Do you have a structured process for evaluating whether new AI developments could benefit your pipeline?", services: ["research"] },
  { id: 7, category: "AI Awareness", question: "Have you identified specific pain points in your pipeline where AI could reduce friction?", services: ["research"] },

  // Tool Benchmarking
  { id: 8, category: "Tool Selection", question: "Do you use quantitative criteria (speed, quality, cost) when choosing between tools?", services: ["benchmarking"] },
  { id: 9, category: "Tool Selection", question: "Have you compared AI tools side-by-side using standardized test datasets from your production?", services: ["benchmarking"] },
  { id: 10, category: "Tool Selection", question: "Do you re-evaluate your tool stack periodically as new options emerge?", services: ["benchmarking"] },

  // Demos & Sandboxes
  { id: 11, category: "Testing", question: "Do you test new tools or workflows in a sandbox environment before deploying to production?", services: ["demos"] },
  { id: 12, category: "Testing", question: "Do you have a staging pipeline that mirrors your production environment for safe experimentation?", services: ["demos"] },
  { id: 13, category: "Testing", question: "Can your team prototype and validate new approaches without disrupting active projects?", services: ["demos"] },

  // Architecture
  { id: 14, category: "Infrastructure", question: "Do you have a documented technology architecture or blueprint for your AI/production stack?", services: ["architecture"] },
  { id: 15, category: "Infrastructure", question: "Is your infrastructure designed to scale compute resources up or down based on project demands?", services: ["architecture"] },
  { id: 16, category: "Infrastructure", question: "Do you have a clear data strategy for training or fine-tuning AI models on your proprietary assets?", services: ["architecture"] },

  // Integration
  { id: 17, category: "Connectivity", question: "Do your DCC tools, asset management, and render systems share data automatically?", services: ["integration"] },
  { id: 18, category: "Connectivity", question: "Are AI-generated outputs automatically routed into the correct stage of your pipeline?", services: ["integration"] },
  { id: 19, category: "Connectivity", question: "Do you have API-level connections between your major production tools?", services: ["integration"] },

  // Workshops & Education
  { id: 20, category: "Team Skills", question: "Does your team receive regular training on AI tools and workflows relevant to their roles?", services: ["workshops"] },
  { id: 21, category: "Team Skills", question: "Is knowledge about tools and best practices shared systematically across departments?", services: ["workshops"] },
  { id: 22, category: "Team Skills", question: "Do you have internal champions or trainers who keep the team up to date on AI capabilities?", services: ["workshops"] },
];

const answerOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

interface PipelineAssessmentQuizProps {
  open: boolean;
  onClose: () => void;
  onComplete: (recommendedServices: string[]) => void;
}

const PipelineAssessmentQuiz = ({ open, onClose, onComplete }: PipelineAssessmentQuizProps) => {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", industry: "" });

  const resetQuiz = () => {
    setStep("intro");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep("results");
      }
    }, 300);
  };

  // Calculate service scores — lower score = more need for the service
  const getServiceScores = () => {
    const serviceScores: Record<string, { total: number; count: number }> = {};
    const allServices = ["research", "benchmarking", "demos", "architecture", "integration", "workshops"];
    allServices.forEach(s => { serviceScores[s] = { total: 0, count: 0 }; });

    quizQuestions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        q.services.forEach((svc) => {
          serviceScores[svc].total += answer;
          serviceScores[svc].count += 1;
        });
      }
    });

    return allServices.map(svc => ({
      id: svc,
      avg: serviceScores[svc].count > 0 ? serviceScores[svc].total / serviceScores[svc].count : 3,
    }));
  };

  const getRecommendedServices = () => {
    const scores = getServiceScores();
    // Recommend services where avg score is below 3.5 (weak area = needs help)
    return scores.filter(s => s.avg < 3.5).map(s => s.id);
  };

  const getServiceLabel = (id: string) => {
    const map: Record<string, string> = {
      research: "GenAI Research",
      benchmarking: "Tool Benchmarking",
      demos: "Demos & Sandboxes",
      architecture: "Architecture Blueprint",
      integration: "Integration",
      workshops: "Workshops & Education",
    };
    return map[id] || id;
  };

  const getScoreColor = (avg: number) => {
    if (avg >= 4) return "text-green-400";
    if (avg >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (avg: number) => {
    if (avg >= 4) return "Strong";
    if (avg >= 3) return "Moderate";
    return "Needs Attention";
  };

  const handleApplyRecommendations = () => {
    const recommended = getRecommendedServices();
    onComplete(recommended.length > 0 ? recommended : ["research"]); // fallback to at least one
    onClose();
    resetQuiz();
  };

  if (!open) return null;

  const progress = step === "quiz" ? ((currentQuestion + 1) / quizQuestions.length) * 100 : step === "results" ? 100 : 0;

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
                <h3 className="font-display font-bold text-lg">Pipeline Assessment</h3>
                <p className="text-xs text-muted-foreground font-body">~2 minute benchmark</p>
              </div>
            </div>
            <button onClick={() => { onClose(); resetQuiz(); }} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          {step !== "intro" && (
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* INTRO STEP */}
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Pipeline Health <span className="text-gradient-gold">Benchmark</span>
                </h2>
                <p className="text-muted-foreground font-body text-sm mb-2">
                  Discover your personalized pipeline report in just <strong className="text-foreground">2 minutes</strong>.
                </p>
                <p className="text-muted-foreground font-body text-xs mb-8 max-w-md mx-auto">
                  Using 22 data points we evaluate whether your production operations depend on
                  <span className="text-red-400"> individual personnel</span> or
                  <span className="text-green-400"> structured systems</span> while also assessing your pipeline's scalability.
                </p>

                <div className="space-y-3 max-w-sm mx-auto text-left">
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">First name</label>
                    <input
                      type="text"
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Last name</label>
                    <input
                      type="text"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                      placeholder="you@studio.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Industry</label>
                    <select
                      value={contactInfo.industry}
                      onChange={(e) => setContactInfo({ ...contactInfo, industry: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select your industry</option>
                      <option value="games">Game Development</option>
                      <option value="animation">3D Animation</option>
                      <option value="vfx">VFX / Post-Production</option>
                      <option value="arch-viz">Architectural Visualization</option>
                      <option value="advertising">Advertising / Motion Graphics</option>
                      <option value="other">Other Creative Production</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep("quiz")}
                  className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  Begin Assessment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* QUIZ STEP */}
            {step === "quiz" && (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    {quizQuestions[currentQuestion].category}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                </div>

                <h3 className="font-display text-lg md:text-xl font-semibold mb-8 leading-snug">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {answerOptions.map((opt) => {
                    const isSelected = answers[quizQuestions[currentQuestion].id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(quizQuestions[currentQuestion].id, opt.value)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 font-body text-sm flex items-center gap-3 ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />}
                        </div>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body disabled:opacity-30 flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  {answers[quizQuestions[currentQuestion].id] !== undefined && currentQuestion < quizQuestions.length - 1 && (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-body flex items-center gap-1"
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* RESULTS STEP */}
            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Your Pipeline Report</h2>
                <p className="text-muted-foreground font-body text-sm mb-8">
                  Based on your responses, here's how your pipeline scores across key areas.
                </p>

                <div className="space-y-3 text-left mb-8">
                  {getServiceScores().map((score) => {
                    const pct = (score.avg / 5) * 100;
                    const isRecommended = score.avg < 3.5;
                    return (
                      <div key={score.id} className={`p-4 rounded-xl border ${isRecommended ? "border-primary bg-primary/5" : "border-border"}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-display text-sm font-semibold">{getServiceLabel(score.id)}</span>
                          <span className={`text-xs font-body font-medium ${getScoreColor(score.avg)}`}>
                            {getScoreLabel(score.avg)} ({score.avg.toFixed(1)}/5)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`h-full rounded-full ${
                              score.avg >= 4 ? "bg-green-500" : score.avg >= 3 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                          />
                        </div>
                        {isRecommended && (
                          <p className="text-xs text-primary font-body mt-1.5">⚡ Recommended for your pipeline</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleApplyRecommendations}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Apply Recommendations to Quote
                  </button>
                  <button
                    onClick={() => { onClose(); resetQuiz(); }}
                    className="btn-chrome-outline px-6 py-3 rounded-full font-display font-semibold text-sm transition-all"
                  >
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
