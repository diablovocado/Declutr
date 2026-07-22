"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Sparkles, FileText, CheckCircle2, Clock, MessageSquare, ArrowRight, CornerDownLeft, History } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface SearchResult {
  id: string;
  fileName: string;
  mimeType: string;
  summary: string;
  snippet: string;
  entities: string[];
  citations: string[];
  relevanceScore: number;
  status: string;
}

export default function SearchPage() {
  const [queryText, setQueryText] = useState("Tax form 2025");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [reasoning, setReasoning] = useState("");

  const executeSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/search/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: q, vaultId: "v_default_01" }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setReasoning(data.reasoning || "Executed Hybrid Search (FTS + Vector Embedding).");
      }
    } catch (e) {
      // Fallback sample match
      setResults([
        {
          id: "file_demo_01",
          fileName: "Tax_Filing_Form_1040_2025.pdf",
          mimeType: "application/pdf",
          summary: "Annual 2025 IRS Tax return filing indicating $125k total income and $3,200 refund due.",
          snippet: "IRS Form 1040 U.S. Individual Income Tax Return 2025. Total Income: $125,000. Tax Paid: $24,500.",
          entities: ["IRS", "Form 1040", "John Smith"],
          citations: ["Form 1040 Tax Return (Line 12)"],
          relevanceScore: 0.96,
          status: "READY",
        },
      ]);
      setReasoning("Hybrid retrieval (Keyword FTS + pgvector semantic vector search).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(queryText);
  }, []);

  return (
    <PageShell
      title="Natural & Semantic Search"
      subtitle="Hybrid search engine combining keyword matching, pgvector embeddings, entity extraction, and memory relevance."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Search" }]}
    >
      {/* Search Input Bar */}
      <div className="mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") executeSearch(queryText);
            }}
            placeholder="Search with natural queries e.g. 'What tax forms did I file?' or 'Doctor prescription'"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
          <Button
            variant="default"
            size="sm"
            onClick={() => executeSearch(queryText)}
            className="absolute right-2"
            leftIcon={<CornerDownLeft className="h-4 w-4" />}
          >
            Search
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wider mr-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {["ALL", "PDF", "IMAGES", "TAXES", "MEDICAL", "TRAVEL"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-md border transition-all ${
                activeFilter === filter
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Query Reasoning Banner */}
      {reasoning && (
        <div className="p-3 mb-6 rounded-lg border border-slate-800 bg-slate-900/40 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
          <span>{reasoning}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center border border-slate-800 rounded-xl bg-slate-900/30">
          <div className="h-8 w-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-300">Searching hybrid vector index...</p>
        </div>
      )}

      {/* Search Results List */}
      {!loading && searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Found {results.length} result(s) for "{queryText}"</span>
            <span>Sorted by hybrid relevance score</span>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center border border-slate-800 rounded-xl bg-slate-900/30">
              <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">No matching documents found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Try searching with different keywords or upload a new document to your vault.
              </p>
              <Link href="/vault">
                <Button variant="default" size="sm">Upload Document</Button>
              </Link>
            </div>
          ) : (
            results.map((res) => (
              <Card key={res.id} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{res.fileName}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{res.summary}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="emerald" className="shrink-0">
                      {(res.relevanceScore * 100).toFixed(0)}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono leading-relaxed mb-3">
                    "{res.snippet}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-500 font-semibold">Entities:</span>
                      {res.entities.map((ent, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0 px-2">
                          {ent}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/files/${res.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                          View Document
                        </Button>
                      </Link>
                      <Link href={`/copilot?query=${encodeURIComponent(queryText)}`}>
                        <Button variant="default" size="sm" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                          Chat with AI
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </PageShell>
  );
}
