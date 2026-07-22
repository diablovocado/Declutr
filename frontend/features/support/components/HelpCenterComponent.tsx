"use client";

import React, { useState } from "react";
import { Search, HelpCircle, BookOpen, MessageSquare, Bug, Sparkles } from "lucide-react";

export function HelpCenterComponent() {
  const [query, setQuery] = useState("");

  const faqs = [
    { q: "What is Declutr?", a: "Declutr is an AI-powered, multi-tenant knowledge management, vault storage, hybrid search, AI copilot streaming, and developer platform." },
    { q: "How does Zero-Knowledge authentication work?", a: "Declutr uses SRP-6a Zero-Knowledge Proofs. Your password is never sent to or stored on server databases." },
    { q: "How do I install third-party extensions?", a: "Navigate to /marketplace, choose an extension, review requested scope permissions, and click Install Extension." },
    { q: "Can I self-host Declutr for my team?", a: "Yes, Declutr is available as a Community Self-Hosted Docker/Helm distribution under the MIT license." },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles, FAQs, SDK documentation..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl bg-card text-sm"
        />
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-5 rounded-xl border bg-card space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{faq.q}</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
