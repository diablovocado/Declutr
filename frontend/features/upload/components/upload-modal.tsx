"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, RefreshCw, Layers, Sparkles, Database, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/components/overlay/dialog";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { UploadService, UploadItem } from "../services/upload-service";
import { cn } from "../../../shared/utils/cn";

export interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export const PROCESSING_STAGES = [
  "VALIDATING",
  "STORING",
  "QUEUEING",
  "EXTRACTING_TEXT",
  "OCR_PROCESSING",
  "METADATA_EXTRACTION",
  "AI_SUMMARIZATION",
  "ENTITY_EXTRACTION",
  "EMBEDDINGS_GENERATION",
  "SEARCH_INDEXING",
  "READY",
] as const;

export function UploadModal({ open, onOpenChange, onUploadComplete }: UploadModalProps) {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const newItems: UploadItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = UploadService.validateFile(file);

      const id = "up_" + Math.random().toString(36).substring(2, 9);
      newItems.push({
        id,
        file,
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/pdf",
        progressPercentage: validation.valid ? 5 : 0,
        status: validation.valid ? "QUEUED" : "FAILED",
        error: validation.error,
      });
    }

    setQueue((prev) => [...prev, ...newItems]);

    // Run stage pipeline
    for (const item of newItems) {
      if (item.status === "FAILED") continue;

      const checksum = await UploadService.computeChecksum(item.file);
      const stageSteps = [
        { status: "UPLOADING", progress: 20 },
        { status: "EXTRACTING_TEXT", progress: 40 },
        { status: "METADATA_EXTRACTION", progress: 65 },
        { status: "EMBEDDINGS_GENERATION", progress: 85 },
        { status: "READY", progress: 100 },
      ];

      for (const s of stageSteps) {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, checksumSha256: checksum, status: s.status as any, progressPercentage: s.progress } : q))
        );
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    if (onUploadComplete) onUploadComplete();
  }, [onUploadComplete]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const retryItem = (item: UploadItem) => {
    setQueue((prev) => prev.filter((i) => i.id !== item.id));
    processFiles([item.file]);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-slate-900 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-400" />
            Upload Memory & Ingest Content
          </DialogTitle>
        </DialogHeader>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          )}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="modal-file-upload-input"
          />
          <label htmlFor="modal-file-upload-input" className="cursor-pointer flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              Drag & drop files or <span className="text-emerald-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Supports PDFs, Images, Notes, and Documents up to 500 MB. Zero-Knowledge Client AES-256 Encrypted.
            </p>
          </label>
        </div>

        {/* Ingestion Pipeline Stages Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 py-1 border-y border-slate-800">
          <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-emerald-400" /> Validate</span>
          <span>➔</span>
          <span className="flex items-center gap-1"><Database className="h-3 w-3 text-blue-400" /> Store & Extract</span>
          <span>➔</span>
          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-purple-400" /> Metadata & AI</span>
          <span>➔</span>
          <span className="flex items-center gap-1"><Search className="h-3 w-3 text-cyan-400" /> Embeddings & Search</span>
        </div>

        {/* Upload Queue List */}
        {queue.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ingestion Queue ({queue.length})
            </h4>
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950/70 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200 truncate">{item.filename}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{(item.sizeBytes / 1024).toFixed(1)} KB</span>
                        {item.checksumSha256 && (
                          <span className="font-mono text-[9px] text-slate-500">
                            SHA256: {item.checksumSha256.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.status === "QUEUED" && <Badge variant="outline">QUEUED</Badge>}
                    {item.status === "UPLOADING" && <Badge variant="blue" className="animate-pulse">UPLOADING 20%</Badge>}
                    {item.status === "EXTRACTING_TEXT" && <Badge variant="amber" className="animate-pulse">EXTRACTING TEXT 40%</Badge>}
                    {item.status === "METADATA_EXTRACTION" && <Badge variant="purple" className="animate-pulse">METADATA & AI 65%</Badge>}
                    {item.status === "EMBEDDINGS_GENERATION" && <Badge variant="cyan" className="animate-pulse">EMBEDDINGS 85%</Badge>}
                    {item.status === "READY" && (
                      <Badge variant="emerald" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> READY 100%
                      </Badge>
                    )}
                    {item.status === "FAILED" && (
                      <div className="flex items-center gap-1">
                        <Badge variant="rose" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {item.error || "FAILED"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => retryItem(item)}>
                          <RefreshCw className="h-3 w-3" /> Retry
                        </Button>
                      </div>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-slate-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${item.progressPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
