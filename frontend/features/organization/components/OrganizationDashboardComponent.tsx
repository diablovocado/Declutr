"use client";

import React from "react";
import { Building2, Users, Layers, ShieldCheck, KeyRound, Globe, ArrowUpRight } from "lucide-react";

export interface OrgDashboardProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    domains?: string[];
    time_zone: string;
    language: string;
  } | null;
  membersCount: number;
  workspacesCount: number;
  rolesCount: number;
  policiesCount: number;
}

export function OrganizationDashboardComponent({
  organization,
  membersCount,
  workspacesCount,
  rolesCount,
  policiesCount,
}: OrgDashboardProps) {
  if (!organization) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
        Select an organization from the switcher above to view enterprise settings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="p-6 rounded-xl border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{organization.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Slug: <span className="font-mono text-foreground">{organization.slug}</span> • Timezone: <span className="font-mono text-foreground">{organization.time_zone}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-secondary px-3 py-1.5 rounded-lg">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>Domains: {organization.domains?.join(", ") || "None set"}</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{membersCount}</div>
          <div className="text-xs text-muted-foreground">Active enterprise directory</div>
        </div>

        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Workspaces</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{workspacesCount}</div>
          <div className="text-xs text-muted-foreground">Department & team vaults</div>
        </div>

        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">RBAC Roles</span>
            <KeyRound className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{rolesCount}</div>
          <div className="text-xs text-muted-foreground">Granular permission roles</div>
        </div>

        <div className="p-5 rounded-xl border bg-card space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Security Policies</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{policiesCount}</div>
          <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Policy Guard Enforced
          </div>
        </div>
      </div>
    </div>
  );
}
