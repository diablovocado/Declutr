"use client";

import React from "react";
import { Bot, Play, Pause, ShieldCheck, Target, Layers } from "lucide-react";

export interface AgentItem {
  id: string;
  name: string;
  type: string;
  description: string;
  status: "ACTIVE" | "PAUSED" | "WORKING" | "IDLE" | "ERROR";
  execution_mode: string;
  permissions: string[];
}

interface AgentDashboardProps {
  agents: AgentItem[];
  onToggleAgent: (agentId: string, pause: boolean) => void;
  onSelectAgent: (agent: AgentItem) => void;
}

export function AgentDashboardComponent({
  agents,
  onToggleAgent,
  onSelectAgent,
}: AgentDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Active Autonomous Collaborators</h3>
          <p className="text-sm text-muted-foreground">Agents continuously monitor vaults, decompose goals, and submit proposals for human approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className="p-5 rounded-xl border bg-card hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{agent.name}</h4>
                    <span className="text-[10px] font-mono text-indigo-500 font-semibold">{agent.type}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    agent.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-muted-foreground">{agent.execution_mode}</span>
              {agent.status === "ACTIVE" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAgent(agent.id, true);
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAgent(agent.id, false);
                  }}
                  className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" /> Resume
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
