import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Users, GraduationCap, CreditCard } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Student",
    icon: GraduationCap,
    price: "$5.99",
    period: "/month",
    note: "Requires .edu email",
    features: [
      "Unlimited searches",
      "Full paper access",
      "Save & organize papers",
      "Export citations",
    ],
    cta: "Start Student Plan",
    highlight: false,
  },
  {
    name: "Individual",
    icon: Zap,
    price: "$9.99",
    period: "/month",
    note: "or $99/year (save 17%)",
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
  },
  {
    name: "Team / Institution",
    icon: Users,
    price: "$19.99",
    period: "/user/month",
    note: "Min 5 users · Volume discounts available",
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
  },
];

const PricingModal = ({ open, onClose }: PricingModalProps) => {
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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-5xl md:w-[calc(100%-2rem)] z-50 bg-card border border-border rounded-2xl overflow-auto max-h-[90vh]"
          >
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Unlock <span className="text-gradient-lavender">Full Access</span>
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    Choose the plan that fits your research needs
                  </p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {plans.map((plan) => {
                  const Icon = plan.icon;
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
                        <span className="text-sm text-muted-foreground font-body">{plan.period}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mb-5">{plan.note}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm font-body text-foreground">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-3 rounded-full text-sm font-body font-bold tracking-wide transition-all ${
                          plan.highlight
                            ? "text-gradient-chrome-animated bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_24px_-4px_hsl(260_85%_75%/0.5)] hover:shadow-[0_0_32px_-2px_hsl(260_85%_75%/0.6)]"
                            : "btn-chrome-outline hover:shadow-[0_0_20px_-4px_hsl(260_85%_75%/0.3)]"
                        }`}
                      >
                        <span className={plan.highlight ? "" : "text-gradient-chrome-animated"}>{plan.cta}</span>
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
                <p className="text-sm text-muted-foreground font-body mb-3">
                  Not ready for a subscription? Use our flexible pay-as-you-go option.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-lg border border-border text-sm font-body text-foreground">
                    $0.99 per advanced search
                  </div>
                  <div className="px-4 py-2 rounded-lg border border-border text-sm font-body text-foreground">
                    $2.99 per paper bundle
                  </div>
                  <div className="px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 text-sm font-body text-foreground">
                    10 premium searches for $5
                  </div>
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
