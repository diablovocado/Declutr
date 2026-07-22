"use client";

import React, { useEffect, useState } from "react";
import { ApprovalCenterComponent } from "@/features/agent/components/ApprovalCenterComponent";
import { AgentPlan } from "@/features/agent/components/PlanViewerComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AgentPlansPage() {
  const [plans, setPlans] = useState<AgentPlan[]>([]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/v1/agents/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data || []);
      }
    } catch (err) {
      console.error("Failed to load plans", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleApprove = async (planId: string, comment: string) => {
    await fetch("/api/v1/agents/plans/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, comment }),
    });
    fetchPlans();
  };

  const handleReject = async (planId: string, comment: string) => {
    await fetch("/api/v1/agents/plans/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, comment }),
    });
    fetchPlans();
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3 border-b pb-6">
        <Link href="/agents" className="p-2 rounded-lg border hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Plan Viewer & Approval Center</h1>
          <p className="text-xs text-muted-foreground">Review proposed multi-step plans, reasoning evidence, and approve execution</p>
        </div>
      </div>

      <ApprovalCenterComponent plans={plans} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
}
