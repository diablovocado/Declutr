"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface CommentItem {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  resolved: boolean;
}

export interface CommentReviewPanelProps {
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  onToggleResolve: (id: string) => void;
}

export function CommentReviewPanel({ comments, onAddComment, onToggleResolve }: CommentReviewPanelProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    onAddComment(inputText);
    setInputText("");
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Document Comments & Discussion ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Input Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add inline comment e.g. @legal verify Section 4..."
            className="flex-1 h-9 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <Button variant="default" size="sm" onClick={handleSend} className="h-9 px-3">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Comment Thread */}
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <User className="h-3.5 w-3.5 text-purple-400" />
                  <span>{c.author}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{c.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{c.content}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                <button
                  onClick={() => onToggleResolve(c.id)}
                  className={`flex items-center gap-1 font-semibold ${
                    c.resolved ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {c.resolved ? "Resolved" : "Mark Resolved"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
