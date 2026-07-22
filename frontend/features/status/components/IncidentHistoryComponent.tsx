"use client";

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

export function IncidentHistoryComponent() {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Past Incident History</h3>
      <div className="p-6 rounded-xl border bg-card text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
        <h4 className="font-bold text-sm">No Incidents Reported</h4>
        <p className="text-xs text-muted-foreground">No major outages or performance degradations reported in the last 90 days.</p>
      </div>
    </div>
  );
}
