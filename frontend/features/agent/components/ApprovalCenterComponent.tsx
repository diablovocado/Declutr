"use client";

import React from "react";
import { AgentPlan, PlanViewerComponent } from "./PlanViewerComponent";
import { ShieldCheck, Layers } from "lucide-react";

interface ApprovalCenterProps {
  plans: AgentPlan[];
  onApprove: (planId: string, comment: string) => void;
  onReject: (planId: string, comment: string) => void;
}

export function ApprovalCenterComponent({ plans, onApprove, onReject }: ApprovalCenterProps) {
  const pendingPlans = plans.filter((p) => p.requires_review && p.status === "PENDING");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-indigo-500" />
        <div>
          <h3 className="text-xl font-bold tracking-tight">Human Approval Center</h3>
          <p className="text-xs text-muted-foreground">Review proposed agent plans before sensitive or destructive actions are executed</p>
        </div>
      </div>

      {pendingPlans.length === 0 ? (
        <div className="p-8 rounded-xl border bg-card text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-sm">No Pending Approvals</h4>
          <p className="text-xs text-muted-foreground">All autonomous agent plan proposals are up to date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPlans.map((plan) => (
            <PlanViewerComponent key={plan.id} plan={plan} onApprove={onApprove} onReject={onReject} />
          ))}
        </div>
      )}
    </div>
  );
}
