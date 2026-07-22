"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Lock, Share2, MessageSquare, ShieldCheck, Plus, CheckCircle2, Clock, FileText } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ShareAccessModal } from "../../features/collaboration/components/share-access-modal";
import { CommentReviewPanel, CommentItem } from "../../features/collaboration/components/comment-review-panel";
import { ApprovalTracker, ApprovalItem } from "../../features/collaboration/components/approval-tracker";

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<"SHARED" | "COMMENTS" | "APPROVALS">("SHARED");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [comments, setComments] = useState<CommentItem[]>([
    { id: "cm1", author: "sarah.accountant@example.com", timestamp: "10 mins ago", content: "Please verify Section 4 tax exemption values before final filing.", resolved: false },
    { id: "cm2", author: "legal.review@firm.com", timestamp: "1 hour ago", content: "Clause 12 looks compliant with 2026 tax standards.", resolved: true },
  ]);

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: "ap1", title: "Approve 2025 Tax Contract Signoff", requester: "sarah.accountant@example.com", targetFile: "Tax_Filing_Form_1040_2025.pdf", timestamp: "Today 14:00", status: "PENDING" },
    { id: "ap2", title: "Signoff Medical Insurance Claim", requester: "dr.smith@clinic.com", targetFile: "Cardiology_Prescription.pdf", timestamp: "Yesterday 09:30", status: "APPROVED" },
  ]);

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      { id: "cm_" + Date.now(), author: "You (Owner)", timestamp: "Just now", content: text, resolved: false },
      ...prev,
    ]);
  };

  const handleToggleResolveComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a))
    );
  };

  return (
    <PageShell
      title="Secure Collaboration & Shared Workspaces"
      subtitle="Safely share knowledge, manage role permissions, review inline comments, and track document signoffs."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Collaboration" }]}
      actions={
        <Button variant="default" size="sm" onClick={() => setShareModalOpen(true)} leftIcon={<Share2 className="h-3.5 w-3.5" />}>
          Share Access Control
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("SHARED")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "SHARED" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            👥 Shared Workspaces & Files (3)
          </button>
          <button
            onClick={() => setActiveTab("COMMENTS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "COMMENTS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            💬 Comments & Discussions ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab("APPROVALS")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "APPROVALS" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            🛡️ Document Approvals ({approvals.length})
          </button>
        </div>

        {/* Tab 1: SHARED WORKSPACES */}
        {activeTab === "SHARED" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="text-[10px]">Shared Project</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">2 Collaborators</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">2025 Tax Filing Workspace</h4>
                  <p className="text-xs text-slate-300 mt-1">Shared with Accountant and Tax Auditor.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                  <span className="text-slate-400">Role: Owner</span>
                  <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)} className="h-7 text-[11px]">
                    Manage Access
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" className="text-[10px]">Shared Collection</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">1 Collaborator</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Japan Travel Itinerary & Receipts</h4>
                  <p className="text-xs text-slate-300 mt-1">Shared with Travel Agent.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                  <span className="text-slate-400">Role: Editor</span>
                  <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)} className="h-7 text-[11px]">
                    Manage Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: COMMENTS */}
        {activeTab === "COMMENTS" && (
          <CommentReviewPanel
            comments={comments}
            onAddComment={handleAddComment}
            onToggleResolve={handleToggleResolveComment}
          />
        )}

        {/* Tab 3: APPROVALS */}
        {activeTab === "APPROVALS" && (
          <ApprovalTracker
            approvals={approvals}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {/* Share Access Control Modal */}
        <ShareAccessModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          resourceTitle="2025 Tax Filing Workspace"
        />
      </div>
    </PageShell>
  );
}
