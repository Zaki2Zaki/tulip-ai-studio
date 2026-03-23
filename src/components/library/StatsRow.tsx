import { BookOpen, Bot, Clock, Headphones, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatsData {
  totalPapers: number;
  pdfRate: number;
  lastScrapeMinutes: number;
  totalSearches: number;
  scheduledSearches: number;
  errorCount: number;
}

interface StatsRowProps {
  papersCount: number;
  processedCount: number;
  lastScrapeMinutes: number;
  audioCount: number;
}

const StatsRow = ({ papersCount }: StatsRowProps) => {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get recent logs (last 24h)
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: logs } = await supabase
          .from("search_logs")
          .select("*")
          .gte("created_at", since)
          .order("created_at", { ascending: false });

        if (!logs) return;

        const totalSearches = logs.length;
        const scheduledSearches = logs.filter((l: any) => l.is_scheduled).length;
        const errorCount = logs.filter((l: any) => !!l.error).length;
        const totalPapers = logs.reduce((sum: number, l: any) => sum + (l.total_results || 0), 0);
        const totalPdfs = logs.reduce((sum: number, l: any) => sum + (l.pdf_count || 0), 0);
        const pdfRate = totalPapers > 0 ? Math.round((totalPdfs / totalPapers) * 100) : 0;

        // Last scrape time
        const lastScheduled = logs.find((l: any) => l.is_scheduled);
        const lastScrapeMinutes = lastScheduled
          ? Math.round((Date.now() - new Date(lastScheduled.created_at).getTime()) / 60000)
          : -1;

        setData({ totalPapers, pdfRate, lastScrapeMinutes, totalSearches, scheduledSearches, errorCount });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Papers Found (24h)",
      value: data ? data.totalPapers.toLocaleString() : papersCount,
      icon: BookOpen,
      accent: "text-primary",
    },
    {
      label: "PDF Coverage",
      value: data ? `${data.pdfRate}%` : "—",
      icon: Bot,
      accent: "text-accent",
    },
    {
      label: "Last Auto-Scrape",
      value: data && data.lastScrapeMinutes >= 0 ? `${data.lastScrapeMinutes}m ago` : "Not yet",
      icon: Clock,
      accent: "text-green-400",
    },
    {
      label: "Searches (24h)",
      value: data ? `${data.totalSearches}` : "—",
      icon: Activity,
      accent: "text-yellow-400",
      subtitle: data && data.errorCount > 0 ? `${data.errorCount} errors` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-colors"
        >
          <div className={`p-2.5 rounded-lg bg-muted/30 ${s.accent}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-display font-bold text-foreground leading-none">{s.value}</p>
            <p className="text-xs font-body text-white uppercase tracking-wider mt-0.5">{s.label}</p>
            {(s as any).subtitle && (
              <p className="text-[9px] text-destructive mt-0.5">{(s as any).subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
