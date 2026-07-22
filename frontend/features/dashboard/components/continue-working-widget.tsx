"use client";

import React from "react";
import Link from "next/link";
import { FileText, MessageSquare, Search, Folder, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface ContinueWorkingWidgetProps {
  recentFiles?: { id: string; name: string; size: string; time: string }[];
  recentChats?: { id: string; question: string; answer: string; time: string }[];
}

export function ContinueWorkingWidget({
  recentFiles = [
    { id: "file_demo_01", name: "Tax_Filing_Form_1040_2025.pdf", size: "4.2 MB", time: "10 mins ago" },
    { id: "file_demo_02", name: "Cardiology_Prescription_Dr_Sharma.pdf", size: "1.8 MB", time: "2 hours ago" },
  ],
  recentChats = [
    { id: "c1", question: "What is this document?", answer: "Annual 2025 IRS Tax filing indicating $125k total income.", time: "15 mins ago" },
    { id: "c2", question: "What dates are mentioned?", answer: "Tax period ending Dec 31, 2025; filed April 12, 2026.", time: "1 hour ago" },
  ],
}: ContinueWorkingWidgetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recently Opened Assets */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" /> Continue Working — Recent Assets
            </CardTitle>
            <Link href="/vault" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentFiles.map((file) => (
            <Link key={file.id} href={`/files/${file.id}`}>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    <FileText className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{file.name}</h4>
                    <p className="text-[11px] text-slate-400">{file.size} • Opened {file.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  PDF
                </Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Recent AI Conversations */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" /> Recent AI Conversations
            </CardTitle>
            <Link href="/copilot" className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1">
              Open Chat <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentChats.map((chat) => (
            <Link key={chat.id} href={`/copilot?c=${chat.id}`}>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{chat.question}</span>
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{chat.answer}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
