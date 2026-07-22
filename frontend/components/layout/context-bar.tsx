"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderKey, Bookmark, Folder, FileText, Sparkles, Layers, ChevronRight, Share2, Move, FileSpreadsheet, Tag, ArrowRightLeft, Check } from "lucide-react";
import { useWorkspaceContext } from "../../shared/providers/workspace-context-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface ContextBarProps {
  onOpenSwitcher: () => void;
}

export function ContextBar({ onOpenSwitcher }: ContextBarProps) {
  const {
    activeVault,
    activeCollection,
    activeProject,
    activeDocument,
    activeChat,
    recentContexts,
    switchVault,
  } = useWorkspaceContext();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionDoneMsg, setActionDoneMsg] = useState("");

  const triggerSmartAction = (actionName: string) => {
    setActionDoneMsg(`${actionName} executed`);
    setActionsOpen(false);
    setTimeout(() => setActionDoneMsg(""), 2000);
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-1.5 flex-wrap text-slate-400 font-medium">
        <Link href="/dashboard" className="hover:text-emerald-400 flex items-center gap-1">
          <FolderKey className="h-3.5 w-3.5 text-emerald-400" />
          <span>{activeVault.name}</span>
        </Link>

        {activeCollection && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            <Link href="/vault" className="hover:text-purple-400 flex items-center gap-1 text-slate-300">
              <Bookmark className="h-3.5 w-3.5 text-purple-400" />
              <span>{activeCollection.name}</span>
            </Link>
          </>
        )}

        {activeProject && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            <span className="flex items-center gap-1 text-slate-200">
              <Folder className="h-3.5 w-3.5 text-amber-400" />
              <span>{activeProject.name}</span>
            </span>
          </>
        )}

        {activeDocument && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            <span className="flex items-center gap-1 text-emerald-400 font-semibold truncate max-w-[200px]">
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>{activeDocument.name}</span>
            </span>
          </>
        )}
      </div>

      {/* Active AI Context & Quick Smart Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {actionDoneMsg && (
          <Badge variant="emerald" className="animate-in fade-in-0 gap-1">
            <Check className="h-3 w-3" /> {actionDoneMsg}
          </Badge>
        )}

        {/* AI Context Badge */}
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-slate-950/60 border-slate-800 text-[11px]">
          <Sparkles className="h-3 w-3 text-purple-400" />
          <span className="text-slate-300">AI Context:</span>
          <span className="text-white font-semibold truncate max-w-[140px]">
            {activeDocument?.name || activeCollection?.name || activeVault.name}
          </span>
        </Badge>

        {/* Context Smart Actions Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActionsOpen((prev) => !prev)}
            className="h-7 text-[11px] gap-1 px-2.5 bg-slate-950 border-slate-800"
          >
            <Tag className="h-3 w-3 text-emerald-400" /> Smart Actions
          </Button>

          {actionsOpen && (
            <div className="absolute right-0 top-8 z-50 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1">
              <button
                onClick={() => triggerSmartAction("AI Summary")}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Summarize File
              </button>
              <button
                onClick={() => triggerSmartAction("Metadata Extraction")}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" /> Extract Metadata
              </button>
              <button
                onClick={() => triggerSmartAction("Share Link")}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-400" /> Share Encrypted Item
              </button>
              <button
                onClick={() => triggerSmartAction("Move to Collection")}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Move className="h-3.5 w-3.5 text-amber-400" /> Move to Collection
              </button>
            </div>
          )}
        </div>

        {/* Context Switcher Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSwitcher}
          className="h-7 text-[11px] gap-1 px-2.5"
        >
          <ArrowRightLeft className="h-3 w-3 text-emerald-400" /> Switcher (⌘J)
        </Button>
      </div>
    </div>
  );
}
