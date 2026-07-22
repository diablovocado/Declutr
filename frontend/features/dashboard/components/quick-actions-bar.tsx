"use client";

import React from "react";
import { Upload, Scan, FolderPlus, BookmarkPlus, MessageSquare, Search, FileUp, Workflow } from "lucide-react";
import { Button } from "../../../components/ui/button";

export interface QuickActionsBarProps {
  onUploadFile: () => void;
  onScanDocument: () => void;
  onCreateFolder: () => void;
  onCreateCollection: () => void;
  onAskAI: () => void;
  onSearchEverything: () => void;
  onImportFiles: () => void;
  onCreateWorkflow: () => void;
}

export function QuickActionsBar({
  onUploadFile,
  onScanDocument,
  onCreateFolder,
  onCreateCollection,
  onAskAI,
  onSearchEverything,
  onImportFiles,
  onCreateWorkflow,
}: QuickActionsBarProps) {
  const actions = [
    { label: "Upload File", icon: <Upload className="h-4 w-4 text-emerald-400" />, onClick: onUploadFile, variant: "default" as const },
    { label: "Scan Document", icon: <Scan className="h-4 w-4 text-purple-400" />, onClick: onScanDocument, variant: "outline" as const },
    { label: "Ask AI Copilot", icon: <MessageSquare className="h-4 w-4 text-blue-400" />, onClick: onAskAI, variant: "outline" as const },
    { label: "Search Vault", icon: <Search className="h-4 w-4 text-amber-400" />, onClick: onSearchEverything, variant: "outline" as const },
    { label: "Create Collection", icon: <BookmarkPlus className="h-4 w-4 text-cyan-400" />, onClick: onCreateCollection, variant: "outline" as const },
    { label: "New Folder", icon: <FolderPlus className="h-4 w-4 text-indigo-400" />, onClick: onCreateFolder, variant: "outline" as const },
    { label: "Import Files", icon: <FileUp className="h-4 w-4 text-emerald-300" />, onClick: onImportFiles, variant: "outline" as const },
    { label: "Create Workflow", icon: <Workflow className="h-4 w-4 text-rose-400" />, onClick: onCreateWorkflow, variant: "outline" as const },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h3>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((act, idx) => (
          <Button
            key={idx}
            variant={act.variant}
            size="sm"
            onClick={act.onClick}
            leftIcon={act.icon}
            className="text-xs font-medium bg-slate-900/80 border-slate-800 hover:border-slate-700"
          >
            {act.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
