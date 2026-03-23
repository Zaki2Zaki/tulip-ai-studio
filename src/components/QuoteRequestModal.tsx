import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  selectedServices: string[];
  estimateRange: string;
  onBookMeeting: () => void;
}

const QuoteRequestModal = ({ open, onClose, selectedServices, estimateRange, onBookMeeting }: QuoteRequestModalProps) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", industry: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.name) return;
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        company: form.company || null,
        industry: form.industry || null,
        lead_type: "quote_request",
        selected_services: selectedServices,
        message: form.message || null,
        assessment_results: { estimate_range: estimateRange },
      } as any);

      await supabase.functions.invoke("send-assessment", {
        body: {
          type: "quote-request",
          to: form.email,
          internalTo: "youki@arimastudios.ca",
          user: form,
          selectedServices,
          estimateRange,
        },
      });
    } catch (e) {
      console.error("Failed to submit quote request:", e);
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const reset = () => {
    setForm({ name: "", email: "", company: "", industry: "", message: "" });
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={reset}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-display font-bold text-xl">
            {submitted ? "Request Received" : "Request a Detailed Quote"}
          </h3>
          <button onClick={reset} className="text-white hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-5 rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="text-sm text-white font-body mb-2">Selected Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((s) => (
                      <span key={s} className="text-sm font-body bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                  {estimateRange && (
                    <p className="text-sm text-white font-body mt-2">Estimate: <strong className="text-foreground">{estimateRange}</strong></p>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-white font-body mb-1 block">Name <span className="text-destructive">*</span></label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-base font-body focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-body mb-1 block">Email <span className="text-destructive">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-base font-body focus:outline-none focus:border-primary transition-colors" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-body mb-1 block">Company</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-base font-body focus:outline-none focus:border-primary transition-colors" placeholder="Company name" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-body mb-1 block">Industry</label>
                    <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-base font-body focus:outline-none focus:border-primary transition-colors">
                      <option value="">Select industry</option>
                      <option value="Game Development">Game Development</option>
                      <option value="3D Animation">3D Animation</option>
                      <option value="VFX / Post-Production">VFX / Post-Production</option>
                      <option value="Architectural Visualization">Architectural Visualization</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-white font-body mb-1 block">Message / Project Description</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-base font-body focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Tell us about your project..." />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || submitting}
                  className="mt-6 w-full bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-base hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Submit Quote Request
                </button>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold mb-2">Request Received</h3>
                <p className="text-white font-body mb-6">
                  We've sent a summary of your request to your email. You can also schedule your consultation now.
                </p>
                <button
                  onClick={() => { reset(); onBookMeeting(); }}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-semibold text-base hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Calendar size={16} />
                  Book Your 30-Minute Meeting
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default QuoteRequestModal;
