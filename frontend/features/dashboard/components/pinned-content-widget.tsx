"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pin, Folder, FileText, Bookmark, Search, MessageSquare, Star, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface PinnedItem {
  id: string;
  type: "file" | "folder" | "collection" | "search" | "chat";
  name: string;
  href: string;
}

export function PinnedContentWidget() {
  const [pinned, setPinned] = useState<PinnedItem[]>([
    { id: "p1", type: "file", name: "Tax_Filing_Form_1040_2025.pdf", href: "/files/file_demo_01" },
    { id: "p2", type: "collection", name: "Financial & Tax 2025", href: "/vault" },
    { id: "p3", type: "search", name: "Saved: Doctor Prescriptions", href: "/search?q=doctor" },
  ]);

  const handleUnpin = (id: string) => {
    setPinned((prev) => prev.filter((p) => p.id !== id));
  };

  const getIcon = (type: PinnedItem["type"]) => {
    switch (type) {
      case "file": return <FileText className="h-3.5 w-3.5 text-emerald-400" />;
      case "folder": return <Folder className="h-3.5 w-3.5 text-amber-400" />;
      case "collection": return <Bookmark className="h-3.5 w-3.5 text-purple-400" />;
      case "search": return <Search className="h-3.5 w-3.5 text-blue-400" />;
      case "chat": return <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />;
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4 text-emerald-400 rotate-45" /> Pinned Workspace Items ({pinned.length})
          </CardTitle>
          <Badge variant="outline">Favorites</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {pinned.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No pinned items yet. Pin your favorite files or searches for quick access.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pinned.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group">
                <Link href={item.href} className="flex items-center gap-2.5 min-w-0 flex-1">
                  {getIcon(item.type)}
                  <span className="text-xs font-semibold text-white truncate">{item.name}</span>
                </Link>
                <button onClick={() => handleUnpin(item.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
