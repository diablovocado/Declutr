"use client";

import React, { useState } from "react";
import { Users, Plus, Shield } from "lucide-react";

export interface Group {
  id: string;
  name: string;
  type: string;
  description?: string;
  member_user_ids?: string[];
}

interface GroupManagementProps {
  groups: Group[];
  onCreateGroup: (name: string, type: string) => void;
}

export function GroupManagementComponent({ groups, onCreateGroup }: GroupManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("TEAM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onCreateGroup(name, type);
      setName("");
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Teams & Department Groups</h3>
          <p className="text-sm text-muted-foreground">Manage user groups with group-level permission inheritance</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="p-4 rounded-xl border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h4 className="font-bold text-sm">{g.name}</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary font-semibold">
                {g.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Members: {g.member_user_ids?.length || 0} users
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Create Organization Group</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Group Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Platform Engineering"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Group Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              >
                <option value="TEAM">Team</option>
                <option value="DEPARTMENT">Department</option>
                <option value="DYNAMIC">Dynamic Group</option>
              </select>
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
                Save Group
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
