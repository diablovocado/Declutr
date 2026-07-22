"use client";

import React, { useState } from "react";
import { Building2, User, ChevronDown, Check, Plus } from "lucide-react";

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

interface OrganizationSwitcherProps {
  organizations: OrgSummary[];
  activeOrgId: string | null; // null represents Personal Account
  onSelectOrg: (orgId: string | null) => void;
  onCreateOrg: () => void;
}

export function OrganizationSwitcher({
  organizations,
  activeOrgId,
  onSelectOrg,
  onCreateOrg,
}: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeOrg = organizations.find((o) => o.id === activeOrgId);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card hover:bg-accent/50 text-xs font-semibold transition-all"
      >
        {activeOrgId ? (
          <>
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="truncate max-w-[140px]">{activeOrg?.name || "Organization"}</span>
          </>
        ) : (
          <>
            <User className="w-4 h-4 text-emerald-500" />
            <span>Personal Account</span>
          </>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-card shadow-xl z-50 p-2 space-y-1 text-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 tracking-wider">
            Switch Context
          </div>

          {/* Personal Account Option */}
          <button
            onClick={() => {
              onSelectOrg(null);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              activeOrgId === null ? "bg-accent text-accent-foreground font-bold" : "hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="font-medium">Personal Account</div>
                <div className="text-[10px] text-muted-foreground">Default vault workspace</div>
              </div>
            </div>
            {activeOrgId === null && <Check className="w-4 h-4 text-emerald-500" />}
          </button>

          <div className="border-t my-1" />
          <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 tracking-wider">
            Organizations ({organizations.length})
          </div>

          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                onSelectOrg(org.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                activeOrgId === org.id ? "bg-accent text-accent-foreground font-bold" : "hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{org.name}</span>
              </div>
              {activeOrgId === org.id && <Check className="w-4 h-4 text-indigo-500" />}
            </button>
          ))}

          <div className="border-t my-1" />
          <button
            onClick={() => {
              onCreateOrg();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-indigo-500 hover:bg-indigo-500/10 font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Create New Organization
          </button>
        </div>
      )}
    </div>
  );
}
