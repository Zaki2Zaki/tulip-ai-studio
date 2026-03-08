import { Globe, Lock, CheckCircle } from "lucide-react";

const SOURCES = [
  { name: "CrossRef", status: "connected" as const, url: "https://www.crossref.org/" },
  { name: "arXiv", status: "connected" as const, url: "https://arxiv.org/" },
  { name: "OpenAlex", status: "connected" as const, url: "https://openalex.org/" },
  { name: "Google Scholar Labs", status: "connected" as const, url: "https://labs.google/fx/tools/whisk/project/3947eb33-9450-4dde-bbef-5563952c0293" },
  { name: "Scholar Inbox", status: "locked" as const, url: "https://www.scholar-inbox.com/" },
  { name: "ACM Digital Library", status: "locked" as const, url: "https://dl.acm.org/" },
  { name: "Substack", status: "locked" as const, url: "https://substack.com/" },
  { name: "Academia.edu", status: "locked" as const, url: "https://www.academia.edu/" },
  { name: "Elsevier", status: "locked" as const, url: "https://www.elsevier.com/" },
];

const DataSources = () => (
  <div className="space-y-2">
    <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      <Globe className="w-3 h-3 inline mr-1.5" />
      Data Sources
    </h3>
    {SOURCES.map((src) => (
      <a
        key={src.name}
        href={src.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-body hover:bg-muted/20 transition-colors"
      >
        <span className={src.status === "connected" ? "text-foreground" : "text-muted-foreground"}>
          {src.name}
        </span>
        {src.status === "connected" ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
        )}
      </a>
    ))}
  </div>
);

export default DataSources;
