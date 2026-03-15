import { motion } from "framer-motion";

const stages = [
  { id: "pre-production", label: "Pre-Production" },
  { id: "production", label: "Production" },
  { id: "post-production", label: "Post-Production" },
] as const;

type StageId = (typeof stages)[number]["id"];

interface StageTabsProps {
  active: StageId;
  onChange: (id: StageId) => void;
}

const StageTabs = ({ active, onChange }: StageTabsProps) => (
  <div className="flex items-center gap-2 flex-wrap justify-center">
    {stages.map((s) => (
      <button
        key={s.id}
        onClick={() => onChange(s.id)}
        className={`relative px-6 py-2.5 rounded-full font-body font-medium text-sm transition-all duration-300 ${
          active === s.id
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50"
        }`}
      >
        {active === s.id && (
          <motion.div
            layoutId="stage-tab-bg"
            className="absolute inset-0 rounded-full iridescent-tab-active"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{s.label}</span>
      </button>
    ))}
  </div>
);

export type { StageId };
export default StageTabs;
