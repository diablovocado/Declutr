"use client";

import React from "react";
import { StatusOverviewComponent } from "@/features/status/components/StatusOverviewComponent";
import { IncidentHistoryComponent } from "@/features/status/components/IncidentHistoryComponent";
import { Activity, ShieldCheck } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="border-b pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-indigo-500" /> Declutr Public Status
          </h1>
          <p className="text-muted-foreground mt-1">Live system health metrics, component operational statuses, and incident history</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Uptime 99.99%
        </span>
      </div>

      <StatusOverviewComponent />
      <IncidentHistoryComponent />
    </div>
  );
}
