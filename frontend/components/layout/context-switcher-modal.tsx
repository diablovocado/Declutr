"use client";

import React, { useState } from "react";
import { FolderKey, Bookmark, Folder, FileText, MessageSquare, Search, ArrowRight, X, Command } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../overlay/dialog";
import { useWorkspaceContext, WorkspaceItem } from "../../shared/providers/workspace-context-provider";
import { Badge } from "../ui/badge";

export interface ContextSwitcherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContextSwitcherModal({ open, onOpenChange }: ContextSwitcherModalProps) {
  const {
    activeVault,
    recentContexts,
    switchVault,
    switchCollection,
    switchProject,
    setActiveDocument,
  } = useWorkspaceContext();

  const [query, setQuery] = useState("");

  const availableItems: WorkspaceItem[] = [
    { id: "v_default", name: "My Life Vault", type: "vault" },
    { id: "v_work", name: "Work & Research Vault", type: "vault" },
    { id: "col_tax_2025", name: "Financial & Tax 2025", type: "collection" },
    { id: "col_medical", name: "Medical & Health Records", type: "collection" },
    { id: "proj_tax_filing", name: "2025 Tax Filing Project", type: "project" },
    { id: "file_demo_01", name: "Tax_Filing_Form_1040_2025.pdf", type: "document" },
    { id: "file_demo_02", name: "Cardiology_Prescription_Dr_Sharma.pdf", type: "document" },
  ];

  const filtered = availableItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: WorkspaceItem) => {
    if (item.type === "vault") {
      switchVault(item);
    } else if (item.type === "collection") {
      switchCollection(item);
    } else if (item.type === "project") {
      switchProject(item);
    } else if (item.type === "document") {
      setActiveDocument(item);
    }
    onOpenChange(false);
  };

  const getIcon = (type?: WorkspaceItem["type"]) => {
    switch (type) {
      case "vault": return <FolderKey className="h-4 w-4 text-emerald-400" />;
      case "collection": return <Bookmark className="h-4 w-4 text-purple-400" />;
      case "project": return <Folder className="h-4 w-4 text-amber-400" />;
      case "document": return <FileText className="h-4 w-4 text-blue-400" />;
      default: return <FolderKey className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Command className="h-4 w-4 text-emerald-400" /> Fast Context Switcher (⌘J)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Switch between Vaults, Collections, Projects, or Recent Files instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspace context..."
            className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-3"
            autoFocus
          />

          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getIcon(item.type)}
                  <span className="text-xs font-semibold text-slate-200 truncate">{item.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono py-0 px-1.5">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
