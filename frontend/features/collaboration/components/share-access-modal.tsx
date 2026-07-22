"use client";

import React, { useState } from "react";
import { Lock, Users, Mail, Link, Key, ShieldCheck, Trash2, Copy, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

export interface Collaborator {
  id: string;
  email: string;
  role: "OWNER" | "EDITOR" | "COMMENTER" | "VIEWER";
}

export interface ShareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
}

export function ShareAccessModal({ isOpen, onClose, resourceTitle }: ShareAccessModalProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "c1", email: "sarah.accountant@example.com", role: "EDITOR" },
    { id: "c2", email: "legal.review@firm.com", role: "COMMENTER" },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Collaborator["role"]>("VIEWER");
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setCollaborators((prev) => [
      ...prev,
      { id: "c_" + Date.now(), email: inviteEmail, role: inviteRole },
    ]);
    setInviteEmail("");
  };

  const handleRemove = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" /> Share & Access Permissions
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px] mt-0.5">{resourceTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>

        {/* Invite Input Bar */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Invite Collaborator</label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 h-9 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Collaborator["role"])}
              className="h-9 px-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="VIEWER">Viewer</option>
              <option value="COMMENTER">Commenter</option>
              <option value="EDITOR">Editor</option>
            </select>
            <Button variant="default" size="sm" onClick={handleInvite} className="h-9 px-3 text-xs">
              Invite
            </Button>
          </div>
        </div>

        {/* Collaborators List */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">People with Access ({collaborators.length})</span>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {collaborators.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-slate-200 truncate max-w-[200px]">{c.email}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] font-mono">{c.role}</Badge>
                  <button onClick={() => handleRemove(c.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secure Link Option */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Link className="h-3.5 w-3.5 text-purple-400" /> Password-Protected Share Link
          </span>
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-7 text-[11px] gap-1">
            {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedLink ? "Copied Link" : "Copy Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
