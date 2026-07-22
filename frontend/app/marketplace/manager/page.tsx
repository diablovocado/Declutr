"use client";

import React, { useEffect, useState } from "react";
import { InstalledExtensionsComponent, InstalledExtension } from "@/features/extension/components/InstalledExtensionsComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InstalledManagerPage() {
  const [installations, setInstallations] = useState<InstalledExtension[]>([]);

  const fetchInstalled = async () => {
    try {
      const res = await fetch("/api/v1/extensions/installed");
      if (res.ok) {
        const data = await res.json();
        setInstallations(data || []);
      }
    } catch (err) {
      console.error("Failed to load installed extensions", err);
    }
  };

  useEffect(() => {
    fetchInstalled();
  }, []);

  const handleLifecycleAction = async (instId: string, action: string) => {
    await fetch("/api/v1/extensions/lifecycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installation_id: instId, action }),
    });
    fetchInstalled();
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3 border-b pb-6">
        <Link href="/marketplace" className="p-2 rounded-lg border hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Installed Extension Manager</h1>
          <p className="text-xs text-muted-foreground">Manage extension lifecycle, states, and sandbox permissions</p>
        </div>
      </div>

      <InstalledExtensionsComponent
        installations={installations}
        onLifecycleAction={handleLifecycleAction}
      />
    </div>
  );
}
