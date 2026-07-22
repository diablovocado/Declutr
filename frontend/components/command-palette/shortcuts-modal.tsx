"use client";

import React from "react";
import { HelpCircle, Command } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../overlay/dialog";

export interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
  const shortcuts = [
    { key: "⌘K / Ctrl+K", description: "Open Universal Command Palette" },
    { key: "⌘U / Ctrl+U", description: "Quick Upload Memory File" },
    { key: "⌘⇧A / Ctrl+Shift+A", description: "Ask AI Copilot" },
    { key: "⌘, / Ctrl+,", description: "Open Vault Settings" },
    { key: "⌘/ / Ctrl+/", description: "Show Keyboard Shortcuts Cheat-Sheet" },
    { key: "Esc", description: "Dismiss Modal / Dialog" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 text-emerald-400" /> Keyboard Shortcuts Cheat-Sheet
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Keyboard-first productivity shortcuts available across all Declutr pages.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-2">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">{sc.description}</span>
              <kbd className="px-2 py-1 text-[10px] font-mono text-emerald-400 bg-slate-900 rounded border border-slate-700">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
