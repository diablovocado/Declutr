"use client";

import React from "react";
import { Target, CheckCircle2, Calendar, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface GoalData {
  id: string;
  title: string;
  targetDate: string;
  completedTasks: number;
  totalTasks: number;
  linkedFilesCount: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
}

export interface GoalCardProps {
  goal: GoalData;
}

export function GoalCard({ goal }: GoalCardProps) {
  const percent = Math.round((goal.completedTasks / goal.totalTasks) * 100);

  return (
    <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="emerald" className="gap-1 text-[10px]">
            <Target className="h-3 w-3" /> Goal
          </Badge>
          <span className="text-[11px] text-slate-400 font-mono">Target: {goal.targetDate}</span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white truncate">{goal.title}</h3>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Progress ({percent}%)</span>
            <span>{goal.completedTasks} / {goal.totalTasks} tasks</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
          <span>{goal.linkedFilesCount} linked vault memories</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
            View Goal <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
