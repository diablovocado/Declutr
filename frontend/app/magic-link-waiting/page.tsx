"use client";

import React from "react";
import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { Spinner } from "../../shared/components/feedback/spinner";
import { Button } from "../../shared/components/ui/button";

export default function MagicLinkWaitingPage() {
  return (
    <AuthCardLayout
      title="Check Your Email"
      subtitle="We sent a secure magic link to your email address."
      footer={
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Return to Sign In
        </Link>
      }
    >
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Mail className="h-8 w-8 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Waiting for authentication...</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Click the verification link in your email to automatically unwrap your Master Vault Key.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-mono">
          <Spinner size="sm" />
          <span>Polling authentication status...</span>
        </div>

        <div className="pt-4 w-full">
          <Link href="/login" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Use Password Login Instead
            </Button>
          </Link>
        </div>
      </div>
    </AuthCardLayout>
  );
}
