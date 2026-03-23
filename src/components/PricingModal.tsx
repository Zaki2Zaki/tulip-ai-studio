import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Users, GraduationCap, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PLANS, PAY_PER_USE } from "@/lib/stripe-plans";
import { toast } from "sonner";

type BillingPeriod = "monthly" | "annual";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  defaultPeriod?: BillingPeriod;
}

const plansByPeriod = (period: BillingPeriod) => [
  {
    name: "Student",
    icon: GraduationCap,
    price: period === "monthly" ? "$5.99" : "$59.99",
    period: period === "monthly" ? "/month" : "/year",
    note: period === "monthly" ? "Requires .edu email" : "Requires .edu email · Save 17%",
    features: [
      "Unlimited searches",
      "Full paper access",
      "Save & organize papers",
      "Export citations",
    ],
    cta: "Start Student Plan",
    highlight: false,
    priceId: PLANS.student.price_id,
  },
  {
    name: "Individual",
    icon: Zap,
    price: period === "monthly" ? "$9.99" : "$99",
    period: period === "monthly" ? "/month" : "/year",
    note: period === "monthly" ? "or $99/year (save 17%)" : "Save 17% vs monthly",
    features: [
      "Unlimited searches",
      "Full paper access",
      "Save & organize papers",
      "Export citations",
      "Priority support",
      "Advanced filters",
    ],
    cta: "Start Individual Plan",
    highlight: true,
    priceId: PLANS.individual.price_id,
  },
  {
    name: "Team / Institution",
    icon: Users,
    price: period === "monthly" ? "$19.99" : "$199",
    period: period === "monthly" ? "/user/month" : "/user/year",
    note: period === "monthly" ? "Min 5 users · Volume discounts available" : "Min 5 users · Save 17%",
    features: [
      "Everything in Individual",
      "Shared team library",
      "Admin dashboard",
      "SSO integration",
      "Custom onboarding",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlight: false,
    priceId: null,
  },
];

const PricingModal = ({ open, onClose, defaultPeriod = "monthly" }: PricingModalProps) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [period, setPeriod] = useState<BillingPeriod>(defaultPeriod);

  useEffect(() => {
    if (open) setPeriod(defaultPeriod);
  }, [open, defaultPeriod]);

  const plans = plansByPeriod(period);

  const handleCheckout = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      toast.info("Contact us at team@tuliprd.com for Team/Institution plans.");
      return;
    }

    setLoadingPlan(planName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth?redirect=/library";
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePayPerUse = async (priceId: string, label: string) => {
    setLoadingPlan(label);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth?redirect=/library";
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-50 inset-4 md:inset-0 md:m-auto md:max-w-5xl md:w-[calc(100%-3rem)] md:max-h-[90vh] md:h-fit bg-card border border-border rounded-2xl overflow-auto"
          >
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Unlock <span className="text-gradient-lavender">Full Access</span>
                  </h2>
                  <p className="text-sm text-white font-body mt-1">
                    Choose the plan that fits your research needs
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-border bg-muted/30 p-0.5">
                    <button
                      onClick={() => setPeriod("monthly")}
                      className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                        period === "monthly"
                          ? "bg-primary text-primary-foreground"
                          : "text-white hover:text-foreground"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setPeriod("annual")}
                      className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                        period === "annual"
                          ? "bg-primary text-primary-foreground"
                          : "text-white hover:text-foreground"
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                  <button onClick={onClose} className="text-white hover:text-foreground transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isLoading = loadingPlan === plan.name;
                  return (
                    <div
                      key={plan.name}
                      className={`relative p-6 rounded-xl border transition-colors ${
                        plan.highlight
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card/50 hover:border-primary/20"
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-body font-semibold rounded-full">
                          Most Popular
                        </div>
                      )}
                      <Icon className="w-6 h-6 text-primary mb-3" />
                      <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-1">
                        <span className="font-display text-3xl font-bold text-gradient-lavender">{plan.price}</span>
                        <span className="text-sm text-white font-body">{plan.period}</span>
                      </div>
                      <p className="text-xs text-white font-body mb-5">{plan.note}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm font-body text-foreground">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleCheckout(plan.priceId, plan.name)}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full text-sm font-body font-bold tracking-wide transition-all disabled:opacity-60 ${
                          plan.highlight
                            ? "text-gradient-chrome-animated bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_24px_-4px_hsl(260_85%_75%/0.5)] hover:shadow-[0_0_32px_-2px_hsl(260_85%_75%/0.6)]"
                            : "btn-chrome-outline hover:shadow-[0_0_20px_-4px_hsl(260_85%_75%/0.3)]"
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          <span className={plan.highlight ? "" : "text-gradient-chrome-animated"}>{plan.cta}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pay-per-use */}
              <div className="p-5 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-semibold text-foreground">Pay-Per-Use</h3>
                </div>
                <p className="text-sm text-white font-body mb-3">
                  Not ready for a subscription? Use our flexible pay-as-you-go option.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "advanced_search", label: "$0.99 per advanced search", ...PAY_PER_USE.advanced_search },
                    { key: "paper_bundle", label: "$2.99 per paper bundle", ...PAY_PER_USE.paper_bundle },
                    { key: "premium_10", label: "10 premium searches for $5", ...PAY_PER_USE.premium_searches_10 },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handlePayPerUse(item.price_id, item.key)}
                      disabled={loadingPlan === item.key}
                      className={`px-4 py-2 rounded-lg border text-sm font-body text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60 ${
                        item.key === "premium_10"
                          ? "border-primary/20 bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      {loadingPlan === item.key ? (
                        <Loader2 className="w-4 h-4 animate-spin inline" />
                      ) : (
                        item.label
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;
