"use client";

import React from "react";
import { Activity, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface LogItem {
  id: string;
  workflowName: string;
  timestamp: string;
  duration: string;
  status: "SUCCESS" | "FAILED";
  affectedFile: string;
}

export interface ExecutionTelemetryProps {
  logs: LogItem[];
}

export function ExecutionTelemetry({ logs }: ExecutionTelemetryProps) {
  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          <Activity className="h-4 w-4" /> Live Execution Logs &amp; Telemetry ({logs.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5">
        {logs.map((log) => (
          <div key={log.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {log.status === "SUCCESS" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-white">{log.workflowName}</h4>
                <span className="text-[10px] text-slate-400 font-mono">File: {log.affectedFile}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <Badge variant={log.status === "SUCCESS" ? "emerald" : "outline"} className="text-[9px] font-mono">
                {log.status} ({log.duration})
              </Badge>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
