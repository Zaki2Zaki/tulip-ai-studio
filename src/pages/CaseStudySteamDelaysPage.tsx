import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, ExternalLink, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingScrollTop from "@/components/FloatingScrollTop";
import heroImg from "@/assets/steam-delays-hero.jpg";
import fig1Img from "@/assets/steam-fig1-data-collection.jpg";
import fig2Img from "@/assets/steam-fig2-delay-distribution.jpg";
import fig3Img from "@/assets/steam-fig3-genre-correlation.jpg";

const ARXIV_URL = "https://arxiv.org/abs/2204.11191";
const PDF_URL = "https://arxiv.org/pdf/2204.11191v1";
const CITATION = "Grewal, B., Lin, D., Doucet, L., & Bezemer, C.-P. (2022). An Empirical Study of Delayed Games on Steam. arXiv:2204.11191v1 [cs.GT]";

/* ── Diagram blocks ── */
const diagramBlocks = [
{
  id: "data",
  label: "SteamDB Data Collection",
  color: "bg-[hsl(270_40%_15%/0.6)]",
  hoverTitle: "23,485 Games Analyzed",
  hoverDescription: "Large-scale data collection from SteamDB covering release dates, delays, genres, and developer metadata across the entire Steam catalogue.",
  hoverMetric: "23,485 titles scraped",
  citation: "Table 1 & Figure 1"
},
{
  id: "analysis",
  label: "Delay Pattern Analysis",
  color: "bg-[hsl(220_40%_15%/0.6)]",
  hoverTitle: "48% of Games Delayed",
  hoverDescription: "Nearly half of all Steam games experience at least one delay. Median delay is 14 days, but early-access and indie titles skew higher.",
  hoverMetric: "48% delay rate · 14-day median",
  citation: "Section 4.2"
},
{
  id: "impact",
  label: "Rating & Revenue Impact",
  color: "bg-[hsl(160_40%_15%/0.6)]",
  hoverTitle: "Ratings Barely Affected",
  hoverDescription: "Delayed games show negligible difference in user ratings — suggesting players care about quality at launch, not schedule adherence.",
  hoverMetric: "< 2% rating variance",
  citation: "Section 5.1"
},
{
  id: "strategy",
  label: "Release Strategy Insights",
  color: "bg-[hsl(25_50%_15%/0.6)]",
  hoverTitle: "Ranges Beat Specific Dates",
  hoverDescription: "Games announcing release windows (e.g. 'Q2 2026') instead of exact dates have significantly lower perceived delay rates and community backlash.",
  hoverMetric: "Release ranges recommended",
  citation: "Section 6"
}];


const capabilities = [
"Delay Prediction",
"Release Window Optimization",
"Pipeline Risk Scoring",
"Milestone Forecasting",
"Community Sentiment Analysis"];


const buildingBlocks = [
"SteamDB API",
"Statistical Modeling",
"NLP Sentiment",
"Tulip Tech R&D Pipeline Optimizer",
"Open Telemetry"];


/* ── Figures ── */
const figures = [
{
  id: "fig1",
  title: "Figure 1: Data Collection Flow",
  description: "The systematic pipeline for scraping, cleaning, and categorizing 23,485 Steam game entries for delay analysis.",
  citation: "Grewal et al. (2022) – Figure 1, p.6"
},
{
  id: "fig2",
  title: "Figure 2: Delay Distribution",
  description: "Histogram showing the distribution of delay durations — median 14 days with a long tail of multi-month delays for AAA titles.",
  citation: "Grewal et al. (2022) – Figure 3, p.8"
},
{
  id: "fig3",
  title: "Figure 3: Genre vs. Delay Correlation",
  description: "Heatmap revealing which game genres are most prone to delays — simulation and strategy titles lead, while casual games ship closer to schedule.",
  citation: "Grewal et al. (2022) – Figure 5, p.10"
}];


const CitationBadge = ({ small = false }: {small?: boolean;}) =>
<a
  href={ARXIV_URL}
  target="_blank"
  rel="noopener noreferrer"
  className={`inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors ${small ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"} font-body text-primary`}>
  
    <BookOpen className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />
    Grewal et al. (2022) arXiv:2204.11191v1
  </a>;


