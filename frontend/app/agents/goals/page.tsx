"use client";

import React from "react";
import { GoalManagerComponent } from "@/features/agent/components/GoalManagerComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AgentGoalsPage() {
  const handleCreateGoal = async (agentId: string, title: string, desc: string, schedule: string) => {
    await fetch("/api/v1/agents/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, title, description: desc, schedule }),
    });
    alert("Persistent goal registered successfully!");
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3 border-b pb-6">
        <Link href="/agents" className="p-2 rounded-lg border hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Persistent Agent Goal Manager</h1>
          <p className="text-xs text-muted-foreground">Configure autonomous continuous goals for taxonomy organization and ID monitoring</p>
        </div>
      </div>

      <GoalManagerComponent agentId="agt-organization-pro" onCreateGoal={handleCreateGoal} />
    </div>
  );
}
