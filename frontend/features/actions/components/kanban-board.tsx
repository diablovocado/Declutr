"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, FileText, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  linkedFile?: string;
  linkedId?: string;
}

export interface KanbanBoardProps {
  tasks: TaskItem[];
  onToggleComplete: (id: string) => void;
}

export function KanbanBoard({ tasks, onToggleComplete }: KanbanBoardProps) {
  const columns: { key: TaskItem["status"]; title: string; color: string }[] = [
    { key: "TODO", title: "To Do", color: "text-slate-300" },
    { key: "IN_PROGRESS", title: "In Progress", color: "text-emerald-400" },
    { key: "REVIEW", title: "Under Review", color: "text-purple-400" },
    { key: "COMPLETED", title: "Completed", color: "text-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between px-1">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                {col.title} ({colTasks.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {colTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 group hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => onToggleComplete(t.id)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400"
                    >
                      <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                        t.status === "COMPLETED" ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700"
                      }`}>
                        {t.status === "COMPLETED" && <Check className="h-3 w-3 font-extrabold" />}
                      </div>
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-semibold block leading-tight ${
                        t.status === "COMPLETED" ? "line-through text-slate-500" : "text-white"
                      }`}>
                        {t.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="font-mono">Due: {t.dueDate}</span>
                    <Badge variant={t.priority === "HIGH" ? "amber" : "outline"} className="text-[9px] py-0 px-1 font-mono">
                      {t.priority}
                    </Badge>
                  </div>

                  {t.linkedFile && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <FileText className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{t.linkedFile}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
