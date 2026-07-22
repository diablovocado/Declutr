"use client";

import React from "react";
import { Upload, Sparkles, Search, MessageSquare, ShieldCheck, Workflow, FileCheck2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface ActivityEvent {
  id: string;
  type: "upload" | "processing" | "search" | "chat" | "workflow";
  title: string;
  detail: string;
  timestamp: string;
}

export function DailyActivityFeed() {
  const activities: ActivityEvent[] = [
    {
      id: "act_01",
      type: "upload",
      title: "Uploaded Memory File",
      detail: "Tax_Filing_Form_1040_2025.pdf (4.2 MB) encrypted & sharded locally.",
      timestamp: "10 mins ago",
    },
    {
      id: "act_02",
      type: "processing",
      title: "AI Processing Pipeline Completed",
      detail: "Extracted text, OCR parsing, 512-dim pgvector indexing completed cleanly.",
      timestamp: "12 mins ago",
    },
    {
      id: "act_03",
      type: "chat",
      title: "AI Copilot Session",
      detail: "Asked 'What is this document?' with 2 citations generated.",
      timestamp: "15 mins ago",
    },
    {
      id: "act_04",
      type: "search",
      title: "Natural Vector Search",
      detail: "Queried 'Tax form 2025' returning 1 exact match (relevance: 98%).",
      timestamp: "1 hour ago",
    },
  ];

  const getIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "upload": return <Upload className="h-4 w-4 text-emerald-400" />;
      case "processing": return <Sparkles className="h-4 w-4 text-purple-400" />;
      case "chat": return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case "search": return <Search className="h-4 w-4 text-amber-400" />;
      case "workflow": return <Workflow className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" /> Daily Activity & Intelligence Timeline
          </CardTitle>
          <Badge variant="outline">Live Feed</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-2.5 top-1 p-1 rounded-full bg-slate-900 border border-slate-700 shrink-0">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white">{act.title}</h4>
                  <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{act.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
