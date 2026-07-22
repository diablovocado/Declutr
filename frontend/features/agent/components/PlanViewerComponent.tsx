"use client";

import React from "react";
import { Check, X, ShieldAlert, Sparkles, Layers, ArrowRight } from "lucide-react";

export interface PlanTask {
  id: string;
  sequence_index: number;
  tool_name: string;
  action: string;
  parameters: any;
  is_destructive: boolean;
  status: string;
}

export interface AgentPlan {
  id: string;
  title: string;
  explanation: string;
  reasoning: string;
  confidence: number;
  status: string;
  requires_review: bool;
  tasks: PlanTask[];
}

interface PlanViewerProps {
  plan: AgentPlan;
  onApprove: (planId: string, comment: string) => void;
  onReject: (planId: string, comment: string) => void;
}

export function PlanViewerComponent({ plan, onApprove, onReject }: PlanViewerProps) {
  return (
    <div className="p-5 rounded-xl border bg-card space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base">{plan.title}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-bold">
              {(plan.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{plan.explanation}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            plan.status === "APPROVED"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : plan.status === "REJECTED"
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
          }`}
        >
          {plan.status}
        </span>
      </div>

      <div className="p-3 rounded-lg bg-secondary/50 border text-xs space-y-1">
        <span className="font-bold text-foreground">Reasoning Rationale:</span>
        <p className="text-muted-foreground">{plan.reasoning}</p>
      </div>

      {/* Task Steps Sequence */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan Task Sequence</h5>
        <div className="space-y-2">
          {plan.tasks.map((task) => (
            <div key={task.id} className="p-3 rounded-lg border bg-card flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[10px]">
                  {task.sequence_index}
                </span>
                <span className="font-bold text-indigo-500">{task.tool_name}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground">{task.action}</span>
              </div>
              {task.is_destructive && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                  <ShieldAlert className="w-3 h-3" /> Requires Approval
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Human Approval Controls */}
      {plan.requires_review && plan.status === "PENDING" && (
        <div className="flex justify-end gap-2 pt-3 border-t">
          <button
            onClick={() => onReject(plan.id, "Rejected by user")}
            className="px-4 py-2 rounded-lg border hover:bg-rose-500/10 text-rose-500 text-xs font-semibold flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Reject Plan
          </button>
          <button
            onClick={() => onApprove(plan.id, "Approved by user")}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Check className="w-4 h-4" /> Approve & Execute Plan
          </button>
        </div>
      )}
    </div>
  );
}
