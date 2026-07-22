"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, Upload, Clipboard, Command, ArrowRight, FileText, Folder, CheckSquare, Clock } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpotlightModal({ isOpen, onClose }: SpotlightModalProps) {
  const [query, setQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setStatusMsg("File dropped! Processing in zero-knowledge vault...");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handlePasteClipboard = () => {
    setStatusMsg("Pasted text from clipboard into Quick Note!");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in-0">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full max-w-2xl bg-slate-900 border ${
          isDragging ? "border-emerald-400 bg-slate-900/90" : "border-slate-800"
        } rounded-2xl shadow-2xl overflow-hidden text-white transition-all`}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="h-5 w-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Spotlight: Search files, ask AI, or drag & drop files (⌘ Space)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
            autoFocus
          />
          <Badge variant="outline" className="text-[10px] font-mono shrink-0">⌘ Space</Badge>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div className="p-3 bg-emerald-950/60 border-b border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-between">
            <span>{statusMsg}</span>
            <Badge variant="emerald" className="text-[9px]">100% Online</Badge>
          </div>
        )}

        {/* Drop Zone Indicator */}
        {isDragging && (
          <div className="p-8 border-2 border-dashed border-emerald-400 m-4 rounded-xl text-center bg-emerald-950/20 text-emerald-400 font-bold text-sm">
            Drop file here to upload and process immediately
          </div>
        )}

        {/* Quick Actions & Search Results */}
        {!isDragging && (
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={handlePasteClipboard} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-colors">
                <Clipboard className="h-4 w-4 text-purple-400 mb-1" />
                <span className="text-xs font-bold block text-white">Paste Clipboard</span>
                <span className="text-[10px] text-slate-400">Save text/URL</span>
              </button>

              <Link href="/copilot" onClick={onClose} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-left transition-colors">
                <Sparkles className="h-4 w-4 text-purple-400 mb-1" />
                <span className="text-xs font-bold block text-white">Ask AI</span>
                <span className="text-[10px] text-slate-400 font-mono">Global Copilot</span>
              </Link>

              <Link href="/actions" onClick={onClose} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-colors">
                <CheckSquare className="h-4 w-4 text-emerald-400 mb-1" />
                <span className="text-xs font-bold block text-white">New Task</span>
                <span className="text-[10px] text-slate-400">Quick capture</span>
              </Link>

              <Link href="/vault" onClick={onClose} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-colors">
                <Upload className="h-4 w-4 text-emerald-400 mb-1" />
                <span className="text-xs font-bold block text-white">Upload File</span>
                <span className="text-[10px] text-slate-400">Zero-knowledge</span>
              </Link>
            </div>

            {/* Quick Results */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Top Suggestions</span>
              <div className="space-y-1">
                <Link href="/files/file_demo_01" onClick={onClose} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium text-white">Tax_Filing_Form_1040_2025.pdf</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono">Vault File</Badge>
                </Link>

                <Link href="/timeline" onClick={onClose} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span className="font-medium text-white">Japan Travel Memory (May 2025)</span>
                  </div>
                  <Badge variant="purple" className="text-[9px] font-mono">Memory</Badge>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Press ESC or ⌘ Space to close</span>
          <span className="text-emerald-400">PWA Desktop Ready</span>
        </div>
      </div>
    </div>
  );
}
