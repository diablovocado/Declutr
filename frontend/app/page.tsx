"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [logs, setLogs] = useState<string[]>(["[system] Initializing zero-trust tunnel..."]);
  const [text, setText] = useState("");
  const [encrypted, setEncrypted] = useState("");

  const steps = [
    "✓ Secured WebAssembly sandbox loaded",
    "⟲ Performing X25519 key exchange...",
    "🔒 Derived ephemeral AES-256-GCM key",
    "⟲ Creating 3 cryptographic file shards...",
    "✦ Distributing shards to Tokyo, Zurich, Reykjavik",
    "✔ Zero-knowledge vault backup successful",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev, steps[index]];
        return next.slice(-5);
      });
      index = (index + 1) % steps.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!text) {
      setEncrypted("");
      return;
    }
    const token = btoa(text).replace(/=/g, "").slice(0, 24).toLowerCase();
    setEncrypted(`dc_vault_aes_gcm_${token}`);
  }, [text]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden relative">
      {/* Grid Pattern and Glow Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between p-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Declutr</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</button>
            <button className="px-4 py-2 text-sm font-medium text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-[0_4px_12px_rgba(52,211,153,0.3)] transition-all">
              Create Vault
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Zero-Trust Architecture Active
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Digital Life, <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                  Secured.
                </span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-xl text-lg text-zinc-400 leading-relaxed">
                A privacy-first digital vault for storing, organizing, preserving, and protecting your most important digital assets.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button className="px-6 py-3.5 text-base font-semibold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-[0_4px_15px_rgba(52,211,153,0.3)] transition-all">
                Create Vault
              </button>
              <button className="px-6 py-3.5 text-base font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all">
                Sign In
              </button>
            </div>
            <div className="pt-6 border-t border-zinc-900 flex justify-center lg:justify-start gap-6 text-xs text-zinc-500 font-mono">
              <span>🔒 AES-256-GCM</span>
              <span>🔑 X25519 DH</span>
              <span>✦ Multi-Node Sharding</span>
            </div>
          </div>

          {/* Hero Right / Terminal Simulator */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-15 blur-xl"></div>
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                </div>
                <div className="text-[10px] font-mono text-zinc-600">CIPHER_HANDSHAKE_LOG</div>
              </div>
              
              <div className="space-y-2 min-h-[140px] font-mono text-xs text-zinc-400">
                {logs.map((log, idx) => (
                  <div key={idx} className={idx === logs.length - 1 ? "text-emerald-400" : "text-zinc-600"}>
                    <span className="text-zinc-700 mr-2">&gt;</span>{log}
                  </div>
                ))}
                <span className="inline-block h-3 w-1.5 bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Encryption Sandbox */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 space-y-3">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Zero-Knowledge Sandbox</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter a secret value..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-2.5 text-[11px] font-mono text-zinc-500 break-all min-h-[38px] flex items-center">
                  {encrypted ? <span className="text-cyan-400">{encrypted}</span> : <span className="italic text-zinc-800">Encrypted token output...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900 bg-zinc-950/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-4 hover:border-zinc-800 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Zero-Knowledge Architecture</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Files are encrypted locally on your device prior to upload. We store no passphrases, recovery codes, or unencrypted data blocks.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-4 hover:border-zinc-800 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-teal-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Digital Legacy Transfer</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Configure a secure dead-man's switch to automatically transfer recovery shards to trusted next-of-kin if you become inactive.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 space-y-4 hover:border-zinc-800 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Decentralized Sharding</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Files are split into encrypted parts and dispersed globally across IPFS storage clusters, eliminating centralized failure points.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm font-bold text-white">Declutr</span>
          </div>
          <div className="text-xs text-zinc-600 font-mono">
            © {new Date().getFullYear()} Declutr. Zero-Knowledge Cryptography.
          </div>
        </div>
      </footer>
    </div>
  );
}
