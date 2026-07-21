import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Card } from "../../../shared/components/ui/card";

export interface AuthCardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCardLayout({ title, subtitle, children, footer }: AuthCardLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/welcome" className="flex items-center gap-2 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Shield className="h-6 w-6" />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-white">Declutr</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400 max-w-xs">{subtitle}</p>}
        </div>

        {/* Form Card */}
        <Card className="glass-panel p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
          {children}
        </Card>

        {/* Footer Links */}
        {footer && <div className="text-center text-xs text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
