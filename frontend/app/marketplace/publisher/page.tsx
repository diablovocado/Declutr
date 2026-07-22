"use client";

import React from "react";
import { PublisherPortalComponent } from "@/features/extension/components/PublisherPortalComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PublisherPortalPage() {
  const handlePublishVersion = async (manifest: any, bundleUrl: string, notes: string) => {
    await fetch("/api/v1/marketplace/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manifest, bundle_url: bundleUrl, release_notes: notes }),
    });
    alert("Extension release published successfully!");
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3 border-b pb-6">
        <Link href="/marketplace" className="p-2 rounded-lg border hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Publisher Developer Portal</h1>
          <p className="text-xs text-muted-foreground">Release new extension builds, inspect downloads, and manage verified publisher profile</p>
        </div>
      </div>

      <PublisherPortalComponent onPublishVersion={handlePublishVersion} />
    </div>
  );
}
