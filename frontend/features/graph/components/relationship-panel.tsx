"use client";

import React, { useEffect, useState } from "react";
import { Share2, Link, ShieldAlert, Cpu } from "lucide-react";
import { GraphService, GraphEdge } from "../services/graph-service";

export function RelationshipPanel({ nodeId }: { nodeId: string }) {
  const [edges, setEdges] = useState<GraphEdge[] | null>(null);

  useEffect(() => {
    GraphService.getRelationshipsForNode(nodeId).then(setEdges);
  }, [nodeId]);

  if (!edges) {
    return (
      <div className="p-6 text-indigo-400 animate-pulse text-sm flex items-center gap-2">
        <Share2 className="h-4 w-4 animate-pulse" /> Discovering Relationships...
      </div>
    );
  }

  return (
    <div className="w-96 border-l border-slate-800 bg-slate-900 h-full overflow-y-auto hide-scrollbar flex flex-col">
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Share2 className="h-4 w-4 text-indigo-400" /> Discovered Relationships
        </h3>
        <p className="text-xs text-slate-500 mt-1">Knowledge graph edges and evidence.</p>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {edges.map((edge) => (
          <div key={edge.edgeId} className="group relative bg-slate-800/40 hover:bg-slate-800/80 transition-colors border border-slate-800/80 rounded-lg p-3">
            
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {edge.relationshipType}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Cpu className="w-3 h-3" /> {edge.discoveryMethod}
              </div>
            </div>

            <div className="text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
              <Link className="w-3 h-3 text-slate-500" />
              Target Node: <span className="font-mono text-slate-400 text-xs">{edge.targetNodeId}</span>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <h5 className="text-[10px] uppercase font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Evidence ({Math.round(edge.confidenceScore * 100)}% Conf)
              </h5>
              <div className="space-y-1">
                {edge.evidence.map(ev => (
                  <p key={ev.evidenceId} className="text-xs text-slate-400 italic">
                    "{ev.evidenceText}"
                  </p>
                ))}
              </div>
            </div>

          </div>
        ))}

        {edges.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No relationships discovered for this node.
          </div>
        )}
      </div>
    </div>
  );
}
