"use client";

import React from "react";
import { PageShell } from "../../shared/components/layout/page-shell";
import { ContextDashboard } from "../../features/context/components/context-dashboard";

export default function ContextPage() {
  return (
    <PageShell
      title="Context & Intent Engine"
      subtitle="Declutr automatically discovers why assets exist together—grouping trips, purchases, medical cases, and legal processes."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Context Engine" }]}
    >
      <ContextDashboard />
    </PageShell>
  );
}
