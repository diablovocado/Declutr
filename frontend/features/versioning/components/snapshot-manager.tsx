"use client";

import React from "react";
import { Camera, RotateCcw, Clock, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface SnapshotItem {
  id: string;
  name: string;
  timestamp: string;
  resourceCount: number;
  type: "MANUAL" | "PRE_IMPORT" | "PRE_CLEANUP";
}

export interface SnapshotManagerProps {
  snapshots: SnapshotItem[];
  onCreateSnapshot: (name: string) => void;
  onRestoreSnapshot: (id: string) => void;
}

export function SnapshotManager({ snapshots, onCreateSnapshot, onRestoreSnapshot }: SnapshotManagerProps) {
  const [snapshotName, setSnapshotName] = React.useState("");

  const handleCreate = () => {
    if (!snapshotName.trim()) return;
    onCreateSnapshot(snapshotName);
    setSnapshotName("");
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Camera className="h-4 w-4" /> Vault Snapshot Restore Points ({snapshots.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Create Snapshot Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Name snapshot e.g. Pre-AI Tagging Snapshot..."
            className="flex-1 h-9 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Button variant="default" size="sm" onClick={handleCreate} className="h-9 px-3 text-xs">
            Create Snapshot
          </Button>
        </div>

        {/* Snapshots List */}
        <div className="space-y-2.5">
          {snapshots.map((s) => (
            <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="emerald" className="text-[9px] font-mono">{s.type}</Badge>
                  <span className="text-[10px] text-slate-500 font-mono">{s.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{s.name}</h4>
                <span className="text-[11px] text-slate-400 font-mono">{s.resourceCount} vault resources saved</span>
              </div>

              <Button variant="outline" size="sm" onClick={() => onRestoreSnapshot(s.id)} className="h-7 text-[11px] gap-1">
                <RotateCcw className="h-3 w-3 text-emerald-400" /> Rollback
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
