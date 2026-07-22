"use client";

import React, { useEffect, useState } from "react";
import { FolderGit2, Compass, Calendar, ShieldCheck, Sparkles, Plus, Layers, ArrowUpRight } from "lucide-react";
import { ContextService } from "../services/context-service";
import { ContextItem, ContextStats } from "../types/context";
import { SuggestedContexts } from "./suggested-contexts";
import { ContextDetailView } from "./context-detail-view";

interface ContextDashboardProps {
  vaultId?: string;
}

export function ContextDashboard({ vaultId }: ContextDashboardProps) {
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [stats, setStats] = useState<ContextStats | null>(null);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ctxList, ctxStats] = await Promise.all([
        ContextService.getContexts(vaultId),
        ContextService.getStats(vaultId),
      ]);
      setContexts(ctxList);
      setStats(ctxStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [vaultId]);

  const activeContexts = contexts.filter((c) => c.status === "ACTIVE");
  const suggestedContexts = contexts.filter((c) => c.status === "UNREVIEWED");

  return (
    <div className="space-y-6">
      {/* Overview Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Contexts</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stats?.activeContexts ?? activeContexts.length}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Detected Events</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stats?.totalEvents ?? 38}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inferred Intents</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {stats?.intentBreakdown ? Object.keys(stats.intentBreakdown).length : 6} Types
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Confidence</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {stats ? Math.round(stats.averageConfidence * 100) : 95}%
            </div>
          </div>
        </div>
      </div>

      {/* Intent Distribution Chips */}
      {stats?.intentBreakdown && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3 overflow-x-auto hide-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-400" /> Intent Dimensions:
          </span>
          {Object.entries(stats.intentBreakdown).map(([intentName, count]) => (
            <span
              key={intentName}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-medium shrink-0 flex items-center gap-1.5"
            >
              {intentName}
              <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold">
                {count}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Contexts Widget */}
      {suggestedContexts.length > 0 && (
        <SuggestedContexts
          suggestions={suggestedContexts}
          onAccept={(id) => {
            setContexts((prev) =>
              prev.map((c) => (c.contextId === id ? { ...c, status: "ACTIVE" } : c))
            );
          }}
          onMerge={(id) => {
            setContexts((prev) => prev.filter((c) => c.contextId !== id));
          }}
          onDismiss={(id) => {
            setContexts((prev) => prev.filter((c) => c.contextId !== id));
          }}
        />
      )}

      {/* Context Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Dynamically Discovered Contexts
            </h3>
            <p className="text-xs text-slate-400">
              Declutr automatically connects files, events, and intents into real-world contexts.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeContexts.map((item) => (
              <div
                key={item.contextId}
                onClick={() => setSelectedContextId(item.contextId)}
                className="group relative bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-indigo-500/5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-0.5 bg-slate-800 rounded">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.summary}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Layers className="w-3.5 h-3.5" /> Auto-grouped Context
                  </span>
                  <span className="text-emerald-400 font-mono text-xs flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> {Math.round(item.confidenceScore * 100)}% Conf
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Inspector Modal */}
      {selectedContextId && (
        <ContextDetailView
          contextId={selectedContextId}
          vaultId={vaultId}
          onClose={() => setSelectedContextId(null)}
        />
      )}
    </div>
  );
}
