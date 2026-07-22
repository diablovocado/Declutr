"use client";

import React, { useState } from "react";
import { ReleaseOverviewComponent } from "@/features/release/components/ReleaseOverviewComponent";
import { SystemAuditMatrixComponent } from "@/features/release/components/SystemAuditMatrixComponent";
import { BenchmarkSummaryComponent } from "@/features/release/components/BenchmarkSummaryComponent";
import { Award, ShieldCheck, Zap, BookOpen } from "lucide-react";

export default function ReleasePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "benchmarks">("overview");

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Declutr Release Candidate Portal</h1>
        <p className="text-muted-foreground mt-1">
          Production Launch Readiness Dashboard • Version 1.0.0-RC1
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "overview" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="w-4 h-4" /> RC1 Overview
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "audit" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security & Accessibility Audit
        </button>
        <button
          onClick={() => setActiveTab("benchmarks")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "benchmarks" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="w-4 h-4" /> Load Benchmarks
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && <ReleaseOverviewComponent />}
        {activeTab === "audit" && <SystemAuditMatrixComponent />}
        {activeTab === "benchmarks" && <BenchmarkSummaryComponent />}
      </div>
    </div>
  );
}
