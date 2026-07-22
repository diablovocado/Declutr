"use client";

import React, { useEffect, useState } from "react";
import { Compass, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { ContextService } from "../services/context-service";
import { IntentPrediction } from "../types/context";

interface IntentCardProps {
  assetId: string;
  vaultId?: string;
}

export function IntentCard({ assetId, vaultId }: IntentCardProps) {
  const [prediction, setPrediction] = useState<IntentPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ContextService.getAssetIntent(assetId, vaultId)
      .then(setPrediction)
      .finally(() => setLoading(false));
  }, [assetId, vaultId]);

  if (loading) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse text-xs text-slate-400 flex items-center gap-2">
        <Compass className="w-4 h-4 text-indigo-400 animate-spin" /> Predicting Asset Intent...
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400" /> No intent predicted for this asset yet.
      </div>
    );
  }

  const confidencePct = Math.round(prediction.confidenceScore * 100);

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-xl p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Inferred Intent</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {prediction.intentTypeName}
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {confidencePct}% Conf
              </span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
          v{prediction.promptVersion}
        </span>
      </div>

      <div className="space-y-2 text-xs pt-1 border-t border-slate-800">
        <div>
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Evidence:
          </span>
          <p className="text-slate-300 italic mt-0.5 bg-slate-950/50 p-2 rounded border border-slate-800/80">
            "{prediction.evidence}"
          </p>
        </div>

        <div>
          <span className="font-semibold text-slate-400">AI Reasoning:</span>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            {prediction.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
