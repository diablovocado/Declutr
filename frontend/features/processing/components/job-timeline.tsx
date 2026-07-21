"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle, PlayCircle, Loader2 } from "lucide-react";
import { cn } from "../../../shared/utils/cn";

export interface TimelineEvent {
  stage: string;
  status: "COMPLETED" | "RUNNING" | "QUEUED" | "FAILED";
  timestamp?: string;
  duration?: string;
}

export function JobTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.stage} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center border-2 shrink-0",
              event.status === "COMPLETED" && "bg-emerald-500/20 border-emerald-500 text-emerald-400",
              event.status === "RUNNING" && "bg-blue-500/20 border-blue-500 text-blue-400",
              event.status === "QUEUED" && "bg-slate-800 border-slate-700 text-slate-500",
              event.status === "FAILED" && "bg-rose-500/20 border-rose-500 text-rose-400"
            )}>
              {event.status === "COMPLETED" && <CheckCircle2 className="h-4 w-4" />}
              {event.status === "RUNNING" && <Loader2 className="h-4 w-4 animate-spin" />}
              {event.status === "QUEUED" && <Clock className="h-4 w-4" />}
              {event.status === "FAILED" && <AlertCircle className="h-4 w-4" />}
            </div>
            {idx < events.length - 1 && (
              <div className={cn(
                "w-0.5 h-full mt-2 rounded-full",
                event.status === "COMPLETED" ? "bg-emerald-500/50" : "bg-slate-800"
              )} />
            )}
          </div>
          
          <div className="pb-6 pt-1">
            <h4 className="text-sm font-semibold text-slate-200">{event.stage}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">{event.timestamp || "Pending"}</span>
              {event.duration && (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {event.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
