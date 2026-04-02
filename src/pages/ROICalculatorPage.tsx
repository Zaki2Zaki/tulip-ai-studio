import { useState, useEffect } from "react";
import "./ROICalculatorPage.css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RowData {
  label: string;
  before: number;
  save: number;
  desc: string;
}

interface TakeawayItem {
  label: string;
  labelClass: string;
  text: string; // may contain <strong> HTML
}

interface Results {
  studioSummary: string;
  date: string;
  budget: number;
  budgetAfter: number;
  totalSave: number;
  savePctNum: number;
  tier: string;
  tierPrice: string;
  tierPayback: string;
  midInvest: number;
  roi: number;
  reworkCost: number;
  reworkAfter: number;
  artCost: number;
  artAfter: number;
  outsourceSave: number;
  timeBefore: number;
  timeAfter: number;
  timeSavePct: number;
  rows: RowData[];
  takeaways: TakeawayItem[];
  maturityNote: string;
  rdOffsetMsg: string; // may contain <strong> HTML
  topPain: string;
  secondPain: string;
  painPointLabels: string[];
  aiUsage: string;
  rdBudgetPct: string;
  rdCurrentSpend: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

type Currency = "USD" | "CAD" | "EUR";
const RATES: Record<Currency, number> = { USD: 1, CAD: 1.36, EUR: 0.92 };
const SYMBOLS: Record<Currency, string> = { USD: "$", CAD: "CA$", EUR: "€" };

const FACTORS: Record<string, { label: string; desc: string; artReduction?: number; reworkRed?: number; engRed?: number; qaRed?: number; timeRed?: number }> = {
  texturing:  { label: "Texturing and rigging",      artReduction: 0.38, desc: "AI generation and automation" },
  rework:     { label: "Rework and revision cycles",  reworkRed: 0.45,   desc: "Structured review pipelines" },
  handoff:    { label: "Team handoffs",               timeRed: 0.25,     desc: "Automated trigger workflows" },
  qa:         { label: "QA and testing",              qaRed: 0.40,       desc: "AI-driven test coverage" },
  concept:    { label: "Concept iteration",           artReduction: 0.30, desc: "Rapid AI-assisted ideation" },
  versioning: { label: "Version control",             reworkRed: 0.20,   desc: "Pipeline observability layer" },
  outsource:  { label: "Outsource coordination",      artReduction: 0.35, desc: "Reduced outsource dependency" },
  render:     { label: "Render and compute",          engRed: 0.20,      desc: "Optimised pipeline submission" },
};

const TYPE_LABELS: Record<string, string> = {
  indie: "Indie studio", aa: "AA studio", aaa: "AAA studio",
  animation: "3D Animation studio", vfx: "VFX studio",
};
const TEAM_LABELS: Record<string, string> = {
  "5": "2 to 10 people", "25": "11 to 50 people", "100": "51 to 200 people",
  "350": "201 to 500 people", "750": "500+ people",
};
const BUDGET_LABELS: Record<string, string> = {
  "175000": "Under $500K", "750000": "$500K to $1M", "2500000": "$1M to $5M",
  "10000000": "$5M to $20M", "40000000": "$20M to $80M", "120000000": "$80M to $200M",
};
const REWORK_LABELS: Record<string, string> = {
  "2": "1 to 2 cycles", "4": "3 to 5 cycles", "8": "6 to 10 cycles", "14": "10+ cycles",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ROICalculatorPage() {
  // Navigation
  const [step, setStep] = useState(1);

  // Step 1
  const [studioType, setStudioType]       = useState("");
  const [teamSize, setTeamSize]           = useState("");
  const [budgetRangeVal, setBudgetRangeVal] = useState("");
  const [budgetExactVal, setBudgetExactVal] = useState("");
  const [outsourcePct, setOutsourcePct]   = useState("0.20");
  const [rdBudget, setRdBudget]           = useState("0.07");

  // Step 2
  const [artPct, setArtPct]               = useState(35);
  const [engPct, setEngPct]               = useState(25);
  const [qaPct, setQaPct]                 = useState(12);
  const [reworkCycles, setReworkCycles]   = useState("4");
  const [deliveryTime, setDeliveryTime]   = useState("12");
  const [aiUsage, setAiUsage]             = useState("experimental");
  const [touchedSliders, setTouchedSliders] = useState<Set<string>>(new Set());

  // Step 3
  const [painPoints, setPainPoints]       = useState<string[]>(["texturing", "rework"]);
  const [biggestPain, setBiggestPain]     = useState("");

  // Currency
  const [activeCurrency, setActiveCurrency] = useState<Currency>("USD");

  // Results
  const [results, setResults]             = useState<Results | null>(null);
  const [methOpen, setMethOpen]           = useState(false);

  // Takeaway animation
  const [visibleTakeaways, setVisibleTakeaways] = useState<Set<number>>(new Set());
  const [maturityVisible, setMaturityVisible]   = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!results) return;
    setVisibleTakeaways(new Set());
    setMaturityVisible(false);
    const timers = results.takeaways.map((_, i) =>
      setTimeout(() => setVisibleTakeaways((prev) => new Set([...prev, i])), 120 + i * 140)
    );
    const matTimer = setTimeout(
      () => setMaturityVisible(true),
      120 + results.takeaways.length * 140 + 200
    );
    return () => { timers.forEach(clearTimeout); clearTimeout(matTimer); };
  }, [results]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const fmtC = (usdAmount: number) => {
    const v = usdAmount * RATES[activeCurrency];
    const sym = SYMBOLS[activeCurrency];
    if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + "M";
    return sym + Math.round(v / 1000).toLocaleString() + "K";
  };

  const fmtUSD = (v: number) => {
    if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
    return "$" + Math.round(v / 1000).toLocaleString() + "K";
  };

  const getBudget = (): number | null => {
    if (!budgetRangeVal) return null;
    if (budgetRangeVal === "custom") {
      const v = Number(budgetExactVal);
      return v >= 50000 ? v : null;
    }
    return Number(budgetRangeVal);
  };

  const validateStep1 = () => {
    if (!studioType)  { alert("Please select a studio type.");                              return false; }
    if (!teamSize)    { alert("Please select a team size.");                                return false; }
    if (!getBudget()) { alert("Please select or enter your annual production budget.");     return false; }
    return true;
  };

  const goStep = (n: number) => {
    if (n === 2 && !validateStep1()) return;
    setStep(n);
  };

