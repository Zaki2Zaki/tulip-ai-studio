import { BookOpen, Bot, Clock, Headphones } from "lucide-react";

interface StatsRowProps {
  papersCount: number;
  processedCount: number;
  lastScrapeMinutes: number;
  audioCount: number;
}

const StatsRow = ({ papersCount, processedCount, lastScrapeMinutes, audioCount }: StatsRowProps) => {
  const stats = [
    { label: "Papers in Library", value: papersCount, icon: BookOpen, accent: "text-primary" },
    { label: "Processed with AI", value: processedCount, icon: Bot, accent: "text-accent" },
    { label: "Last Scrape", value: `${lastScrapeMinutes}m ago`, icon: Clock, accent: "text-green-400" },
    { label: "Audio Summaries", value: audioCount, icon: Headphones, accent: "text-yellow-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-colors"
        >
          <div className={`p-2 rounded-lg bg-muted/30 ${s.accent}`}>
            <s.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-display font-bold text-foreground leading-none">{s.value}</p>
            <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
