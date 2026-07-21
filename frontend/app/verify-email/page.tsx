"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Alert } from "../../shared/components/feedback/alert";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length < 6) {
      setError("Verification code must be 6 digits.");
      return;
    }

    setVerified(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  };

  const handleResend = async () => {
    setResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResending(false);
    alert("New verification code sent to your email!");
  };

  return (
    <AuthCardLayout
      title="Verify Email Address"
      subtitle="Enter the 6-digit verification code sent to your email inbox."
      footer={
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Return to Sign In
        </Link>
      }
    >
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {verified && (
        <Alert variant="success">
          Email verified! Initializing vault workspace...
        </Alert>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          label="Verification Code"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center text-lg tracking-widest font-mono"
        />

        <Button type="submit" variant="default" className="w-full">
          Verify & Continue
        </Button>
      </form>

      <div className="pt-2 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          isLoading={resending}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          className="text-xs"
        >
          Resend Verification Code
        </Button>
      </div>
    </AuthCardLayout>
  );
}