  const togglePainPoint = (key: string) =>
    setPainPoints((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const touchSlider = (id: string) =>
    setTouchedSliders((prev) => new Set([...prev, id]));

  // ── Calculate ────────────────────────────────────────────────────────────────

  const calculate = () => {
    const budget = getBudget();
    if (!budget) return;

    const artPctF       = artPct / 100;
    const engPctF       = engPct / 100;
    const qaPctF        = qaPct / 100;
    const reworkCyc     = Number(reworkCycles);
    const delivMths     = Number(deliveryTime);
    const outsourcePctF = Number(outsourcePct);

    const artCost       = budget * artPctF;
    const engCost       = budget * engPctF;
    const qaCost        = budget * qaPctF;
    const outsourceCost = budget * outsourcePctF;
    const reworkCost    = budget * (reworkCyc / 100) * 0.6;
    const rdCurrentSpend = rdBudget === "none" ? 0 : budget * Number(rdBudget);

    const maturityMult = ({ none: 1.0, experimental: 0.85, partial: 0.65, governed: 0.3 } as Record<string, number>)[aiUsage] ?? 0.85;

    let artSave = 0, qaSave = 0, reworkSave = 0, outsourceSave = 0, timeSavePct = 0;
    const rows: RowData[] = [];

    if (painPoints.length > 0) {
      painPoints.forEach((pid) => {
        const f = FACTORS[pid];
        if (!f) return;
        const ar  = (f.artReduction ?? 0) * maturityMult;
        const rr  = (f.reworkRed    ?? 0) * maturityMult;
        const er  = (f.engRed       ?? 0) * maturityMult;
        const qr  = (f.qaRed        ?? 0) * maturityMult;
        const tr  = (f.timeRed      ?? 0) * maturityMult;
        const or_ = pid === "outsource" ? 0.35 * maturityMult : 0;

        const base =
          pid === "rework"    ? reworkCost    :
          pid === "qa"        ? qaCost        :
          pid === "outsource" ? outsourceCost :
          pid === "render"    ? engCost       :
          artCost;

        const save = Math.round(base * (ar + rr + er + qr + or_));
        artSave       += artCost * ar + engCost * er;
        reworkSave    += reworkCost * rr;
        qaSave        += qaCost * qr;
        outsourceSave += outsourceCost * or_;
        timeSavePct   += tr;
        rows.push({ label: f.label, before: base, save, desc: f.desc });
      });
    } else {
      artSave       = artCost * 0.32 * maturityMult;
      reworkSave    = reworkCost * 0.40 * maturityMult;
      qaSave        = qaCost * 0.35 * maturityMult;
      outsourceSave = outsourceCost * 0.25 * maturityMult;
      timeSavePct   = 0.20 * maturityMult;
    }

    const totalSave   = Math.round(artSave + reworkSave + qaSave + outsourceSave);
    const budgetAfter = budget - totalSave;
    const artAfter    = Math.max(artCost - artSave, 0);
    const reworkAfter = Math.max(reworkCost - reworkSave, 0);
    const timeAfter   = delivMths * (1 - Math.min(timeSavePct, 0.45));
    const savePctNum  = Math.round((totalSave / budget) * 100);

    let tier: string, tierPrice: string, tierPayback: string, midInvest: number;
    if (budget < 1_000_000) {
      tier = "Starter";    tierPrice = "$15K to $45K";   tierPayback = "2 to 4 months";  midInvest = 30000;
    } else if (budget < 20_000_000) {
      tier = "Studio";     tierPrice = "$45K to $165K";  tierPayback = "4 to 8 months";  midInvest = 105000;
    } else {
      tier = "Enterprise"; tierPrice = "$165K to $395K"; tierPayback = "6 to 12 months"; midInvest = 280000;
    }

    const roi = Math.round((totalSave / midInvest) * 10) / 10;

    const typeLabel   = TYPE_LABELS[studioType] || studioType;
    const budgetLabel = budgetRangeVal === "custom"
      ? fmtUSD(budget)
      : (BUDGET_LABELS[budgetRangeVal] || budgetRangeVal);
    const studioSummary = `${typeLabel} · ${TEAM_LABELS[teamSize] || teamSize} · ${budgetLabel} annual budget`;

    const rdOffsetMsg = rdBudget === "none"
      ? `You have no dedicated pipeline or R&D budget. The estimated efficiency opportunity of <strong>${fmtUSD(totalSave)}</strong> is approximately <strong>${Math.round(totalSave / midInvest)}× the indicative cost</strong> of a Tulip ${tier} engagement. Subject to pipeline validation, this suggests the engagement may be offset by recoverable spend rather than requiring a new budget allocation.`
      : `Your current pipeline investment of approximately <strong>${fmtUSD(rdCurrentSpend)}</strong> is a starting point. A structured Tulip engagement is designed to return measurably more than it costs — the indicative return of <strong>${roi}×</strong> is based on benchmarks from comparable studios and would be validated before commitment.`;

    const outsourceFrame =
      outsourcePctF === 0    ? "minimal outsourcing" :
      outsourcePctF <= 0.20  ? "a modest outsource footprint" :
      outsourcePctF <= 0.40  ? "a meaningful outsource footprint" :
      "a significant outsource footprint";
    const outsourceCostStr = outsourceCost > 0
      ? ` Outsource coordination accounts for approximately ${fmtUSD(outsourceCost)} of current spend.`
      : "";
    const deliveryFrame =
      Number(deliveryTime) <= 6  ? "fast cycle production" :
      Number(deliveryTime) <= 18 ? "a standard production cycle" :
      "a long form production schedule";

    const rdFrameShort = rdBudget === "none"
      ? `No dedicated pipeline budget is allocated. Based on benchmarks, the ${fmtUSD(totalSave)} efficiency opportunity is approximately ${Math.round(totalSave / midInvest)}x the indicative cost of a Tulip ${tier} engagement, suggesting the investment may be self-offsetting subject to validation.`
      : `An existing pipeline investment of approximately ${fmtUSD(rdCurrentSpend)} is in place. A Tulip engagement is structured to return measurably more than it costs, with an indicative return of ${roi}x validated against your actual pipeline before commitment.`;

    const topPain = painPoints.length > 0
      ? (FACTORS[painPoints[0]]?.label?.toLowerCase() ?? "art and asset production")
      : "art and asset production";
    const secondPain = painPoints.length > 1
      ? (FACTORS[painPoints[1]]?.label?.toLowerCase() ?? "rework and revision cycles")
      : "rework and revision cycles";

    const painReadShort: Record<string, string> = {
      texturing:  `Art and asset production represents ${Math.round(artPctF * 100)}% of your budget and contains the largest single recoverable cost. AI-assisted texture automation at comparable studios indicates a 30 to 40% reduction is achievable, subject to validation.`,
      rework:     `Rework cycles are the most consistent source of hidden cost at your scale. With ${REWORK_LABELS[reworkCycles]}, the estimated annual rework exposure is ${fmtUSD(reworkCost)}. Structured review pipelines typically recover 35 to 45% of this.`,
      handoff:    `Slow handoffs compound throughout ${deliveryFrame}. Automated trigger workflows replacing manual notification chains have shown 15 to 25% delivery time improvements at comparable studios.`,
      qa:         `QA bottlenecks create disproportionate cost pressure near delivery dates. AI-driven test coverage has shown 30 to 40% reductions in QA cycle time, freeing the team for judgment-based quality assessment.`,
      concept:    `Slow concept iteration is typically where schedule compression becomes schedule extension. AI-assisted ideation reduces time from brief to first-pass options from days to hours.`,
      versioning: `Version control issues create invisible rework, work completed twice because asset state was unclear. A pipeline observability layer addresses this category of cost quickly and is one of the faster wins in a Tulip engagement.`,
      outsource:  `With ${outsourceFrame}${outsourceCostStr} the brief to delivery loop is likely the most variable cost. Structured briefs and automated handoff layers have shown 25 to 35% reductions in outsource coordination overhead.`,
      render:     `Render and compute costs are recoverable through pre-submission validation, catching simulation errors before farm submission rather than after a full render. This is one of the highest-return interventions for simulation-heavy pipelines.`,
    };

    const maturityNote = ({
      none:         `This studio has no AI tools currently in place. The full benchmark opportunity applies but so does the integration work. Tulip structures this as a phased engagement to avoid disrupting production while the pipeline is being rebuilt.`,
      experimental: `Studios using AI experimentally without a governing strategy consistently show the largest gap between AI spend and AI return. The tools are in place but the architecture connecting them is not. That is precisely where a Tulip engagement begins.`,
      partial:      `With AI integrated in some workflows but not governed end to end, the efficiency gap is more targeted. The indicative opportunity of ${fmtUSD(totalSave)} reflects the specific stages where ungoverned tool use is creating inconsistency and rework rather than eliminating it.`,
      governed:     `With a governed pipeline already in place, the remaining opportunity of ${fmtUSD(totalSave)} is concentrated in the handoff and validation layers rather than generation. A Tulip engagement at this maturity level optimises what is already working rather than rebuilding it.`,
    } as Record<string, string>)[aiUsage] ?? "";

    const mainPainText = painReadShort[painPoints[0]]
      || `This ${typeLabel.toLowerCase()} with ${outsourceFrame} and ${aiUsage === "none" ? "no AI tools currently in place" : aiUsage === "experimental" ? "AI tools used experimentally without an integration strategy" : aiUsage === "partial" ? "AI integrated in some workflows but not governed end to end" : "a governed AI pipeline already in place"} carries an estimated ${fmtUSD(totalSave)} in recoverable efficiency opportunity across ${topPain} and ${secondPain}, based on benchmarks from comparable studios.`;

    const takeaways: TakeawayItem[] = [
      { label: "Largest cost",    labelClass: "red",  text: mainPainText },
      { label: "Opportunity",     labelClass: "grn",  text: `The estimated annual efficiency opportunity is <strong>${fmtUSD(totalSave)}</strong>, representing ${savePctNum}% of the current production budget. The two highest-impact areas based on your inputs are ${topPain}${painPoints.length > 1 ? ` and ${secondPain}` : ""}.` },
      { label: "How Tulip works", labelClass: "cyan", text: `A Tulip engagement starts with a workflow audit of your specific pipeline, not a generic AI tool recommendation. The highest-recovery stages are restructured first within a scoped sprint using your actual assets, so the efficiency gain is measured before any broader integration is committed to.` },
      { label: "Investment case", labelClass: "lav",  text: rdFrameShort },
      { label: "Delivery",        labelClass: "amb",  text: `The indicative return of <strong>${roi}x in year one</strong> is benchmarked against the ${tier} engagement range of ${tierPrice}. Recovered capital of ${fmtUSD(totalSave)} could fund additional production capacity, accelerate IP development, or reduce outsource dependency.` },
    ];

    const defaultRows: RowData[] = [
      { label: "Art and asset pipeline", before: artCost,       save: artSave,       desc: "AI generation and texture automation" },
      { label: "Rework and revisions",   before: reworkCost,    save: reworkSave,    desc: "Structured review pipelines" },
      { label: "QA and testing",         before: qaCost,        save: qaSave,        desc: "AI-driven test coverage" },
      { label: "Outsource coordination", before: outsourceCost, save: outsourceSave, desc: "Automated brief and handoff layer" },
    ].filter((r) => r.save > 0);

    setResults({
      studioSummary,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      budget, budgetAfter, totalSave, savePctNum,
      tier, tierPrice, tierPayback, midInvest, roi,
      reworkCost, reworkAfter, artCost, artAfter, outsourceSave,
      timeBefore: delivMths, timeAfter: Math.round(timeAfter),
      timeSavePct: Math.round(timeSavePct * 100),
      rows: rows.length > 0 ? rows.filter((r) => r.save > 0) : defaultRows,
      takeaways, maturityNote, rdOffsetMsg,
      topPain, secondPain,
      painPointLabels: painPoints.map((p) => FACTORS[p]?.label ?? p),
      aiUsage, rdBudgetPct: rdBudget, rdCurrentSpend,
    });

    setStep(4);
  };

  // ── PDF Download ──────────────────────────────────────────────────────────────

  const downloadPDF = async () => {
    if (!results) { alert("Please generate your efficiency model first before downloading."); return; }
    let jsPDF: typeof import("jspdf")["default"];
    try {
      const mod = await import("jspdf");
      jsPDF = mod.default;
    } catch {
      alert("PDF generation requires jspdf. Please run: bun add jspdf");
      return;
    }

    const r   = results;
    const sym = SYMBOLS[activeCurrency];
    const rate = RATES[activeCurrency];
    const c = (n: number) => {
      const v = n * rate;
      if (v >= 1_000_000) return sym + (v / 1_000_000).toFixed(1) + "M";
      return sym + Math.round(v / 1000).toLocaleString() + "K";
    };

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, pad = 18;
    let y = 0;

    const BG    = [10,10,10]    as [number,number,number];
    const CARD  = [17,17,17]    as [number,number,number];
    const WHITE = [255,255,255] as [number,number,number];
    const CYAN  = [34,211,238]  as [number,number,number];
    const RED   = [248,113,113] as [number,number,number];
    const GRN   = [74,222,128]  as [number,number,number];
    const AMB   = [251,191,36]  as [number,number,number];
    const LAV   = [192,132,252] as [number,number,number];
    const DIM   = [160,160,160] as [number,number,number];
    const stops: [number,number,number][] = [[244,114,182],[192,132,252],[34,211,238],[45,212,191]];

    const drawPageBase = () => {
      doc.setFillColor(...BG); doc.rect(0,0,W,297,"F");
      stops.forEach((clr, i) => {
        doc.setFillColor(...clr);
        doc.rect(pad + i*(W-pad*2)/stops.length, 0, (W-pad*2)/stops.length+1, 3, "F");
      });
    };

    const addPage = () => { doc.addPage(); y = 20; };
    const checkY  = (needed = 20) => { if (y + needed > 270) addPage(); };

    // PAGE 1
    drawPageBase(); y = 32;
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...CYAN);
    doc.text("TULIP TECHNOLOGY R&D", pad, y); y += 7;
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...DIM);
    doc.text(`Prepared ${r.date}`, pad, y); y += 22;
    doc.setFont("helvetica","bold"); doc.setFontSize(26); doc.setTextColor(...WHITE);
    doc.text("Pipeline Efficiency", pad, y); y += 12;
    doc.setTextColor(...CYAN); doc.text("Opportunity Report", pad, y); y += 10;
    doc.setFillColor(...CYAN); doc.rect(pad, y, 24, 1.2, "F"); y += 10;
    doc.setFillColor(...CARD); doc.roundedRect(pad, y, W-pad*2, 14, 3, 3, "F");
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...DIM);
    doc.text("STUDIO", pad+5, y+5.5);
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...WHITE);
    doc.text(r.studioSummary, pad+5, y+10.5); y += 22;
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...DIM);
    doc.text("ESTIMATED ANNUAL EFFICIENCY OPPORTUNITY", pad, y); y += 8;
    doc.setFontSize(42); doc.setTextColor(...CYAN);
    doc.text(c(r.totalSave), pad, y); y += 6;
    doc.setFontSize(11); doc.setTextColor(...WHITE);
    doc.text(`${r.savePctNum}% of current production budget`, pad, y); y += 16;
    const metW = (W-pad*2-8)/2;
    ([[ `${r.roi}x`, "Indicative return in year one", LAV], [r.tierPayback, "Indicative payback period", GRN]] as [string,string,[number,number,number]][]).forEach(([val,lbl,clr], i) => {
      const bx = pad + i*(metW+8);
      doc.setFillColor(...CARD); doc.roundedRect(bx, y, metW, 22, 3, 3, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(...clr);
      doc.text(val, bx+5, y+13);
      doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...DIM);
      doc.text(lbl, bx+5, y+19);
    }); y += 32;
    doc.setFillColor(...CARD); doc.roundedRect(pad, y, W-pad*2, 18, 3, 3, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...CYAN);
    doc.text("RECOMMENDED ENGAGEMENT", pad+5, y+6);
    doc.setFontSize(13); doc.setTextColor(...WHITE);
    doc.text(`${r.tier}  ·  ${r.tierPrice}`, pad+5, y+13.5); y += 26;
    doc.setFont("helvetica","italic"); doc.setFontSize(7.5); doc.setTextColor(...DIM);
    doc.text(doc.splitTextToSize("This is an indicative pipeline efficiency model based on verified industry benchmarks. All figures are subject to validation against your actual pipeline.", W-pad*2), pad, y);

    // PAGE 2
    addPage(); drawPageBase();
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...CYAN);
    doc.text("PIPELINE EFFICIENCY OPPORTUNITY REPORT", pad, y); y += 10;
    doc.setFontSize(16); doc.setTextColor(...WHITE);
    doc.text("Before and After", pad, y); y += 10;
    const baW = (W-pad*2-8)/2;
    doc.setFillColor(40,10,10); doc.roundedRect(pad, y, baW, 9, 2, 2, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...RED);
    doc.text("CURRENT PIPELINE", pad+4, y+6);
    doc.setFillColor(10,30,15); doc.roundedRect(pad+baW+8, y, baW, 9, 2, 2, "F");
    doc.setTextColor(...GRN); doc.text("WITH AI PIPELINE", pad+baW+12, y+6); y += 12;
    ([
      ["Annual spend",      c(r.budget),       c(r.budgetAfter)],
      ["Rework cost",       c(r.reworkCost),   c(r.reworkAfter)],
      ["Art pipeline cost", c(r.artCost),      c(r.artAfter)],
      ["Delivery time",     r.timeBefore+"mo", r.timeAfter+"mo"],
    ] as [string,string,string][]).forEach(([lbl, before, after]) => {
      checkY(14);
      doc.setFillColor(...CARD); doc.roundedRect(pad, y, baW, 12, 2, 2, "F");
      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...DIM);
      doc.text(lbl.toUpperCase(), pad+4, y+5);
      doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...RED);
      doc.text(before, pad+4, y+10);
      doc.setFillColor(...CARD); doc.roundedRect(pad+baW+8, y, baW, 12, 2, 2, "F");
      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...DIM);
      doc.text(lbl.toUpperCase(), pad+baW+12, y+5);
      doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...GRN);
      doc.text(after, pad+baW+12, y+10);
      y += 15;
    });
    y += 6;
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...CYAN);
    doc.text("ESTIMATED EFFICIENCY OPPORTUNITY BY AREA", pad, y); y += 7;
    doc.setFillColor(20,40,45); doc.rect(pad, y, W-pad*2, 8, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(...CYAN);
    doc.text("AREA", pad+3, y+5.5);
    doc.text("CURRENT EST.", pad+82, y+5.5, { align: "right" });
    doc.text("WITH AI",       pad+112, y+5.5, { align: "right" });
    doc.text("OPPORTUNITY",   W-pad-2, y+5.5, { align: "right" }); y += 10;
    r.rows.forEach((row, idx) => {
      checkY(12);
      if (idx%2===0) { doc.setFillColor(20,20,20); doc.rect(pad, y-3, W-pad*2, 11, "F"); }
      const after = Math.max(row.before - row.save, 0);
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...WHITE);
      doc.text(row.label, pad+3, y+4);
      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...DIM);
      doc.text(row.desc, pad+3, y+8.5);
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.setTextColor(...RED);  doc.text(c(row.before),       pad+82,  y+5, { align: "right" });
      doc.setTextColor(...GRN);  doc.text(c(after),             pad+112, y+5, { align: "right" });
      doc.setTextColor(...CYAN); doc.text("↓ "+c(row.save),    W-pad-2, y+5, { align: "right" });
      y += 13;
    });

    // PAGE 3
    addPage(); drawPageBase();
    doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(...WHITE);
    doc.text("Pipeline Areas — Key Summary", pad, y); y += 12;
    ([
      ["LARGEST COST",    RED,  `Art and asset production and ${r.topPain} contain the primary recoverable costs based on your inputs.`],
      ["OPPORTUNITY",     GRN,  `Estimated annual efficiency opportunity of ${c(r.totalSave)}, representing ${r.savePctNum}% of current production budget. Top areas: ${r.topPain}${r.painPointLabels.length > 1 ? " and " + r.secondPain : ""}.`],
      ["HOW TULIP WORKS", CYAN, `A Tulip engagement starts with a workflow audit of your specific pipeline, not a generic AI tool recommendation. The highest-recovery stages are restructured first within a scoped sprint using your actual assets.`],
      ["INVESTMENT CASE", LAV,  r.rdBudgetPct === "none" ? `No dedicated pipeline budget. The ${c(r.totalSave)} opportunity is approximately ${Math.round(r.totalSave/r.midInvest)}x the indicative cost of a Tulip ${r.tier} engagement.` : `Existing pipeline investment of approximately ${c(r.rdCurrentSpend)}. Indicative return of ${r.roi}x based on benchmarks from comparable studios.`],
      ["DELIVERY",        AMB,  `Indicative return of ${r.roi}x in year one, benchmarked against the ${r.tier} engagement range of ${r.tierPrice}. Recovered capital could fund additional production capacity, accelerate IP development, or reduce outsource dependency.`],
    ] as [string,[number,number,number],string][]).forEach(([lbl, clr, text]) => {
      const lines = doc.splitTextToSize(text, W-pad*2-30);
      const rowH  = Math.max(16, lines.length*5+10);
      checkY(rowH+3);
      doc.setFillColor(...CARD); doc.roundedRect(pad, y, W-pad*2, rowH, 2, 2, "F");
      doc.setFillColor(...clr);  doc.roundedRect(pad, y, 3, rowH, 1, 1, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(...clr);
      doc.text(lbl, pad+7, y+6);
      doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...WHITE);
      doc.text(lines, pad+7, y+11.5);
      y += rowH+4;
    });
    y += 4; checkY(32);
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...CYAN);
    doc.text("RECOMMENDED INVESTMENT", pad, y); y += 8;
    doc.setFillColor(...CARD); doc.roundedRect(pad, y, W-pad*2, 22, 3, 3, "F");
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...DIM);
    doc.text(`${r.tier} Engagement`, pad+5, y+7);
    doc.setFont("helvetica","bold"); doc.setFontSize(15); doc.setTextColor(...WHITE);
    doc.text(r.tierPrice, pad+5, y+16);
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...GRN);
    doc.text("Indicative payback: "+r.tierPayback, W-pad-2, y+16, { align: "right" }); y += 30;
    checkY(24);
    doc.setFillColor(...CYAN); doc.roundedRect(pad, y, W-pad*2, 16, 3, 3, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...BG);
    doc.text("Validate in a 30-min 1:1 Brief", W/2, y+10, { align: "center" }); y += 20;
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...CYAN);
    doc.text("calendly.com/youki-harada/30min", W/2, y, { align: "center" }); y += 12;
    doc.setFont("helvetica","italic"); doc.setFontSize(7); doc.setTextColor(...DIM);
    doc.text(doc.splitTextToSize("This report is an indicative pipeline efficiency model, not a financial projection or guarantee of return. All figures are derived from published industry benchmarks and adjusted for the studio profile provided. Actual efficiency opportunity will be determined during a structured Tulip Technology R&D engagement.", W-pad*2), pad, y);

    doc.save(`Tulip-Pipeline-Efficiency-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // ── Render helpers ────────────────────────────────────────────────────────────

  const stepState = (n: number) => n === step ? "active" : n < step ? "done" : "";

  const tiers = [
    { name: "Starter",    price: "$15K to $45K",   rec: !results || results.budget < 1_000_000,                                 items: ["Pipeline audit and tool benchmarking", "Indie to mid-size studios", "Payback: 2 to 4 months"] },
    { name: "Studio",     price: "$45K to $165K",  rec: !!results && results.budget >= 1_000_000 && results.budget < 20_000_000, items: ["Full adoption, integration, workshops", "Mid-size to AAA studios", "Payback: 4 to 8 months"] },
    { name: "Enterprise", price: "$165K to $395K", rec: !!results && results.budget >= 20_000_000,                               items: ["Architecture blueprint and multi-studio rollout", "AAA to publisher scale", "Payback: 6 to 12 months"] },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="rc">
      <div className="page">

        {/* HEADER */}
        <div className="stage-row">
          <span className="stage-txt">Pipeline ROI Calculator</span>
          <span className="demo-pill">Interactive</span>
        </div>
        <h1>See exactly where <span className="grad">AI saves</span><br />your production budget.</h1>
        <div className="acc-bar" />
        <p className="h1-sub">Enter your studio's real numbers. We model the before and after — then show what a Tulip Technology R&amp;D engagement returns on that investment.</p>

        {/* STEP INDICATORS */}
        <div className="steps">
          {(["Studio profile","Pipeline costs","Pain points","Efficiency opportunity"] as string[]).map((lbl, i) => (
            <div key={i} className="step-item">
              <div className={`step-num ${stepState(i+1)}`}>
                <span className="sn-inner">{stepState(i+1) === "done" ? "✓" : i+1}</span>
              </div>
              <div className="step-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {/* ═══ STEP 1 — STUDIO PROFILE ═══ */}
        {step === 1 && (
          <div className="form-card">
            <div className="fc-title">Tell us about your studio</div>
            <div className="fc-hint">Your answers calibrate the model. All figures stay in your browser.</div>

            <div className="field-row">
              <div className="field">
                <label>Studio type</label>
                <select value={studioType} onChange={(e) => setStudioType(e.target.value)}>
                  <option value="">Select type</option>
                  <option value="indie">Indie studio</option>
                  <option value="aa">AA studio</option>
                  <option value="aaa">AAA studio</option>
                  <option value="animation">3D Animation studio</option>
                  <option value="vfx">VFX studio</option>
                </select>
              </div>
              <div className="field">
                <label>Team size</label>
                <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)}>
                  <option value="">Select range</option>
                  <option value="5">2 to 10 people</option>
                  <option value="25">11 to 50 people</option>
                  <option value="100">51 to 200 people</option>
                  <option value="350">201 to 500 people</option>
                  <option value="750">500+ people</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Annual production budget</label>
                <select value={budgetRangeVal} onChange={(e) => setBudgetRangeVal(e.target.value)}>
                  <option value="">Select range</option>
                  <option value="175000">Under $500K</option>
                  <option value="750000">$500K to $1M</option>
                  <option value="2500000">$1M to $5M</option>
                  <option value="10000000">$5M to $20M</option>
                  <option value="40000000">$20M to $80M</option>
                  <option value="120000000">$80M to $200M</option>
                  <option value="custom">Prefer to enter exact figure</option>
                </select>
                {budgetRangeVal === "custom" && (
                  <div className="prefix-wrap" style={{ marginTop: 8 }}>
                    <span className="pfx">$</span>
                    <input type="number" value={budgetExactVal} onChange={(e) => setBudgetExactVal(e.target.value)} placeholder="e.g. 2500000" min={50000} step={50000} />
                  </div>
                )}
              </div>
              <div className="field">
                <label>What percentage is outsourced?</label>
                <select value={outsourcePct} onChange={(e) => setOutsourcePct(e.target.value)}>
                  <option value="0">We do not outsource</option>
                  <option value="0.10">Under 20% outsourced</option>
                  <option value="0.20">20 to 40% outsourced</option>
                  <option value="0.40">40 to 60% outsourced</option>
                  <option value="0.60">Over 60% outsourced</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Pipeline or R&amp;D budget</label>
                <select value={rdBudget} onChange={(e) => setRdBudget(e.target.value)}>
                  <option value="none">No dedicated R&amp;D budget</option>
                  <option value="0.03">Under 3% of production</option>
                  <option value="0.07">3 to 10% of production</option>
                  <option value="0.12">Over 10% of production</option>
                </select>
              </div>
              <div className="field" style={{ alignSelf: "flex-end" }}>
                <div style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.18)", borderRadius: "var(--r8)", padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: 4 }}>Why this matters</div>
                  <div style={{ fontSize: 12, color: "var(--w)", lineHeight: 1.5 }}>37% of studios do not know their pipeline spend. If you have no R&amp;D budget, we model how savings fund the engagement from existing waste.</div>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => goStep(2)}>Continue → Pipeline costs</button>
          </div>
        )}

        {/* ═══ STEP 2 — PIPELINE COSTS ═══ */}
        {step === 2 && (
          <>
            <button className="btn-back" onClick={() => goStep(1)}>← Back</button>
            <div className="form-card">
              <div className="fc-title">How does your budget break down?</div>
              <div className="fc-hint">Approximate is fine. We use industry benchmarks to fill any gaps.</div>

              <div className="field-row">
                <div className="field">
                  <label>Art and asset creation (%)</label>
                  <div className="slider-wrap">
                    <div className={`slider-hint${touchedSliders.has("artPct") ? " hidden" : ""}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 4l4 3-4 3" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Drag to adjust
                    </div>
                    <div className="slider-val">{artPct}%</div>
                    <input type="range" min={5} max={70} value={artPct} onChange={(e) => { setArtPct(Number(e.target.value)); touchSlider("artPct"); }} />
                    <div className="slider-labels"><span>5%</span><span>70%</span></div>
                  </div>
                </div>
                <div className="field">
                  <label>Engineering and tech (%)</label>
                  <div className="slider-wrap">
                    <div className={`slider-hint${touchedSliders.has("engPct") ? " hidden" : ""}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 4l4 3-4 3" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Drag to adjust
                    </div>
                    <div className="slider-val">{engPct}%</div>
                    <input type="range" min={5} max={60} value={engPct} onChange={(e) => { setEngPct(Number(e.target.value)); touchSlider("engPct"); }} />
                    <div className="slider-labels"><span>5%</span><span>60%</span></div>
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>QA and testing (%)</label>
                  <div className="slider-wrap">
                    <div className={`slider-hint${touchedSliders.has("qaPct") ? " hidden" : ""}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 4l4 3-4 3" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Drag to adjust
                    </div>
                    <div className="slider-val">{qaPct}%</div>
                    <input type="range" min={2} max={30} value={qaPct} onChange={(e) => { setQaPct(Number(e.target.value)); touchSlider("qaPct"); }} />
                    <div className="slider-labels"><span>2%</span><span>30%</span></div>
                  </div>
                </div>
                <div className="field">
                  <label>How many rework or revision cycles per project?</label>
                  <select value={reworkCycles} onChange={(e) => setReworkCycles(e.target.value)}>
                    <option value="2">1 to 2 cycles</option>
                    <option value="4">3 to 5 cycles</option>
                    <option value="8">6 to 10 cycles</option>
                    <option value="14">10+ cycles</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Average project delivery time</label>
                  <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                    <option value="3">Under 6 months</option>
                    <option value="12">6 to 18 months</option>
                    <option value="24">18 to 36 months</option>
                    <option value="42">36+ months</option>
                  </select>
                </div>
                <div className="field">
                  <label>Current AI tool usage</label>
                  <select value={aiUsage} onChange={(e) => setAiUsage(e.target.value)}>
                    <option value="none">No AI tools yet</option>
                    <option value="experimental">Experimental only</option>
                    <option value="partial">Some workflows integrated</option>
                    <option value="governed">Governed pipeline strategy</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary" onClick={() => goStep(3)}>Continue → Pain points</button>
            </div>
          </>
        )}

        {/* ═══ STEP 3 — PAIN POINTS ═══ */}
        {step === 3 && (
          <>
            <button className="btn-back" onClick={() => goStep(2)}>← Back</button>
            <div className="form-card">
              <div className="fc-title">Where does your pipeline lose the most time?</div>
              <div className="fc-hint">Select all that apply. These map directly to Tulip's service recommendations.</div>

              <div className="check-grid" style={{ marginBottom: 20 }}>
                {[
                  ["texturing",  "Manual texturing and rigging"],
                  ["rework",     "Rework and revision cycles"],
                  ["handoff",    "Slow team handoffs"],
                  ["qa",         "QA bottlenecks"],
                  ["concept",    "Slow concept iteration"],
                  ["versioning", "Version control issues"],
                  ["outsource",  "Outsource coordination cost"],
                  ["render",     "Render or compute cost"],
                ].map(([key, label]) => (
                  <label key={key} className="check-item">
                    <input type="checkbox" checked={painPoints.includes(key)} onChange={() => togglePainPoint(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="field">
                <label>Biggest single frustration (optional)</label>
                <input type="text" value={biggestPain} onChange={(e) => setBiggestPain(e.target.value)} placeholder="e.g. Art review rounds take 3 weeks each time" />
              </div>

              <button className="btn-primary" style={{ marginTop: 14 }} onClick={calculate}>
                Generate my efficiency model →
              </button>
            </div>
          </>
        )}

        {/* ═══ STEP 4 — RESULTS ═══ */}
        {step === 4 && results && (
          <>
            <button className="btn-back" onClick={() => goStep(3)}>← Adjust inputs</button>

            {/* INDICATIVE NOTICE */}
            <div className="indicative-notice">
              <div className="in-icon">◈</div>
              <div>
                <div className="in-title">Indicative pipeline efficiency model</div>
                <div className="in-text">These figures are benchmarks derived from verified industry research across 650+ studios. They represent what studios of comparable size and type have achieved — not a guarantee for your specific situation. Pipeline maturity, team adoption rate, and integration scope all affect actual outcomes. The purpose of this model is to frame the conversation, not close it. A 30-minute briefing with Tulip is where these numbers get validated against your actual pipeline.</div>
              </div>
            </div>

            {/* RESULTS HEADER */}
            <div className="results-header">
              <div className="rh-label">Indicative pipeline efficiency opportunity</div>
              <div className="rh-studio">{results.studioSummary}</div>
            </div>

            {/* SAVINGS CALLOUT */}
            <div className="savings-bar">
              <div className="sb-inner">
                <div className="sb-left">
                  <div className="sb-label">Estimated annual efficiency opportunity</div>
                  <div className="sb-val">{fmtC(results.totalSave)}</div>
                  <div className="sb-sub">{results.savePctNum}% of your current production budget</div>
                </div>
                <div className="sb-right">
                  <div className="sb-payback-lbl">Indicative payback</div>
                  <div className="sb-payback">{results.tierPayback}</div>
                </div>
              </div>
            </div>

            {/* BEFORE / AFTER */}
            <div className="ba-grid">
              <div className="ba-col before">
                <div className="ba-badge before">Current pipeline</div>
                <div className="ba-metric"><div className="bam-label">Annual spend</div><div className="bam-val red">{fmtC(results.budget)}</div></div>
                <div className="ba-metric"><div className="bam-label">Est. rework cost</div><div className="bam-val red">{fmtC(results.reworkCost)}</div></div>
                <div className="ba-metric"><div className="bam-label">Art pipeline cost</div><div className="bam-val red">{fmtC(results.artCost)}</div></div>
                <div className="ba-metric"><div className="bam-label">Avg delivery time</div><div className="bam-val red">{results.timeBefore} months</div></div>
              </div>
              <div className="ba-arrow">→</div>
              <div className="ba-col after">
                <div className="ba-badge after">With AI pipeline</div>
                <div className="ba-metric"><div className="bam-label">Optimised spend</div><div className="bam-val grn">{fmtC(results.budgetAfter)}</div></div>
                <div className="ba-metric"><div className="bam-label">Est. rework cost</div><div className="bam-val grn">{fmtC(results.reworkAfter)}</div></div>
                <div className="ba-metric"><div className="bam-label">Art pipeline cost</div><div className="bam-val grn">{fmtC(results.artAfter)}</div></div>
                <div className="ba-metric"><div className="bam-label">Avg delivery time</div><div className="bam-val grn">{results.timeAfter} months</div></div>
              </div>
            </div>

            {/* BREAKDOWN TABLE */}
            <div className="breakdown">
              <div className="breakdown-hd">
                <div className="breakdown-hd-top">
                  <span className="breakdown-hd-label">Estimated efficiency opportunity by pipeline area</span>
                  <div className="currency-toggle">
                    {(["USD","CAD","EUR"] as Currency[]).map((cur) => (
                      <button key={cur} className={`cur-btn${activeCurrency === cur ? " active" : ""}`} onClick={() => setActiveCurrency(cur)}>{cur}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="breakdown-row" style={{ paddingTop: 8, paddingBottom: 8 }}>
                <div className="br-hd">Area</div>
                <div className="br-hd">Current est.</div>
                <div className="br-hd">With AI</div>
                <div className="br-hd">Opportunity</div>
              </div>
              {results.rows.map((row, i) => (
                <div key={i} className="breakdown-row">
                  <div className="br-area">
                    {row.label}
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{row.desc}</div>
                  </div>
                  <div className="br-before">{fmtC(row.before)}</div>
                  <div className="br-after">{fmtC(Math.max(row.before - row.save, 0))}</div>
                  <div className="br-save">↓ {fmtC(row.save)}</div>
                </div>
              ))}
              <div className="rd-offset" dangerouslySetInnerHTML={{ __html: results.rdOffsetMsg }} />
            </div>

            {/* AI ANALYSIS — KEY TAKEAWAYS */}
            <div className="ai-analysis">
              <div className="aa-header">
                <div className="aa-icon">✦</div>
                <div className="aa-title">Pipeline Areas — Key Summary</div>
              </div>
              <div className="aa-body">
                {results.takeaways.map((t, i) => (
                  <div key={i} className={`kt-item${visibleTakeaways.has(i) ? " visible" : ""}`}>
                    <div className={`kt-label ${t.labelClass}`}>{t.label}</div>
                    <div className="kt-text" dangerouslySetInnerHTML={{ __html: t.text }} />
                  </div>
                ))}
                {results.maturityNote && (
                  <div className={`kt-maturity${maturityVisible ? " visible" : ""}`}>{results.maturityNote}</div>
                )}
              </div>
            </div>

            {/* INVESTMENT OPTIONS */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--w)", marginBottom: 14 }}>Recommended Tulip engagement</div>
            <div className="invest-row">
              {tiers.map((t) => (
                <div key={t.name} className={`inv-card${t.rec ? " selected" : ""}`}>
                  {t.rec && <div className="inv-rec-badge">Recommended</div>}
                  <div className="inv-name">{t.name}</div>
                  <div className="inv-price">{t.price}</div>
                  <ul className="inv-items">{t.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>

            {/* ROI PROJECTION */}
            <div className="roi-proj">
              <div className="rp-row"><span>Estimated annual efficiency opportunity</span><span className="rp-val grn">{fmtC(results.totalSave)}</span></div>
              <div className="rp-row"><span>Est. outsource coordination saving</span><span className="rp-val grn">{fmtC(results.outsourceSave)}</span></div>
              <div className="rp-row"><span>Indicative engagement cost ({results.tier})</span><span className="rp-val">{results.tierPrice}</span></div>
              <div className="rp-row"><span>Indicative return multiple</span><span className="rp-val grad">{results.roi}× in year one</span></div>
              <div className="rp-row"><span>Estimated delivery time reduction</span><span className="rp-val grn">{results.timeSavePct}% faster</span></div>
              <div className="rp-row"><span>Indicative payback period</span><span className="rp-val">{results.tierPayback}</span></div>
            </div>

            {/* METHODOLOGY PANEL */}
            <div className="meth-panel">
              <button className="meth-toggle" onClick={() => setMethOpen((o) => !o)}>
                <div className="meth-toggle-left">
                  <div className="meth-toggle-icon">⟁</div>
                  <div className="meth-toggle-label">Methodology — how these figures are calculated</div>
                </div>
                <div className={`meth-toggle-arrow${methOpen ? " open" : ""}`}>▼</div>
              </button>
              {methOpen && (
                <div className="meth-body open">

                  <div className="meth-section">
                    <div className="meth-sec-title">Games — reduction factors by pipeline area</div>
                    {[
                      ["Concept art and visual ideation (AI-assisted generation)", "30 to 50%", "AWS Guide to GenAI for Game Developers 2025"],
                      ["2D to 3D asset pipeline (prompt to Blender to engine)", "Significant but quality-gated", "Begemann & Hutson, Lindenwood University 2024"],
                      ["Rework and revision cycles (structured review pipelines)", "35 to 45%", "a16z Games AI x Game Dev Survey 2024"],
                      ["QA and testing (AI-driven automated coverage)", "30 to 40%", "Google Cloud Research / Udonis 2025"],
                      ["Outsource coordination (automated brief and handoff layer)", "25 to 35%", "StudioKrew — AI Generated Game Assets 2025"],
                      ["Early-stage prototyping and coding assistance", "Most useful, broad agreement", "Daneels, ECAI 2025 — Belgian Game Industry Study"],
                    ].map(([area, range, source]) => (
                      <div key={area} className="meth-factor-row">
                        <div className="mf-area">{area}</div>
                        <div className="mf-range">{range}</div>
                        <div className="mf-source">{source}</div>
                      </div>
                    ))}
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">3D Animation — reduction factors by pipeline area</div>
                    {[
                      ["Production cost reduction through AI integration", "30%", "Morgan Stanley — GenAI's Leading Role in Entertainment"],
                      ["Mechanical schedule work (60–70% of schedule)", "30 to 90% compression", "Vitrina AI — Animation Strategic Report 2026"],
                      ["Asset lifecycle reuse (legacy motion data, crowd simulation)", "Case-study validated", "Vitrina AI — DreamWorks Kung Fu Panda 4 case study"],
                      ["Client review loop (structured note ingestion to revision)", "10× speed improvement (El Eternaut)", "Vitrina AI / Netflix production data 2026"],
                      ["Concept art to 3D asset iteration time", "Days to under 48 hours", "StudioKrew — AI Generated Game Assets 2025"],
                      ["Studios without pipeline spend visibility", "37% do not know their spend", "Ynput — State of Animation and VFX Pipelines 2025"],
                    ].map(([area, range, source]) => (
                      <div key={area} className="meth-factor-row">
                        <div className="mf-area">{area}</div>
                        <div className="mf-range">{range}</div>
                        <div className="mf-source">{source}</div>
                      </div>
                    ))}
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">VFX — adoption and integration gaps (case study grounded)</div>
                    <p className="meth-note" style={{ marginBottom: 10 }}>VFX is the sector with the largest gap between AI's theoretical efficiency potential and actual governed adoption. The following gaps are drawn from verified case studies and industry research, not projections.</p>
                    {[
                      ["Quality gap: AI outputs require significant artist refinement for production-quality VFX shots", "Adoption barrier", "Daneels ECAI 2025; Begemann & Hutson 2024"],
                      ["Pipeline integration gap: AI tools not yet connected to Houdini, Nuke, or render farm submission queues in most studios", "Structural gap", "Autodesk AU Session — Innovating the Future Pipeline 2024"],
                      ["IP and copyright risk: Studios cautious about AI training on proprietary assets without cleared rights", "Legal barrier", "Daneels ECAI 2025; Belgian Game Industry Study"],
                      ["Pre-render validation opportunity: AI flagging simulation errors before farm submission — highest-return VFX intervention", "35 to 50% task reduction", "S3ART — Breaking Down the VFX Pipeline 2025"],
                      ["AI in VFX market growth: $4.33B in 2024 to $25.51B by 2034", "CAGR 19.38%", "Market Research Future 2025"],
                      ["Studios with no dedicated pipeline budget — largest adoption risk group", "37% of studios", "Ynput — State of Animation and VFX Pipelines 2025"],
                    ].map(([area, range, source]) => (
                      <div key={area} className="meth-factor-row">
                        <div className="mf-area">{area}</div>
                        <div className="mf-range">{range}</div>
                        <div className="mf-source">{source}</div>
                      </div>
                    ))}
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">AI maturity adjustment</div>
                    <p className="meth-note">Reduction factors are scaled down based on your current AI usage. Studios with no AI tools in place have the largest theoretical opportunity but also the most integration work ahead — a finding consistent across the Belgian game industry study (Daneels, ECAI 2025) and the Begemann and Hutson pipeline case study. Studios with a governed pipeline have a smaller remaining opportunity.</p>
                    <div className="meth-calc-box">
                      No AI tools: full benchmark range applied<br />
                      Experimental use: factors reduced by 15%<br />
                      Partial integration: factors reduced by 35%<br />
                      Governed pipeline: factors reduced by 70%
                    </div>
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">Rework cost derivation</div>
                    <p className="meth-note">Rework cost is estimated as a function of total budget and reported revision cycles. A conservative 60% weighting is applied — only 60% of rework time is treated as recoverable, accounting for legitimate creative iteration. The 2D to 3D pipeline transition identified by Begemann and Hutson as a specific rework driver is captured within the art pipeline reduction factor.</p>
                    <div className="meth-calc-box">
                      Rework cost estimate = budget × (revision cycles ÷ 100) × 0.6<br /><br />
                      Example: $5M budget, 4 revision cycles<br />
                      → $5M × 0.04 × 0.6 = $120K estimated rework exposure
                    </div>
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">What this model does not account for</div>
                    <p className="meth-note">Team adoption time and change management cost. Tool licensing and infrastructure cost for AI systems. Creative quality risk during transition — specifically the output quality concerns consistently raised by developers in the Belgian industry study. Union and contractual constraints on AI use (SAG-AFTRA, WGA protections). IP clearance requirements for model training on proprietary assets. Film and series financing structure complexity documented in the Vitrina Film Financing Playbook 2026. These are all assessed during the Tulip scoping engagement.</p>
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">Primary sources — verified and accessible</div>
                    <p className="meth-note">
                      <a href="https://www.blog.udonis.co/mobile-marketing/mobile-games/ai-game-development" target="_blank" rel="noopener noreferrer">a16z Games AI x Game Dev Survey 2024 — 651 developers, productivity and cost data (via Udonis) ↗</a><br /><br />
                      <a href="https://d1.awsstatic.com/psc-digital/2025/gc-a4gmt/genai-game-dev/the-2025-aws-guide-to-generative-ai-for-game-developers.pdf" target="_blank" rel="noopener noreferrer">AWS Guide to Generative AI for Game Developers 2025 — Saltwater Games case study, pipeline acceleration frameworks ↗</a><br /><br />
                      <a href="https://digitalcommons.lindenwood.edu/cgi/viewcontent.cgi?article=1056&context=student-research-papers" target="_blank" rel="noopener noreferrer">Begemann &amp; Hutson — AI-Assisted Game Development Case Study, Lindenwood University 2024 — Full pipeline diary: concept art → Blender 3D → Unreal Engine 5, 2D-to-3D gap analysis ↗</a><br /><br />
                      <a href="https://ai4hgi.github.io/paper7.pdf" target="_blank" rel="noopener noreferrer">Daneels — Opportunities and Risks of GenAI for Game Development, ECAI 2025 — 20 Belgian developers, quality concerns, VFX integration barriers, adoption patterns ↗</a><br /><br />
                      <a href="https://vitrina.ai/blog/ai-in-animation-strategic-report-2026/" target="_blank" rel="noopener noreferrer">Vitrina AI — Animation Strategic Report 2026 — DreamWorks, Netflix El Eternaut, Disney Frozen II case studies ↗</a><br /><br />
                      <a href="https://www.morganstanley.com/insights/articles/ai-in-media-entertainment-benefits-and-risks" target="_blank" rel="noopener noreferrer">Morgan Stanley — GenAI's Leading Role in Entertainment — 30% production cost reduction, Netflix VFX data ↗</a><br /><br />
                      <a href="https://ynput.io/the-state-of-animation-vfx-pipelines-report/" target="_blank" rel="noopener noreferrer">Ynput — State of Animation and VFX Pipelines 2025 — 200+ studios, pipeline spend visibility data ↗</a><br /><br />
                      <a href="https://studiokrew.com/blog/ai-generated-game-assets-2025/" target="_blank" rel="noopener noreferrer">StudioKrew — AI Generated Game Assets 2025 — Outsource cost reduction, timeline compression data ↗</a><br /><br />
                      <a href="https://hs-20258191.f.hubspotemail.net/hubfs/20258191/Financing_Playbook_Vitrina.pdf" target="_blank" rel="noopener noreferrer">Vitrina Film Financing Playbook 2026 — Independent film and series capital structure, financier perspectives ↗</a>
                    </p>
                  </div>

                  <div className="meth-section">
                    <div className="meth-sec-title">Sources referenced but not directly fetchable</div>
                    <p className="meth-note" style={{ color: "rgba(255,255,255,0.55)" }}>
                      The following sources were provided as references. Their PDFs returned access errors (403, binary, or no machine-readable text) during verification. They are cited where their findings are corroborated by accessible sources above, but are not used as sole evidence for any reduction factor in this model.<br /><br />
                      Autodesk AU — Innovating the Future Pipeline (ComfyUI + ControlNet + Stable Diffusion in Blender/Houdini/Maya) · Adobe — Recenter Creativity in Your 3D Pipeline · Animation Guild / CVL Economics — Future Unscripted (86.7% early adoption claim) · arXiv 2509.11898 — Generative AI in Game Development Research Synthesis · BCG Video Gaming Report 2026 (navigation-only, article body inaccessible) · Whimsy Games — How AI Is Changing Game Art Outsourcing (server timeout)
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* CTA */}
            <div className="result-cta">
              <a href="https://calendly.com/youki-harada/30min" className="btn-cta-p" target="_blank" rel="noopener noreferrer">Validate in a 30-min 1:1 Brief →</a>
              <button className="btn-cta-s" onClick={downloadPDF}>⬇ Download report</button>
            </div>

            <div className="disclaimer">
              <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>◈</span>
              <p>This is an indicative pipeline efficiency model, not a financial projection or guarantee of return. All figures are derived from published industry benchmarks and adjusted for your reported studio profile. Your actual efficiency opportunity will be determined during a structured Tulip engagement and validated against your live pipeline data before any investment is recommended.</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
