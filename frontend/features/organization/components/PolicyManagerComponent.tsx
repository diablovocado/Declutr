"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, Clock, EyeOff, FileText, Cpu, Workflow } from "lucide-react";

export interface Policy {
  id: string;
  type: string;
  is_enabled: boolean;
  rules: Record<string, any>;
}

interface PolicyManagerProps {
  policies: Policy[];
  onTogglePolicy: (type: string, enabled: boolean) => void;
}

const DEFAULT_POLICIES = [
  { type: "PASSWORD_POLICY", label: "Password Strength & Expiration Policy", icon: Lock },
  { type: "SESSION_TIMEOUT", label: "Session Inactivity Timeout Policy", icon: Clock },
  { type: "MFA_REQUIREMENT", label: "Mandatory Multi-Factor Authentication (MFA)", icon: ShieldCheck },
  { type: "SHARING_RESTRICTION", label: "External Sharing & Link Expiration Policy", icon: EyeOff },
  { type: "RETENTION_POLICY", label: "Automated Data Retention & Purge Policy", icon: FileText },
  { type: "AI_USAGE_POLICY", label: "Organization AI Inference & Grounding Rules", icon: Cpu },
  { type: "WORKFLOW_RESTRICTION", label: "Automated Action Execution Restrictions", icon: Workflow },
];

export function PolicyManagerComponent({ policies, onTogglePolicy }: PolicyManagerProps) {
  const isPolicyEnabled = (type: string) => {
    const p = policies.find((pol) => pol.type === type);
    return p ? p.is_enabled : true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Enterprise Governance & Security Policy Center</h3>
        <p className="text-sm text-muted-foreground">Enforce organization-wide security, retention, sharing, and AI execution guardrails</p>
      </div>

      <div className="space-y-3">
        {DEFAULT_POLICIES.map((p) => {
          const Icon = p.icon;
          const enabled = isPolicyEnabled(p.type);
          return (
            <div key={p.type} className="p-4 rounded-xl border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Icon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{p.label}</h4>
                  <p className="text-xs text-muted-foreground font-mono">Type: {p.type}</p>
                </div>
              </div>

              <button
                onClick={() => onTogglePolicy(p.type, !enabled)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  enabled
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                }`}
              >
                {enabled ? "Policy Active" : "Disabled"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
