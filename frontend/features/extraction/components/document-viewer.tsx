"use client";

import React, { useEffect, useState } from "react";
import { FileText, AlignLeft, List as ListIcon, Code, Table as TableIcon, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { ContentService, ExtractedDocument, ContentBlock } from "../services/content-service";

export function DocumentViewer({ assetId }: { assetId: string }) {
  const [doc, setDoc] = useState<ExtractedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ContentService.getExtractedContent(assetId)
      .then(setDoc)
      .catch((e) => setError(e.message));
  }, [assetId]);

  if (error) {
    return (
      <div className="p-8 text-rose-400 flex flex-col items-center justify-center bg-slate-900 h-full">
        <AlertCircle className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-sm">Failed to load content: {error}</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="p-8 text-slate-400 animate-pulse flex flex-col items-center justify-center bg-slate-900 h-full">
        <RefreshCw className="h-6 w-6 mb-4 opacity-50 animate-spin" />
        <p className="text-sm">Extracting document...</p>
      </div>
    );
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.blockType) {
      case "heading":
        return <h2 key={block.blockId} className="text-xl font-bold text-slate-100 mt-6 mb-4 flex items-center gap-2"><AlignLeft className="h-4 w-4 text-slate-500"/> {block.content}</h2>;
      case "paragraph":
        return <p key={block.blockId} className="text-slate-300 leading-relaxed mb-4 text-sm">{block.content}</p>;
      case "list":
        return (
          <ul key={block.blockId} className="list-disc list-inside text-slate-300 mb-4 space-y-1 text-sm bg-slate-800/30 p-4 rounded-lg border border-slate-800/50">
            {block.content.split("\n").map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                 <span className="text-slate-500 mt-1">•</span> 
                 <span className="flex-1">{item.replace(/^[-*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        );
      case "code":
        return (
          <pre key={block.blockId} className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto mb-4 text-sm font-mono text-emerald-400">
            <code>{block.content}</code>
          </pre>
        );
      case "table":
        return <div key={block.blockId} className="bg-slate-800/50 p-4 rounded text-slate-300 text-sm mb-4 border border-slate-700">Table Data Placeholder: {block.content}</div>;
      default:
        return <div key={block.blockId} className="text-slate-500 text-xs mb-2">Unknown Block: {block.content}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Header toolbar */}
      <div className="flex-none p-4 border-b border-slate-800 bg-slate-900/95 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-slate-200 text-sm">Extracted Content</h3>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{doc.wordCount} words</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {Math.ceil(doc.readingTimeSeconds / 60)} min read</span>
            </p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
          {doc.extractor} v{doc.extractorVersion}
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 overflow-y-auto p-8 lg:px-16 custom-scrollbar bg-slate-900">
        <div className="max-w-3xl mx-auto">
          {doc.blocks?.map(renderBlock)}
          
          {(!doc.blocks || doc.blocks.length === 0) && (
            <div className="text-center py-20 text-slate-500">
              <p>No content could be extracted from this asset.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
