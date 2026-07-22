"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Copy, FileText, CheckCircle2, AlertCircle, Sparkles, Filter, Trash2, Tag, Folder, ArrowRight, Check, X, Edit2, Layers, RefreshCw } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface DuplicateGroup {
  id: string;
  originalName: string;
  duplicateName: string;
  matchPercent: number;
  size: string;
  type: "EXACT" | "NEAR" | "VERSION";
}

interface MetadataSuggestion {
  id: string;
  fileName: string;
  suggestedTag: string;
  suggestedCollection: string;
  confidence: number;
}

interface UncategorizedItem {
  id: string;
  fileName: string;
  size: string;
  suggestedCategory: string;
}

export default function HealthPage() {
  const [healthScore, setHealthScore] = useState(92);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "DUPLICATES" | "METADATA" | "UNCATEGORIZED" | "CLEANUP">("OVERVIEW");

  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([
    { id: "dup_1", originalName: "Tax_Filing_Form_1040_2025.pdf", duplicateName: "Tax_Filing_Form_1040_2025_copy.pdf", matchPercent: 100, size: "4.2 MB", type: "EXACT" },
    { id: "dup_2", originalName: "Cardiology_Prescription.pdf", duplicateName: "Cardiology_Prescription_v2.pdf", matchPercent: 95, size: "1.2 MB", type: "VERSION" },
  ]);

  const [metadataSuggestions, setMetadataSuggestions] = useState<MetadataSuggestion[]>([
    { id: "sug_1", fileName: "W-2_Income_Summary_2025.pdf", suggestedTag: "Tax 2025", suggestedCollection: "Financial & Tax", confidence: 0.94 },
    { id: "sug_2", fileName: "Blood_Test_Report_Jan.pdf", suggestedTag: "Lab Results", suggestedCollection: "Medical Records", confidence: 0.96 },
  ]);

  const [uncategorizedItems, setUncategorizedItems] = useState<UncategorizedItem[]>([
    { id: "unc_1", fileName: "Scanning_Doc_00412.pdf", size: "850 KB", suggestedCategory: "Receipts" },
    { id: "unc_2", fileName: "Notes_Meeting_July.txt", size: "12 KB", suggestedCategory: "Work Notes" },
  ]);

  const [selectedUncategorizedIds, setSelectedUncategorizedIds] = useState<string[]>([]);
  const [actionDoneMsg, setActionDoneMsg] = useState("");

  const triggerAction = (msg: string) => {
    setActionDoneMsg(msg);
    setTimeout(() => setActionDoneMsg(""), 2500);
  };

  const handleMergeDuplicate = (id: string) => {
    setDuplicateGroups((prev) => prev.filter((d) => d.id !== id));
    triggerAction("Merged duplicate file pair");
  };

  const handleAcceptMetadata = (id: string) => {
    setMetadataSuggestions((prev) => prev.filter((s) => s.id !== id));
    triggerAction("Accepted AI metadata tag suggestion");
  };

  const handleOrganizeUncategorized = (id: string) => {
    setUncategorizedItems((prev) => prev.filter((u) => u.id !== id));
    triggerAction("Organized item into collection");
  };

  return (
    <PageShell
      title="Knowledge Management & Data Health Center"
      subtitle="Monitor repository health, resolve duplicates, review AI metadata suggestions, and run bulk cleanups."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Data Health" }]}
    >
      <div className="space-y-6">
        {/* Health Action Alert Notification */}
        {actionDoneMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0">
            <CheckCircle2 className="h-4 w-4" /> {actionDoneMsg}
          </div>
        )}

        {/* Knowledge Health Score Dial Banner */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-emerald-500 bg-slate-950 shadow-inner">
                <span className="text-2xl font-black text-emerald-400 font-mono">{healthScore}</span>
                <span className="text-[10px] font-bold text-slate-400 absolute bottom-2">/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Knowledge Health: Excellent</h2>
                  <Badge variant="emerald" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> 92% Organized
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Your vault memory is well-indexed and organized. Resolve 2 duplicate pairs and 4 AI metadata suggestions to reach 100%.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" onClick={() => setActiveTab("DUPLICATES")}>
                Review Duplicates (2)
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("METADATA")}>
                Review Metadata (2)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          {(["OVERVIEW", "DUPLICATES", "METADATA", "UNCATEGORIZED", "CLEANUP"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {tab === "OVERVIEW" && "📊 Overview & Metrics"}
              {tab === "DUPLICATES" && "👯 Duplicate Manager (2)"}
              {tab === "METADATA" && "🏷️ Metadata Review (2)"}
              {tab === "UNCATEGORIZED" && "📂 Uncategorized (2)"}
              {tab === "CLEANUP" && "🧹 Bulk Cleanup Tools"}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Metadata Completeness</span>
                <p className="text-xl font-extrabold text-white">95.4%</p>
                <p className="text-[11px] text-slate-400">2 documents missing tags</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duplicate Rate</span>
                <p className="text-xl font-extrabold text-emerald-400">0.4%</p>
                <p className="text-[11px] text-slate-400">2 duplicate file pairs detected</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Readiness</span>
                <p className="text-xl font-extrabold text-purple-400">100%</p>
                <p className="text-[11px] text-slate-400">All 42 files fully indexed in pgvector</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: DUPLICATES */}
        {activeTab === "DUPLICATES" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Copy className="h-4 w-4" /> Detected Duplicate Files ({duplicateGroups.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {duplicateGroups.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No duplicate files detected in your vault.</p>
              ) : (
                duplicateGroups.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="amber" className="gap-1 text-[10px]">
                        {d.type} MATCH ({d.matchPercent}% Match)
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{d.size}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Original File:</span>
                        <span className="text-white font-medium truncate block">{d.originalName}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Detected Duplicate:</span>
                        <span className="text-slate-300 font-medium truncate block">{d.duplicateName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button variant="default" size="sm" onClick={() => handleMergeDuplicate(d.id)}>
                        Merge Duplicate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMergeDuplicate(d.id)}>
                        Keep Both
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: METADATA */}
        {activeTab === "METADATA" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Tag className="h-4 w-4" /> AI Metadata Suggestions ({metadataSuggestions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {metadataSuggestions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">All metadata tags approved.</p>
              ) : (
                metadataSuggestions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{s.fileName}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Suggested Tag:</span>
                        <Badge variant="purple" className="text-[10px]">{s.suggestedTag}</Badge>
                        <span className="text-slate-400">Collection:</span>
                        <Badge variant="emerald" className="text-[10px]">{s.suggestedCollection}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {Math.round(s.confidence * 100)}% confidence
                      </Badge>
                      <Button variant="default" size="sm" onClick={() => handleAcceptMetadata(s.id)}>
                        Accept
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 4: UNCATEGORIZED */}
        {activeTab === "UNCATEGORIZED" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Folder className="h-4 w-4" /> Uncategorized Vault Items ({uncategorizedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {uncategorizedItems.map((u) => (
                <div key={u.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">{u.fileName}</span>
                    <span className="text-[10px] text-slate-400">Size: {u.size}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Suggest: <strong className="text-emerald-400">{u.suggestedCategory}</strong></span>
                    <Button variant="secondary" size="sm" onClick={() => handleOrganizeUncategorized(u.id)}>
                      Auto-Organize
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tab 5: CLEANUP */}
        {activeTab === "CLEANUP" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-400" /> Bulk Cleanup Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-purple-400" /> Bulk Tagging Engine
                </h4>
                <p className="text-xs text-slate-400">Apply tags across unorganized files automatically using AI heuristics.</p>
                <Button variant="default" size="sm" onClick={() => triggerAction("Bulk tagging completed")}>
                  Run Bulk Tagging
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5 text-rose-400" /> Bulk Archive / Purge
                </h4>
                <p className="text-xs text-slate-400">Archive or safely delete orphaned temporary documents older than 90 days.</p>
                <Button variant="outline" size="sm" onClick={() => triggerAction("Bulk archive completed")}>
                  Purge Temporary Files
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
