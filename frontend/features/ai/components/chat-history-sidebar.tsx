"use client";

import React, { useState } from "react";
import { MessageSquare, Pin, Search, Plus, Trash2, Clock, Sparkles } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
}

export interface ChatHistorySidebarProps {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export function ChatHistorySidebar({ activeSessionId, onSelectSession, onNewChat }: ChatHistorySidebarProps) {
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "c1", title: "Tax Return 2025 Questions", date: "Today", pinned: true },
    { id: "c2", title: "Cardiology Prescription Analysis", date: "Yesterday", pinned: true },
    { id: "c3", title: "Japan Travel Receipts Comparison", date: "3 days ago" },
    { id: "c4", title: "W-2 Income Summary 2024 vs 2025", date: "1 week ago" },
  ]);

  const filtered = sessions.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 shrink-0 hidden lg:flex flex-col gap-4 text-xs">
      <button
        onClick={onNewChat}
        className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
      >
        <Plus className="h-4 w-4" /> New AI Conversation
      </button>

      {/* Filter Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full h-8 px-2.5 pl-8 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2" />
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Recent AI Chats
        </div>

        {filtered.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSession(s.id)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between group ${
              activeSessionId === s.id
                ? "bg-slate-800 border-emerald-500/50 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-xs truncate block">{s.title}</span>
                <span className="text-[10px] text-slate-400 block">{s.date}</span>
              </div>
            </div>

            {s.pinned && <Pin className="h-3 w-3 text-amber-400 shrink-0" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
