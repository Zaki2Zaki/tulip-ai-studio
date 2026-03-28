export type StudioScale = "indie" | "midsize" | "aaa" | "publisher";
export type OutputType = "games" | "animation" | "vfx" | "virtualproduction" | "mixed";
export type TierId = "starter" | "studio" | "enterprise";

export interface SourceEntry {
  label: string;
  url?: string;
}

export interface RiskEntry {
  id: number;
  impact: "High" | "Medium";
  title: string;
  stat: string;
  sources: SourceEntry[];
  exposure: string;
}

export interface MetricEntry {
  name: string;
  detail: string;
  sources?: SourceEntry[];
}

export interface ScenarioData {
  screen2Headline: string;
  risks: RiskEntry[];
  defaultExpandedIds: number[];
  roiMetrics: MetricEntry[];
  getRecommendedTierId: (budgetRange: string) => TierId;
  competitivePositioning: string;
  competitivePositioningBreakdown?: string;
  competitivePositioningSources?: SourceEntry[];
  reworkCostNote?: string;
}

export interface SourceRef {
  num: string;
  org: string;
  title: string;
  description: string;
  url: string;
}

const ALWAYS_STARTER = (): TierId => "starter";
const ALWAYS_STUDIO = (): TierId => "studio";
const ALWAYS_ENTERPRISE = (): TierId => "enterprise";
const BUDGET_ENTERPRISE = (b: string): TierId =>
  b === "$50M to $200M" || b === "$200M+" ? "enterprise" : "studio";

// ─── Shared risks ─────────────────────────────────────────────────────────────

const RISKS_INDIE_GAMES: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "You are being out-produced by studios the same size as yours",
    stat: "In 2025, a single developer using AI tools can generate 17 character concepts in under a week. The same work previously required a full team and 34 business days.",
    sources: [{ label: "Whimsy Games / Lost Lore Bearverse production data 2024" }],
    exposure: "Production advantage",
  },
  {
    id: 2,
    impact: "High",
    title: "Over 14,000 games launched on Steam last year. 70% made less than $10,000.",
    stat: "Visibility is now the primary competitive risk for indie studios. AI-assisted content volume and faster iteration are the primary tools for breaking through.",
    sources: [{ label: "GameDiscoverCo Steam Analysis 2024", url: "https://newsletter.gamediscover.co" }],
    exposure: "Revenue at risk",
  },
  {
    id: 3,
    impact: "Medium",
    title: "AI reduces asset creation time by 35% — but only when integrated correctly",
    stat: "Studios that adopt AI without an integration strategy see the same abandonment pattern as those who never adopted it. The tool is not the risk. The approach is.",
    sources: [
      { label: "Juego Studios Indie Game Development Cost Guide 2026", url: "https://juegostudio.com" },
      { label: "a16z Games Survey 2024", url: "https://a16z.com/games-ai-survey-2024" },
    ],
    exposure: "35% time savings",
  },
];

const RISKS_MIDSIZE_GAMES: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "Rework cycles are your largest hidden cost",
    stat: "Estimated $50K to $500K per rework cycle at mid-size scale. 5 to 15 developers offline for 1 to 3 weeks. Every revision loop that reaches the art director is a scheduling event, not just a creative note.",
    sources: [{ label: "ESAC / Nordicity — The Canadian Video Game Industry 2021", url: "https://theesa.ca/wp-content/uploads/2022/10/esac-2021-final-report.pdf" }],
    exposure: "$50K to $500K",
  },
  {
    id: 2,
    impact: "High",
    title: "73% of studios your size already use AI. Strategy is now the differentiator.",
    stat: "Nearly 40% of studios report over 20% productivity gains. The 60% not seeing returns adopted tools without integration strategy. The gap is growing.",
    sources: [{ label: "a16z Games AI Developer Survey 2024", url: "https://a16z.com/games-ai-survey-2024" }],
    exposure: "20%+ productivity gap",
  },
  {
    id: 3,
    impact: "Medium",
    title: "Manual texturing and rigging are consuming your art team",
    stat: "AI concept art and texture tools deliver 30 to 40% cost reductions in early-stage work at studios your size.",
    sources: [{ label: "Whimsy Games 2025" }],
    exposure: "30 to 40% budget",
  },
];

