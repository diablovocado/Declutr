"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export interface CitationItem {
  documentId: string;
  documentName: string;
  section: string;
  confidence: number; // e.g. 0.96
  snippet?: string;
}

export interface CitationListProps {
  citations: CitationItem[];
}

export function CitationList({ citations }: CitationListProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Verifiable Knowledge Sources ({citations.length})
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Zero-Knowledge RAG</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((c, idx) => (
          <Link key={idx} href={`/files/${c.documentId}`}>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate block group-hover:text-purple-300">
                    {c.documentName}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">{c.section}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="emerald" className="text-[9px] font-mono py-0 px-1">
                  {Math.round(c.confidence * 100)}% match
                </Badge>
                <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-purple-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
