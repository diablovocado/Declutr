"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { ThemeProvider, useTheme } from "../../shared/providers/theme-provider";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { Container, Grid, Section } from "../../shared/components/layout/layout-primitives";

function WelcomeContent() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-lg text-white">Declutr</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          Theme: {theme.toUpperCase()}
        </Button>
      </header>

      {/* Main Hero Onboarding Content */}
      <main className="flex-1 flex items-center py-16">
        <Container size="md" className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="emerald">Zero-Knowledge Storage</Badge>
            <Badge variant="outline">SRP-6a Protocol</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Your Digital Life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Encrypted & Contextually Organized.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Store receipts, documents, audio notes, and files in a client-side encrypted vault powered by natural-language semantic search.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto mb-12">
            <Link href="/register" className="w-full">
              <Button size="lg" variant="default" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Create Vault Account
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button size="lg" variant="outline" className="w-full">
                Sign In to Vault
              </Button>
            </Link>
          </div>

          <Grid cols={3} className="pt-8 border-t border-slate-900 text-left">
            <div className="space-y-1 p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                <Lock className="h-4 w-4" /> Zero-Trust Encryption
              </div>
              <p className="text-[11px] text-slate-400">Master Vault Key derived locally via Argon2id.</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
                <Sparkles className="h-4 w-4" /> Intent-Aware Search
              </div>
              <p className="text-[11px] text-slate-400">Hybrid keyword and 512-dim vector embeddings.</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                <CheckCircle2 className="h-4 w-4" /> Biometric Passkeys
              </div>
              <p className="text-[11px] text-slate-400">Hardware WebAuthn TouchID / FaceID sign in.</p>
            </div>
          </Grid>
        </Container>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        Declutr Vault Engine • Zero-Knowledge Guarantee • Server holds no plaintext passwords.
      </footer>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <ThemeProvider>
      <WelcomeContent />
    </ThemeProvider>
  );
}
