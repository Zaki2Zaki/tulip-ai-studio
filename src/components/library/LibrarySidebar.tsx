import { useState } from "react";
import { Upload, Tag, Layers, FolderPlus, Folder, X, Plus, Download, Cloud } from "lucide-react";
import { toast } from "sonner";
import DataSources from "./DataSources";

export interface Collection {
  id: string;
  name: string;
  paperIds: string[];
}

interface LibrarySidebarProps {
  onUploadClick: () => void;
  onAILabelClick: () => void;
  onBulkProcessClick: () => void;
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  onDropToCollection?: (collectionId: string, paperId: string, paperTitle: string) => void;
  enabledSources: Set<string>;
  onToggleSource: (key: string) => void;
  activeCollectionId?: string | null;
  onCollectionClick?: (collectionId: string | null) => void;
}

const LibrarySidebar = ({
  onUploadClick,
  onAILabelClick,
  onBulkProcessClick,
  collections,
  onCreateCollection,
  onDeleteCollection,
  onDropToCollection,
  enabledSources,
  onToggleSource,
  activeCollectionId,
  onCollectionClick,
}: LibrarySidebarProps) => {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

      {/* Collections - drop targets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-bold uppercase tracking-widest">
            <FolderPlus className="w-4 h-4 inline mr-1.5" />
            <span className="text-foreground">MY </span><span className="text-gradient-gold">COLLECTIONS</span>
          </h3>
          <button
            onClick={() => setShowNewInput(true)}
            className="p-1 rounded-md hover:bg-muted/30 text-gradient-gold hover:text-foreground transition-colors"
          >
            <Plus className="w-3.5 h-3.5" style={{ color: 'hsl(200 40% 82%)' }} />
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
            onClick={() => onCollectionClick?.(activeCollectionId === col.id ? null : col.id)}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group cursor-pointer ${
              activeCollectionId === col.id
                ? "bg-primary/15 border border-primary/40 ring-1 ring-primary/20"
                : dragOverId === col.id
                ? "bg-accent/15 border border-accent/40 ring-1 ring-accent/20 scale-[1.02]"
                : "hover:bg-muted/20 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Folder className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeCollectionId === col.id ? "text-primary" : dragOverId === col.id ? "text-accent" : "text-accent/60"}`} />
              <span className={`text-sm font-body truncate ${activeCollectionId === col.id ? "text-foreground font-semibold" : "text-foreground"}`}>{col.name}</span>
              <span className="text-xs text-muted-foreground">{col.paperIds.length}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteCollection(col.id); }}
              className="p-1 rounded-md text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Collection export actions */}
          <div className="flex items-center gap-1 pl-9 -mt-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (col.paperIds.length === 0) {
                  toast.info("No papers in this collection to download");
                  return;
                }
                toast.success(`Preparing ZIP of ${col.paperIds.length} paper(s)…`, { description: "Download will start shortly." });
                // TODO: implement actual ZIP generation from paper PDF URLs
              }}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-body text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
              title="Download collection as ZIP"
            >
              <Download className="w-3 h-3" />
              ZIP
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (col.paperIds.length === 0) {
                  toast.info("No papers in this collection to save");
                  return;
                }
                toast.info("Google Drive integration coming soon", { description: "Connect your Google account to save collections directly to Drive." });
              }}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-body text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
              title="Save to Google Drive"
            >
              <Cloud className="w-3 h-3" />
              Drive
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
