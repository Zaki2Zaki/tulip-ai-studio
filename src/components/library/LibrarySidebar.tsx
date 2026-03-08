import { Upload, Tag, Layers, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface LibrarySidebarProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  categories: { id: string; label: string }[];
  onUploadClick: () => void;
  onAILabelClick: () => void;
  onBulkProcessClick: () => void;
}

const LibrarySidebar = ({
  activeCategory,
  onCategoryChange,
  categories,
  onUploadClick,
  onAILabelClick,
  onBulkProcessClick,
}: LibrarySidebarProps) => {
  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card/30 p-5 space-y-6 overflow-y-auto">
      {/* Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Actions
        </h3>
        <button
          onClick={onUploadClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-sm font-body text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all"
        >
          <Upload className="w-4 h-4 text-primary" />
          Upload Thesis Paper
        </button>
        <button
          onClick={onAILabelClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/50 text-sm font-body text-foreground hover:border-primary/20 transition-all"
        >
          <Tag className="w-4 h-4 text-accent" />
          Manual AI Label
        </button>
        <button
          onClick={onBulkProcessClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/50 text-sm font-body text-foreground hover:border-primary/20 transition-all"
        >
          <Layers className="w-4 h-4 text-primary" />
          Bulk Process
        </button>
      </div>

      {/* Category Filters */}
      <div className="space-y-2">
        <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          <Filter className="w-3 h-3 inline mr-1.5" />
          Subjects
        </h3>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-body transition-all ${
              activeCategory === cat.id
                ? "bg-primary/10 text-foreground border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default LibrarySidebar;
