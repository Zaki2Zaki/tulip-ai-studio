import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { getScenario, getTopRisks, getSources } from "./personalisationData";
import { TIERS } from "./ROIModel";

interface ExecutiveSummaryProps {
  studioScale: string;
  outputType: string;
  budgetRange: string;
  onBack: () => void;
}

const CALENDLY = "https://calendly.com/youki-harada/30min";

const ACCENT_LINK_STYLE = {
  background: "linear-gradient(90deg, #a78bfa, #c4b5fd, #e9d5ff)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const SECTION_HEADER = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  fontWeight: 700,
  background: "linear-gradient(90deg, #a78bfa, #c4b5fd, #e9d5ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "8px",
};

function buildPDF(
  studioScale: string,
  outputType: string,
  budgetRange: string,
  today: string
): string {
  const scenario = getScenario(studioScale, outputType);
  const topRisks = getTopRisks(studioScale, outputType);
  const recommendedTierId = scenario.getRecommendedTierId(budgetRange);
  const recommendedTier = TIERS.find((t) => t.id === recommendedTierId)!;
  const sources = getSources(studioScale, outputType);

  const riskRows = topRisks
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:13px">${r.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #222;text-align:center">
            <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;border:1px solid;${
              r.impact === "High"
                ? "color:#f87171;border-color:#f8717140;background:#f8717110"
                : "color:#fbbf24;border-color:#fbbf2440;background:#fbbf2410"
            }">${r.impact}</span>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:12px;color:#aaa">${r.exposure}</td>
        </tr>`
    )
    .join("");

  const metricRows = scenario.roiMetrics
    .map(
      (m) =>
        `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:13px;font-weight:600">${m.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:12px;color:#aaa">${m.detail.split(".")[0]}.</td>
      </tr>`
    )
    .join("");

  const sourceRows = sources
    .map(
      (s) =>
        `<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #1a1a1a">
          <div style="font-size:12px;font-weight:700;color:#fff">${s.num} ${s.org} — ${s.title}</div>
          ${s.description ? `<div style="font-size:11px;color:#aaa;margin-top:2px">${s.description}</div>` : ""}
          <a href="${s.url}" style="font-size:11px;color:#a78bfa;text-decoration:underline">→ source</a>
        </div>`
    )
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Tulip Pipeline Lab — Executive Summary</title>
    <style>
      body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:40px;max-width:820px;margin:auto}
      h1{font-size:24px;margin:0 0 4px;letter-spacing:-0.02em}
      .sub{font-size:12px;color:#555;text-transform:uppercase;letter-spacing:.1em;margin-bottom:32px}
      h3{font-size:14px;font-weight:700;margin:28px 0 8px;background:linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-transform:uppercase;letter-spacing:.08em}
      table{width:100%;border-collapse:collapse;margin-bottom:8px}
      th{text-align:left;padding:8px 12px;border-bottom:2px solid #222;font-size:11px;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .snapshot{font-size:14px;color:#ccc;padding:12px 16px;border:1px solid #222;border-radius:8px;margin-bottom:8px}
      .tier-box{border:1px solid #a78bfa55;border-radius:8px;padding:14px 18px;margin-bottom:8px;background:#0f0f14}
      .tier-price{font-size:18px;font-weight:700;margin:4px 0}
      .competitive{font-size:13px;color:#ccc;line-height:1.6;padding:12px 16px;border:1px solid #222;border-radius:8px;margin-bottom:8px}
      .next-step{font-size:13px;color:#ccc;line-height:1.6;padding:12px 16px;border:1px solid #333;border-radius:8px;margin-bottom:8px}
      .calendly-link{background:linear-gradient(90deg,#a78bfa,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:600;text-decoration:none}
      footer{margin-top:32px;font-size:10px;color:#444;border-top:1px solid #1a1a1a;padding-top:16px}
      @media print{
        body{background:#fff;color:#000}
        .snapshot,.competitive,.next-step{border-color:#ddd;background:#fafafa;color:#333}
        .tier-box{border-color:#a78bfa;background:#f9f5ff}
        footer{color:#999;border-color:#ddd}
      }
    </style>
  </head><body>
    <h1>Tulip Pipeline Lab™ — Executive Summary</h1>
    <div class="sub">Prepared ${today} · Confidential</div>

    <h3>Studio Snapshot</h3>
    <div class="snapshot">${studioScale} · ${outputType} · ${budgetRange}</div>

    <h3>Top Pipeline Cost Risks</h3>
    <table>
      <thead><tr><th>Risk</th><th>Impact</th><th>Estimated Exposure</th></tr></thead>
      <tbody>${riskRows}</tbody>
    </table>

    <h3>ROI Model Summary</h3>
    <table>
      <thead><tr><th>Metric</th><th>Headline Finding</th></tr></thead>
      <tbody>${metricRows}</tbody>
    </table>

    <h3>Recommended Investment Tier</h3>
    <div class="tier-box">
      <strong>${recommendedTier.name}</strong>
      <div class="tier-price">${recommendedTier.price}</div>
      <div style="font-size:12px;color:#aaa">${recommendedTier.detail}</div>
    </div>

    <h3>Competitive Positioning</h3>
    <div class="competitive">${scenario.competitivePositioning}</div>

    <h3>Recommended Next Step</h3>
    <div class="next-step">
      Book a 30-minute strategic briefing. We will validate these numbers against your actual pipeline
      and give you a phased roadmap your team can act on.<br><br>
      <a href="${CALENDLY}" class="calendly-link">Book Now → calendly.com/youki-harada/30min</a>
    </div>

    <h3>Research Sources</h3>
    ${sourceRows}

    <footer>
      Based on published research. Results vary by studio size and pipeline maturity.<br>
      Generated by Tulip Technology R&D™ — tuliptechnology.ca
    </footer>
  </body></html>`;
}

