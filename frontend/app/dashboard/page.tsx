"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, RefreshCw, HardDrive, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { UploadModal } from "../../features/upload/components/upload-modal";

import { GreetingHeader } from "../../features/dashboard/components/greeting-header";
import { QuickActionsBar } from "../../features/dashboard/components/quick-actions-bar";
import { SmartSearchHero } from "../../features/dashboard/components/smart-search-hero";
import { AIInsightsWidget } from "../../features/dashboard/components/ai-insights-widget";
import { ContinueWorkingWidget } from "../../features/dashboard/components/continue-working-widget";
import { DailyActivityFeed } from "../../features/dashboard/components/daily-activity-feed";
import { PinnedContentWidget } from "../../features/dashboard/components/pinned-content-widget";
import { DashboardCustomizer, WidgetConfig } from "../../features/dashboard/components/dashboard-customizer";
import { OnboardingWalkthrough } from "../../features/dashboard/components/onboarding-walkthrough";

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "quick_actions", name: "Quick Actions Bar", visible: true },
    { id: "smart_search", name: "Smart Search Hero", visible: true },
    { id: "ai_insights", name: "AI Insights Hub", visible: true },
    { id: "continue_working", name: "Continue Working Assets", visible: true },
    { id: "pinned_content", name: "Pinned Items & Favorites", visible: true },
    { id: "activity_feed", name: "Daily Activity Timeline", visible: true },
    { id: "storage_overview", name: "Storage Telemetry", visible: true },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const resetWidgets = () => {
    setWidgets((prev) => prev.map((w) => ({ ...w, visible: true })));
  };

  const isVisible = (id: string) => {
    const found = widgets.find((w) => w.id === id);
    return found ? found.visible : true;
  };

  return (
    <PageShell
      title="Personal Intelligence Hub"
      subtitle="Your daily calm command center for zero-knowledge vault memory, AI insights, natural search, and activity timelines."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Dashboard" }]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={() => setUploadOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>
            Quick Upload
          </Button>
        </div>
      }
    >
      {/* Upload Modal Launcher */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={() => {}}
      />

      {/* Layout Customizer Dialog */}
      <DashboardCustomizer
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        widgets={widgets}
        onToggleWidget={toggleWidget}
        onResetLayout={resetWidgets}
      />

      {/* Onboarding Tour */}
      <OnboardingWalkthrough
        open={walkthroughOpen}
        onOpenChange={setWalkthroughOpen}
        onStartUpload={() => setUploadOpen(true)}
      />

      {/* Greeting Header */}
      <GreetingHeader
        userName="Maithili"
        vaultName="My Life Vault"
        onOpenWalkthrough={() => setWalkthroughOpen(true)}
        onCustomizeLayout={() => setCustomizerOpen(true)}
      />

      {/* Quick Actions Bar */}
      {isVisible("quick_actions") && (
        <QuickActionsBar
          onUploadFile={() => setUploadOpen(true)}
          onScanDocument={() => setUploadOpen(true)}
          onCreateFolder={() => {}}
          onCreateCollection={() => {}}
          onAskAI={() => {}}
          onSearchEverything={() => {}}
          onImportFiles={() => setUploadOpen(true)}
          onCreateWorkflow={() => {}}
        />
      )}

      {/* Smart Natural Search Hero */}
      {isVisible("smart_search") && <SmartSearchHero />}

      {/* AI Insights Recommendations */}
      {isVisible("ai_insights") && <AIInsightsWidget />}

      {/* Continue Working & Recent Conversations */}
      {isVisible("continue_working") && <ContinueWorkingWidget />}

      {/* Pinned Workspace Content */}
      {isVisible("pinned_content") && <PinnedContentWidget />}

      {/* Daily Activity Timeline */}
      {isVisible("activity_feed") && <DailyActivityFeed />}

      {/* Storage Telemetry Overview */}
      {isVisible("storage_overview") && (
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-emerald-400" /> Vault Storage & Shard Telemetry
              </CardTitle>
              <Badge variant="emerald">SRP-6a Active</Badge>
            </div>
            <CardDescription className="text-xs text-slate-400">
              AES-256 client-encrypted memory distributed across decentralized nodes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
              <span>4.2 MB Used</span>
              <span>10 GB Quota (0.04%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-4">
              <div className="h-full bg-emerald-500 rounded-full w-[4%]" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">TOKYO SHARD</span>
                <span className="text-emerald-400 font-semibold text-xs">ONLINE</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ZURICH SHARD</span>
                <span className="text-emerald-400 font-semibold text-xs">ONLINE</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">REYKJAVIK SHARD</span>
                <span className="text-emerald-400 font-semibold text-xs">ONLINE</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
