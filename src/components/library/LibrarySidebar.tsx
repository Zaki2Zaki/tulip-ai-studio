import { useState, useRef, useEffect } from "react";
import { Upload, Tag, Layers, Filter, FolderPlus, Folder, X, Plus, ChevronDown, Check } from "lucide-react";
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
  onDropToCollection?: (collectionId: string, paperId: string, paperTitle: string) => void;
  enabledSources: Set<string>;
  onToggleSource: (key: string) => void;
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
  onDropToCollection,
  enabledSources,
  onToggleSource,
}: LibrarySidebarProps) => {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = categories.find(c => c.id === activeCategory)?.label || "Select Subject";

  const handleCreate = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName("");
      setShowNewInput(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverId(collectionId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    setDragOverId(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.paperId && onDropToCollection) {
        onDropToCollection(collectionId, data.paperId, data.title);
      }
    } catch {
      // ignore
    }
  };

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card/30 p-5 space-y-6 overflow-y-auto library-scroll">
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

      {/* Subject Filter — Dropdown */}
      <div className="relative" ref={subjectRef}>
        <h3 className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          <Filter className="w-3 h-3 inline mr-1.5" />
          Subject
        </h3>

        {/* Selected subject pill — acts as trigger */}
        <button
          onClick={() => setSubjectOpen(!subjectOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-body text-foreground font-medium text-left transition-all hover:bg-primary/15"
        >
          <span className="truncate">{activeLabel}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 ml-2 text-muted-foreground transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown list — absolutely positioned, aligned to pill bottom */}
        {subjectOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg border border-border bg-card shadow-xl max-h-64 overflow-y-auto library-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  setSubjectOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-body transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
              >
                {activeCategory === cat.id && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                <span className={activeCategory === cat.id ? "" : "pl-5.5"}>{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collections - drop targets */}
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
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
              dragOverId === col.id
                ? "bg-accent/15 border border-accent/40 ring-1 ring-accent/20 scale-[1.02]"
                : "hover:bg-muted/20 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Folder className={`w-3.5 h-3.5 shrink-0 transition-colors ${dragOverId === col.id ? "text-accent" : "text-accent/60"}`} />
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
      <DataSources enabledSources={enabledSources} onToggleSource={onToggleSource} />
    </aside>
  );
};

export default LibrarySidebar;
