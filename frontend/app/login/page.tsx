"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../features/auth/schemas/auth-schemas";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { SocialAuthButtons } from "../../features/auth/components/social-auth-buttons";
import { Input, PasswordInput } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import { Alert } from "../../shared/components/feedback/alert";

export default function LoginPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setAuthSuccess(false);

    // Simulate mock client auth delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "error@declutr.vault") {
      setAuthError("Invalid zero-knowledge SRP challenge proof. Check your credentials.");
      return;
    }

    setAuthSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <AuthCardLayout
      title="Sign In to Vault"
      subtitle="Enter your credentials to derive your Master Vault Key (MVK)."
      footer={
        <p>
          Don't have a vault account?{" "}
          <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      }
    >
      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          {authError}
        </Alert>
      )}

      {authSuccess && (
        <Alert variant="success">
          Authentication successful! Unwrapping Master Vault Key...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Master Passphrase"
          placeholder="••••••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
            <input
              type="checkbox"
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-3.5 w-3.5"
              {...register("rememberMe")}
            />
            <span>Remember device</span>
          </label>

          <Link href="/forgot-password" className="text-emerald-400 hover:underline">
            Forgot Passphrase?
          </Link>
        </div>

        <Button type="submit" variant="default" className="w-full" isLoading={isSubmitting}>
          Sign In to Vault
        </Button>
      </form>

      <SocialAuthButtons />
    </AuthCardLayout>
  );
}
