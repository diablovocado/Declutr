"use client";

import React from "react";
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface AISuggestion {
  id: string;
  title: string;
  reason: string;
  sourceFile: string;
  sourceId: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
}

export interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAccept: (suggestion: AISuggestion) => void;
  onDismiss: (id: string) => void;
}

export function AISuggestionCard({ suggestion, onAccept, onDismiss }: AISuggestionCardProps) {
  return (
    <Card className="bg-purple-950/20 border-purple-800/40 hover:border-purple-600/60 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="purple" className="gap-1 text-[10px]">
            <Sparkles className="h-3 w-3" /> Proactive AI Recommendation
          </Badge>
          <Badge
            variant={suggestion.priority === "HIGH" ? "amber" : "outline"}
            className="text-[10px] font-mono"
          >
            {suggestion.priority} Priority
          </Badge>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white">{suggestion.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{suggestion.reason}</p>
        </div>

        <div className="flex items-center justify-between border-t border-purple-900/40 pt-2.5 text-xs">
          <span className="text-[11px] font-mono text-purple-300 truncate max-w-[180px]">
            Source: {suggestion.sourceFile}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDismiss(suggestion.id)}
              className="text-slate-400 hover:text-rose-400 text-[11px] font-medium"
            >
              Dismiss
            </button>
            <Button variant="default" size="sm" onClick={() => onAccept(suggestion)} className="h-7 text-[11px] px-2.5">
              Accept Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
