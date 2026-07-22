"use client";

import React, { useEffect, useState } from "react";
import { MarketplaceBrowserComponent, ExtensionItem } from "@/features/extension/components/MarketplaceBrowserComponent";
import { ExtensionDetailsModal } from "@/features/extension/components/ExtensionDetailsModal";
import { Store, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
  const [extensions, setExtensions] = useState<ExtensionItem[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<ExtensionItem | null>(null);

  const fetchMarketplace = async () => {
    try {
      const res = await fetch("/api/v1/marketplace");
      if (res.ok) {
        const data = await res.json();
        setExtensions(data || []);
      }
    } catch (err) {
      console.error("Failed to load marketplace", err);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const handleInstall = async (extId: string, perms: string[]) => {
    try {
      await fetch("/api/v1/extensions/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extension_id: extId, approved_permissions: perms }),
      });
      setSelectedExtension(null);
    } catch (err) {
      console.error("Failed to install extension", err);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Declutr Extension Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover verified AI providers, document extractors, custom workflow actions, and tools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace/manager"
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-accent text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-500" /> Manage Installed
          </Link>
          <Link
            href="/marketplace/publisher"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            Publisher Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <MarketplaceBrowserComponent
        extensions={extensions}
        onSelectExtension={(ext) => setSelectedExtension(ext)}
      />

      <ExtensionDetailsModal
        extension={selectedExtension}
        onClose={() => setSelectedExtension(null)}
        onInstall={handleInstall}
      />
    </div>
  );
}
