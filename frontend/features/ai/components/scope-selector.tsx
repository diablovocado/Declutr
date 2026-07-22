"use client";

import React, { useState } from "react";
import { FolderKey, Bookmark, Folder, FileText, Search, Check, Layers, ChevronDown } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export type AIScopeType = "VAULT" | "COLLECTION" | "PROJECT" | "SEARCH_RESULTS" | "SELECTED_FILES";

export interface AIScope {
  id: string;
  name: string;
  type: AIScopeType;
  itemCount?: number;
}

export interface ScopeSelectorProps {
  currentScope: AIScope;
  onScopeChange: (scope: AIScope) => void;
}

export function ScopeSelector({ currentScope, onScopeChange }: ScopeSelectorProps) {
  const [open, setOpen] = useState(false);

  const availableScopes: AIScope[] = [
    { id: "v_all", name: "Entire Vault", type: "VAULT", itemCount: 42 },
    { id: "col_tax_2025", name: "Financial & Tax 2025", type: "COLLECTION", itemCount: 8 },
    { id: "col_medical", name: "Medical & Health Records", type: "COLLECTION", itemCount: 12 },
    { id: "proj_tax_filing", name: "2025 Tax Filing Project", type: "PROJECT", itemCount: 4 },
    { id: "multi_sel_01", name: "Selected Files (3 docs)", type: "SELECTED_FILES", itemCount: 3 },
  ];

  const getScopeIcon = (type: AIScopeType) => {
    switch (type) {
      case "VAULT": return <FolderKey className="h-3.5 w-3.5 text-emerald-400" />;
      case "COLLECTION": return <Bookmark className="h-3.5 w-3.5 text-purple-400" />;
      case "PROJECT": return <Folder className="h-3.5 w-3.5 text-amber-400" />;
      case "SEARCH_RESULTS": return <Search className="h-3.5 w-3.5 text-blue-400" />;
      case "SELECTED_FILES": return <FileText className="h-3.5 w-3.5 text-emerald-400" />;
      default: return <Layers className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
      >
        {getScopeIcon(currentScope.type)}
        <span>Scope:</span>
        <span className="font-semibold text-white truncate max-w-[160px]">{currentScope.name}</span>
        {currentScope.itemCount !== undefined && (
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
            {currentScope.itemCount} items
          </Badge>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-50 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Knowledge Scope
          </div>

          {availableScopes.map((scope) => (
            <button
              key={scope.id}
              onClick={() => {
                onScopeChange(scope);
                setOpen(false);
              }}
              className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                currentScope.id === scope.id
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getScopeIcon(scope.type)}
                <span className="truncate">{scope.name}</span>
              </div>
              {currentScope.id === scope.id && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