export default function ExecutiveSummary({
  studioScale,
  outputType,
  budgetRange,
  onBack,
}: ExecutiveSummaryProps) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const today = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scenario = getScenario(studioScale, outputType);
  const topRisks = getTopRisks(studioScale, outputType);
  const recommendedTierId = scenario.getRecommendedTierId(budgetRange);
  const recommendedTier = TIERS.find((t) => t.id === recommendedTierId)!;
  const sources = getSources(studioScale, outputType);

  const handleDownloadPDF = () => {
    const html = buildPDF(studioScale, outputType, budgetRange, today);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      w.addEventListener("load", () => {
        w.focus();
        w.print();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleSendEmail = () => {
    if (!emailInput.trim()) return;
    const subject = encodeURIComponent("Tulip Pipeline Lab — Executive Summary");
    const body = encodeURIComponent(
      `Tulip Pipeline Lab™ Executive Summary\nPrepared ${today}\n\n` +
      `Studio: ${studioScale} · ${outputType} · ${budgetRange}\n\n` +
      `Top Risks:\n${topRisks.map((r) => `• ${r.title} [${r.impact}]`).join("\n")}\n\n` +
      `Recommended Tier: ${recommendedTier.name} — ${recommendedTier.price}\n\n` +
      `Book a strategic briefing: ${CALENDLY}`
    );
    window.location.href = `mailto:${emailInput}?subject=${subject}&body=${body}`;
    setEmailSent(true);
    setTimeout(() => {
      setEmailModalOpen(false);
      setEmailSent(false);
      setEmailInput("");
    }, 2000);
  };

  return (
    <div className="max-w-2xl">
      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-semibold mb-3">
        Executive Summary
      </p>
      <h2
        className="font-display text-2xl md:text-3xl font-bold text-white mb-1"
        style={{ letterSpacing: "-0.02em" }}
      >
        Your pipeline risk and investment brief.
      </h2>
      <p className="text-sm text-white font-body mb-6">
        Prepared {today}. Ready to share with your leadership team.
      </p>

      {/* Summary Preview Card */}
      <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden mb-6">

        {/* Section 1 — Studio Snapshot */}
        <div className="px-5 py-4 border-b border-border/20">
          <p style={SECTION_HEADER}>Studio Snapshot</p>
          <p className="text-sm font-body text-white">
            {studioScale} · {outputType} · {budgetRange}
          </p>
        </div>

        {/* Section 2 — Top Pipeline Cost Risks */}
        <div className="px-5 py-4 border-b border-border/20">
          <p style={SECTION_HEADER}>Top Pipeline Cost Risks</p>
          <div className="space-y-2">
            {topRisks.map((risk) => (
              <div key={risk.id} className="flex items-start justify-between gap-3">
                <span className="text-sm font-body text-white flex-1">{risk.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      risk.impact === "High"
                        ? "text-red-400 bg-red-400/15 border-red-400/30"
                        : "text-amber-400 bg-amber-400/15 border-amber-400/30"
                    }`}
                  >
                    {risk.impact}
                  </span>
                  <span className="text-xs font-body text-white/40">{risk.exposure}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — ROI Model Summary */}
        <div className="px-5 py-4 border-b border-border/20">
          <p style={SECTION_HEADER}>ROI Model Summary</p>
          <div className="space-y-2">
            {scenario.roiMetrics.map((m) => (
              <div key={m.name} className="flex items-start gap-2">
                <span className="text-white/30 shrink-0 mt-0.5">→</span>
                <span className="text-sm font-body text-white">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 — Recommended Investment Tier */}
        <div className="px-5 py-4 border-b border-border/20">
          <p style={SECTION_HEADER}>Recommended Investment Tier</p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-display font-bold text-white mr-2">
                {recommendedTier.name}
              </span>
              <span className="text-xs font-body text-white">
                {recommendedTier.detail.split("Payback")[1]
                  ? "Payback" + recommendedTier.detail.split("Payback")[1]
                  : ""}
              </span>
            </div>
            <span className="text-sm font-display font-bold text-white shrink-0">
              {recommendedTier.price}
            </span>
          </div>
        </div>

        {/* Section 5 — Competitive Positioning */}
        <div className="px-5 py-4 border-b border-border/20">
          <p style={SECTION_HEADER}>Competitive Positioning</p>
          <p className="text-sm font-body text-white/80 leading-relaxed">
            {scenario.competitivePositioning}
          </p>
        </div>

        {/* Section 6 — Recommended Next Step */}
        <div className="px-5 py-4">
          <p style={SECTION_HEADER}>Recommended Next Step</p>
          <p className="text-sm font-body text-white/80 leading-relaxed mb-2">
            Book a 30-minute strategic briefing. We will validate these numbers against your actual
            pipeline and give you a phased roadmap your team can act on.
          </p>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-body font-semibold"
            style={ACCENT_LINK_STYLE}
          >
            Book Now → calendly.com/youki-harada/30min
          </a>
        </div>
      </div>

      {/* Three CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Book a Strategic Briefing <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </button>
        <button
          onClick={() => setEmailModalOpen(true)}
          className="inline-flex items-center gap-2 btn-chrome-outline px-5 py-2.5 rounded-full font-display font-semibold text-sm transition-all min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          Email to My Team
        </button>
      </div>

      <button
        onClick={onBack}
        className="text-xs text-white/40 hover:text-white font-body transition-colors flex items-center gap-1 mb-8"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to ROI Model
      </button>

      {/* Research Sources */}
      <div className="rounded-2xl border border-border/30 bg-card/30 px-5 py-5">
        <p
          className="font-body font-semibold mb-4"
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            background: "linear-gradient(90deg, #a78bfa, #c4b5fd, #e9d5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Research Sources
        </p>
        <div>
          {sources.map((s, i) => (
            <div key={i}>
              {i > 0 && <hr className="border-border/20 my-3" />}
              <div>
                <p className="text-sm font-body text-white leading-snug">
                  <span className="font-bold">{s.num}</span>
                  {" "}
                  <span className="font-bold">{s.org}</span>
                  {" — "}
                  <span>{s.title}</span>
                </p>
                {s.description && (
                  <p className="text-sm font-body text-white/80 mt-0.5 leading-snug">{s.description}</p>
                )}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-body underline underline-offset-2 mt-0.5 inline-block"
                  style={ACCENT_LINK_STYLE}
                >
                  → source
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-border/40 bg-card p-6 relative">
            <button
              onClick={() => { setEmailModalOpen(false); setEmailSent(false); setEmailInput(""); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-display font-bold text-white mb-1">
              Send this brief to your team
            </p>
            <p className="text-xs font-body text-white/50 mb-4">
              Opens your email client with the brief pre-filled.
            </p>
            {emailSent ? (
              <p className="text-sm font-body text-green-400 py-2">Sent. Check your inbox.</p>
            ) : (
              <>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="teammate@studio.com"
                  className="w-full bg-secondary border border-border/40 rounded-lg px-3 py-2 text-sm font-body text-white placeholder:text-white/40 focus:outline-none focus:border-primary mb-3"
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                />
                <button
                  disabled={!emailInput.trim()}
                  onClick={handleSendEmail}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Send Brief
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
