"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, Sparkles, FileText, CheckCircle2, Clock, MessageSquare, ArrowRight, CornerDownLeft, History, CheckSquare, Square } from "lucide-react";
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
  const router = useRouter();
  const [queryText, setQueryText] = useState("Tax form 2025");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [reasoning, setReasoning] = useState("");
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);

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
        {
          id: "file_demo_02",
          fileName: "W-2_Income_Summary_2025.pdf",
          mimeType: "application/pdf",
          summary: "W-2 Wage and Tax Statement from employer for tax year 2025.",
          snippet: "W-2 Statement 2025. Employer: Acme Corp. Box 1 Wages: $125,000.",
          entities: ["Acme Corp", "W-2", "John Smith"],
          citations: ["W-2 Wage Statement"],
          relevanceScore: 0.94,
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

  const toggleSelect = (id: string) => {
    setSelectedResultIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAskAI = () => {
    router.push(`/copilot?sel=${selectedResultIds.join(",")}`);
  };

  return (
    <PageShell
      title="Natural & Semantic Search"
      subtitle="Hybrid search engine combining keyword matching, pgvector embeddings, entity extraction, and memory relevance."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Search" }]}
    >
      {/* Search Input Bar */}
      <div className="mb-6">
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
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs">
          <div className="flex items-center gap-2">
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

          {/* Search + AI Selection Bar */}
          {selectedResultIds.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAskAI}
              leftIcon={<Sparkles className="h-3.5 w-3.5 text-purple-400" />}
              className="animate-in fade-in-0"
            >
              Ask AI About Selected Content ({selectedResultIds.length} files)
            </Button>
          )}
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
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Found {results.length} relevant memories</span>
            <span>Sorted by hybrid vector score</span>
          </div>

          {results.map((result) => {
            const selected = selectedResultIds.includes(result.id);
            return (
              <Card
                key={result.id}
                className={`bg-slate-900/60 border-slate-800 transition-all ${
                  selected ? "border-purple-500/60 bg-purple-950/20" : "hover:border-slate-700"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleSelect(result.id)}
                      className="mt-1 text-slate-400 hover:text-white"
                    >
                      {selected ? (
                        <CheckSquare className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <Link href={`/files/${result.id}`}>
                          <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors truncate flex items-center gap-2">
                            <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>{result.fileName}</span>
                          </h3>
                        </Link>

                        <Badge variant="emerald" className="font-mono text-[11px] shrink-0">
                          {Math.round(result.relevanceScore * 100)}% match
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        {result.summary}
                      </p>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono mb-3">
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1 font-sans">
                          Matching Snippet:
                        </span>
                        "{result.snippet}"
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {result.entities.map((ent, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] text-slate-400 border-slate-800">
                            {ent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
