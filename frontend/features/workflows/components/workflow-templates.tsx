"use client";

import React from "react";
import { Zap, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  triggerText: string;
  actionsText: string;
}

export interface WorkflowTemplatesProps {
  onUseTemplate: (tpl: WorkflowTemplate) => void;
}

export function WorkflowTemplates({ onUseTemplate }: WorkflowTemplatesProps) {
  const templates: WorkflowTemplate[] = [
    {
      id: "tpl_1",
      title: "Receipt & Expense Organizer",
      description: "Extract merchant, total amount, and date from uploaded receipts and move to Financials.",
      category: "FINANCE",
      triggerText: "On Receipt Upload",
      actionsText: "OCR ➔ Extract Merchant ➔ Add to Financials",
    },
    {
      id: "tpl_2",
      title: "Contract Expiration Alert",
      description: "Extract expiration date from contracts and automatically create a calendar task reminder.",
      category: "LEGAL",
      triggerText: "On PDF Upload",
      actionsText: "Extract Dates ➔ Create Task Reminder",
    },
    {
      id: "tpl_3",
      title: "Tax Season Auto-Categorizer",
      description: "Auto-tag W-2s, Form 1040s, and accountant invoices into the 2025 Tax Project.",
      category: "TAXES",
      triggerText: "On Financial Import",
      actionsText: "AI Categorize ➔ Tag ➔ Move to Tax Project",
    },
  ];

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Zap className="h-4 w-4" /> Recommended Automation Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <Badge variant="purple" className="text-[9px] font-mono">{tpl.category}</Badge>
              <h4 className="text-xs font-bold text-white">{tpl.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-900 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 block">{tpl.actionsText}</span>
              <Button variant="default" size="sm" onClick={() => onUseTemplate(tpl)} className="w-full h-7 text-[11px] gap-1">
                Activate Template <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
