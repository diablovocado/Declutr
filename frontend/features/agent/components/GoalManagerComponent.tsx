"use client";

import React, { useState } from "react";
import { Target, Plus, Clock, Sparkles } from "lucide-react";

interface GoalManagerProps {
  agentId: string;
  onCreateGoal: (agentId: string, title: string, desc: string, schedule: string) => void;
}

export function GoalManagerComponent({ agentId, onCreateGoal }: GoalManagerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("CONTINUOUS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && agentId) {
      onCreateGoal(agentId, title, description, schedule);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="p-6 rounded-xl border bg-card space-y-4">
      <div className="flex items-center gap-2 font-bold text-base">
        <Target className="w-5 h-5 text-indigo-500" />
        <span>Set Persistent Autonomous Goal</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="font-semibold text-muted-foreground">Goal Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Keep tax receipts organized & monitor expiring IDs"
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary"
          />
        </div>

        <div>
          <label className="font-semibold text-muted-foreground">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe execution instructions, desired outcomes, and preferred tagging..."
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary h-20"
          />
        </div>

        <div>
          <label className="font-semibold text-muted-foreground">Execution Schedule Trigger</label>
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary font-mono"
          >
            <option value="CONTINUOUS">Continuous Real-time Trigger</option>
            <option value="DAILY">Daily at 02:00 UTC</option>
            <option value="WEEKLY">Weekly on Sunday</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Decompose Goal & Generate Plan
        </button>
      </form>
    </div>
  );
}
