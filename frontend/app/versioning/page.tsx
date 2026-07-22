"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Trash2, Camera, GitCompare, RotateCcw, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { VersionDiffViewer, DiffData } from "../../features/versioning/components/version-diff-viewer";
import { SnapshotManager, SnapshotItem } from "../../features/versioning/components/snapshot-manager";
import { VersionHistoryStream, VersionEvent } from "../../features/versioning/components/version-history-stream";

interface SoftDeletedItem {
  id: string;
  name: string;
  size: string;
  deletedAt: string;
  daysLeft: number;
}

export default function VersioningPage() {
  const [activeTab, setActiveTab] = useState<"RECYCLE" | "SNAPSHOTS" | "DIFF" | "STREAM">("RECYCLE");
  const [actionDoneMsg, setActionDoneMsg] = useState("");

  const [recycleBinItems, setRecycleBinItems] = useState<SoftDeletedItem[]>([
    { id: "bin_1", name: "Old_Draft_Tax_Calculation_2024.pdf", size: "1.4 MB", deletedAt: "2 days ago", daysLeft: 28 },
    { id: "bin_2", name: "Temporary_Medical_Receipt.pdf", size: "620 KB", deletedAt: "5 days ago", daysLeft: 25 },
  ]);

  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([
    { id: "snap_1", name: "Pre-AI Tagging Snapshot", timestamp: "July 20, 2026", resourceCount: 42, type: "PRE_IMPORT" },
    { id: "snap_2", name: "Quarterly Financial Backup", timestamp: "July 01, 2026", resourceCount: 38, type: "MANUAL" },
  ]);

  const [historyEvents, setHistoryEvents] = useState<VersionEvent[]>([
    { id: "ve_1", versionNumber: "v3", timestamp: "Today 14:32", author: "AI Copilot", action: "METADATA_UPDATED", summary: "Regenerated Tax Summary with OCR confidence 98%" },
    { id: "ve_2", versionNumber: "v2", timestamp: "Yesterday 11:15", author: "You", action: "RENAMED", summary: "Renamed Tax_2025.pdf to Tax_Filing_Form_1040_2025.pdf" },
    { id: "ve_3", versionNumber: "v1", timestamp: "July 18, 2026", author: "You", action: "CREATED", summary: "Initial zero-knowledge upload into vault" },
  ]);

  const sampleDiff: DiffData = {
    resourceTitle: "Tax_Filing_Form_1040_2025.pdf",
    versionOld: "v2",
    versionNew: "v3",
    timestamp: "Today 14:32",
    changes: [
      { field: "AI Summary", oldValue: "Draft tax summary filed in March 2026.", newValue: "Verified Form 1040 summary with $125,000 gross income and $3,200 refund." },
      { field: "Metadata Tag", oldValue: "Uncategorized", newValue: "Tax 2025 / Financials" },
    ],
  };

  const triggerNotify = (msg: string) => {
    setActionDoneMsg(msg);
    setTimeout(() => setActionDoneMsg(""), 2500);
  };

  const handleRestoreItem = (id: string) => {
    setRecycleBinItems((prev) => prev.filter((i) => i.id !== id));
    triggerNotify("Restored document back to Vault");
  };

  const handleCreateSnapshot = (name: string) => {
    setSnapshots((prev) => [
      { id: "snap_" + Date.now(), name, timestamp: "Just now", resourceCount: 42, type: "MANUAL" },
      ...prev,
    ]);
    triggerNotify("Created new vault snapshot restore point");
  };

  const handleRollbackSnapshot = (id: string) => {
    triggerNotify("Rollback executed successfully");
  };

  return (
    <PageShell
      title="Version History, Snapshots & Recovery Center"
      subtitle="Complete data trustworthiness. Transparent revision history, visual diffs, manual snapshots, and soft-delete recovery."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Recovery Center" }]}
    >
      <div className="space-y-6">
        {actionDoneMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0">
            <CheckCircle2 className="h-4 w-4" /> {actionDoneMsg}
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("RECYCLE")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "RECYCLE" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            🗑️ Recycle Bin ({recycleBinItems.length})
          </button>
          <button
            onClick={() => setActiveTab("SNAPSHOTS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "SNAPSHOTS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            📷 Vault Snapshots ({snapshots.length})
          </button>
          <button
            onClick={() => setActiveTab("DIFF")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "DIFF" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            🔍 Visual Diff Comparison
          </button>
          <button
            onClick={() => setActiveTab("STREAM")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "STREAM" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            📜 Revision Stream (v1 - v3)
          </button>
        </div>

        {/* Tab 1: RECYCLE BIN */}
        {activeTab === "RECYCLE" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Soft-Deleted Items (30-Day Auto Purge)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recycleBinItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Recycle bin is empty.</p>
              ) : (
                recycleBinItems.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Size: {item.size} • Deleted: {item.deletedAt} • {item.daysLeft} days until purge
                      </span>
                    </div>

                    <Button variant="default" size="sm" onClick={() => handleRestoreItem(item.id)} className="h-7 text-[11px] gap-1">
                      <RotateCcw className="h-3 w-3" /> Restore File
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: SNAPSHOTS */}
        {activeTab === "SNAPSHOTS" && (
          <SnapshotManager
            snapshots={snapshots}
            onCreateSnapshot={handleCreateSnapshot}
            onRestoreSnapshot={handleRollbackSnapshot}
          />
        )}

        {/* Tab 3: VISUAL DIFF */}
        {activeTab === "DIFF" && <VersionDiffViewer diff={sampleDiff} />}

        {/* Tab 4: STREAM */}
        {activeTab === "STREAM" && (
          <VersionHistoryStream
            events={historyEvents}
            onRestoreVersion={(ver) => triggerNotify(`Restored resource to version ${ver}`)}
          />
        )}
      </div>
    </PageShell>
  );
}
