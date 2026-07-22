"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Command, ArrowRight } from "lucide-react";
import { SearchInput } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";

export interface SmartSearchHeroProps {
  recentSearches?: string[];
}

export function SmartSearchHero({ recentSearches = ["Tax form 2025", "Passport renewal", "Doctor prescription"] }: SmartSearchHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 rounded-2xl mb-8 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Natural & Vector Search</span>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across documents, notes, receipts, or ask 'What tax forms did I file?'..."
            className="w-full h-12 pl-12 pr-24 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>
      </form>

      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
        <span className="text-slate-500 font-medium">Recent Searches:</span>
        {recentSearches.map((term, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(term)}
            className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:text-slate-200 transition-colors text-slate-300 flex items-center gap-1"
          >
            {term}
            <ArrowRight className="h-2.5 w-2.5 text-slate-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
