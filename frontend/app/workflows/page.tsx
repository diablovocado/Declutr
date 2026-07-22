"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Plus, Sparkles, Activity, CheckCircle2, Play, Power, Trash2 } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { AIWorkflowBuilder } from "../../features/workflows/components/ai-workflow-builder";
import { WorkflowBuilderModal } from "../../features/workflows/components/workflow-builder-modal";
import { WorkflowTemplates, WorkflowTemplate } from "../../features/workflows/components/workflow-templates";
import { ExecutionTelemetry, LogItem } from "../../features/workflows/components/execution-telemetry";

export interface ActiveWorkflow {
  id: string;
  title: string;
  trigger: string;
  actions: string;
  enabled: boolean;
  runCount: number;
}

export default function WorkflowsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"WORKFLOWS" | "TEMPLATES" | "LOGS">("WORKFLOWS");
  const [modalInitialTitle, setModalInitialTitle] = useState("");

  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>([
    { id: "wf_1", title: "Receipt & Expense Organizer", trigger: "On Receipt Upload", actions: "OCR ➔ Extract Merchant ➔ Add to Financials", enabled: true, runCount: 14 },
    { id: "wf_2", title: "Contract Expiration Alert", trigger: "On PDF Upload", actions: "Extract Dates ➔ Create Task Reminder", enabled: true, runCount: 6 },
  ]);

  const [logs, setLogs] = useState<LogItem[]>([
    { id: "l1", workflowName: "Receipt & Expense Organizer", timestamp: "Today 14:32", duration: "1.2s", status: "SUCCESS", affectedFile: "Tax_Filing_Form_1040_2025.pdf" },
    { id: "l2", workflowName: "Contract Expiration Alert", timestamp: "Yesterday 11:15", duration: "0.8s", status: "SUCCESS", affectedFile: "US_Passport_Scan_2021.pdf" },
  ]);

  const handleGenerateAIWorkflow = (prompt: string) => {
    setModalInitialTitle("AI Generated: " + prompt.slice(0, 30));
    setModalOpen(true);
  };

  const handleUseTemplate = (tpl: WorkflowTemplate) => {
    setModalInitialTitle(tpl.title);
    setModalOpen(true);
  };

  const handleSaveWorkflow = (wfData: any) => {
    setWorkflows((prev) => [
      {
        id: "wf_" + Date.now(),
        title: wfData.title,
        trigger: wfData.trigger,
        actions: wfData.action,
        enabled: true,
        runCount: 0,
      },
      ...prev,
    ]);
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  return (
    <PageShell
      title="Automation Studio & Intelligent Workflows"
      subtitle="Automate repetitive document processing, AI metadata extraction, and collection organization without writing code."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Automation Studio" }]}
      actions={
        <Button variant="default" size="sm" onClick={() => { setModalInitialTitle("Custom Workflow"); setModalOpen(true); }} leftIcon={<Plus className="h-3.5 w-3.5" />}>
          New Visual Workflow
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Natural Language AI Generator Prompt */}
        <AIWorkflowBuilder onGenerateWorkflow={handleGenerateAIWorkflow} />

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("WORKFLOWS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "WORKFLOWS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            ⚡ Active Workflows ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab("TEMPLATES")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "TEMPLATES" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            🧩 Recommended Templates
          </button>
          <button
            onClick={() => setActiveTab("LOGS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "LOGS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            📊 Live Execution Logs ({logs.length})
          </button>
        </div>

        {/* Tab 1: WORKFLOWS */}
        {activeTab === "WORKFLOWS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workflows.map((w) => (
              <Card key={w.id} className="bg-slate-900/60 border-slate-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={w.enabled ? "emerald" : "outline"} className="text-[10px] font-mono">
                      {w.enabled ? "ACTIVE" : "DISABLED"}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">{w.runCount} runs</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{w.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 font-mono">{w.trigger} ➔ {w.actions}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                    <Button variant="outline" size="sm" onClick={() => handleToggleWorkflow(w.id)} className="h-7 text-[11px] gap-1">
                      <Power className="h-3 w-3 text-emerald-400" /> {w.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: TEMPLATES */}
        {activeTab === "TEMPLATES" && <WorkflowTemplates onUseTemplate={handleUseTemplate} />}

        {/* Tab 3: LOGS */}
        {activeTab === "LOGS" && <ExecutionTelemetry logs={logs} />}

        {/* Visual Builder Modal */}
        <WorkflowBuilderModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialTitle={modalInitialTitle}
          onSave={handleSaveWorkflow}
        />
      </div>
    </PageShell>
  );
}
