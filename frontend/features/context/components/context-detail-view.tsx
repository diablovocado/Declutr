"use client";

import React, { useEffect, useState } from "react";
import { FolderGit2, FileText, RefreshCw, X, ShieldCheck, History, Layers } from "lucide-react";
import { ContextService } from "../services/context-service";
import { ContextDetail } from "../types/context";
import { ContextTimeline } from "./context-timeline";

interface ContextDetailViewProps {
  contextId: string;
  vaultId?: string;
  onClose?: () => void;
}

export function ContextDetailView({ contextId, vaultId, onClose }: ContextDetailViewProps) {
  const [detail, setDetail] = useState<ContextDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await ContextService.getContextDetail(contextId, vaultId);
      setDetail(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contextId) loadDetail();
  }, [contextId, vaultId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await ContextService.refreshContext(contextId, vaultId);
      await loadDetail();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !detail) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Loading Context Details & Graph...</p>
        </div>
      </div>
    );
  }

  const { context, assets, events, versions } = detail;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{context.name}</h2>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {context.type}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {Math.round(context.confidenceScore * 100)}% Conf
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{context.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Context
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Member Assets */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Member Assets ({assets.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assets.map((ast) => (
                <div key={ast.id} className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      {ast.assetId}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {Math.round(ast.confidenceScore * 100)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">"{ast.evidence}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <ContextTimeline events={events} />

          {/* Prompt Version & LLM Log */}
          {versions && versions.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-400" /> Engine Version Audit Log
              </h4>
              <div className="space-y-2">
                {versions.map((ver) => (
                  <div key={ver.versionId} className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-900 pb-1">
                    <span>
                      Ver #{ver.versionNumber} ({ver.modelName} Prompt v{ver.promptVersion}): {ver.changesSummary}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{ver.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
