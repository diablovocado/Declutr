"use client";

import React, { useState } from "react";
import { UserPlus, Shield, Mail, MoreVertical, CheckCircle, Clock, AlertOctagon } from "lucide-react";

export interface Member {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role_name: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED" | "DEACTIVATED";
  joined_at: string;
}

interface MemberManagementProps {
  members: Member[];
  onInvite: (email: string, roleId: string) => void;
  onStatusChange: (userId: string, status: string) => void;
  onTransferOwnership: (userId: string) => void;
}

export function MemberManagementComponent({
  members,
  onInvite,
  onStatusChange,
  onTransferOwnership,
}: MemberManagementProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      onInvite(inviteEmail, "role-editor");
      setInviteEmail("");
      setShowInviteModal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "INVITED":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "SUSPENDED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Organization Members</h3>
          <p className="text-sm text-muted-foreground">Manage user directory, invitations, RBAC roles and account states</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Member Directory Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/50 border-b text-muted-foreground uppercase font-mono">
            <tr>
              <th className="p-3">Member</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-3">
                  <div className="font-semibold text-foreground">{m.name}</div>
                  <div className="text-muted-foreground text-[11px] font-mono">{m.email}</div>
                </td>
                <td className="p-3 font-mono font-medium">{m.role_name}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(m.status)}`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground font-mono">
                  {new Date(m.joined_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right space-x-2">
                  {m.status === "ACTIVE" ? (
                    <button
                      onClick={() => onStatusChange(m.user_id, "SUSPENDED")}
                      className="px-2 py-1 rounded border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-[10px] font-semibold"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => onStatusChange(m.user_id, "ACTIVE")}
                      className="px-2 py-1 rounded border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 text-[10px] font-semibold"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleInviteSubmit} className="bg-card border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Invite Member to Organization</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
