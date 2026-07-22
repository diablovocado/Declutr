"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckSquare, Sparkles, Target, Plus, Filter, Calendar, FileText, CheckCircle2, Clock } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { AISuggestionCard, AISuggestion } from "../../features/actions/components/ai-suggestion-card";
import { GoalCard, GoalData } from "../../features/actions/components/goal-card";
import { KanbanBoard, TaskItem } from "../../features/actions/components/kanban-board";

export default function ActionsPage() {
  const [activeTab, setActiveTab] = useState<"KANBAN" | "GOALS" | "SUGGESTIONS">("KANBAN");

  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([
    {
      id: "s1",
      title: "Schedule Passport Renewal",
      reason: "Passport expires in 6 months. Early renewal is recommended for international travel.",
      sourceFile: "US_Passport_Scan_2021.pdf",
      sourceId: "file_demo_pass",
      priority: "HIGH",
      dueDate: "Aug 15, 2026",
    },
    {
      id: "s2",
      title: "Review 3 Unpaid Accountant Invoices",
      reason: "Invoice #1042, #1043, and #1045 match payment pending status.",
      sourceFile: "Accountant_Receipt_John_Smith.pdf",
      sourceId: "file_demo_03",
      priority: "MEDIUM",
      dueDate: "July 30, 2026",
    },
  ]);

  const [goals, setGoals] = useState<GoalData[]>([
    { id: "g1", title: "Prepare 2025 Taxes", targetDate: "April 15, 2026", completedTasks: 6, totalTasks: 8, linkedFilesCount: 12, status: "IN_PROGRESS" },
    { id: "g2", title: "Japan Trip 2025", targetDate: "May 10, 2025", completedTasks: 14, totalTasks: 14, linkedFilesCount: 18, status: "COMPLETED" },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "t1", title: "Submit Form 1040 to IRS Accountant", dueDate: "Tomorrow", priority: "HIGH", status: "TODO", linkedFile: "Tax_Filing_Form_1040_2025.pdf" },
    { id: "t2", title: "Verify W-2 Wage Withholding Details", dueDate: "July 25", priority: "MEDIUM", status: "IN_PROGRESS", linkedFile: "W-2_Income_Summary_2025.pdf" },
    { id: "t3", title: "Archive 2024 Tax Receipts", dueDate: "Completed", priority: "LOW", status: "COMPLETED" },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAcceptSuggestion = (sug: AISuggestion) => {
    const newTask: TaskItem = {
      id: "t_" + Date.now(),
      title: sug.title,
      dueDate: sug.dueDate || "Next Week",
      priority: sug.priority,
      status: "TODO",
      linkedFile: sug.sourceFile,
    };
    setTasks((prev) => [newTask, ...prev]);
    setAiSuggestions((prev) => prev.filter((s) => s.id !== sug.id));
  };

  const handleDismissSuggestion = (id: string) => {
    setAiSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "COMPLETED" ? "TODO" : "COMPLETED" } : t))
    );
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: "t_" + Date.now(),
        title: newTaskTitle,
        dueDate: "Soon",
        priority: "MEDIUM",
        status: "TODO",
      },
      ...prev,
    ]);
    setNewTaskTitle("");
    setCreateOpen(false);
  };

  return (
    <PageShell
      title="Goals, Tasks & AI Action Center"
      subtitle="Knowledge-grounded execution platform. Transform vault memories and AI insights into completed actions."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Action Center" }]}
      actions={
        <Button variant="default" size="sm" onClick={() => setCreateOpen(true)} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Quick Capture Task
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Proactive AI Recommendations Bar */}
        {aiSuggestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Proactive AI Recommendations ({aiSuggestions.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((sug) => (
                <AISuggestionCard
                  key={sug.id}
                  suggestion={sug}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={handleDismissSuggestion}
                />
              ))}
            </div>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("KANBAN")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "KANBAN" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            📋 Task Board (Kanban)
          </button>
          <button
            onClick={() => setActiveTab("GOALS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "GOALS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            🎯 Long-Term Goals ({goals.length})
          </button>
        </div>

        {/* Tab 1: KANBAN BOARD */}
        {activeTab === "KANBAN" && (
          <KanbanBoard tasks={tasks} onToggleComplete={handleToggleTaskComplete} />
        )}

        {/* Tab 2: GOALS HUB */}
        {activeTab === "GOALS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Task Capture Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-400" /> Quick Task Capture
            </h3>

            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />

            <div className="flex items-center gap-2 pt-2">
              <Button variant="default" className="w-full" onClick={handleCreateTask}>
                Create Task
              </Button>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
