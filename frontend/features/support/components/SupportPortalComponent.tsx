"use client";

import React, { useState } from "react";
import { MessageSquare, Bug, Sparkles, Send } from "lucide-react";

export function SupportPortalComponent() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Bug Report");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 rounded-xl border bg-card max-w-xl mx-auto space-y-4">
      <h3 className="font-bold text-lg">Contact Technical Support</h3>
      {submitted ? (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold text-center">
          Thank you! Your support ticket has been submitted. Our engineering team will respond within 1 business hour.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary"
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="API & Webhooks">API & Webhooks</option>
              <option value="Billing & Enterprise">Billing & Enterprise</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of issue..."
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary"
            />
          </div>

          <div>
            <label className="font-semibold text-muted-foreground">Message Body</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide steps to reproduce or details..."
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary h-24"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Support Ticket
          </button>
        </form>
      )}
    </div>
  );
}
