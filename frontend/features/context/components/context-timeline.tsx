"use client";

import React from "react";
import { Calendar, Plane, Stethoscope, ShoppingCart, Users, FileSignature, MapPin, Sparkles } from "lucide-react";
import { ContextEvent } from "../types/context";

interface ContextTimelineProps {
  events: ContextEvent[];
}

export function ContextTimeline({ events }: ContextTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 text-xs">
        No events detected for this timeline yet.
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("flight") || lower.includes("trip") || lower.includes("vacation")) {
      return <Plane className="w-4 h-4 text-sky-400" />;
    }
    if (lower.includes("hospital") || lower.includes("doctor") || lower.includes("mri") || lower.includes("medical")) {
      return <Stethoscope className="w-4 h-4 text-rose-400" />;
    }
    if (lower.includes("purchase") || lower.includes("buy") || lower.includes("car") || lower.includes("receipt")) {
      return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes("meeting") || lower.includes("interview") || lower.includes("review")) {
      return <Users className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes("contract") || lower.includes("signing") || lower.includes("nda") || lower.includes("visa")) {
      return <FileSignature className="w-4 h-4 text-purple-400" />;
    }
    return <Calendar className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" /> Dynamic Event Timeline
        </h3>
        <span className="text-xs text-slate-500">{events.length} Events Detected</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((ev) => (
          <div key={ev.eventId} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
              {getEventIcon(ev.eventType)}
            </div>

            <div className="bg-slate-800/40 hover:bg-slate-800/80 transition-colors border border-slate-800/80 hover:border-slate-700 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{ev.eventName}</span>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {ev.eventType}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {ev.eventDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(ev.eventDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {ev.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {ev.location}
                  </span>
                )}
              </div>

              {ev.evidence && (
                <div className="pt-2 text-xs text-slate-400 italic flex items-start gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                  <span>"{ev.evidence}"</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
