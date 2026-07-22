"use client";

import * as React from "react";
import Link from "next/link";
import { Sun, Moon, Search, ShieldCheck, FolderKey, LayoutDashboard, MessageSquare, Compass, Bot, Plus, LogIn, UserPlus } from "lucide-react";
import { useTheme } from "../../providers/theme-provider";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function TopNavigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 px-6 backdrop-blur-md sticky top-0 z-50">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Declutr
          </span>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/vault" className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <FolderKey className="h-4 w-4" /> Vault
          </Link>
          <Link href="/search" className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Search className="h-4 w-4" /> Search
          </Link>
          <Link href="/copilot" className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> AI Chat
          </Link>
          <Link href="/lifeos" className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Compass className="h-4 w-4" /> LifeOS
          </Link>
        </nav>
      </div>

      {/* Action Controls & Auth Links */}
      <div className="flex items-center gap-2.5">
        <Link href="/vault">
          <Button variant="default" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Upload Memory
          </Button>
        </Link>
        
        <Link href="/login">
          <Button variant="outline" size="sm" leftIcon={<LogIn className="h-3.5 w-3.5" />}>
            Sign In
          </Button>
        </Link>

        <Button
          variant="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 rounded-lg border border-slate-800"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </Button>

        <Avatar className="h-8 w-8 ml-1">
          <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold">UK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-600 dark:text-slate-500">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-emerald-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
