"use client";

import React, { useEffect, useState } from "react";
import { SystemStatusComponent, HealthResponse } from "@/features/admin/components/SystemStatusComponent";
import { PerformanceDashboardComponent, MetricsData } from "@/features/admin/components/PerformanceDashboardComponent";
import { QueueOverviewComponent, WorkerInfo } from "@/features/admin/components/QueueOverviewComponent";
import { ErrorLogViewerComponent, LogTraceSpan } from "@/features/admin/components/ErrorLogViewerComponent";
import { Activity, ShieldCheck, Cpu, Terminal, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"status" | "performance" | "queues" | "logs">("status");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);
  const [spans, setSpans] = useState<LogTraceSpan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hRes, mRes, qRes, tRes] = await Promise.all([
        fetch("/api/v1/admin/status").then((res) => res.json()).catch(() => null),
        fetch("/api/v1/admin/metrics").then((res) => res.json()).catch(() => null),
        fetch("/api/v1/admin/queues").then((res) => res.json()).catch(() => null),
        fetch("/api/v1/admin/traces").then((res) => res.json()).catch(() => null),
      ]);

      if (hRes) setHealth(hRes);
      if (mRes) setMetrics(mRes);
      if (qRes && qRes.workers) setWorkers(qRes.workers);
      if (tRes && Array.isArray(tRes)) setSpans(tRes);
    } catch (err) {
      console.error("Failed to fetch admin telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Production Observability & Admin Console</h1>
          <p className="text-muted-foreground mt-1">
            Real-time diagnostics, performance telemetry, worker health & system security logs
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-accent text-sm font-medium transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b space-x-4">
        <button
          onClick={() => setActiveTab("status")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "status" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> System Status
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "performance" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="w-4 h-4" /> Performance Dashboard
        </button>
        <button
          onClick={() => setActiveTab("queues")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "queues" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cpu className="w-4 h-4" /> Queues & Workers
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "logs" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal className="w-4 h-4" /> Distributed Traces & Logs
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "status" && <SystemStatusComponent health={health} loading={loading} />}
        {activeTab === "performance" && <PerformanceDashboardComponent metrics={metrics} loading={loading} />}
        {activeTab === "queues" && (
          <QueueOverviewComponent workers={workers} queueDepth={metrics?.queue_depth || 0} loading={loading} />
        )}
        {activeTab === "logs" && <ErrorLogViewerComponent spans={spans} loading={loading} />}
      </div>
    </div>
  );
}
