"use client";

import React, { useState } from "react";
import { Search, Star, Download, ShieldCheck, Sparkles, Filter } from "lucide-react";

export interface ExtensionItem {
  id: string;
  slug: string;
  rating: number;
  downloads_count: number;
  is_verified: boolean;
  is_featured: boolean;
  manifest: {
    name: string;
    description: string;
    category: string;
    type: string;
    version: string;
    author: string;
    permissions: string[];
  };
}

interface MarketplaceBrowserProps {
  extensions: ExtensionItem[];
  onSelectExtension: (ext: ExtensionItem) => void;
}

const CATEGORIES = [
  "All",
  "AI",
  "Productivity",
  "Documents",
  "Automation",
  "Storage",
  "Security",
  "Developer Tools",
  "Themes",
  "Utilities",
];

export function MarketplaceBrowserComponent({
  extensions,
  onSelectExtension,
}: MarketplaceBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExtensions = extensions.filter((ext) => {
    const matchesCategory = selectedCategory === "All" || ext.manifest.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      ext.manifest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.manifest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extensions, AI tools, themes, automation triggers..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl bg-card text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExtensions.map((ext) => (
          <div
            key={ext.id}
            onClick={() => onSelectExtension(ext)}
            className="p-5 rounded-xl border bg-card hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">{ext.manifest.name}</h4>
                  {ext.is_verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified Publisher" />
                  )}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground font-semibold">
                  v{ext.manifest.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{ext.manifest.description}</p>
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-foreground">{ext.rating.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[11px]">
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>{ext.downloads_count.toLocaleString()} installs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
