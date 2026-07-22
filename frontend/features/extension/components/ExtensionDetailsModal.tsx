"use client";

import React, { useState } from "react";
import { ExtensionItem } from "./MarketplaceBrowserComponent";
import { ShieldCheck, Star, Download, Globe, Code, Check, X } from "lucide-react";

interface ExtensionDetailsModalProps {
  extension: ExtensionItem | null;
  onClose: () => void;
  onInstall: (extId: string, perms: string[]) => void;
}

export function ExtensionDetailsModal({
  extension,
  onClose,
  onInstall,
}: ExtensionDetailsModalProps) {
  const [selectedPerms, setSelectedPerms] = useState<string[]>(extension?.manifest.permissions || []);

  if (!extension) return null;

  const togglePerm = (p: string) => {
    if (selectedPerms.includes(p)) {
      setSelectedPerms(selectedPerms.filter((item) => item !== p));
    } else {
      setSelectedPerms([...selectedPerms, p]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border rounded-xl p-6 w-full max-w-xl space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
            <Code className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{extension.manifest.name}</h2>
              {extension.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              By <span className="font-semibold text-foreground">{extension.manifest.author}</span> • Category:{" "}
              <span className="font-mono text-foreground">{extension.manifest.category}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{extension.manifest.description}</p>

        {/* Requested Permissions */}
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Requested Scope Permissions
          </h4>
          <div className="space-y-1">
            {extension.manifest.permissions.map((p) => (
              <label
                key={p}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary text-xs font-mono cursor-pointer"
              >
                <span>{p}</span>
                <input
                  type="checkbox"
                  checked={selectedPerms.includes(p)}
                  onChange={() => togglePerm(p)}
                  className="rounded text-indigo-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-semibold">
            Cancel
          </button>
          <button
            onClick={() => onInstall(extension.id, selectedPerms)}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" /> Install Extension
          </button>
        </div>
      </div>
    </div>
  );
}
