"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../../features/auth/schemas/auth-schemas";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { PasswordStrengthMeter } from "../../features/auth/components/password-strength-meter";
import { Input, PasswordInput } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import { Alert } from "../../shared/components/feedback/alert";

export default function RegisterPage() {
  const [authSuccess, setAuthSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setAuthSuccess(false);

    // Simulate client key generation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setAuthSuccess(true);
    setTimeout(() => {
      window.location.href = "/verify-email";
    }, 1000);
  };

  return (
    <AuthCardLayout
      title="Create Vault Account"
      subtitle="Your master passphrase never leaves your device."
      footer={
        <p>
          Already have a vault account?{" "}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      }
    >
      {authSuccess && (
        <Alert variant="success">
          Account created! Verification code dispatched.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <PasswordInput
            label="Master Passphrase"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        <PasswordInput
          label="Confirm Master Passphrase"
          placeholder="••••••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-4 w-4 shrink-0"
              {...register("acceptTerms")}
            />
            <span>
              I accept the{" "}
              <a href="#" className="text-emerald-400 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-400 underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-rose-500">{errors.acceptTerms.message}</p>
          )}
        </div>

        <Button type="submit" variant="default" className="w-full" isLoading={isSubmitting}>
          Create Encrypted Vault
        </Button>
      </form>
    </AuthCardLayout>
  );
}
