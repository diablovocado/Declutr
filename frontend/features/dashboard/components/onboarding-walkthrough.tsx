"use client";

import React, { useState } from "react";
import { Sparkles, Upload, Search, MessageSquare, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../../components/overlay/dialog";
import { Button } from "../../../components/ui/button";

export interface OnboardingWalkthroughProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartUpload: () => void;
}

export function OnboardingWalkthrough({ open, onOpenChange, onStartUpload }: OnboardingWalkthroughProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Declutr",
      description: "Your personal knowledge operating system — private, zero-knowledge, AI-powered memory vault.",
      icon: <Sparkles className="h-8 w-8 text-emerald-400" />,
    },
    {
      title: "1. Upload & Ingest Any File",
      description: "Drag and drop Tax returns, medical receipts, contracts, or audio notes. Files are encrypted client-side using SRP-6a before sharding.",
      icon: <Upload className="h-8 w-8 text-purple-400" />,
    },
    {
      title: "2. Natural & Vector Hybrid Search",
      description: "Find anything by searching naturally — 'Tax form 2025' or 'Doctor prescription'. Keyword FTS fuses with 512-dim pgvector embeddings.",
      icon: <Search className="h-8 w-8 text-blue-400" />,
    },
    {
      title: "3. Grounded AI Copilot Chat",
      description: "Ask questions like 'What is this document?' or 'Summarize my medical report' and receive AI answers grounded with exact citations.",
      icon: <MessageSquare className="h-8 w-8 text-amber-400" />,
    },
  ];

  const currentStep = steps[step];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white text-center">
        <div className="py-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 w-fit mx-auto mb-4">
            {currentStep.icon}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mb-6">
            {currentStep.description}
          </p>

          <div className="flex justify-center gap-1.5 mb-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === step ? "w-6 bg-emerald-400" : "w-1.5 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {step < steps.length - 1 ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Skip Tour
              </Button>
              <Button variant="default" size="sm" onClick={() => setStep((s) => s + 1)} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Next Step
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                onStartUpload();
              }}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload First Memory File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
