"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Server, Cpu, Database, Activity, RefreshCw } from "lucide-react";

export function StatusOverviewComponent() {
  const components = [
    { name: "Public REST API Gateway", status: "OPERATIONAL", uptime: "99.99%" },
    { name: "PostgreSQL Database Cluster", status: "OPERATIONAL", uptime: "99.99%" },
    { name: "Redis Cache & Memory Store", status: "OPERATIONAL", uptime: "100.0%" },
    { name: "Vector & Hybrid Search Engine", status: "OPERATIONAL", uptime: "99.98%" },
    { name: "Grounded RAG AI Copilot", status: "OPERATIONAL", uptime: "99.95%" },
    { name: "Offline Sync Engine", status: "OPERATIONAL", uptime: "100.0%" },
    { name: "Developer Webhook Engine", status: "OPERATIONAL", uptime: "99.99%" },
    { name: "Extension Sandbox Runtime", status: "OPERATIONAL", uptime: "100.0%" },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Banner */}
      <div className="p-6 rounded-xl border bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          <div>
            <h2 className="text-xl font-bold text-emerald-500">All Systems Operational</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Declutr Global Cloud Platform & Subsystems Operating Normally</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5" /> Updated 1 min ago
        </div>
      </div>

      {/* Grid of Components */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">System Component Status</h3>
        <div className="rounded-xl border bg-card divide-y">
          {components.map((c, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-foreground">{c.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-muted-foreground">{c.uptime} uptime</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
