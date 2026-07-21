"use client";

import React, { useEffect, useState } from "react";
import { Activity, Server, AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/components/ui/card";
import { Grid } from "../../../shared/components/layout/layout-primitives";
import { ProcessingService, ProcessingStats } from "../services/processing-service";

export function ProcessingDashboard() {
  const [stats, setStats] = useState<ProcessingStats | null>(null);

  useEffect(() => {
    ProcessingService.getStats().then(setStats);
  }, []);

  if (!stats) return <div className="animate-pulse h-32 bg-slate-800 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" /> Processing Engine
          </h2>
          <p className="text-sm text-slate-400">Real-time telemetry for content orchestration workers</p>
        </div>
        <button onClick={() => ProcessingService.getStats().then(setStats)} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <Grid cols={4} className="gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Clock className="h-4 w-4" /> Queued
            </div>
            <span className="text-2xl font-bold text-white">{stats.queuedJobs}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <Activity className="h-4 w-4" /> Running
            </div>
            <span className="text-2xl font-bold text-white">{stats.runningJobs}</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-medium">
              <AlertCircle className="h-4 w-4" /> Failed
            </div>
            <span className="text-2xl font-bold text-white">{stats.failedJobs}</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <Server className="h-4 w-4" /> Workers Active
            </div>
            <span className="text-2xl font-bold text-white">{stats.activeWorkers}</span>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
