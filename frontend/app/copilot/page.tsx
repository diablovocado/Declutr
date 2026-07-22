"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, Send, FileText, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, CornerDownLeft, X, Layers, GitCompare, RotateCcw } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScopeSelector, AIScope } from "../../features/ai/components/scope-selector";
import { CitationList, CitationItem } from "../../features/ai/components/citation-list";
import { KnowledgeComparisonMatrix, ComparisonRow } from "../../features/ai/components/knowledge-comparison-matrix";
import { ChatHistorySidebar } from "../../features/ai/components/chat-history-sidebar";

interface ChatMsg {
  id: string;
  sender: "user" | "assistant";
  content: string;
  citations?: CitationItem[];
  comparisonRows?: ComparisonRow[];
  timestamp: string;
}

export default function CopilotPage() {
  const [currentScope, setCurrentScope] = useState<AIScope>({
    id: "v_all",
    name: "Entire Vault",
    type: "VAULT",
    itemCount: 42,
  });

  const [activeSessionId, setActiveSessionId] = useState("c1");

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "m0",
      sender: "assistant",
      content: `Welcome to your Global AI Workspace. Ask natural language questions across your entire vault (${currentScope.name}).`,
      citations: [
        {
          documentId: "file_demo_01",
          documentName: "Tax_Filing_Form_1040_2025.pdf",
          section: "Form 1040 Line 12 - Adjusted Gross Income",
          confidence: 0.96,
        },
        {
          documentId: "file_demo_02",
          documentName: "W-2_Income_Summary_2025.pdf",
          section: "Box 1 Wages & Box 2 Federal Tax Withheld",
          confidence: 0.94,
        },
      ],
      timestamp: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const crossKnowledgePrompts = [
    "Compare my last 2 tax returns.",
    "Show all receipts related to Japan.",
    "What medical reports reference cholesterol?",
    "Summarize everything about my university.",
  ];

  const handleSend = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: ChatMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      let reply = `Cross-Knowledge Reasoning Analysis (${currentScope.name}):\n\n`;
      let compRows: ComparisonRow[] | undefined = undefined;

      if (question.toLowerCase().includes("compare") || question.toLowerCase().includes("tax")) {
        reply += "Analyzed Tax_Filing_Form_1040_2025.pdf and W-2_Income_Summary_2025.pdf across your vault. Key financial comparison generated below:";
        compRows = [
          { attribute: "Reported Income", docA: "$125,000", docB: "$125,000", status: "SIMILAR" },
          { attribute: "Federal Tax Withheld", docA: "$24,500", docB: "$24,500", status: "SIMILAR" },
          { attribute: "Refund Credit", docA: "$3,200", docB: "N/A", status: "DIFFERENT" },
        ];
      } else if (question.toLowerCase().includes("receipt") || question.toLowerCase().includes("japan")) {
        reply += "Found 3 receipts matching 'Japan' in your Financial & Tax Collection: Tokyo Express Hotel ($450), Narita Express ($60), and Ramen Street ($35).";
      } else {
        reply += "Grounded cross-knowledge synthesis derived from active vault scope. All relevant facts extracted with zero-knowledge verification.";
      }

      const aiMsg: ChatMsg = {
        id: "a_" + Date.now(),
        sender: "assistant",
        content: reply,
        citations: [
          {
            documentId: "file_demo_01",
            documentName: "Tax_Filing_Form_1040_2025.pdf",
            section: "Form 1040 Line 12",
            confidence: 0.96,
          },
          {
            documentId: "file_demo_02",
            documentName: "W-2_Income_Summary_2025.pdf",
            section: "Box 1 Wages",
            confidence: 0.92,
          },
        ],
        comparisonRows: compRows,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <PageShell
      title="Global AI Workspace"
      subtitle="Cross-knowledge intelligence reasoning over your entire digital vault with verifiable source citations."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "AI Workspace" }]}
    >
      <div className="flex h-[620px] rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {/* Chat History Sidebar */}
        <ChatHistorySidebar
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewChat={() => setMessages([])}
        />

        {/* Main AI Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar with Scope Selector */}
          <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <ScopeSelector currentScope={currentScope} onScopeChange={setCurrentScope} />
            <Badge variant="emerald" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Multi-Doc RAG
            </Badge>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-950/80 border border-slate-800 text-slate-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>

                  {/* Multi-Document Comparison Matrix if present */}
                  {msg.comparisonRows && (
                    <KnowledgeComparisonMatrix
                      docAName="Tax Form 1040"
                      docBName="W-2 Income Summary"
                      rows={msg.comparisonRows}
                    />
                  )}

                  {/* Verifiable Source Citations */}
                  {msg.citations && <CitationList citations={msg.citations} />}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-purple-400 p-2 bg-purple-950/30 rounded-xl border border-purple-800/40 w-fit animate-pulse">
                <Sparkles className="h-4 w-4" /> Reasoning across multi-document knowledge vault...
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Prompts:</span>
            {crossKnowledgePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 hover:text-white shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask anything across your entire digital knowledge..."
                className="flex-1 h-10 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button variant="default" size="sm" type="submit" disabled={loading} leftIcon={<Send className="h-3.5 w-3.5" />}>
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
