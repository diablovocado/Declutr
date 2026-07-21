"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { Button } from "../../shared/components/ui/button";

export default function AuthErrorPage() {
  return (
    <AuthCardLayout
      title="Authentication Error"
      subtitle="We encountered an issue verifying your zero-knowledge security session."
      footer={
        <Link href="/welcome" className="text-emerald-400 font-semibold hover:underline">
          Return to Welcome Onboarding
        </Link>
      }
    >
      <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-rose-200">SRP Proof Verification Failed</h3>
          <p className="text-xs text-rose-300/70 max-w-xs leading-relaxed">
            The SRP-6a challenge token was invalid or expired (5 minute threshold). Please try signing in again.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full pt-2">
          <Link href="/login">
            <Button variant="danger" className="w-full" leftIcon={<RefreshCw className="h-4 w-4" />}>
              Try Sign In Again
            </Button>
          </Link>
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full">
              Reset Passphrase
            </Button>
          </Link>
        </div>
      </div>
    </AuthCardLayout>
  );
}
