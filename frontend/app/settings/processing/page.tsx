"use client";

import React from "react";
import { PageShell } from "../../../shared/components/layout/page-shell";
import { ProcessingDashboard } from "../../../features/processing/components/processing-dashboard";
import { JobQueue } from "../../../features/processing/components/job-queue";

export default function ProcessingSettingsPage() {
  return (
    <PageShell
      title="Processing Engine"
      subtitle="Monitor and manage background orchestration jobs and workers."
      breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Processing Engine" }]}
    >
      <div className="space-y-8 max-w-5xl">
        <ProcessingDashboard />
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Active Processing Queue</h3>
          <JobQueue />
        </div>
      </div>
    </PageShell>
  );
}
