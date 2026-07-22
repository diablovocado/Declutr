"use client";

import React from "react";
import { History, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface VersionEvent {
  id: string;
  versionNumber: string;
  timestamp: string;
  author: string;
  action: "CREATED" | "RENAMED" | "METADATA_UPDATED" | "RESTORED";
  summary: string;
}

export interface VersionHistoryStreamProps {
  events: VersionEvent[];
  onRestoreVersion: (versionNumber: string) => void;
}

export function VersionHistoryStream({ events, onRestoreVersion }: VersionHistoryStreamProps) {
  return (
    <div className="space-y-3">
      {events.map((evt) => (
        <div key={evt.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" className="text-[9px] font-mono">{evt.versionNumber}</Badge>
              <Badge variant="outline" className="text-[9px] font-mono">{evt.action}</Badge>
              <span className="text-[10px] text-slate-500 font-mono">{evt.timestamp}</span>
            </div>
            <p className="text-xs font-medium text-white">{evt.summary}</p>
            <span className="text-[10px] text-slate-400 font-mono">By: {evt.author}</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => onRestoreVersion(evt.versionNumber)} className="h-7 text-[11px] gap-1 shrink-0">
            <RotateCcw className="h-3 w-3 text-purple-400" /> Restore V{evt.versionNumber}
          </Button>
        </div>
      ))}
    </div>
  );
}
