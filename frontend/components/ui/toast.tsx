"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "p-4 rounded-xl border shadow-lg flex items-start gap-3 text-xs transition-all animate-in slide-in-from-bottom-2",
            t.type === "success" && "bg-slate-900 border-emerald-500/50 text-slate-100",
            t.type === "error" && "bg-slate-900 border-rose-500/50 text-slate-100",
            t.type === "info" && "bg-slate-900 border-blue-500/50 text-slate-100"
          )}
        >
          {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />}
          {t.type === "info" && <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-0.5">{t.title}</h4>
            {t.message && <p className="text-slate-400 leading-relaxed">{t.message}</p>}
          </div>

          <button onClick={() => onDismiss(t.id)} className="text-slate-500 hover:text-slate-300 p-0.5">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
