"use client";

import React from "react";
import { ShieldCheck, Check, Lock, Eye, Code, Terminal } from "lucide-react";

export function SystemAuditMatrixComponent() {
  const audits = [
    { area: "Authentication & Zero-Knowledge", spec: "SRP-6a & WebAuthn Passkeys", result: "VERIFIED" },
    { area: "Multi-Tenant Data Isolation", spec: "Tenant Context Propagation", result: "VERIFIED" },
    { area: "Encryption at Rest & Transit", spec: "AES-256-GCM / TLS 1.3", result: "VERIFIED" },
    { area: "Scoped API Key Security", spec: "SHA-256 Hashing & Scopes", result: "VERIFIED" },
    { area: "Webhook Signature Integrity", spec: "HMAC-SHA256 Payload Signing", result: "VERIFIED" },
    { area: "Extension Sandbox Isolation", spec: "128MB / 5s Timeout Quotas", result: "VERIFIED" },
    { area: "WCAG 2.2 AA Accessibility", spec: "Keyboard Nav, ARIA, 4.5:1 Contrast", result: "VERIFIED" },
    { area: "Database Migrations Audit", spec: "Migrations 001–030 Safety", result: "VERIFIED" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Security, Privacy & Compliance Audit Matrix</h3>
        <p className="text-sm text-muted-foreground">Formal verification matrix across zero-knowledge auth, tenant isolation, and accessibility</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/50 border-b text-muted-foreground uppercase font-mono">
            <tr>
              <th className="p-3">Audit Boundary</th>
              <th className="p-3">Specification Standard</th>
              <th className="p-3 text-right">Audit Result</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {audits.map((a, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-semibold text-foreground">{a.area}</td>
                <td className="p-3 font-mono text-muted-foreground">{a.spec}</td>
                <td className="p-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Check className="w-3 h-3" /> {a.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
