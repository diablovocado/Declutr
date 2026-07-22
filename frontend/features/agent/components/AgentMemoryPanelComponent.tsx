"use client";

import React from "react";
import { Brain, Sparkles, CheckCircle2 } from "lucide-react";

export interface AgentMemoryItem {
  id: string;
  key: string;
  value: string;
  category: string;
  created_at: string;
}

interface AgentMemoryPanelProps {
  memories: AgentMemoryItem[];
}

export function AgentMemoryPanelComponent({ memories }: AgentMemoryPanelProps) {
  return (
    <div className="space-y-4 p-5 rounded-xl border bg-card">
      <div className="flex items-center gap-2 font-bold text-sm">
        <Brain className="w-4 h-4 text-indigo-500" />
        <span>Operational Agent Memory & Learnings</span>
      </div>

      <div className="space-y-2">
        {memories.map((mem) => (
          <div key={mem.id} className="p-3 rounded-lg bg-secondary/50 border text-xs space-y-1 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-500">{mem.key}</span>
              <span className="text-[10px] text-muted-foreground">{mem.category}</span>
            </div>
            <p className="text-muted-foreground">{mem.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