const DownloadButton = ({ size = "sm" }: {size?: "sm" | "lg";}) =>
<a
  href={PDF_URL}
  target="_blank"
  rel="noopener noreferrer"
  className={`inline-flex items-center gap-2 rounded-full font-body font-semibold transition-all hover:scale-105 ${
  size === "lg" ?
  "px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 glow-gold" :
  "px-3.5 py-1.5 text-xs border border-primary/30 text-primary hover:bg-primary/10"}`
  }>
  
    <Download className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />
    {size === "lg" ? "Download Full PDF" : "Download PDF"}
  </a>;


const CaseStudySteamDelaysPage = () => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-12 section-padding">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-10">
            
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-bold case-study-hero-title flex-1">
              Steam Game Delays  Empirical Insights That Prevent Pipeline Slippage

            </motion.h1>
            <div className="flex flex-col items-end gap-2 shrink-0 pt-2">
              <CitationBadge />
              <DownloadButton />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base font-body max-w-3xl mb-6 text-white">
            
            48% of 23,485 Steam titles delayed (median 14 days) — AI prevents it. First large-scale study shows release ranges beat specific dates, indie/early-access games delay more, ratings barely affected. Tulip Tech R&D turns data into on-time pipelines.
          </motion.p>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-2xl overflow-hidden border border-border/50 mb-12">
            
            
            <div className="absolute top-4 right-4">
              <CitationBadge small />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Executive Summary ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6">Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
            { stat: "23,485", label: "Games Analyzed", sub: "Largest Steam delay dataset" },
            { stat: "48%", label: "Were Delayed", sub: "Nearly half of all titles" },
            { stat: "14 days", label: "Median Delay", sub: "But long tail to months" }].
            map((item) =>
            <div key={item.label} className="rounded-xl bg-card border border-border/50 p-6 text-center">
                <p className="font-display font-bold text-3xl text-gradient-gold mb-1">{item.stat}</p>
                <p className="font-body font-semibold text-foreground text-sm mb-0.5">{item.label}</p>
                <p className="font-body text-xs text-muted-foreground">{item.sub}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Interactive Architecture Diagram ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-lg bg-muted/50 border border-border/50 mb-4">
                <span className="text-xs font-body text-muted-foreground tracking-wide uppercase">Interactive Pipeline Visualization</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">Research Architecture</h2>
            </div>
            <CitationBadge small />
          </div>

          {/* Diagram blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {diagramBlocks.map((block) =>
            <div
              key={block.id}
              className="relative"
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}>
              
                <motion.div
                className={`${block.color} rounded-xl p-6 border border-border/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-8px_hsl(260_80%_70%/0.3)] hover:border-primary/40 min-h-[100px] flex flex-col justify-center`}
                whileHover={{ scale: 1.02 }}>
                
                  <p className="font-display font-semibold text-foreground text-sm mb-1">{block.label}</p>
                  <p className="text-xs text-muted-foreground font-body">Hover for details</p>
                </motion.div>

                <AnimatePresence>
                  {hoveredBlock === block.id &&
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full mt-2 z-30 bg-card border border-border rounded-xl p-5 shadow-2xl backdrop-blur-xl">
                  
                      <p className="font-display font-bold text-foreground text-sm mb-2">{block.hoverTitle}</p>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">{block.hoverDescription}</p>
                      {block.hoverMetric &&
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                          <span className="text-xs font-body font-semibold text-primary">{block.hoverMetric}</span>
                        </div>
                  }
                      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                        <span className="text-[10px] font-body text-muted-foreground">
                          Citation: {block.citation} (arXiv:2204.11191v1)
                        </span>
                        <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="text-[10px] font-body text-primary hover:underline flex items-center gap-1">
                          <Download className="w-2.5 h-2.5" /> PDF
                        </a>
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Capabilities + Building Blocks */}
          <div className="rounded-xl bg-[hsl(25_80%_20%/0.3)] border border-[hsl(25_80%_50%/0.3)] p-5 mb-4">
            <p className="text-sm font-display font-bold text-foreground mb-3">Key Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap) =>
              <span key={cap} className="text-xs font-body px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30">{cap}</span>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-[hsl(50_70%_20%/0.2)] border border-[hsl(50_70%_40%/0.3)] p-5">
            <p className="text-sm font-display font-bold text-foreground mb-3">Building Blocks</p>
            <div className="flex flex-wrap gap-2">
              {buildingBlocks.map((bb) =>
              <span key={bb} className="text-xs font-body px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30">{bb}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Toolchain Integration ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6">Toolchain Integration</h2>
          <div className="rounded-2xl bg-card border border-border/50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-3"><h3 className="font-display font-semibold text-foreground text-lg mb-3">How Tulip Tech R&D Uses This Data</h3></h3>
                <ul className="space-y-3 font-body text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Ingest your project milestones & compare against 23k Steam delay patterns</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Predict delay risk by genre, team size, and early-access status</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Recommend release window strategies backed by empirical data</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Automate pipeline checkpoints to catch slippage before it compounds</li>
                </ul>
              </div>
              <div className="rounded-xl bg-muted/30 border border-border/30 p-6">
                <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-3">Source Citation</p>
                <p className="text-sm font-body text-foreground leading-relaxed mb-4">{CITATION}</p>
                <DownloadButton size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research Figures ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-foreground mb-8">Research Figures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {figures.map((fig) =>
            <motion.div
              key={fig.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden group">
              
                <div className="h-40 bg-muted/30 flex items-center justify-center">
                  <span className="text-xs font-body text-muted-foreground">Visual from paper</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-foreground text-sm mb-2">{fig.title}</h3>
                  <p className="text-xs font-body text-muted-foreground leading-relaxed mb-3">{fig.description}</p>
                  <p className="text-[10px] font-body text-muted-foreground/70 mb-2">{fig.citation}</p>
                  <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-body text-primary hover:underline">
                    <Download className="w-3 h-3" /> Download Full Paper
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Results & Insights ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6">Results & Insights</h2>
          <div className="space-y-4">
            {[
            { insight: "Release ranges outperform specific dates", detail: "Games announcing windows instead of exact dates see less community backlash and lower perceived delay." },
            { insight: "Indie & early-access titles delay more", detail: "Smaller teams with iterative development models are statistically more likely to push release dates." },
            { insight: "Ratings are barely affected by delays", detail: "User review scores show < 2% variance between delayed and on-time titles — quality at launch matters more." },
            { insight: "Tulip Tech R&D eliminates the guesswork", detail: "Feed your milestones into our pipeline optimizer and get data-backed release strategy recommendations in minutes." }].
            map((item, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display font-bold text-primary text-sm">{i + 1}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm mb-1">{item.insight}</p>
                  <p className="text-xs font-body text-muted-foreground">{item.detail}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-foreground mb-4">Ready to Ship On Time?</h2>
          <p className="text-sm font-body text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let Tulip Tech R&D analyze your pipelines and predict delay risks before they happen with optimization assessments and custom dev tools
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-body font-semibold text-sm text-white transition-all hover:scale-105 hover:shadow-[0_0_24px_-4px_hsl(260_80%_65%/0.5)]"
            style={{ background: "linear-gradient(135deg, hsl(250 70% 60%), hsl(300 60% 55%), hsl(220 80% 60%))" }}>
            
            Book Consultation <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto section-padding pb-12">
        <div className="flex items-center justify-between border-t border-border pt-8">
          <Link to="/case-studies/production" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Production
          </Link>
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
            All Case Studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Sticky Source Bar ── */}
      <AnimatePresence>
        {showSticky &&
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50 py-3 px-6">
          
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <CitationBadge small />
                <span className="text-xs font-body text-muted-foreground truncate hidden sm:inline">
                  An Empirical Study of Delayed Games on Steam
                </span>
              </div>
              <DownloadButton />
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <Footer />
      <FloatingScrollTop />
    </main>);

};

export default CaseStudySteamDelaysPage;