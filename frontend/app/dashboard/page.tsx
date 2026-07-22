"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderKey, Search, ShieldCheck, Activity, Plus, Upload, MessageSquare, FileText, CheckCircle2, Clock, Sparkles, HardDrive, ArrowRight, RefreshCw } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Grid } from "../../components/layout/layout-primitives";
import { UploadModal } from "../../features/upload/components/upload-modal";

interface FileItem {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  stage: string;
  summary: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [recentUploads, setRecentUploads] = useState<FileItem[]>([
    {
      id: "file_demo_01",
      fileName: "Tax_Filing_Form_1040_2025.pdf",
      mimeType: "application/pdf",
      sizeBytes: 4200000,
      status: "COMPLETED",
      stage: "READY",
      summary: "Annual 2025 IRS Tax return filing indicating $125k total income and $3,200 refund due.",
      createdAt: "Just now",
    },
  ]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Tax form 2025",
    "Passport renewal",
    "Doctor prescription",
  ]);
  const [recentChats, setRecentChats] = useState<{ id: string; question: string; answer: string }[]>([
    {
      id: "c1",
      question: "What is this document?",
      answer: "IRS Form 1040 Tax Return for fiscal year 2025 with $125,000 income recorded.",
    },
    {
      id: "c2",
      question: "What dates are mentioned?",
      answer: "Tax period ending December 31, 2025; filed on April 12, 2026.",
    },
  ]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/files");
      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          setRecentUploads(data.files);
        }
      }
    } catch (e) {
      // Backend optional offline fallback
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Central command for your zero-knowledge life vault, recent uploads, processing queue, searches, and AI chats."
      breadcrumbs={[{ label: "Declutr", href: "/" }, { label: "Dashboard" }]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh Status
          </Button>
          <Button variant="default" onClick={() => setUploadOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>
            Quick Upload
          </Button>
        </div>
      }
    >
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={fetchDashboardData}
      />

      {/* Top Stat Overview Grid */}
      <Grid cols={4} className="mb-8 gap-4">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Encrypted Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">4.2 MB</span>
            <span className="text-xs text-slate-400 block mt-1">10 GB Free Tier Quota</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Active Vault</CardTitle>
              <FolderKey className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">My Life Vault</span>
            <Badge variant="emerald" className="ml-2 text-[10px]">AES-256 GCM</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Indexed Vectors</CardTitle>
              <Search className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">512-Dim</span>
            <Badge variant="outline" className="ml-2 text-[10px]">pgvector Ready</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Pipeline State</CardTitle>
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-emerald-400">Healthy</span>
            <span className="text-xs text-slate-400 block mt-1">0 Queue Backlog</span>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content Sections: Recent Uploads & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Cols: Recent Uploads & Processing Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Uploads & Processing Queue</CardTitle>
                <CardDescription>Files ingested into your zero-knowledge vault</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUploadOpen(true)} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Add File
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUploads.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{file.fileName}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{file.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Badge variant={file.status === "COMPLETED" ? "emerald" : "amber"} className="flex items-center gap-1">
                        {file.status === "COMPLETED" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {file.stage || file.status}
                      </Badge>
                      <Link href={`/copilot?fileId=${file.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Natural Search Bar */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-emerald-400" /> Natural Language Vault Search
              </CardTitle>
              <CardDescription>Search across full text, OCR, entities, and context tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask anything e.g. 'Show tax forms from 2025' or 'Doctor prescription'"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                    }
                  }}
                />
                <Link href="/search">
                  <Button variant="default" leftIcon={<ArrowRight className="h-4 w-4" />}>
                    Search
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Searches & AI Chats */}
        <div className="space-y-6">
          {/* Recent AI Chats */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" /> Recent AI Chats
              </CardTitle>
              <Link href="/copilot">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {recentChats.map((chat) => (
                <Link key={chat.id} href="/copilot" className="block p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition-colors">
                  <p className="font-semibold text-emerald-400 mb-1">"{chat.question}"</p>
                  <p className="text-slate-300 line-clamp-2">{chat.answer}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" /> Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, idx) => (
                  <Link key={idx} href={`/search?q=${encodeURIComponent(s)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:border-emerald-500/50 hover:text-emerald-400 transition-colors py-1 px-2.5 text-xs">
                      {s}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
