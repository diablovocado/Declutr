"use client";

import React from "react";
import { Activity, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";

export function ActivityHeatmap() {
  const days = Array.from({ length: 35 }, (_, i) => {
    const intensity = Math.floor(Math.random() * 5);
    return { day: i + 1, intensity };
  });

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-slate-900 border-slate-800";
      case 1: return "bg-emerald-950/60 border-emerald-800/40 text-emerald-400";
      case 2: return "bg-emerald-800/60 border-emerald-600/60 text-emerald-300";
      case 3: return "bg-emerald-600 border-emerald-500 text-slate-950 font-bold";
      case 4: return "bg-emerald-400 border-emerald-300 text-slate-950 font-extrabold";
      default: return "bg-slate-900 border-slate-800";
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Activity className="h-4 w-4" /> 35-Day Digital Memory Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d.day}
              className={`h-9 rounded-lg border flex items-center justify-center text-xs transition-transform hover:scale-105 ${getHeatmapColor(
                d.intensity
              )}`}
              title={`Day ${d.day}: ${d.intensity * 3} memory events`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 font-mono">
          <span>Less Activity</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
            <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
            <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-500" />
            <span className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
          </div>
          <span>High Activity</span>
        </div>
      </CardContent>
    </Card>
  );
}
