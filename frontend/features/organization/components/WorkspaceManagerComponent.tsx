"use client";

import React, { useState } from "react";
import { Layers, Plus, CheckCircle, Folder } from "lucide-react";

export interface Workspace {
  id: string;
  vault_id: string;
  name: string;
  type: "PERSONAL" | "ORGANIZATION" | "DEPARTMENT" | "SHARED" | "ARCHIVED";
  department?: string;
  is_default: boolean;
}

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  onCreateWorkspace: (name: string, type: string, dept: string) => void;
}

export function WorkspaceManagerComponent({ workspaces, onCreateWorkspace }: WorkspaceManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [wsType, setWsType] = useState("ORGANIZATION");
  const [dept, setDept] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onCreateWorkspace(name, wsType, dept);
      setName("");
      setDept("");
      setShowModal(false);
    }
  };

  const getWorkspaceTypeBadge = (type: string) => {
    switch (type) {
      case "ORGANIZATION":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "DEPARTMENT":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "SHARED":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Organization Workspaces & Vaults</h3>
          <p className="text-sm text-muted-foreground">Classify & isolate workspaces across departments, teams, and shared vaults</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="p-4 rounded-xl border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-sm">{ws.name}</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getWorkspaceTypeBadge(ws.type)}`}>
                {ws.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Vault ID: {ws.vault_id} {ws.department && `• Dept: ${ws.department}`}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Create Organization Workspace</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Workspace Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Legal Contracts Vault"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Classification Type</label>
              <select
                value={wsType}
                onChange={(e) => setWsType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              >
                <option value="ORGANIZATION">Organization-Wide</option>
                <option value="DEPARTMENT">Department Vault</option>
                <option value="SHARED">Shared Workspace</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Department (Optional)</label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Finance"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Save Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
