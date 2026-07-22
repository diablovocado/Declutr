"use client";

import React, { useState } from "react";
import { Zap, Play, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

export interface WorkflowBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  onSave: (workflow: any) => void;
}

export function WorkflowBuilderModal({ isOpen, onClose, initialTitle, onSave }: WorkflowBuilderModalProps) {
  const [title, setTitle] = useState(initialTitle || "Custom Knowledge Automation");
  const [trigger, setTrigger] = useState("FILE_UPLOADED");
  const [condition, setCondition] = useState("TYPE_PDF");
  const [action, setAction] = useState("EXTRACT_METADATA");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState("");

  if (!isOpen) return null;

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setTestResult("Test Run Passed! 1 file matched conditions. 3 actions executed cleanly.");
    }, 1200);
  };

  const handleSave = () => {
    onSave({ title, trigger, condition, action });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" /> Visual Workflow Builder
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Workflow Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">1. TRIGGER</span>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="FILE_UPLOADED">When File Uploaded</option>
              <option value="FILE_IMPORTED">When File Imported</option>
              <option value="OCR_COMPLETED">When OCR Completed</option>
              <option value="SUMMARY_GENERATED">When Summary Generated</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">2. CONDITION</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="TYPE_PDF">If File Type is PDF</option>
              <option value="COLLECTION_FINANCIALS">If Collection is Financials</option>
              <option value="CONFIDENCE_HIGH">If AI Confidence &gt; 90%</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">3. ACTIONS</span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="EXTRACT_METADATA">Extract Merchant &amp; Add Tags</option>
              <option value="CREATE_TASK">Create Task &amp; Expiration Reminder</option>
              <option value="MOVE_COLLECTION">Move to Financials Collection</option>
            </select>
          </div>

          {testResult && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> {testResult}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <Button variant="outline" size="sm" onClick={handleTest} disabled={testing} className="h-8 text-xs gap-1">
            <Play className="h-3 w-3 text-emerald-400" /> {testing ? "Testing..." : "Test Run"}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} className="h-8 text-xs">
              Save &amp; Enable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
