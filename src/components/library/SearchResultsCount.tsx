import { Hash, Database, Globe } from "lucide-react";

interface SearchResultsCountProps {
  totalResults: number;
  searchQuery: string;
  sources: { name: string; count: number }[];
}

const SearchResultsCount = ({ totalResults, searchQuery, sources }: SearchResultsCountProps) => {
  if (!searchQuery && totalResults === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/20 border border-border">
      <div className="flex items-center gap-2">
        <Hash className="w-5 h-5 text-primary" />
        <span className="text-base font-body text-foreground font-semibold">{totalResults}</span>
        <span className="text-sm font-body text-white">results</span>
        {searchQuery && (
          <span className="text-sm font-body text-white">
            for "<span className="text-accent">{searchQuery}</span>"
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {sources.map((src) => (
          <div key={src.name} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/50 border border-border">
            {src.name === "CrossRef" ? (
              <Database className="w-3 h-3 text-primary" />
            ) : (
              <Globe className="w-3 h-3 text-accent" />
            )}
            <span className="text-sm font-body text-white">{src.name}</span>
            <span className="text-sm font-body text-foreground font-semibold">{src.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsCount;
