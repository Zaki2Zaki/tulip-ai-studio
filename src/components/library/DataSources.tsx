import { Globe, Lock, CheckCircle } from "lucide-react";

export interface DataSource {
  name: string;
  key: string;
  status: "connected" | "locked";
  url: string;
  defaultEnabled: boolean;
}

export const ALL_SOURCES: DataSource[] = [
  { name: "CrossRef", key: "crossref", status: "connected", url: "https://www.crossref.org/", defaultEnabled: true },
  { name: "arXiv", key: "arxiv", status: "connected", url: "https://arxiv.org/", defaultEnabled: true },
  { name: "OpenAlex", key: "openalex", status: "connected", url: "https://openalex.org/", defaultEnabled: true },
  { name: "Google Scholar Labs", key: "google_scholar", status: "connected", url: "https://labs.google/fx/tools/whisk/project/3947eb33-9450-4dde-bbef-5563952c0293", defaultEnabled: true },
  { name: "Nvidia Publications", key: "nvidia", status: "connected", url: "https://research.nvidia.com/publications", defaultEnabled: true },
  { name: "Scholar Inbox", key: "scholar_inbox", status: "locked", url: "https://www.scholar-inbox.com/", defaultEnabled: false },
  { name: "ACM Digital Library", key: "acm", status: "locked", url: "https://dl.acm.org/", defaultEnabled: false },
  { name: "Substack", key: "substack", status: "locked", url: "https://substack.com/", defaultEnabled: false },
  { name: "Academia.edu", key: "academia", status: "locked", url: "https://www.academia.edu/", defaultEnabled: false },
  { name: "Elsevier", key: "elsevier", status: "locked", url: "https://www.elsevier.com/", defaultEnabled: false },
];

export const DEFAULT_ENABLED_KEYS = ALL_SOURCES.filter((s) => s.defaultEnabled).map((s) => s.key);

interface DataSourcesProps {
  enabledSources: Set<string>;
  onToggleSource: (key: string) => void;
}

const DataSources = ({ enabledSources, onToggleSource }: DataSourcesProps) => (
  <div className="space-y-2">
    <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-white mb-3">
      <Globe className="w-3 h-3 inline mr-1.5" />
      Data Sources
    </h3>
    {ALL_SOURCES.map((src) => {
      const isLocked = src.status === "locked";
      const isEnabled = enabledSources.has(src.key);

      return (
        <button
          key={src.key}
          onClick={() => !isLocked && onToggleSource(src.key)}
          disabled={isLocked}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-body transition-colors ${
            isLocked
              ? "opacity-50 cursor-not-allowed"
              : isEnabled
              ? "bg-primary/10 hover:bg-primary/15"
              : "hover:bg-muted/20"
          }`}
        >
          <span className={isEnabled && !isLocked ? "text-foreground" : "text-white"}>
            {src.name}
          </span>
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-white/50" />
          ) : isEnabled ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40" />
          )}
        </button>
      );
    })}
  </div>
);

export default DataSources;
