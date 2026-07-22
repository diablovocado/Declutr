"use client";

import React from "react";
import { Cpu, RefreshCw, AlertCircle, PlayCircle, ShieldCheck } from "lucide-react";

export interface WorkerInfo {
  id: string;
  name: string;
  type: string;
  state: "STOPPED" | "RUNNING" | "FAILED" | "RESTARTING";
  restart_count: number;
  last_error?: string;
  last_active: string;
  started_at: string;
}

interface QueueOverviewProps {
  workers: WorkerInfo[];
  queueDepth: number;
  loading: boolean;
}

export function QueueOverviewComponent({ workers, queueDepth, loading }: QueueOverviewProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading Worker Queue Overview...
      </div>
    );
  }

  const getWorkerBadge = (state: string) => {
    switch (state) {
      case "RUNNING":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "RESTARTING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "FAILED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Background Worker & Queue Overview</h2>
          <p className="text-sm text-muted-foreground">Self-healing worker pool monitoring & job depth analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card text-xs font-mono">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span>Queue Depth: <strong>{queueDepth} jobs</strong></span>
        </div>
      </div>

      {/* Workers List */}
      <div className="space-y-3">
        {workers.map((w) => (
          <div key={w.id} className="p-4 rounded-xl border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <PlayCircle className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">{w.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-secondary/50">{w.type}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  ID: {w.id} • Started: {new Date(w.started_at).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground">Restarts</span>
                <span className="font-bold text-foreground">{w.restart_count}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getWorkerBadge(w.state)}`}>
                {w.state}
              </span>
            </div>
          </div>
        ))}

        {workers.length === 0 && (
          <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
            No active background workers registered.
          </div>
        )}
      </div>
    </div>
  );
}
