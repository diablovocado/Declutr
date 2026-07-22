"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbProps } from "./top-navigation";
import { Container } from "./layout-primitives";
import { CommandPalette } from "../command-palette/command-palette";
import { ShortcutsModal } from "../command-palette/shortcuts-modal";
import { WorkspaceContextProvider } from "../../shared/providers/workspace-context-provider";
import { ContextBar } from "./context-bar";
import { SmartSidebar } from "./smart-sidebar";
import { ContextSwitcherModal } from "./context-switcher-modal";

export interface PageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbProps["items"];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

function InnerPageShell({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: PageShellProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setSwitcherOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Universal Command Palette */}
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Shortcuts Cheat-Sheet */}
      <ShortcutsModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />

      {/* Context Switcher Dialog */}
      <ContextSwitcherModal
        open={switcherOpen}
        onOpenChange={setSwitcherOpen}
      />

      {/* Persistent Context Bar */}
      <ContextBar onOpenSwitcher={() => setSwitcherOpen(true)} />

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full">
        <Container size="lg" className="py-6 flex-1">
          {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>

          <div className="w-full">{children}</div>
        </Container>

        {/* Adaptive Smart Sidebar */}
        <SmartSidebar />
      </div>
    </div>
  );
}

export function PageShell(props: PageShellProps) {
  return (
    <WorkspaceContextProvider>
      <InnerPageShell {...props} />
    </WorkspaceContextProvider>
  );
}
