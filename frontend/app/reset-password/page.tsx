"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "../../features/auth/schemas/auth-schemas";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { PasswordStrengthMeter } from "../../features/auth/components/password-strength-meter";
import { PasswordInput } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import { Alert } from "../../shared/components/feedback/alert";

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: ResetPasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <AuthCardLayout
      title="Set New Master Passphrase"
      subtitle="Your new passphrase will derive a replacement Master Vault Key (MVK)."
      footer={
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Return to Sign In
        </Link>
      }
    >
      {success ? (
        <Alert variant="success" title="Passphrase Reset Successful">
          Your master passphrase has been updated. Redirecting to login...
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <PasswordInput
              label="New Master Passphrase"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrengthMeter password={passwordValue} />
          </div>

          <PasswordInput
            label="Confirm New Passphrase"
            placeholder="••••••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" variant="default" className="w-full" isLoading={isSubmitting}>
            Update Master Passphrase
          </Button>
        </form>
      )}
    </AuthCardLayout>
  );
}
