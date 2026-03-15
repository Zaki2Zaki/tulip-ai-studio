import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiagramBlock {
  id: string;
  label: string;
  color: string; // tailwind bg class using semantic tokens
  hoverTitle: string;
  hoverDescription: string;
  hoverMetric?: string;
}

interface CaseStudyDiagramProps {
  blocks: DiagramBlock[];
  capabilities: string[];
  buildingBlocks: string[];
  comingSoon?: boolean;
}

const CaseStudyDiagram = ({ blocks, capabilities, buildingBlocks, comingSoon }: CaseStudyDiagramProps) => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {comingSoon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="iridescent-badge px-6 py-3 rounded-full font-display font-bold text-lg tracking-wide">
            Q2 2026
          </div>
        </div>
      )}

      <div className={comingSoon ? "opacity-30 pointer-events-none select-none" : ""}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 rounded-lg bg-muted/50 border border-border/50">
            <span className="text-sm font-body text-muted-foreground tracking-wide uppercase">Pipeline Visualization</span>
          </div>
        </div>

        {/* Main blocks grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="relative"
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              <motion.div
                className={`${block.color} rounded-xl p-6 border border-border/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-8px_hsl(260_80%_70%/0.3)] hover:border-primary/40 min-h-[120px] flex flex-col justify-center`}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-display font-semibold text-foreground text-sm mb-1">{block.label}</p>
                <p className="text-xs text-muted-foreground font-body">Hover for details</p>
              </motion.div>

              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredBlock === block.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 z-30 bg-card border border-border rounded-xl p-5 shadow-2xl backdrop-blur-xl"
                  >
                    <p className="font-display font-bold text-foreground text-sm mb-2">{block.hoverTitle}</p>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed mb-2">{block.hoverDescription}</p>
                    {block.hoverMetric && (
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xs font-body font-semibold text-primary">{block.hoverMetric}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Key capabilities bar */}
        <div className="rounded-xl bg-[hsl(25_80%_20%/0.3)] border border-[hsl(25_80%_50%/0.3)] p-5 mb-4">
          <p className="text-sm font-display font-bold text-foreground mb-3">Key Capabilities</p>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap, i) => (
              <span key={i} className="text-xs font-body px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Building blocks bar */}
        <div className="rounded-xl bg-[hsl(50_70%_20%/0.2)] border border-[hsl(50_70%_40%/0.3)] p-5">
          <p className="text-sm font-display font-bold text-foreground mb-3">Building Blocks</p>
          <div className="flex flex-wrap gap-2">
            {buildingBlocks.map((bb, i) => (
              <span key={i} className="text-xs font-body px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30">
                {bb}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDiagram;
