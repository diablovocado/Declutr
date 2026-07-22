"use client";

import React from "react";
import { GitCompare, ArrowRight, CheckCircle2, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface DiffData {
  resourceTitle: string;
  versionOld: string;
  versionNew: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface VersionDiffViewerProps {
  diff: DiffData;
}

export function VersionDiffViewer({ diff }: VersionDiffViewerProps) {
  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <GitCompare className="h-4 w-4" /> Visual Version Comparison
          </CardTitle>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{diff.versionOld}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-emerald-400 font-bold">{diff.versionNew}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="text-xs text-slate-300 font-medium">
          Resource: <strong className="text-white">{diff.resourceTitle}</strong>
        </div>

        <div className="space-y-3">
          {diff.changes.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">{c.field}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300 truncate">
                  - {c.oldValue}
                </div>
                <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 truncate">
                  + {c.newValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
