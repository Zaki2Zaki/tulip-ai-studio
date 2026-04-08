import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

interface EntryScreenProps {
  onNext: () => void;
}

const OPTIONS = [
  {
    id: "a" as const,
    title: "Benchmark AI tools in my pipeline",
    description:
      "Compare tools by pipeline stage. See what integrates with your stack and what delivers the fastest return on your specific workflow.",
    roles: ["Technical Artist", "Pipeline TD", "VFX Supervisor"],
    comingSoon: true,
    borderColor: "rgba(29,158,117,0.5)",
    tagBg: "rgba(29,158,117,0.12)",
    tagColor: "rgb(52,211,153)",
  },
  {
    id: "b" as const,
    title: "Find where my studio is losing time",
    description:
      "Map the bottlenecks slowing your production. Identify which pipeline stages are costing the most hours and where AI integration delivers the fastest recovery.",
    roles: ["Producer", "Art Director", "Development Director"],
    comingSoon: true,
    borderColor: "rgba(186,117,23,0.5)",
    tagBg: "rgba(186,117,23,0.12)",
    tagColor: "rgb(251,191,36)",
  },
  {
    id: "c" as const,
    title:
      "Understand how AI reshapes our competitive position — and what it costs to fall behind",
    description:
      "Five questions about your studio. A risk scan and ROI model built from published data across studios your size — your efficiency gap, the annual cost of inaction, and what recovery looks like at your scale.",
    roles: ["VP", "CTO", "Studio Head", "CSO"],
    comingSoon: false,
    borderColor: "rgba(127,119,221,0.5)",
    tagBg: "rgba(127,119,221,0.15)",
    tagColor: "rgb(167,139,250)",
  },
] as const;

type OptionId = "a" | "b" | "c";

export default function EntryScreen({ onNext }: EntryScreenProps) {
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState<Set<OptionId>>(new Set());

  const handleCTA = () => {
    if (!selected) return;
    if (selected === "c") {
      onNext();
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitEmail = () => {
    if (!email.trim()) return;
    if (selected && selected !== "c") {
      setNotified((prev) => new Set(prev).add(selected));
    }
    setShowModal(false);
    setEmail("");
  };

  const ctaLabel =
    !selected
      ? "Select a path"
      : selected === "c"
      ? "Start Briefing"
      : "Notify me when ready";

  return (
    <div className="max-w-2xl" style={{ color: "white", fontSize: "14px" }}>
      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold mb-3">
        Strategic Briefing
      </p>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Where do you want to start?
      </h2>
      <p className="text-[15px] text-white font-body mb-8 leading-relaxed">
        Three paths. Each one built for a different role and a different question.
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id;
          const confirmed = notified.has(opt.id as Exclude<OptionId, "c">);

          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className="w-full text-left px-4 py-4 rounded-xl transition-all"
              style={
                active
                  ? {
                      border: `2px solid ${opt.borderColor}`,
                      background: "hsl(0 0% 6%)",
                      borderRadius: "12px",
                    }
                  : {
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "hsl(0 0% 7%)",
                      borderRadius: "12px",
                    }
              }
            >
              <div className="flex items-start gap-3">
                {/* Radio */}
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    borderColor: active ? opt.tagColor : "#555",
                    background: active ? opt.tagColor : "transparent",
                  }}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-body font-semibold text-white mb-1 leading-snug">
                    {opt.title}
                  </p>
                  <p className="text-[13px] font-body text-white leading-relaxed mb-2">
                    {opt.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.roles.map((role) => (
                      <span
                        key={role}
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "99px",
                          background: opt.tagBg,
                          color: opt.tagColor,
                          border: `1px solid ${opt.borderColor}`,
                          fontFamily: "inherit",
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  {confirmed && (
                    <p
                      className="text-xs font-body mt-2"
                      style={{ color: opt.tagColor }}
                    >
                      Got it. We'll be in touch.
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        disabled={!selected}
        onClick={handleCTA}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {ctaLabel}
        {selected && <ArrowRight className="w-3.5 h-3.5" />}
      </button>

      {/* Email capture modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{
              background: "hsl(0 0% 8%)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-[10px] tracking-[0.2em] uppercase font-body font-semibold mb-1"
                  style={{ color: "#e9d5ff" }}
                >
                  Coming Soon
                </p>
                <p className="font-display text-base font-bold text-white">
                  We'll let you know when this path opens.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white transition-colors ml-3 shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitEmail()}
              className="w-full mb-3 px-4 py-2.5 rounded-xl text-sm font-body text-white placeholder:text-white/30 outline-none"
              style={{
                background: "hsl(0 0% 12%)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "14px",
              }}
              autoFocus
            />
            <button
              onClick={handleSubmitEmail}
              disabled={!email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Notify me <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
