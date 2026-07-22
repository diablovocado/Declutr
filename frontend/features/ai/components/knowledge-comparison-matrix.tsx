"use client";

import React from "react";
import { GitCompare, CheckCircle2, AlertCircle, HelpCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export interface ComparisonRow {
  attribute: string;
  docA: string;
  docB: string;
  status: "SIMILAR" | "DIFFERENT" | "MISSING";
}

export interface KnowledgeComparisonMatrixProps {
  docAName: string;
  docBName: string;
  rows: ComparisonRow[];
}

export function KnowledgeComparisonMatrix({ docAName, docBName, rows }: KnowledgeComparisonMatrixProps) {
  return (
    <Card className="bg-slate-950/80 border-slate-800 my-3">
      <CardHeader className="py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <GitCompare className="h-4 w-4" /> Multi-Document Knowledge Comparison Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
              <th className="p-3">Attribute</th>
              <th className="p-3 font-semibold text-slate-200">{docAName}</th>
              <th className="p-3 font-semibold text-slate-200">{docBName}</th>
              <th className="p-3 text-right">Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-slate-200">{row.attribute}</td>
                <td className="p-3">{row.docA}</td>
                <td className="p-3">{row.docB}</td>
                <td className="p-3 text-right">
                  {row.status === "SIMILAR" && (
                    <Badge variant="emerald" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Similar
                    </Badge>
                  )}
                  {row.status === "DIFFERENT" && (
                    <Badge variant="amber" className="gap-1">
                      <AlertCircle className="h-3 w-3" /> Different
                    </Badge>
                  )}
                  {row.status === "MISSING" && (
                    <Badge variant="outline" className="gap-1 text-slate-400">
                      <HelpCircle className="h-3 w-3" /> Missing
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
