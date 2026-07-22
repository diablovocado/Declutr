"use client";

import React, { useState } from "react";
import { Monitor, Download, ShieldCheck, CheckCircle2, Command } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export function SystemIntegrationCard() {
  const [installedPWA, setInstalledPWA] = useState(true);
  const [shortcutKey, setShortcutKey] = useState("⌘ Space");

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Monitor className="h-4 w-4" /> System Integration & PWA Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="font-bold text-white block">Desktop PWA Installation</span>
            <span className="text-[11px] text-slate-400">Offline service worker caching enabled (100% ready)</span>
          </div>
          <Badge variant="emerald" className="gap-1 text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> Installed
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="font-bold text-white block">Global Launcher Shortcut</span>
            <span className="text-[11px] text-slate-400">Trigger Spotlight from any desktop window</span>
          </div>
          <Badge variant="purple" className="font-mono text-[10px]">
            {shortcutKey}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
