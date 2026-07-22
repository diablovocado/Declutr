"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Command, LayoutDashboard, FolderKey, MessageSquare, Compass, Sliders, Upload, Plus, FileText, ArrowRight, Sun, Moon, HelpCircle, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useTheme } from "../../providers/theme-provider";

export interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "AI Commands" | "Recent Assets";
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenUpload?: () => void;
  onOpenShortcuts?: () => void;
}

export function CommandPalette({ open, onOpenChange, onOpenUpload, onOpenShortcuts }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandCatalog: CommandItem[] = [
    // Navigation
    { id: "nav_dash", category: "Navigation", label: "Open Dashboard", sublabel: "Home Personal Intelligence Hub", icon: <LayoutDashboard className="h-4 w-4 text-emerald-400" />, action: () => router.push("/dashboard") },
    { id: "nav_vault", category: "Navigation", label: "Open Vault", sublabel: "Zero-Knowledge Workspace", icon: <FolderKey className="h-4 w-4 text-amber-400" />, action: () => router.push("/vault") },
    { id: "nav_search", category: "Navigation", label: "Open Search", sublabel: "Natural & Semantic Search", icon: <Search className="h-4 w-4 text-blue-400" />, action: () => router.push("/search") },
    { id: "nav_chat", category: "Navigation", label: "Open AI Copilot Chat", sublabel: "RAG Grounded Conversation", icon: <MessageSquare className="h-4 w-4 text-purple-400" />, action: () => router.push("/copilot") },
    { id: "nav_lifeos", category: "Navigation", label: "Open LifeOS", sublabel: "Areas, Projects & Goals", icon: <Compass className="h-4 w-4 text-cyan-400" />, action: () => router.push("/lifeos") },
    { id: "nav_ds", category: "Navigation", label: "Open Design System", sublabel: "UI Tokens & Component Gallery", icon: <Sliders className="h-4 w-4 text-rose-400" />, action: () => router.push("/design-system") },

    // Actions
    { id: "act_upload", category: "Actions", label: "Upload Memory File", sublabel: "Ingest PDF, Document, or Receipt", shortcut: "⌘U", icon: <Upload className="h-4 w-4 text-emerald-400" />, action: () => { onOpenChange(false); onOpenUpload?.(); } },
    { id: "act_ask_ai", category: "Actions", label: "Ask AI Copilot", sublabel: "Start new RAG session", shortcut: "⌘⇧A", icon: <Sparkles className="h-4 w-4 text-purple-400" />, action: () => router.push("/copilot") },
    { id: "act_theme", category: "Actions", label: "Toggle Theme", sublabel: "Switch between Dark & Light Mode", icon: theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />, action: () => toggleTheme() },
    { id: "act_shortcuts", category: "Actions", label: "Keyboard Shortcuts Help", sublabel: "View all hotkeys", shortcut: "⌘/", icon: <HelpCircle className="h-4 w-4 text-slate-400" />, action: () => { onOpenChange(false); onOpenShortcuts?.(); } },

    // AI Natural Language Commands
    { id: "ai_tax", category: "AI Commands", label: "Summarize Tax Filing 2025", sublabel: "AI prompt recommendation", icon: <Sparkles className="h-4 w-4 text-emerald-400" />, action: () => router.push("/files/file_demo_01") },
    { id: "ai_passport", category: "AI Commands", label: "Find Passport & ID Documents", sublabel: "Search query prompt", icon: <Sparkles className="h-4 w-4 text-blue-400" />, action: () => router.push("/search?q=passport") },
    { id: "ai_medical", category: "AI Commands", label: "Show Medical Prescriptions", sublabel: "Search query prompt", icon: <Sparkles className="h-4 w-4 text-purple-400" />, action: () => router.push("/search?q=prescription") },

    // Recent Assets
    { id: "rec_tax", category: "Recent Assets", label: "Tax_Filing_Form_1040_2025.pdf", sublabel: "Opened 10 mins ago • 4.2 MB", icon: <FileText className="h-4 w-4 text-slate-400" />, action: () => router.push("/files/file_demo_01") },
  ];

  // Filter commands by fuzzy match
  const filteredCommands = commandCatalog.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.sublabel && cmd.sublabel.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Keyboard events inside command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-black/75 backdrop-blur-sm animate-in fade-in-0"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Command Palette"
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/80">
          <Search className="h-5 w-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. 'Upload file', 'Open Vault', 'Tax 2025')..."
            className="w-full h-14 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => onOpenChange(false)} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or files found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onOpenChange(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? "bg-emerald-950/60 border border-emerald-500/40 text-white" : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{cmd.label}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                          {cmd.category}
                        </Badge>
                      </div>
                      {cmd.sublabel && <p className="text-[11px] text-slate-400 truncate">{cmd.sublabel}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">ESC</kbd> Close</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-emerald-400">
            <Command className="h-3 w-3" /> Declutr Spotlight
          </div>
        </div>
      </div>
    </div>
  );
}
