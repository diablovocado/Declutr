"use client";

import React, { useState } from "react";
import { AlertOctagon, Filter, Terminal, ShieldAlert } from "lucide-react";

export interface LogTraceSpan {
  trace_id: string;
  span_id: string;
  name: string;
  duration_ms: number;
  start_time: string;
}

interface ErrorLogViewerProps {
  spans: LogTraceSpan[];
  loading: boolean;
}

export function ErrorLogViewerComponent({ spans, loading }: ErrorLogViewerProps) {
  const [filter, setFilter] = useState("");

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading Distributed Traces & Error Stream...
      </div>
    );
  }

  const filteredSpans = spans.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.trace_id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Distributed Traces & Diagnostic Logs</h2>
          <p className="text-sm text-muted-foreground">Correlated trace IDs, execution spans and system log entries</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter trace by name or ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Filter className="w-4 h-4 text-muted-foreground absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Terminal View */}
      <div className="rounded-xl border bg-slate-950 text-slate-200 p-4 font-mono text-xs space-y-2 overflow-x-auto max-h-[400px] overflow-y-auto">
        <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Declutr Distributed Trace Log Stream
          </span>
          <span>{filteredSpans.length} spans recorded</span>
        </div>

        {filteredSpans.map((s, idx) => (
          <div key={idx} className="hover:bg-slate-900/60 p-1.5 rounded flex items-center justify-between gap-4 border-b border-slate-900/40">
            <div className="flex items-center gap-2 truncate">
              <span className="text-emerald-400 font-semibold">{s.name}</span>
              <span className="text-slate-500 text-[10px]">[{s.trace_id.substring(0, 8)}]</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 shrink-0">
              <span>{new Date(s.start_time).toLocaleTimeString()}</span>
              <span className="text-amber-400 font-bold">{s.duration_ms}ms</span>
            </div>
          </div>
        ))}

        {filteredSpans.length === 0 && (
          <div className="text-slate-500 text-center py-6">
            No trace spans recorded matching query.
          </div>
        )}
      </div>
    </div>
  );
}
