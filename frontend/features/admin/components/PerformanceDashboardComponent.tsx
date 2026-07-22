"use client";

import React from "react";
import { Activity, Clock, Zap, Database, ArrowUpRight, BarChart2 } from "lucide-react";

export interface MetricsData {
  total_requests: number;
  average_latency_ms: number;
  cache_hit_rate: number;
  storage_usage_bytes: number;
  queue_depth: number;
  status_codes: Record<number, number>;
}

interface PerformanceDashboardProps {
  metrics: MetricsData | null;
  loading: boolean;
}

export function PerformanceDashboardComponent({ metrics, loading }: PerformanceDashboardProps) {
  if (loading || !metrics) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading Performance Telemetry...
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Performance Telemetry</h2>
          <p className="text-sm text-muted-foreground">Real-time throughput, latency, cache efficiency & system load</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests Card */}
        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{metrics.total_requests.toLocaleString()}</div>
          <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Live Request Stream
          </div>
        </div>

        {/* Average Latency Card */}
        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg API Latency</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{metrics.average_latency_ms.toFixed(1)} ms</div>
          <div className="text-xs text-muted-foreground">Sub-millisecond routing</div>
        </div>

        {/* Cache Hit Rate Card */}
        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Cache Hit Rate</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{(metrics.cache_hit_rate * 100).toFixed(1)}%</div>
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.cache_hit_rate * 100)}%` }}
            />
          </div>
        </div>

        {/* Vault Storage Usage Card */}
        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Usage</span>
            <Database className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{formatBytes(metrics.storage_usage_bytes)}</div>
          <div className="text-xs text-muted-foreground">Encrypted digital assets</div>
        </div>
      </div>

      {/* HTTP Status Code Distribution */}
      <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-base">HTTP Status Code Distribution</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(metrics.status_codes || { 200: metrics.total_requests }).map(([code, count]) => (
            <div key={code} className="p-3 rounded-lg bg-secondary/50 border flex justify-between items-center font-mono">
              <span className={`text-xs font-semibold ${code.startsWith("2") ? "text-emerald-500" : code.startsWith("4") ? "text-amber-500" : "text-rose-500"}`}>
                {code} HTTP
              </span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
