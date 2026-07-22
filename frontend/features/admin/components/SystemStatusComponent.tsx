"use client";

import React from "react";
import { Server, Database, HardDrive, Cpu, Layers, Activity, Zap, Radio, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export interface Subsystem {
  status: "UP" | "DOWN" | "DEGRADED";
  latency_ms: number;
  message?: string;
  details?: Record<string, any>;
}

export interface HealthResponse {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  version: string;
  timestamp: string;
  uptime_seconds: number;
  subsystems: Record<string, Subsystem>;
}

interface SystemStatusProps {
  health: HealthResponse | null;
  loading: boolean;
}

export function SystemStatusComponent({ health, loading }: SystemStatusProps) {
  if (loading || !health) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading System Observability Matrix...
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "DEGRADED":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "UP":
      case "HEALTHY":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "DEGRADED":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
  };

  const getSubsystemIcon = (key: string) => {
    switch (key) {
      case "application":
        return <Server className="w-4 h-4 text-blue-500" />;
      case "database":
        return <Database className="w-4 h-4 text-indigo-500" />;
      case "redis":
        return <Zap className="w-4 h-4 text-amber-500" />;
      case "storage":
        return <HardDrive className="w-4 h-4 text-cyan-500" />;
      case "ai_provider":
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case "vector_database":
        return <Layers className="w-4 h-4 text-teal-500" />;
      case "queue":
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case "connectors":
        return <Radio className="w-4 h-4 text-orange-500" />;
      default:
        return <Server className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Header Card */}
      <div className="p-6 rounded-xl border bg-card/50 backdrop-blur shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">System Status Overview</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(health.status)}`}>
              {health.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Engine Version: <span className="font-mono text-foreground font-medium">{health.version}</span> • Uptime: <span className="font-mono text-foreground font-medium">{Math.floor(health.uptime_seconds / 60)}m {Math.floor(health.uptime_seconds % 60)}s</span>
          </p>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Last Probe: {new Date(health.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Subsystem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(health.subsystems).map(([key, sub]) => (
          <div key={key} className="p-4 rounded-xl border bg-card hover:border-accent/40 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSubsystemIcon(key)}
                <span className="font-semibold text-sm capitalize">{key.replace("_", " ")}</span>
              </div>
              {getStatusIcon(sub.status)}
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Latency</span>
                <span className="font-mono font-medium text-foreground">{sub.latency_ms}ms</span>
              </div>
              {sub.message && (
                <p className="text-xs text-muted-foreground line-clamp-2">{sub.message}</p>
              )}
            </div>

            {sub.details && (
              <div className="pt-2 border-t text-[11px] font-mono text-muted-foreground space-y-1">
                {Object.entries(sub.details).map(([dk, dv]) => (
                  <div key={dk} className="flex justify-between">
                    <span className="capitalize">{dk.replace("_", " ")}:</span>
                    <span className="text-foreground font-medium">{String(dv)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
