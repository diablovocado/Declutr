"use client";

import React, { useState } from "react";
import { KeyRound, Shield, Check, Plus } from "lucide-react";

export interface Role {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: string[];
}

interface RoleEditorProps {
  roles: Role[];
  onCreateRole: (name: string, desc: string, perms: string[]) => void;
}

const ALL_PERMISSIONS = [
  "MANAGE_ORGANIZATION",
  "MANAGE_BILLING",
  "MANAGE_USERS",
  "MANAGE_VAULTS",
  "MANAGE_AI",
  "MANAGE_WORKFLOWS",
  "MANAGE_INTEGRATIONS",
  "MANAGE_SECURITY",
  "MANAGE_AUDIT",
  "VIEW_ANALYTICS",
];

export function RoleEditorComponent({ roles, onCreateRole }: RoleEditorProps) {
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const togglePerm = (perm: string) => {
    if (selectedPerms.includes(perm)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== perm));
    } else {
      setSelectedPerms([...selectedPerms, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleName) {
      onCreateRole(roleName, roleDesc, selectedPerms);
      setRoleName("");
      setRoleDesc("");
      setSelectedPerms([]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Role-Based Access Control (RBAC)</h3>
          <p className="text-sm text-muted-foreground">Configure system roles & custom granular permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.id} className="p-4 rounded-xl border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm">{r.name}</h4>
              </div>
              {r.is_system_role && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                  System Role
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{r.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {r.permissions.map((p) => (
                <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Create Custom Organization Role</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Role Name</label>
              <input
                type="text"
                required
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Compliance Auditor"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <input
                type="text"
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                placeholder="Description of role privileges"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Granular Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((perm) => (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePerm(perm)}
                    className={`p-2 rounded-lg border text-[11px] font-mono text-left flex items-center justify-between transition-colors ${
                      selectedPerms.includes(perm)
                        ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span>{perm}</span>
                    {selectedPerms.includes(perm) && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
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
                Save Role
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
