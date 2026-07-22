"use client";

import React, { useEffect, useState } from "react";
import { AgentDashboardComponent, AgentItem } from "@/features/agent/components/AgentDashboardComponent";
import { GoalManagerComponent } from "@/features/agent/components/GoalManagerComponent";
import { AgentMemoryPanelComponent, AgentMemoryItem } from "@/features/agent/components/AgentMemoryPanelComponent";
import { Bot, Target, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [memories, setMemories] = useState<AgentMemoryItem[]>([]);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/v1/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data || []);
        if (data.length > 0) setSelectedAgent(data[0]);
      }
    } catch (err) {
      console.error("Failed to load agents", err);
    }
  };

  const fetchMemories = async (agentId: string) => {
    try {
      const res = await fetch(`/api/v1/agents/memory?agent_id=${agentId}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data || []);
      }
    } catch (err) {
      console.error("Failed to load memories", err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) fetchMemories(selectedAgent.id);
  }, [selectedAgent]);

  const handleToggleAgent = async (agentId: string, pause: boolean) => {
    await fetch("/api/v1/agents/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, pause }),
    });
    fetchAgents();
  };

  const handleCreateGoal = async (agentId: string, title: string, desc: string, schedule: string) => {
    await fetch("/api/v1/agents/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, title, description: desc, schedule }),
    });
    alert("Goal created and plan generated!");
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Autonomous Knowledge Agent Platform</h1>
          <p className="text-muted-foreground mt-1">
            Declutr Intelligence v2 — Autonomous collaborators continuously organizing vaults and executing goals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/agents/plans"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> Approval Center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <AgentDashboardComponent
        agents={agents}
        onToggleAgent={handleToggleAgent}
        onSelectAgent={(agent) => setSelectedAgent(agent)}
      />

      {selectedAgent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoalManagerComponent agentId={selectedAgent.id} onCreateGoal={handleCreateGoal} />
          <AgentMemoryPanelComponent memories={memories} />
        </div>
      )}
    </div>
  );
}
