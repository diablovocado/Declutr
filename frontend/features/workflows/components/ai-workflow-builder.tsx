"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface AIWorkflowBuilderProps {
  onGenerateWorkflow: (prompt: string) => void;
}

export function AIWorkflowBuilder({ onGenerateWorkflow }: AIWorkflowBuilderProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerateWorkflow(prompt);
    setPrompt("");
  };

  return (
    <Card className="bg-purple-950/20 border-purple-800/40">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="purple" className="gap-1 text-[10px]">
            <Sparkles className="h-3 w-3" /> Natural Language AI Workflow Generator
          </Badge>
          <span className="text-[10px] font-mono text-purple-300">Powered by Gemini OCR & LLM</span>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white mb-1">Describe what you want to automate in plain English:</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'When I upload receipts, extract merchant and add to Financials collection'"
              className="flex-1 h-10 px-3 rounded-xl bg-slate-950/80 border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Button variant="default" size="sm" onClick={handleGenerate} className="h-10 px-4 text-xs gap-1.5 shrink-0">
              Generate Workflow <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
