"use client";

import React from "react";
import Link from "next/link";
import { FileText, Bookmark, MessageSquare, Search, Sparkles, Layers, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useWorkspaceContext } from "../../shared/providers/workspace-context-provider";
import { Badge } from "../ui/badge";

export function SmartSidebar() {
  const { activeDocument, activeCollection, activeProject } = useWorkspaceContext();

  const relatedFiles = [
    { id: "file_demo_01", name: "Tax_Filing_Form_1040_2025.pdf", size: "4.2 MB" },
    { id: "file_demo_02", name: "W-2_Income_Summary_2025.pdf", size: "1.2 MB" },
    { id: "file_demo_03", name: "Accountant_Receipt_John_Smith.pdf", size: "0.8 MB" },
  ];

  const relatedChats = [
    { id: "c1", title: "Tax Return 2025 Questions" },
    { id: "c2", title: "Deductions & Refund Analysis" },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-l border-slate-800 p-4 shrink-0 hidden xl:flex flex-col gap-6 text-xs overflow-y-auto">
      {/* Context Summary Header */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smart Sidebar</span>
        </div>
        <h3 className="font-semibold text-white text-sm truncate">
          {activeDocument?.name || activeCollection?.name || "Active Context"}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Contextually adapted items for current workspace.
        </p>
      </div>

      {/* Related Documents */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <FileText className="h-3 w-3 text-emerald-400" /> Related Files
          </span>
          <Badge variant="outline" className="text-[9px]">3 items</Badge>
        </div>
        <div className="space-y-1.5">
          {relatedFiles.map((file) => (
            <Link key={file.id} href={`/files/${file.id}`}>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between">
                <span className="text-slate-200 font-medium truncate">{file.name}</span>
                <ArrowUpRight className="h-3 w-3 text-slate-500 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Related AI Chats */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-purple-400" /> Grounded AI Chats
          </span>
        </div>
        <div className="space-y-1.5">
          {relatedChats.map((chat) => (
            <Link key={chat.id} href={`/copilot?c=${chat.id}`}>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="text-slate-200 font-medium truncate block">{chat.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="mt-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
          <Sparkles className="h-3.5 w-3.5" /> Suggested Action
        </div>
        <p className="text-[11px] text-slate-400">
          Run automated metadata extraction to tag tax deduction line items.
        </p>
      </div>
    </aside>
  );
}