const RISKS_AAA_GAMES: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "Disconnected pipelines",
    stat: "Estimated $500K to $3M per rework cycle at AAA scale. Ten to thirty developers offline for three to seven days. Every time it happens.",
    sources: [
      { label: "Bloomberg / Jason Schreier, March 2026", url: "https://bsky.app/profile/jasonschreier.bsky.social/post/3mhvx2lohzs2j" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
    exposure: "$500K to $3M+",
  },
  {
    id: 2,
    impact: "High",
    title: "52% of AAA developers are building AI pipelines right now",
    stat: "Studios not on this path are falling behind on live ops delivery cadence. EA's partnership with Stability AI signals that even the largest publishers are committing to pipeline transformation.",
    sources: [
      { label: "GDC State of Industry 2025", url: "https://gdconf.com/state-of-the-game-industry" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
    exposure: "Pipeline gap",
  },
  {
    id: 3,
    impact: "High",
    title: "Manual texturing and rigging are your biggest budget sink",
    stat: "68% of total studio expenditure is labour. Asset creation workflows are the stages most directly compressible by AI integration.",
    sources: [{ label: "ESAC / Nordicity — The Canadian Video Game Industry 2021", url: "https://theesa.ca/wp-content/uploads/2022/10/esac-2021-final-report.pdf" }],
    exposure: "70% of modeling budget",
  },
  {
    id: 4,
    impact: "Medium",
    title: "Unvetted AI tools break live services",
    stat: "An AI tool that fails in a development pipeline is an inconvenience. The same failure in a live service pipeline is a player-facing outage. The difference is an integration strategy.",
    sources: [
      { label: "EA CTO technology strategy remit" },
      { label: "Diversion.dev Version Control Survey 2024", url: "https://diversion.dev" },
    ],
    exposure: "Live service outage risk",
  },
  {
    id: 5,
    impact: "Medium",
    title: "Fragmented adoption creates expensive dependencies",
    stat: "Adopting AI tools without a strategy creates vendor dependencies your team will pay to exit.",
    sources: [{ label: "Third Point Ventures — AI Impact on Gaming and Media Tooling 2025", url: "https://www.google.com/search?q=Third+Point+Ventures+AI+Impact+Gaming+Media+Tooling+2025" }],
    exposure: "Vendor exit costs",
  },
];

const RISKS_PUBLISHER_GAMES: RiskEntry[] = [
  RISKS_AAA_GAMES[0],
  {
    id: 2,
    impact: "High",
    title: "Cloud gaming is restructuring your distribution model",
    stat: "BCG projects cloud gaming revenues growing from $1.4B in 2025 to $18.3B by 2030 — a CAGR above 50%. Publishers that cannot support cloud-native content cadences will lose distribution leverage as platforms shift.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
    exposure: "$1.4B to $18.3B market",
  },
  {
    id: 3,
    impact: "High",
    title: "Fragmented AI adoption across studios creates unmanageable vendor dependencies",
    stat: "Publishers with multiple studios each adopting AI tools independently create proprietary dependencies that are expensive to exit and impossible to standardise across franchises.",
    sources: [{ label: "Third Point Ventures — AI Impact on Gaming and Media Tooling 2025", url: "https://www.google.com/search?q=Third+Point+Ventures+AI+Impact+Gaming+Media+Tooling+2025" }],
    exposure: "Vendor exit costs",
  },
  RISKS_AAA_GAMES[3],
  {
    id: 5,
    impact: "Medium",
    title: "52% of AAA developers are building AI pipelines now",
    stat: "The studios not building them are your competitors' development partners. The talent and pipeline advantage is forming now.",
    sources: [{ label: "GDC State of Industry 2025", url: "https://gdconf.com/state-of-the-game-industry" }],
    exposure: "Pipeline gap",
  },
];

const RISKS_ANIMATION: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "60 to 70% of your production schedule is mechanical work AI can now automate",
    stat: "Rotoscoping, crowd simulation, asset retargeting — the stages consuming most of your schedule — are compressible. Studios automating these are redirecting that budget toward IP development and creative direction.",
    sources: [
      { label: "Vitrina AI in Animation Strategic Report 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" },
      { label: "Morgan Stanley Research — Generative AI in Film and TV 2024" },
    ],
    exposure: "60 to 70% of schedule",
  },
  {
    id: 2,
    impact: "High",
    title: "Streaming platforms are demanding feature-level visuals on series budgets",
    stat: "Netflix's El Eternauta achieved feature-film visuals on a series budget using AI-assisted rendering — a 10x speed improvement over traditional CGI pipelines. Studios without AI cannot meet these economics.",
    sources: [{ label: "Vitrina AI in Animation 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" }],
    exposure: "Commission risk",
  },
  {
    id: 3,
    impact: "Medium",
    title: "Only 8% of animation studios feel prepared for the pipeline changes already underway",
    stat: "Ynput's 2025 survey of 200+ studios. 37% do not know their pipeline spend at all. Studios winning new commissions in 2026 have moved from experimental adoption to governed infrastructure.",
    sources: [{ label: "Ynput State of Animation and VFX Pipelines 2025", url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report" }],
    exposure: "Infrastructure gap",
  },
];

const RISKS_VFX: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "AI-enabled studios are undercutting you on cost-per-shot",
    stat: "MARZ's Automated Visual Effects platform turns around shots in a fraction of the time comparable manual pipelines require. Their quotes on high-volume roto, cleanup, and crowd work are significantly below market rate. This is not a future risk.",
    sources: [
      { label: "Vitrina Top 10 VFX Companies 2026", url: "https://vitrina.ai/blog/discover-the-best-vfx-studios-worldwide-top-10-vfx-companies" },
      { label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" },
    ],
    exposure: "Cost-per-shot gap",
  },
  {
    id: 2,
    impact: "High",
    title: "20 to 65% time savings on AI auto-rotoscoping — confirmed in production",
    stat: "DNEG confirmed 28% roto and layout labour reduction on a Disney+ series in a 2024 pilot. Amazon Originals confirmed 40% faster first-pass editing with AI-supported assembly editing. Production confirmed. Not projected.",
    sources: [
      { label: "Roland Berger — AI Innovations for VFX and Animation", url: "https://www.rolandberger.com/en/Insights/Publications/AI-Innovations-for-VFX-and-animation.html" },
      { label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" },
      { label: "DNEG production data 2024" },
    ],
    exposure: "20 to 65% time savings",
  },
  {
    id: 3,
    impact: "Medium",
    title: "Only 8% of VFX studios feel prepared for what is already underway",
    stat: "Ynput's 2025 survey of 200+ studios worldwide. 37% do not know their pipeline spend at all. Studios winning new commissions in 2026 have moved from experimental adoption to governed production infrastructure.",
    sources: [{ label: "Ynput State of Animation and VFX Pipelines 2025", url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report" }],
    exposure: "Infrastructure gap",
  },
];

const RISKS_VP: RiskEntry[] = [
  {
    id: 1,
    impact: "High",
    title: "Manual asset preparation for LED volumes is your biggest pre-production cost",
    stat: "Virtual production requires environment assets ready before the shoot — not after. Studios spending weeks preparing background plates manually are losing that time to AI-assisted environment generation. The prep cost is compressible.",
    sources: [
      { label: "VFX Voice Industry Outlook 2026", url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity" },
      { label: "Autodesk Flow Studio documentation", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" },
    ],
    exposure: "Pre-production budget",
  },
  {
    id: 2,
    impact: "High",
    title: "AI relighting and rotoscoping are eliminating the need for reshoots",
    stat: "Beeble's AI relighting converts standard footage into fully relightable assets without reshoots. Autodesk Flow Studio delivers mocap without suits, markers, or green screens. Both remove cost categories that virtual production was supposed to solve but often still carries.",
    sources: [
      { label: "Beeble AI documentation", url: "https://beeble.ai" },
      { label: "Autodesk Flow Studio 2025", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" },
    ],
    exposure: "Reshoot cost elimination",
  },
  {
    id: 3,
    impact: "Medium",
    title: "Only 8% of studios feel prepared for the pipeline changes already underway",
    stat: "Ynput's 2025 survey of 200+ studios. Virtual production workflows are among the most complex to integrate AI into — and the most valuable when done correctly.",
    sources: [{ label: "Ynput State of Animation and VFX Pipelines 2025", url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report" }],
    exposure: "Infrastructure gap",
  },
];

// ─── Shared metrics ───────────────────────────────────────────────────────────

const METRICS_INDIE_GAMES: MetricEntry[] = [
  {
    name: "Asset creation speed",
    detail: "AI tooling delivers an estimated 35% reduction in asset creation time at indie scale. One developer can now produce what previously required 3 to 4. That is not a marginal gain. That is a team size advantage.",
    sources: [
      { label: "a16z Games AI Developer Survey 2024", url: "https://a16z.com/games-ai-survey-2024" },
      { label: "Juego Studios Indie Game Development Cost Guide 2026", url: "https://juegostudio.com" },
    ],
  },
  {
    name: "Concept to prototype",
    detail: "17 character concepts in under a week versus 34 business days manually. The same quality bar. A fraction of the time.",
    sources: [{ label: "Whimsy Games / Lost Lore Bearverse production data 2024" }],
  },
  {
    name: "Production cost",
    detail: "AI concept art and texture generation delivers 30 to 40% cost reductions in early-stage work. Senior artists focus on final polish and creative direction.",
    sources: [{ label: "Juego Studios Indie Game Development Cost Guide 2026", url: "https://juegostudio.com" }],
  },
  {
    name: "Competitive window",
    detail: "BCG estimates 50% of studios now use AI — double the rate of a year ago. Indie studios not integrating are competing against those producing significantly more content with the same team.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
];

const METRICS_MIDSIZE_GAMES: MetricEntry[] = [
  {
    name: "Rework cost exposure",
    detail: "Estimated $50K to $500K per cycle at this scale. AI integration reduces rework triggers by 40 to 60%. That is not a productivity gain. That is budget recovered.",
    sources: [{ label: "ESAC / Nordicity — The Canadian Video Game Industry 2021", url: "https://theesa.ca/wp-content/uploads/2022/10/esac-2021-final-report.pdf" }],
  },
  {
    name: "Developer velocity",
    detail: "40% of studios with AI report over 20% productivity gain. One developer now produces what previously required 2 to 3 for asset-heavy tasks.",
    sources: [{ label: "a16z Games AI Developer Survey 2024", url: "https://a16z.com/games-ai-survey-2024" }],
  },
  {
    name: "Production cost",
    detail: "30 to 40% reduction in early-stage concept and texture work. Frees senior artists for hero assets and final polish.",
    sources: [{ label: "Whimsy Games 2025" }],
  },
  {
    name: "Market positioning",
    detail: "AA games: 22% YoY growth in investment interest 2023 to 2024. 4.4x higher average revenue per title versus indie. AI pipeline efficiency is what makes AA-level output achievable at this headcount.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
];

const METRICS_AAA_GAMES: MetricEntry[] = [
  {
    name: "Rework cost exposure",
    detail: "AAA development budgets in the US and Canada now start at $300M per title confirmed by Bloomberg March 2026. AI integration reduces the rework triggers that drive overruns. That is budget recovered.",
    sources: [{ label: "Bloomberg / Jason Schreier, March 2026", url: "https://bsky.app/profile/jasonschreier.bsky.social/post/3mhvx2lohzs2j" }],
  },
  {
    name: "Developer velocity",
    detail: "Asset creation from 100 hours to under 30 minutes per type. Some vendors report up to 90% acceleration in development cycles. BCG cites this in context of AAA pipeline tools entering production.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
  {
    name: "Production cost",
    detail: "68% of total studio spend is labour. Texturing and rigging are compressible. Freeing that capacity redirects senior artists to hero asset work only.",
    sources: [{ label: "ESAC / Nordicity — The Canadian Video Game Industry 2021", url: "https://theesa.ca/wp-content/uploads/2022/10/esac-2021-final-report.pdf" }],
  },
  {
    name: "Competitive window",
    detail: "Roughly 18 months before the gap between studios that have integrated AI and those that have not becomes structurally difficult to close. BCG cloud gaming projection: $1.4B to $18.3B by 2030 at 50%+ CAGR.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
];

const METRICS_PUBLISHER_GAMES: MetricEntry[] = [
  {
    name: "Cross-franchise rework exposure",
    detail: "$500K to $3M per rework cycle per studio. Multiplied across a multi-studio portfolio. AI integration reduces triggers by 60 to 85% per studio.",
    sources: [
      { label: "Bloomberg / Jason Schreier, March 2026", url: "https://bsky.app/profile/jasonschreier.bsky.social/post/3mhvx2lohzs2j" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
  },
  {
    name: "Developer velocity at scale",
    detail: "Standardised AI pipeline across studios multiplies productivity gains. Publishers that standardise early set the baseline their studios operate from.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
  {
    name: "Distribution model readiness",
    detail: "Cloud gaming CAGR above 50% through 2030. Publishers without AI-ready content pipelines will not sustain the release cadence that cloud-native distribution requires.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
  {
    name: "Competitive window",
    detail: "18 to 24 months before the structural advantage of AI-integrated studios becomes difficult to close at franchise scale. After that point the investment required to catch up increases across every title.",
    sources: [{ label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" }],
  },
];

const METRICS_ANIMATION: MetricEntry[] = [
  {
    name: "Production cost",
    detail: "Morgan Stanley projects 30% reduction in animation and film production costs through AI integration. On a series budget that compression funds additional seasons or higher production value on the same slate.",
    sources: [{ label: "Morgan Stanley Research — Generative AI in Film and TV 2024" }],
  },
  {
    name: "Schedule compression",
    detail: "60 to 70% of production schedule is mechanical work. AI compresses that portion by 30 to 90% depending on pipeline maturity. Recovered time goes into creative development and IP.",
    sources: [
      { label: "Vitrina AI in Animation Strategic Report 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" },
      { label: "Morgan Stanley Research — Generative AI in Film and TV 2024" },
    ],
  },
  {
    name: "Asset lifecycle value",
    detail: "DreamWorks applied AI to reuse legacy animation data across thousands of background characters in Kung Fu Panda 4 with high visual diversity. Studios with catalogued assets can unlock this value immediately.",
    sources: [{ label: "Vitrina AI in Animation 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" }],
  },
  {
    name: "Market growth",
    detail: "Generative AI in animation: 39% CAGR growing from $1.66B in 2024 to over $23B by 2032. Studios integrating now are building the pipeline advantage that scales with the market.",
    sources: [{ label: "Vitrina AI in Animation 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" }],
  },
];

const METRICS_VFX: MetricEntry[] = [
  {
    name: "Rotoscoping and cleanup time",
    detail: "20 to 65% time savings on AI auto-rotoscoping confirmed by Roland Berger across five film genres. DNEG confirmed 28% labour reduction on Disney+. Amazon confirmed 40% faster first-pass editing. Production confirmed.",
    sources: [
      { label: "Roland Berger — AI Innovations for VFX and Animation", url: "https://www.rolandberger.com/en/Insights/Publications/AI-Innovations-for-VFX-and-animation.html" },
      { label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" },
    ],
  },
  {
    name: "Cost-per-shot competitiveness",
    detail: "Studios that have automated roto, cleanup, and crowd augmentation are quoting significantly below market rates. If your studio has not automated these categories, you are losing volume work bids to studios that have.",
    sources: [
      { label: "Vitrina Top 10 VFX Companies 2026", url: "https://vitrina.ai/blog/discover-the-best-vfx-studios-worldwide-top-10-vfx-companies" },
      { label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" },
    ],
  },
  {
    name: "Infrastructure cost",
    detail: "One mid-size VFX studio replaced $72,000 in annual cloud spending with three AI workstations while improving artist productivity through faster feedback loops.",
    sources: [{ label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" }],
  },
  {
    name: "Competitive window",
    detail: "VFX Voice 2026 states studios with tech-enabled pipelines will have a structural advantage. AI and real-time technologies are moving from experimental to mainstream in 2026. Being unprepared now means catching up under competitive pressure later.",
    sources: [{ label: "VFX Voice Industry Outlook 2026", url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity" }],
  },
];

const METRICS_VP: MetricEntry[] = [
  {
    name: "Pre-production environment cost",
    detail: "AI-assisted environment and background generation compresses the pre-production asset preparation phase. Specific figures depend on project scope. We will model this in your briefing.",
    sources: [
      { label: "VFX Voice Industry Outlook 2026", url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity" },
      { label: "Autodesk Flow Studio documentation", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" },
    ],
  },
  {
    name: "Reshoot elimination",
    detail: "Beeble's AI relighting converts footage into relightable assets without reshoots. Autodesk Flow Studio delivers production-grade mocap without suits or markers. Both remove cost categories from the production budget.",
    sources: [
      { label: "Beeble AI documentation", url: "https://beeble.ai" },
      { label: "Autodesk Flow Studio 2025", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" },
    ],
  },
  {
    name: "Turnaround time",
    detail: "Boxel Studio delivered high-end visuals for Superman and Lois with a smaller team and shorter timeline than the previous season using Autodesk Flow Studio — transforming live-action footage into editable CG scenes directly in pipeline.",
    sources: [{ label: "Autodesk Flow Studio 2025", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" }],
  },
  {
    name: "Competitive window",
    detail: "VFX Voice 2026: studios with global reach and tech-enabled pipelines will have a structural advantage. Virtual production facilities without AI integration are carrying cost structures that AI-enabled competitors have already eliminated.",
    sources: [{ label: "VFX Voice Industry Outlook 2026", url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity" }],
  },
];

// ─── Competitive positioning strings ─────────────────────────────────────────

const COMP_ANIMATION = "The studios winning streaming commissions in 2026 are delivering feature-level visuals on series economics. AI is the only mechanism that makes that equation work.";
const COMP_VFX = "The VFX market is repricing around AI-automated studios. MARZ is already undercutting manual pipelines on cost-per-shot. The question is not whether to integrate AI. It is whether to do it before or after your clients notice the difference.";
const COMP_VP = "Virtual production was supposed to reduce post-production costs. For studios that have not integrated AI into the workflow, it has added a new category of pre-production cost instead. AI closes that gap.";

const COMP_ANIMATION_BREAKDOWN = "Netflix's El Eternauta confirmed a 10x speed improvement delivering feature-film visuals at series budget. Morgan Stanley projects 30% production cost reduction industry-wide through AI integration. Vitrina AI reports only 8% of animation studios feel prepared for these pipeline changes.";
const COMP_ANIMATION_SOURCES: SourceEntry[] = [
  { label: "Morgan Stanley Research — Generative AI in Film and TV 2024" },
  { label: "Vitrina AI in Animation Strategic Report 2025", url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026" },
];

const COMP_VFX_BREAKDOWN = "MARZ's Automated Visual Effects platform confirms quotes significantly below market rate for roto, cleanup, and crowd work. Roland Berger documents 20 to 65% time savings on AI auto-rotoscoping across five film genres. Vitrina Top 10 VFX Companies 2026 documents the competitive repricing underway.";
const COMP_VFX_SOURCES: SourceEntry[] = [
  { label: "Roland Berger — AI Innovations for VFX and Animation", url: "https://www.rolandberger.com/en/Insights/Publications/AI-Innovations-for-VFX-and-animation.html" },
  { label: "Vitrina Top 10 VFX Companies 2026", url: "https://vitrina.ai/blog/discover-the-best-vfx-studios-worldwide-top-10-vfx-companies" },
  { label: "LBBOnline / Sohonet 2026", url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030" },
];

const COMP_VP_BREAKDOWN = "VFX Voice 2026 documents studios with AI-enabled pipelines gaining structural cost advantage over facilities carrying traditional pre-production budgets. Autodesk Flow Studio and Beeble AI eliminate specific cost categories — reshoot days, specialised mocap hardware, post-correction — that virtual production was supposed to reduce but often still carries without AI integration.";
const COMP_VP_SOURCES: SourceEntry[] = [
  { label: "VFX Voice Industry Outlook 2026", url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity" },
  { label: "Beeble AI documentation", url: "https://beeble.ai" },
  { label: "Autodesk Flow Studio 2025", url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects" },
];

// ─── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS: Record<string, ScenarioData> = {
  "indie_games": {
    screen2Headline: "For a small studio, the game has changed. A single developer with the right AI tools can now ship what used to require a full team.",
    risks: RISKS_INDIE_GAMES,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_INDIE_GAMES,
    getRecommendedTierId: ALWAYS_STARTER,
    competitivePositioning: "2025 is the first year where a single-person studio can ship content pipelines that used to cost AAA budgets. The studios that recognise this early are the ones that break through.",
    competitivePositioningBreakdown: "a16z Games 2024 survey and Whimsy Games/Lost Lore Bearverse 2024 production data show a single developer with AI tools can produce 17 character concepts in under a week — work that previously required 34 business days and a full team. BCG documents that AI studio adoption has doubled in one year.",
    competitivePositioningSources: [
      { label: "a16z Games AI Developer Survey 2024", url: "https://a16z.com/games-ai-survey-2024" },
      { label: "Whimsy Games / Lost Lore Bearverse production data 2024" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
    reworkCostNote: "Rework cost exposure scales with team and project size. We will scope this specifically in your briefing.",
  },
  "midsize_games": {
    screen2Headline: "73% of studios your size are already using AI. The ones not seeing returns adopted tools without a strategy.",
    risks: RISKS_MIDSIZE_GAMES,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_MIDSIZE_GAMES,
    getRecommendedTierId: ALWAYS_STUDIO,
    competitivePositioning: "AA is the fastest-growing segment in games investment. The studios winning it are not the ones with the largest teams. They are the ones with the most efficient pipelines.",
    competitivePositioningBreakdown: "BCG Video Gaming Report 2026 documents 22% YoY growth in AA investment interest 2023–2024 and 4.4x higher average revenue per title versus indie. The positioning is drawn from BCG's analysis that pipeline efficiency — not team size — is the primary differentiator enabling AA-level output at reduced headcount.",
    competitivePositioningSources: [
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
  },
  "aaa_games": {
    screen2Headline: "From custom dev startups to indie and AAA studios, this is where the money is going.",
    risks: RISKS_AAA_GAMES,
    defaultExpandedIds: [1, 2, 4],
    roiMetrics: METRICS_AAA_GAMES,
    getRecommendedTierId: BUDGET_ENTERPRISE,
    competitivePositioning: "EA and Stability AI have committed to reimagining how content is built. Studios that wait for the technology to mature before integrating will find that the maturation period was also the window to build competitive advantage.",
    competitivePositioningBreakdown: "GDC State of Industry 2025 reports 52% of AAA developers actively building AI pipelines. EA's Stability AI partnership was reported by Bloomberg/Jason Schreier in March 2026. BCG projects the competitive gap becomes structurally difficult to close within 18 months.",
    competitivePositioningSources: [
      { label: "GDC State of Industry 2025", url: "https://gdconf.com/state-of-the-game-industry" },
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
      { label: "Bloomberg / Jason Schreier, March 2026", url: "https://bsky.app/profile/jasonschreier.bsky.social/post/3mhvx2lohzs2j" },
    ],
  },
  "publisher_games": {
    screen2Headline: "At publisher scale, pipeline inefficiency does not stay in one studio. It compounds across every franchise.",
    risks: RISKS_PUBLISHER_GAMES,
    defaultExpandedIds: [1, 2, 3, 4, 5],
    roiMetrics: METRICS_PUBLISHER_GAMES,
    getRecommendedTierId: ALWAYS_ENTERPRISE,
    competitivePositioning: "The question for a publisher is not whether to integrate AI. The question is whether to do it studio by studio or whether to build an architecture that standardises the advantage across every franchise simultaneously.",
    competitivePositioningBreakdown: "BCG projects cloud gaming revenues growing from $1.4B to $18.3B by 2030 (CAGR above 50%), creating sustained release cadence pressure on publishers. The multi-studio standardisation argument is drawn from BCG's analysis that publishers standardising AI infrastructure across franchises gain compounding rather than linear advantage.",
    competitivePositioningSources: [
      { label: "BCG Video Gaming Report 2026", url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth" },
    ],
  },
  "indie_animation": {
    screen2Headline: "For an independent animation studio, 60 to 70% of your production schedule is mechanical work. That is the budget AI can give back.",
    risks: RISKS_ANIMATION,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_ANIMATION,
    getRecommendedTierId: ALWAYS_STARTER,
    competitivePositioning: COMP_ANIMATION,
    competitivePositioningBreakdown: COMP_ANIMATION_BREAKDOWN,
    competitivePositioningSources: COMP_ANIMATION_SOURCES,
  },
  "midsize_animation": {
    screen2Headline: "60 to 70% of your production schedule is mechanical work AI can now automate. Studios automating this are redirecting that budget toward IP development.",
    risks: RISKS_ANIMATION,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_ANIMATION,
    getRecommendedTierId: ALWAYS_STUDIO,
    competitivePositioning: COMP_ANIMATION,
    competitivePositioningBreakdown: COMP_ANIMATION_BREAKDOWN,
    competitivePositioningSources: COMP_ANIMATION_SOURCES,
  },
  "aaa_animation": {
    screen2Headline: "Netflix achieved a 10x speed improvement on El Eternauta using AI-assisted rendering. DreamWorks applied AI crowd simulation across thousands of characters in Kung Fu Panda 4. This is production-ready.",
    risks: RISKS_ANIMATION,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_ANIMATION,
    getRecommendedTierId: BUDGET_ENTERPRISE,
    competitivePositioning: COMP_ANIMATION,
    competitivePositioningBreakdown: COMP_ANIMATION_BREAKDOWN,
    competitivePositioningSources: COMP_ANIMATION_SOURCES,
  },
  "publisher_animation": {
    screen2Headline: "At publisher scale, 60 to 70% of production schedule consumed by mechanical tasks compounds across every title on your slate.",
    risks: RISKS_ANIMATION,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_ANIMATION,
    getRecommendedTierId: ALWAYS_ENTERPRISE,
    competitivePositioning: COMP_ANIMATION,
    competitivePositioningBreakdown: COMP_ANIMATION_BREAKDOWN,
    competitivePositioningSources: COMP_ANIMATION_SOURCES,
  },
  "indie_vfx": {
    screen2Headline: "VFX studios with AI pipelines are now quoting turnaround times that manual studios cannot match. Speed has become a procurement criterion alongside price and quality.",
    risks: RISKS_VFX,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VFX,
    getRecommendedTierId: ALWAYS_STARTER,
    competitivePositioning: COMP_VFX,
    competitivePositioningBreakdown: COMP_VFX_BREAKDOWN,
    competitivePositioningSources: COMP_VFX_SOURCES,
  },
  "midsize_vfx": {
    screen2Headline: "VFX studios with AI pipelines are now quoting turnaround times that manual studios cannot match. Speed has become a procurement criterion alongside price and quality.",
    risks: RISKS_VFX,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VFX,
    getRecommendedTierId: ALWAYS_STUDIO,
    competitivePositioning: COMP_VFX,
    competitivePositioningBreakdown: COMP_VFX_BREAKDOWN,
    competitivePositioningSources: COMP_VFX_SOURCES,
  },
  "aaa_vfx": {
    screen2Headline: "VFX studios with AI pipelines are now quoting turnaround times that manual studios cannot match. Speed has become a procurement criterion alongside price and quality.",
    risks: RISKS_VFX,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VFX,
    getRecommendedTierId: BUDGET_ENTERPRISE,
    competitivePositioning: COMP_VFX,
    competitivePositioningBreakdown: COMP_VFX_BREAKDOWN,
    competitivePositioningSources: COMP_VFX_SOURCES,
  },
  "publisher_vfx": {
    screen2Headline: "VFX studios with AI pipelines are now quoting turnaround times that manual studios cannot match. Speed has become a procurement criterion alongside price and quality.",
    risks: RISKS_VFX,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VFX,
    getRecommendedTierId: ALWAYS_ENTERPRISE,
    competitivePositioning: COMP_VFX,
  },
  "indie_virtualproduction": {
    screen2Headline: "Real-time engines changed what is possible on set. AI is changing what it costs to get there.",
    risks: RISKS_VP,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VP,
    getRecommendedTierId: ALWAYS_STARTER,
    competitivePositioning: COMP_VP,
  },
  "midsize_virtualproduction": {
    screen2Headline: "Real-time engines changed what is possible on set. AI is changing what it costs to get there.",
    risks: RISKS_VP,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VP,
    getRecommendedTierId: ALWAYS_STUDIO,
    competitivePositioning: COMP_VP,
  },
  "aaa_virtualproduction": {
    screen2Headline: "Real-time engines changed what is possible on set. AI is changing what it costs to get there.",
    risks: RISKS_VP,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VP,
    getRecommendedTierId: ALWAYS_ENTERPRISE,
    competitivePositioning: COMP_VP,
  },
  "publisher_virtualproduction": {
    screen2Headline: "Real-time engines changed what is possible on set. AI is changing what it costs to get there.",
    risks: RISKS_VP,
    defaultExpandedIds: [1, 2, 3],
    roiMetrics: METRICS_VP,
    getRecommendedTierId: ALWAYS_ENTERPRISE,
    competitivePositioning: COMP_VP,
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getScenario(studioScale: string, outputType: string): ScenarioData {
  if (outputType === "mixed") return SCENARIOS["aaa_games"]!;
  const key = `${studioScale}_${outputType}`;
  return SCENARIOS[key] ?? SCENARIOS["aaa_games"]!;
}

export function getTopRisks(studioScale: string, outputType: string): RiskEntry[] {
  return getScenario(studioScale, outputType).risks.slice(0, 3);
}

// ─── Sources ──────────────────────────────────────────────────────────────────

const ALWAYS_SOURCES: SourceRef[] = [
  {
    num: "[1]",
    org: "BCG",
    title: "Video Gaming Report 2026: How Platforms Are Colliding and Why This Will Spark the Next Era of Growth",
    description: "3,000-gamer global survey and independent Steam metadata analysis. December 2025.",
    url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth",
  },
  {
    num: "[2]",
    org: "Bloomberg / Jason Schreier",
    title: "AAA Game Development Costs, March 2026",
    description: "Primary reporting from US and Canadian studio sources confirming budgets now start at $300M.",
    url: "https://bsky.app/profile/jasonschreier.bsky.social/post/3mhvx2lohzs2j",
  },
  {
    num: "[3]",
    org: "ESAC / Nordicity",
    title: "The Canadian Video Game Industry 2021",
    description: "Government-commissioned economic impact study of 937 active Canadian studios.",
    url: "https://theesa.ca/wp-content/uploads/2022/10/esac-2021-final-report.pdf",
  },
  {
    num: "[4]",
    org: "GDC",
    title: "State of the Game Industry 2025",
    description: "Annual developer survey.",
    url: "https://gdconf.com/state-of-the-game-industry",
  },
];

const SOURCES_GAMES: SourceRef[] = [
  {
    num: "[5]",
    org: "a16z Games",
    title: "AI in Game Development Survey 2024",
    description: "Survey of 650 game developers on AI adoption and productivity impact.",
    url: "https://a16z.com/games-ai-survey-2024",
  },
  {
    num: "[6]",
    org: "Third Point Ventures",
    title: "AI Impact on Gaming and Media Tooling 2025",
    description: "",
    url: "https://www.thirdpointventures.com/currents/AI-impact-on-gaming-and-media-tooling",
  },
  {
    num: "[7]",
    org: "StudioKrew",
    title: "Economics of Game Development 2025",
    description: "",
    url: "https://studiokrew.com/blog/the-economics-of-game-development-2025",
  },
];

const SOURCES_ANIMATION: SourceRef[] = [
  {
    num: "[5]",
    org: "Morgan Stanley Research",
    title: "Generative AI Cost Impact in Film and Television 2024",
    description: "Projects 30% cost reduction through AI integration in post-production.",
    url: "https://www.google.com/search?q=Morgan+Stanley+generative+AI+film+television+2024",
  },
  {
    num: "[6]",
    org: "Vitrina AI",
    title: "AI in Animation Strategic Report 2025",
    description: "",
    url: "https://vitrina.ai/blog/ai-in-animation-strategic-report-2026",
  },
  {
    num: "[7]",
    org: "Ynput",
    title: "State of Animation and VFX Pipelines 2025",
    description: "Survey of 200+ studios worldwide.",
    url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report",
  },
  {
    num: "[8]",
    org: "Roland Berger",
    title: "AI Innovations for VFX and Animation",
    description: "",
    url: "https://www.rolandberger.com/en/Insights/Publications/AI-Innovations-for-VFX-and-animation.html",
  },
];

const SOURCES_VFX: SourceRef[] = [
  {
    num: "[5]",
    org: "Roland Berger",
    title: "AI Innovations for VFX and Animation",
    description: "20 to 65% time savings on AI auto-rotoscoping across five film genres.",
    url: "https://www.rolandberger.com/en/Insights/Publications/AI-Innovations-for-VFX-and-animation.html",
  },
  {
    num: "[6]",
    org: "Ynput",
    title: "State of Animation and VFX Pipelines 2025",
    description: "Survey of 200+ studios worldwide.",
    url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report",
  },
  {
    num: "[7]",
    org: "VFX Voice",
    title: "Industry Outlook 2026",
    description: "",
    url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity",
  },
  {
    num: "[8]",
    org: "Vitrina",
    title: "Top 10 VFX Companies 2026: Executive Procurement Guide",
    description: "",
    url: "https://vitrina.ai/blog/discover-the-best-vfx-studios-worldwide-top-10-vfx-companies",
  },
  {
    num: "[9]",
    org: "LBBOnline / Sohonet",
    title: "Generative AI Cost Compression: Post and VFX Workflow Impact 2026",
    description: "DNEG 28% roto labour reduction. Amazon 40% faster first-pass edit.",
    url: "https://lbbonline.com/news/Generative-AI-Cost-Compression-Post-and-VFX-Workflow-Impact-2026-2030",
  },
];

const SOURCES_VP: SourceRef[] = [
  {
    num: "[5]",
    org: "Beeble AI",
    title: "SwitchLight Production Documentation",
    description: "AI relighting and rotoscoping for virtual production workflows.",
    url: "https://beeble.ai",
  },
  {
    num: "[6]",
    org: "Autodesk Flow Studio",
    title: "Superman and Lois Case Study",
    description: "AI-assisted mocap and VFX without specialised hardware.",
    url: "https://www.autodesk.com/solutions/media-entertainment/ai-visual-effects",
  },
  {
    num: "[7]",
    org: "VFX Voice",
    title: "Industry Outlook 2026",
    description: "",
    url: "https://vfxvoice.com/entering-2026-vfx-animation-industry-balances-uncertainty-and-opportunity",
  },
  {
    num: "[8]",
    org: "Ynput",
    title: "State of Animation and VFX Pipelines 2025",
    description: "",
    url: "https://ynput.io/the-state-of-animation-vfx-pipelines-report",
  },
];

const SOURCE_PUBLISHER_APPEND: SourceRef = {
  num: "[+]",
  org: "BCG",
  title: "Cloud Gaming Projection",
  description: "$1.4B to $18.3B by 2030. CAGR above 50%. Part of BCG Video Gaming Report 2026.",
  url: "https://www.bcg.com/publications/2025/video-gaming-report-2026-next-era-of-growth",
};

export function getSources(studioScale: string, outputType: string): SourceRef[] {
  const base = [...ALWAYS_SOURCES];
  const ot = outputType === "mixed" ? "games" : outputType;

  if (ot === "games") base.push(...SOURCES_GAMES);
  else if (ot === "animation") base.push(...SOURCES_ANIMATION);
  else if (ot === "vfx") base.push(...SOURCES_VFX);
  else if (ot === "virtualproduction") base.push(...SOURCES_VP);

  if (studioScale === "publisher") base.push(SOURCE_PUBLISHER_APPEND);

  return base;
}
