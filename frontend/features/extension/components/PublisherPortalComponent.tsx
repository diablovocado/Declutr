"use client";

import React, { useState } from "react";
import { Upload, ShieldCheck, BarChart3, AlertCircle } from "lucide-react";

interface PublisherPortalProps {
  onPublishVersion: (manifest: any, bundleUrl: string, notes: string) => void;
}

export function PublisherPortalComponent({ onPublishVersion }: PublisherPortalProps) {
  const [extId, setExtId] = useState("");
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [category, setCategory] = useState("AI");
  const [description, setDescription] = useState("");
  const [bundleUrl, setBundleUrl] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (extId && name && version) {
      onPublishVersion(
        {
          id: extId,
          name,
          version,
          author: "Verified Publisher",
          category,
          type: "METADATA_EXTRACTOR",
          description,
          permissions: ["vault.read"],
        },
        bundleUrl || "https://cdn.declutr.dev/bundles/sample.js",
        releaseNotes || "Initial public release"
      );
      setExtId("");
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Publisher Developer Portal</h3>
          <p className="text-sm text-muted-foreground">Publish extension releases, manage versions, and inspect installation analytics</p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold font-mono">
          <ShieldCheck className="w-4 h-4" /> Verified Publisher Account
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 p-6 rounded-xl border bg-card space-y-4">
          <h4 className="font-bold text-base">Release New Extension Version</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Extension ID</label>
              <input
                type="text"
                required
                value={extId}
                onChange={(e) => setExtId(e.target.value)}
                placeholder="ext-my-tool"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Extension Name"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">SemVer Version</label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              >
                <option value="AI">AI</option>
                <option value="Productivity">Productivity</option>
                <option value="Automation">Automation</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of extension capability..."
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs h-20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Bundle URL</label>
            <input
              type="url"
              value={bundleUrl}
              onChange={(e) => setBundleUrl(e.target.value)}
              placeholder="https://cdn.myapp.com/bundles/ext-1.0.0.js"
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Publish Release
          </button>
        </form>

        <div className="space-y-4">
          <div className="p-5 rounded-xl border bg-card space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Publisher Telemetry</span>
            </div>
            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Total Downloads:</span>
                <span className="font-bold">24,000</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Active Installs:</span>
                <span className="font-bold text-emerald-500">18,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crash Rate:</span>
                <span className="font-bold text-emerald-500">0.01%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
