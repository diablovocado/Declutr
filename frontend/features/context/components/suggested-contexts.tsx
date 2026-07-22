"use client";

import React from "react";
import { Sparkles, CheckCircle2, Merge, XCircle } from "lucide-react";
import { ContextItem } from "../types/context";

interface SuggestedContextsProps {
  suggestions?: ContextItem[];
  onAccept?: (contextId: string) => void;
  onMerge?: (contextId: string) => void;
  onDismiss?: (contextId: string) => void;
}

export function SuggestedContexts({ suggestions = [], onAccept, onMerge, onDismiss }: SuggestedContextsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Auto-Discovered Suggested Contexts ({suggestions.length})
        </h4>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          Zero-Manual Config
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((item) => (
          <div
            key={item.contextId}
            className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between space-y-2 hover:border-indigo-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-white">{item.name}</span>
                <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-indigo-400 font-mono text-[11px]">
                {Math.round(item.confidenceScore * 100)}% Confidence
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAccept?.(item.contextId)}
                  className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3" /> Confirm
                </button>
                <button
                  onClick={() => onMerge?.(item.contextId)}
                  className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Merge className="w-3 h-3" /> Merge
                </button>
                <button
                  onClick={() => onDismiss?.(item.contextId)}
                  className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
