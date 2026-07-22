"use client";

import React, { useState } from "react";
import { Sliders, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../../components/overlay/dialog";
import { Button } from "../../../components/ui/button";

export interface WidgetConfig {
  id: string;
  name: string;
  visible: boolean;
}

export interface DashboardCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  onResetLayout: () => void;
}

export function DashboardCustomizer({
  open,
  onOpenChange,
  widgets,
  onToggleWidget,
  onResetLayout,
}: DashboardCustomizerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sliders className="h-4 w-4 text-emerald-400" /> Customize Personal Intelligence Hub
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Show or hide widgets on your home dashboard to tailor your daily workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          {widgets.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
            >
              <span className="font-semibold text-slate-200">{w.name}</span>
              <button
                onClick={() => onToggleWidget(w.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  w.visible
                    ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {w.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onResetLayout} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset Default
          </Button>
          <DialogClose asChild>
            <Button variant="default" size="sm">
              Save Preferences
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
