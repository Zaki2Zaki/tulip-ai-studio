import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Search, ListFilter, MousePointerClick, FolderPlus, ThumbsUp, Bot, Download } from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Choose a Category",
    description: "Start by selecting a research category from the dropdown menu (e.g. 3D Animation, VFX, Game Dev). This sets your search scope.",
    icon: ListFilter,
    accent: "from-primary to-accent",
  },
  {
    number: 2,
    title: "Search or Browse",
    description: "Type keywords into the search bar to refine results, or browse the default results for your category. Papers are pulled from arXiv, CrossRef, OpenAlex & NVIDIA.",
    icon: Search,
    accent: "from-accent to-primary",
  },
  {
    number: 3,
    title: "Review Results",
    description: "Scan the results table — each paper shows a Match Rate, AI Flag, AI Label, Year, and TLDR summary. Use the year and match-rate sliders to filter further.",
    icon: MousePointerClick,
    accent: "from-primary to-accent",
  },
  {
    number: 4,
    title: "Deep Dive into Papers",
    description: "Click any paper to open the inline Deep Dive below the table. Read the abstract, preview the PDF, generate an AI executive summary, and chat with the AI about the paper.",
    icon: Bot,
    accent: "from-accent to-primary",
  },
  {
    number: 5,
    title: "Mark as Relevant or Not Useful",
    description: "Use the Relevant / Not Useful buttons to vote on papers. Relevant papers are automatically added to Bulk Review for batch processing.",
    icon: ThumbsUp,
    accent: "from-primary to-accent",
  },
  {
    number: 6,
    title: "Organize into Collections",
    description: "Create named collections in the sidebar. Drag-and-drop papers or use the bulk add feature to save papers into collections for later reference.",
    icon: FolderPlus,
    accent: "from-accent to-primary",
  },
  {
    number: 7,
    title: "Export & Download",
    description: "Download individual PDFs from the Deep Dive view, or export entire collections as ZIP files. Google Drive integration is coming soon.",
    icon: Download,
    accent: "from-primary to-accent",
  },
];

const LibraryGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-body font-semibold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
      >
        <HelpCircle className="w-4 h-4" />
        How to Use This Tool
      </button>

      {/* Guide overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 library-scroll"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-border bg-card/95 backdrop-blur-md">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Getting Started
                  </h2>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    Your step-by-step guide to the Library R&D tool
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps */}
              <div className="p-8 space-y-1">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex gap-5 group"
                  >
                    {/* Left: number + line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.accent} flex items-center justify-center shrink-0 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
                        <span className="text-sm font-display font-bold text-primary-foreground">{step.number}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent my-2 min-h-[24px]" />
                      )}
                    </div>

                    {/* Right: content */}
                    <div className="pb-8 flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <step.icon className="w-4 h-4 text-primary" />
                        <h3 className="font-display text-base font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 px-8 py-4 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-between">
                <p className="text-xs font-body text-muted-foreground italic">
                  *This tool is customized to each client's research needs
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-body font-semibold hover:bg-primary/90 transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LibraryGuide;
