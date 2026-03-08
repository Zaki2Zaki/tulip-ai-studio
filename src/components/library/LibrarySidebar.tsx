import { useState } from "react";
import { Upload, Tag, Layers, Filter, FolderPlus, Folder, X, Plus } from "lucide-react";
import DataSources from "./DataSources";

export interface Collection {
  id: string;
  name: string;
  paperIds: string[];
}

interface LibrarySidebarProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  categories: { id: string; label: string }[];
  onUploadClick: () => void;
  onAILabelClick: () => void;
  onBulkProcessClick: () => void;
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
}

const LibrarySidebar = ({
  activeCategory,
  onCategoryChange,
  categories,
  onUploadClick,
  onAILabelClick,
  onBulkProcessClick,
  collections,
  onCreateCollection,
  onDeleteCollection,
}: LibrarySidebarProps) => {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);

  const handleCreate = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName("");
      setShowNewInput(false);
    }
  };

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

      {/* Collections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground">
            <FolderPlus className="w-3 h-3 inline mr-1.5" />
            My Collections
          </h3>
          <button
            onClick={() => setShowNewInput(true)}
            className="p-1 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {showNewInput && (
          <div className="flex gap-1">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Collection name…"
              className="flex-1 bg-muted/30 border border-border rounded-md px-2 py-1.5 text-xs text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              autoFocus
            />
            <button onClick={handleCreate} className="px-2 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-body">
              Add
            </button>
            <button onClick={() => setShowNewInput(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {collections.length === 0 && !showNewInput && (
          <p className="text-xs text-muted-foreground font-body px-2">No collections yet</p>
        )}

        {collections.map((col) => (
          <div
            key={col.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Folder className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-sm font-body text-foreground truncate">{col.name}</span>
              <span className="text-xs text-muted-foreground">{col.paperIds.length}</span>
            </div>
            <button
              onClick={() => onDeleteCollection(col.id)}
              className="p-1 rounded-md text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <DataSources />
    </aside>
  );
};

export default LibrarySidebar;
