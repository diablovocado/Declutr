"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, FolderKey, Search, Lock, Layers, ArrowRight, CheckCircle2, Zap, Brain, MessageSquare } from "lucide-react";
import { ThemeProvider, useTheme } from "../providers/theme-provider";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Container, Grid, Section } from "../components/layout/layout-primitives";
import { TopNavigation } from "../components/layout/top-navigation";

function LandingContent() {
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <TopNavigation />

      <main>
        {/* Hero Section */}
        <Section className="pt-24 pb-20 text-center border-0">
          <Container size="md">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="emerald" className="px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> End-to-End User Experience
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Zero-Knowledge SRP-6a Encryption
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Your AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Digital Life Vault & Knowledge Engine
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Declutr securely ingests, organizes, contextually links, and answers questions about your files, receipts, notes, and life projects with natural human memory associations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="default" leftIcon={<ArrowRight className="h-5 w-5" />}>
                  Create Free Vault
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" leftIcon={<Lock className="h-4 w-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="ghost" leftIcon={<FolderKey className="h-4 w-4 text-emerald-400" />}>
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Complete Journey Steps */}
        <Section className="py-16 border-t border-slate-900 bg-slate-900/30">
          <Container size="lg">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Complete End-to-End User Journey
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Seamless flow connecting account registration, vault creation, asset ingestion, AI enrichment, hybrid search, and grounded copilot chat.
              </p>
            </div>

            <Grid cols={4} className="gap-6">
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-emerald-500/50 transition-all">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">1. Sign Up & Vault Key</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero-knowledge SRP-6a protocol derives master encryption key locally. Server never sees plaintext passwords.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-blue-500/50 transition-all">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">2. Ingest & Processing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload PDF, images, or documents. Capability pipeline extracts text, runs OCR, detects entities, and generates 512-dim vector embeddings.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-purple-500/50 transition-all">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">3. Natural Search</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Search with natural queries like "Tax form 2025" or "Doctor prescription". Hybrid FTS + pgvector semantic matching retrieves exact matches.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 transition-all">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">4. AI Copilot Chat</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask questions about your uploaded documents and receive grounded answers with exact source citations.
                </p>
              </div>
            </Grid>
          </Container>
        </Section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}
