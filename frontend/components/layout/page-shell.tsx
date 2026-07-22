"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbProps } from "./top-navigation";
import { Container } from "./layout-primitives";
import { CommandPalette } from "../command-palette/command-palette";
import { ShortcutsModal } from "../command-palette/shortcuts-modal";

export interface PageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbProps["items"];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: PageShellProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <Container size="lg" className="py-6">
      {/* Universal Command Palette Overlay */}
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Keyboard Shortcuts Cheat-Sheet */}
      <ShortcutsModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />

      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>

      <div className="w-full">{children}</div>
    </Container>
  );
}
