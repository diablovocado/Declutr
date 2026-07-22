"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Cpu, Activity, Award, Sparkles } from "lucide-react";

export function ReleaseOverviewComponent() {
  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="p-6 rounded-xl border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">Declutr v1.0.0-rc1</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                RELEASE CANDIDATE 1
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Production Launch Readiness • All 35 Milestones Verified • 100% Core System Health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-secondary px-3 py-2 rounded-lg border">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Build: commit-rc1-final</span>
        </div>
      </div>

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Core & Auth Engine", status: "ONLINE", sub: "SRP-6a & Passkeys" },
          { title: "Multi-Tenant Orgs", status: "ONLINE", sub: "RBAC & Isolation" },
          { title: "Developer Platform", status: "ONLINE", sub: "REST, OAuth, Webhooks" },
          { title: "Extension Sandbox", status: "ONLINE", sub: "20 Types & Quotas" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{item.title}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xs font-mono text-emerald-500 font-bold">{item.status}</div>
            <div className="text-[11px] text-muted-foreground">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
