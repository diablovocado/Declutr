"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Command, Search, Sparkles, Monitor, Upload, Clipboard, CheckSquare, ArrowRight } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SpotlightModal } from "../../features/spotlight/components/spotlight-modal";
import { SystemIntegrationCard } from "../../features/spotlight/components/system-integration-card";

export default function SpotlightPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PageShell
      title="Universal Spotlight & System Integration"
      subtitle="Raycast and Apple Spotlight-inspired device integration. Search, ask AI, paste clipboard, and drag & drop files from anywhere."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Universal Spotlight" }]}
      actions={
        <Button variant="default" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Command className="h-3.5 w-3.5" />}>
          Open Spotlight (⌘ Space)
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Banner */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <Badge variant="purple" className="gap-1 mb-1 text-[10px]">
                <Command className="h-3 w-3" /> Universal Device Launcher
              </Badge>
              <h2 className="text-lg font-bold text-white">Declutr Available Everywhere</h2>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Press <strong className="text-emerald-400 font-mono">⌘ + Space</strong> anytime to instantly search vault memory, execute tasks, paste clipboard content, or drop files without opening the full web application.
              </p>
            </div>

            <Button variant="default" size="sm" onClick={() => setModalOpen(true)}>
              Test Spotlight Launcher
            </Button>
          </CardContent>
        </Card>

        {/* System Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SystemIntegrationCard />

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Quick Actions Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="font-medium text-white">Drag & Drop Upload</span>
                <Badge variant="outline" className="text-[9px] font-mono">Supported</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="font-medium text-white">Instant Clipboard Processing</span>
                <Badge variant="outline" className="text-[9px] font-mono">Supported</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="font-medium text-white">Global Copilot Prompt</span>
                <Badge variant="purple" className="text-[9px] font-mono">Supported</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spotlight Modal Trigger */}
        <SpotlightModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </PageShell>
  );
}
