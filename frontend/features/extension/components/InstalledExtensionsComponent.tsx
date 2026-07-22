"use client";

import React from "react";
import { Code, Power, Trash2, Shield, RefreshCw } from "lucide-react";

export interface InstalledExtension {
  id: string;
  extension_id: string;
  installed_version: string;
  status: "INSTALLED" | "ENABLED" | "DISABLED" | "ERROR" | "UNINSTALLED";
  approved_permissions: string[];
}

interface InstalledExtensionsProps {
  installations: InstalledExtension[];
  onLifecycleAction: (instId: string, action: string) => void;
}

export function InstalledExtensionsComponent({
  installations,
  onLifecycleAction,
}: InstalledExtensionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Installed Extensions & Sandboxes</h3>
        <p className="text-sm text-muted-foreground">Manage active extension state, lifecycle controls, and resource limits</p>
      </div>

      <div className="space-y-3">
        {installations.map((inst) => (
          <div key={inst.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">{inst.extension_id}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary">
                    v{inst.installed_version}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {inst.approved_permissions.map((p) => (
                    <span key={p} className="text-[10px] font-mono text-muted-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {inst.status === "ENABLED" || inst.status === "INSTALLED" ? (
                <button
                  onClick={() => onLifecycleAction(inst.id, "DISABLE")}
                  className="px-3 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => onLifecycleAction(inst.id, "ENABLE")}
                  className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold"
                >
                  Enable
                </button>
              )}

              <button
                onClick={() => onLifecycleAction(inst.id, "UNINSTALL")}
                className="p-1.5 rounded hover:bg-rose-500/10 text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
