"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HardDrive, Cloud, FileText, FileArchive, CheckCircle2, Clock, Play, Pause, X, RefreshCw, AlertCircle, Sparkles, Filter, Database, ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface Connector {
  id: string;
  name: string;
  category: "CLOUD" | "REPOS" | "PRODUCTIVITY" | "MAIL_CHAT" | "LOCAL";
  status: "CONNECTED" | "DISCONNECTED" | "SYNCING" | "ERROR";
  fileCount: number;
  lastSync: string;
  icon: string;
}

interface ImportJob {
  id: string;
  sourceName: string;
  totalFiles: number;
  processedFiles: number;
  progressPercent: number;
  status: "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "FAILED";
  startedAt: string;
}

interface ImportHistoryItem {
  id: string;
  source: string;
  timestamp: string;
  duration: string;
  filesCount: number;
  status: "SUCCESS" | "WARNING" | "FAILED";
}

export default function ImportPage() {
  const [connectors, setConnectors] = useState<Connector[]>([
    { id: "gdrive", name: "Google Drive", category: "CLOUD", status: "CONNECTED", fileCount: 142, lastSync: "10 mins ago", icon: "🌐" },
    { id: "dropbox", name: "Dropbox", category: "CLOUD", status: "DISCONNECTED", fileCount: 0, lastSync: "Never", icon: "📦" },
    { id: "onedrive", name: "Microsoft OneDrive", category: "CLOUD", status: "DISCONNECTED", fileCount: 0, lastSync: "Never", icon: "☁️" },
    { id: "github", name: "GitHub Repositories", category: "REPOS", status: "CONNECTED", fileCount: 28, lastSync: "1 hour ago", icon: "🐙" },
    { id: "notion", name: "Notion Workspace", category: "PRODUCTIVITY", status: "CONNECTED", fileCount: 64, lastSync: "30 mins ago", icon: "📝" },
    { id: "s3", name: "Amazon S3 / R2 Bucket", category: "CLOUD", status: "CONNECTED", fileCount: 512, lastSync: "2 hours ago", icon: "🪣" },
    { id: "gmail", name: "Gmail Attachments", category: "MAIL_CHAT", status: "DISCONNECTED", fileCount: 0, lastSync: "Never", icon: "✉️" },
    { id: "slack", name: "Slack Export", category: "MAIL_CHAT", status: "DISCONNECTED", fileCount: 0, lastSync: "Never", icon: "💬" },
    { id: "zip", name: "Local ZIP & Folders", category: "LOCAL", status: "CONNECTED", fileCount: 15, lastSync: "Just now", icon: "📁" },
  ]);

  const [activeQueue, setActiveQueue] = useState<ImportJob[]>([
    {
      id: "job_01",
      sourceName: "Google Drive (Financials & Tax)",
      totalFiles: 45,
      processedFiles: 32,
      progressPercent: 71,
      status: "IN_PROGRESS",
      startedAt: "2 mins ago",
    },
  ]);

  const [historyItems, setHistoryItems] = useState<ImportHistoryItem[]>([
    { id: "h1", source: "Notion Workspace Import", timestamp: "Today 14:30", duration: "45s", filesCount: 64, status: "SUCCESS" },
    { id: "h2", source: "GitHub Repos (Docs Folder)", timestamp: "Yesterday 09:15", duration: "1m 12s", filesCount: 28, status: "SUCCESS" },
    { id: "h3", source: "Dropbox Auto-Sync", timestamp: "3 days ago", duration: "15s", filesCount: 0, status: "FAILED" },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [conflictRule, setConflictRule] = useState<"SKIP" | "MERGE" | "RENAME">("SKIP");

  const openPreview = (connector: Connector) => {
    setSelectedConnector(connector);
    setPreviewOpen(true);
  };

  const handleStartImport = () => {
    if (!selectedConnector) return;
    const newJob: ImportJob = {
      id: "job_" + Date.now(),
      sourceName: `${selectedConnector.name} Sync`,
      totalFiles: 30,
      processedFiles: 0,
      progressPercent: 0,
      status: "IN_PROGRESS",
      startedAt: "Just now",
    };
    setActiveQueue((prev) => [newJob, ...prev]);
    setPreviewOpen(false);
  };

  return (
    <PageShell
      title="Universal Import Hub"
      subtitle="Connect cloud storage, workspace tools, repositories, and local archives into your zero-knowledge vault."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Import Hub" }]}
    >
      <div className="space-y-6">
        {/* Smart Suggestions Banner */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">Smart Import Suggestion</h3>
              <p className="text-xs text-slate-300">
                You connected Google Drive 10 mins ago. 12 new financial documents are available for sync.
              </p>
            </div>
          </div>
          <Button variant="default" size="sm" onClick={() => openPreview(connectors[0])}>
            Import New Files
          </Button>
        </div>

        {/* Connected Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cloud className="h-4 w-4 text-emerald-400" /> Connected Digital Life Services
            </h2>
            <Badge variant="outline">9 Connectors</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map((c) => (
              <Card key={c.id} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <h3 className="font-bold text-white text-xs">{c.name}</h3>
                        <span className="text-[10px] text-slate-400">{c.category}</span>
                      </div>
                    </div>

                    {c.status === "CONNECTED" && (
                      <Badge variant="emerald" className="gap-1 text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                      </Badge>
                    )}
                    {c.status === "DISCONNECTED" && (
                      <Badge variant="outline" className="text-[10px] text-slate-500">
                        Disconnected
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5 mt-2">
                    <span>{c.fileCount} imported files</span>
                    <span>Sync: {c.lastSync}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {c.status === "CONNECTED" ? (
                      <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => openPreview(c)}>
                        Sync Now
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Connect Service
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Import Queue Telemetry */}
        {activeQueue.length > 0 && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Active Import Queue ({activeQueue.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {activeQueue.map((job) => (
                <div key={job.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{job.sourceName}</span>
                    <span className="text-slate-400 font-mono">
                      {job.processedFiles} / {job.totalFiles} files ({job.progressPercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Started {job.startedAt}</span>
                    <div className="flex items-center gap-2">
                      <button className="hover:text-white flex items-center gap-1">
                        <Pause className="h-3 w-3" /> Pause
                      </button>
                      <button className="hover:text-rose-400 flex items-center gap-1">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Import History Table */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="py-3 px-4 border-b border-slate-800">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" /> Recent Import History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="p-3">Source Name</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Files</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{item.source}</td>
                    <td className="p-3">{item.timestamp}</td>
                    <td className="p-3 font-mono">{item.duration}</td>
                    <td className="p-3">{item.filesCount} items</td>
                    <td className="p-3 text-right">
                      {item.status === "SUCCESS" && (
                        <Badge variant="emerald" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Success
                        </Badge>
                      )}
                      {item.status === "FAILED" && (
                        <Badge variant="amber" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> Failed
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Import Preview Modal */}
      {previewOpen && selectedConnector && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <span>{selectedConnector.icon}</span> Import Preview: {selectedConnector.name}
              </h3>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Estimated File Count:</span>
                <span className="font-semibold text-white">30 files</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Estimated Storage:</span>
                <span className="font-semibold text-white">45.2 MB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>Estimated Processing Time:</span>
                <span className="font-semibold text-white">~ 15 seconds</span>
              </div>
            </div>

            {/* Duplicate & Conflict Rule Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Duplicate Handling Rule:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(["SKIP", "MERGE", "RENAME"] as const).map((rule) => (
                  <button
                    key={rule}
                    onClick={() => setConflictRule(rule)}
                    className={`py-1.5 rounded-lg border text-center font-semibold transition-colors ${
                      conflictRule === rule
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    {rule}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button variant="default" className="w-full" onClick={handleStartImport}>
                Confirm & Launch Import
              </Button>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
