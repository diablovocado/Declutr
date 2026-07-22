"use client";

import React, { useState } from "react";
import { Shield, Check, X } from "lucide-react";

interface PermissionApprovalDialogProps {
  extensionName: string;
  requestedPermissions: string[];
  onApprove: (perms: string[]) => void;
  onCancel: () => void;
}

export function PermissionApprovalDialog({
  extensionName,
  requestedPermissions,
  onApprove,
  onCancel,
}: PermissionApprovalDialogProps) {
  const [approved, setApproved] = useState<string[]>(requestedPermissions);

  const toggle = (p: string) => {
    if (approved.includes(p)) {
      setApproved(approved.filter((item) => item !== p));
    } else {
      setApproved([...approved, p]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-500 font-bold">
          <Shield className="w-5 h-5" />
          <span>Approve Extension Permissions</span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{extensionName}</span> is requesting access to the following scopes:
        </p>

        <div className="space-y-1">
          {requestedPermissions.map((p) => (
            <label key={p} className="flex items-center justify-between p-2 rounded-lg bg-secondary text-xs font-mono">
              <span>{p}</span>
              <input
                type="checkbox"
                checked={approved.includes(p)}
                onChange={() => toggle(p)}
                className="rounded text-indigo-600"
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border text-xs font-semibold">
            Deny
          </button>
          <button
            onClick={() => onApprove(approved)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Grant Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
