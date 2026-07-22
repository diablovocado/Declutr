"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, FileQuestion, Clock, Copy, Tag, CheckCircle2, ArrowRight, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface AIInsightItem {
  id: string;
  type: "review" | "expiring" | "metadata" | "duplicate" | "search";
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  category: string;
}

export function AIInsightsWidget() {
  const [insights, setInsights] = useState<AIInsightItem[]>([
    {
      id: "ins_01",
      type: "review",
      title: "Tax Filing 2025 Needs Review",
      description: "IRS Form 1040 is missing an accountant verification tag.",
      actionText: "Review Document",
      actionHref: "/files/file_demo_01",
      category: "Document Review",
    },
    {
      id: "ins_02",
      type: "expiring",
      title: "Passport Renewal Reminder",
      description: "US Passport expires in 60 days. Renewal window is open.",
      actionText: "View Passport Asset",
      actionHref: "/search?q=passport",
      category: "Expiring Document",
    },
    {
      id: "ins_03",
      type: "metadata",
      title: "2 Medical Receipts Missing Tags",
      description: "Uncategorized medical expense receipts in inbox.",
      actionText: "Add Tags",
      actionHref: "/vault",
      category: "Missing Metadata",
    },
  ]);

  const handleDismiss = (id: string) => {
    setInsights((prev) => prev.filter((item) => item.id !== id));
  };

  if (insights.length === 0) {
    return (
      <Card className="bg-slate-900/60 border-slate-800 mb-6">
        <CardContent className="py-6 text-center text-xs text-slate-400">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          All AI Insights reviewed! Your vault intelligence is up to date.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Intelligence Insights ({insights.length})</h3>
        </div>
        <span className="text-[11px] text-slate-500">Explainable proactive recommendations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => (
          <Card key={item.id} className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all relative group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={item.type === "expiring" ? "amber" : item.type === "review" ? "purple" : "blue"}>
                  {item.category}
                </Badge>
                <button onClick={() => handleDismiss(item.id)} className="text-slate-500 hover:text-slate-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CardTitle className="text-sm font-semibold text-white mt-2 leading-snug">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {item.description}
              </p>
              <Link href={item.actionHref}>
                <Button variant="outline" size="sm" className="w-full justify-between text-xs" rightIcon={<ArrowRight className="h-3 w-3" />}>
                  {item.actionText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
