"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Calendar, Sparkles, Activity, Search, Filter, Layers, ArrowRight } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { MemoryCard, MemoryCardData } from "../../features/timeline/components/memory-card";
import { ActivityHeatmap } from "../../features/timeline/components/activity-heatmap";
import { VerticalTimelineStream, TimelineEvent } from "../../features/timeline/components/vertical-timeline-stream";

export default function TimelinePage() {
  const [activeView, setActiveView] = useState<"STREAM" | "HEATMAP" | "CARDS">("STREAM");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const sampleMemories: MemoryCardData[] = [
    {
      id: "mem_1",
      title: "Japan Trip & Travel Receipts",
      subtitle: "Hotel bookings, Narita express tickets, and travel photos.",
      dateRange: "May 10 - May 24, 2025",
      itemCount: 14,
      category: "TRAVEL",
      coverTag: "Travel Memory",
    },
    {
      id: "mem_2",
      title: "Tax Season 2025 Filing",
      subtitle: "Form 1040, W-2 wage summary, accountant receipts, and refund confirmation.",
      dateRange: "March 1 - April 15, 2026",
      itemCount: 8,
      category: "FINANCE",
      coverTag: "Annual Financials",
    },
    {
      id: "mem_3",
      title: "Cardiology & Health Checkups",
      subtitle: "Blood test reports, Dr. Sharma prescriptions, and insurance claims.",
      dateRange: "January 2026",
      itemCount: 6,
      category: "MEDICAL",
      coverTag: "Health Records",
    },
  ];

  const sampleEvents: TimelineEvent[] = [
    {
      id: "evt_1",
      time: "14:32 PM",
      dateGroup: "Today (July 22, 2026)",
      type: "UPLOAD",
      title: "Uploaded Tax_Filing_Form_1040_2025.pdf",
      description: "Stored in zero-knowledge vault. Text OCR and metadata extraction completed in 1.2s.",
      relatedFile: "Tax_Filing_Form_1040_2025.pdf",
      relatedId: "file_demo_01",
    },
    {
      id: "evt_2",
      time: "12:15 PM",
      dateGroup: "Today (July 22, 2026)",
      type: "AI_SUMMARY",
      title: "Generated Tax Summary & Deduction Metrics",
      description: "AI Copilot extracted $125,000 gross income and $3,200 refund due.",
      relatedFile: "Tax_Filing_Form_1040_2025.pdf",
      relatedId: "file_demo_01",
    },
    {
      id: "evt_3",
      time: "09:45 AM",
      dateGroup: "Yesterday (July 21, 2026)",
      type: "IMPORT",
      title: "Google Drive Sync (Financials Folder)",
      description: "Imported 12 new documents into Financial & Tax Collection.",
    },
    {
      id: "evt_4",
      time: "16:20 PM",
      dateGroup: "July 18, 2026",
      type: "PROJECT_CREATED",
      title: "Created Project '2025 Tax Filing'",
      description: "Grouped tax receipts, W-2 forms, and Form 1040 into a unified project timeline.",
    },
  ];

  return (
    <PageShell
      title="Timeline & Memory Engine"
      subtitle="Explore your digital life chronologically. All uploads, imports, AI summaries, and events organized around time."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Timeline" }]}
    >
      <div className="space-y-6">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {/* Natural Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search timeline e.g. 'Japan trip' or 'Tax season 2025'"
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Time Scrubber Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {["ALL", "TODAY", "THIS_WEEK", "THIS_MONTH", "2026", "2025"].map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  timeFilter === f
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView("STREAM")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === "STREAM" ? "bg-slate-800 text-white font-bold" : "text-slate-400"
              }`}
            >
              Stream
            </button>
            <button
              onClick={() => setActiveView("CARDS")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === "CARDS" ? "bg-slate-800 text-white font-bold" : "text-slate-400"
              }`}
            >
              Memory Cards
            </button>
            <button
              onClick={() => setActiveView("HEATMAP")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === "HEATMAP" ? "bg-slate-800 text-white font-bold" : "text-slate-400"
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>

        {/* View 1: STREAM */}
        {activeView === "STREAM" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VerticalTimelineStream events={sampleEvents} />
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> AI Memory Flashback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">One Year Ago Today:</strong> You uploaded your 2024 Tax Return form and cardiologist consultation notes.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                    View Flashback Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* View 2: CARDS */}
        {activeView === "CARDS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleMemories.map((mem) => (
              <MemoryCard key={mem.id} memory={mem} />
            ))}
          </div>
        )}

        {/* View 3: HEATMAP */}
        {activeView === "HEATMAP" && <ActivityHeatmap />}
      </div>
    </PageShell>
  );
}
