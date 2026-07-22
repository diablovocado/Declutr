"use client";

import React from "react";
import Link from "next/link";
import { Upload, RefreshCw, MessageSquare, Sparkles, Folder, Bookmark, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export interface TimelineEvent {
  id: string;
  time: string;
  dateGroup: string;
  type: "UPLOAD" | "IMPORT" | "AI_SUMMARY" | "AI_CHAT" | "WORKFLOW" | "PROJECT_CREATED";
  title: string;
  description: string;
  relatedFile?: string;
  relatedId?: string;
}

export interface VerticalTimelineStreamProps {
  events: TimelineEvent[];
}

export function VerticalTimelineStream({ events }: VerticalTimelineStreamProps) {
  const getEventBadge = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "UPLOAD": return <Badge variant="emerald" className="gap-1"><Upload className="h-3 w-3" /> Upload</Badge>;
      case "IMPORT": return <Badge variant="purple" className="gap-1"><RefreshCw className="h-3 w-3" /> Import</Badge>;
      case "AI_SUMMARY": return <Badge variant="purple" className="gap-1"><Sparkles className="h-3 w-3" /> AI Summary</Badge>;
      case "AI_CHAT": return <Badge variant="purple" className="gap-1"><MessageSquare className="h-3 w-3" /> AI Chat</Badge>;
      case "WORKFLOW": return <Badge variant="amber" className="gap-1"><Folder className="h-3 w-3" /> Workflow</Badge>;
      case "PROJECT_CREATED": return <Badge variant="outline" className="gap-1"><Bookmark className="h-3 w-3" /> Project</Badge>;
      default: return <Badge variant="outline">Event</Badge>;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {events.map((evt) => (
        <div key={evt.id} className="relative group">
          {/* Node Dot */}
          <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-emerald-400 group-hover:scale-125 transition-transform" />

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getEventBadge(evt.type)}
                <span className="text-[11px] font-mono text-slate-400">{evt.time}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{evt.dateGroup}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                {evt.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{evt.description}</p>
            </div>

            {evt.relatedFile && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <Link href={evt.relatedId ? `/files/${evt.relatedId}` : "/vault"}>
                  <span className="text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 font-medium truncate max-w-[240px]">
                    <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{evt.relatedFile}</span>
                  </span>
                </Link>
                <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
