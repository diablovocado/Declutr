"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, Sparkles, CheckCircle2, ShieldCheck, Tag, Calendar, Database, MessageSquare, ArrowLeft, Download, Eye } from "lucide-react";
import { PageShell } from "../../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export default function FileDetailPage() {
  const params = useParams();
  const fileId = (params?.id as string) || "file_demo_01";

  const [fileDetails, setFileDetails] = useState({
    id: fileId,
    fileName: "Tax_Filing_Form_1040_2025.pdf",
    mimeType: "application/pdf",
    sizeBytes: 4200000,
    status: "COMPLETED",
    stage: "READY",
    progress: 100,
    extractedText: "IRS Form 1040 U.S. Individual Income Tax Return 2025. Total Income: $125,000. Tax Paid: $24,500. Refund Due: $3,200. Filed electronically on April 12, 2026 by Accountant John Smith.",
    summary: "Annual 2025 IRS Tax return filing indicating $125k total income, $24.5k tax paid, and $3,200 refund due.",
    metadata: { type: "tax_document", year: "2025", authority: "IRS", status: "filed" },
    entities: ["IRS", "Form 1040", "John Smith", "April 12, 2026"],
    citations: ["Form 1040 Tax Return (Lines 1-15)", "W-2 Income Summary 2025"],
  });

  return (
    <PageShell
      title={fileDetails.fileName}
      subtitle={`Asset ID: ${fileDetails.id} • Zero-Knowledge Encrypted Item`}
      breadcrumbs={[
        { label: "Declutr", href: "/" },
        { label: "Vault", href: "/vault" },
        { label: fileDetails.fileName },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/copilot?fileId=${fileDetails.id}`}>
            <Button variant="default" size="sm" leftIcon={<MessageSquare className="h-4 w-4" />}>
              Chat about File
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Extracted Content & AI Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary Card */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" /> AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {fileDetails.summary}
              </p>
            </CardContent>
          </Card>

          {/* Extracted Text Snippet */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" /> Extracted Text (OCR & Parsing)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
                {fileDetails.extractedText}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Metadata Tags & Pipeline Telemetry */}
        <div className="space-y-6">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Ingestion Pipeline Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <Badge variant="emerald">{fileDetails.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Stage</span>
                <Badge variant="outline">{fileDetails.stage}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">File Size</span>
                <span className="font-mono text-slate-200">{(fileDetails.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">MIME Type</span>
                <span className="font-mono text-slate-200">{fileDetails.mimeType}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-400" /> Extracted Entities & Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {fileDetails.entities.map((ent, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs py-1 px-2.5">
                    {ent}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
