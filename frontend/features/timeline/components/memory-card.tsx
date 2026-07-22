"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, FolderKey, Bookmark, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface MemoryCardData {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  itemCount: number;
  category: "TRAVEL" | "FINANCE" | "EDUCATION" | "MEDICAL" | "PROJECT";
  coverTag: string;
}

export interface MemoryCardProps {
  memory: MemoryCardData;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const getCategoryColor = (cat: MemoryCardData["category"]) => {
    switch (cat) {
      case "TRAVEL": return "border-blue-500/40 bg-blue-950/20 text-blue-400";
      case "FINANCE": return "border-emerald-500/40 bg-emerald-950/20 text-emerald-400";
      case "EDUCATION": return "border-purple-500/40 bg-purple-950/20 text-purple-400";
      case "MEDICAL": return "border-rose-500/40 bg-rose-950/20 text-rose-400";
      case "PROJECT": return "border-amber-500/40 bg-amber-950/20 text-amber-400";
      default: return "border-slate-800 bg-slate-900/60 text-slate-300";
    }
  };

  return (
    <Card className={`border transition-all hover:scale-[1.01] cursor-pointer ${getCategoryColor(memory.category)}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider font-mono">
            {memory.coverTag}
          </Badge>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {memory.dateRange}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white truncate">{memory.title}</h3>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{memory.subtitle}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">{memory.itemCount} items linked</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
            Explore Memory <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
