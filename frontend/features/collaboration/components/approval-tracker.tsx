"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface ApprovalItem {
  id: string;
  title: string;
  requester: string;
  targetFile: string;
  timestamp: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ApprovalTrackerProps {
  approvals: ApprovalItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalTracker({ approvals, onApprove, onReject }: ApprovalTrackerProps) {
  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Lightweight Document Approvals ({approvals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {approvals.map((a) => (
          <div key={a.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={a.status === "PENDING" ? "amber" : a.status === "APPROVED" ? "emerald" : "outline"}
                  className="text-[10px] font-mono"
                >
                  {a.status}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">From: {a.requester}</span>
              </div>
              <h4 className="text-xs font-bold text-white">{a.title}</h4>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <FileText className="h-3 w-3 text-emerald-400" /> {a.targetFile}
              </span>
            </div>

            {a.status === "PENDING" ? (
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => onReject(a.id)} className="h-7 text-[11px] text-rose-400 border-rose-900/50">
                  Reject
                </Button>
                <Button variant="default" size="sm" onClick={() => onApprove(a.id)} className="h-7 text-[11px]">
                  Approve Signoff
                </Button>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">{a.timestamp}</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
