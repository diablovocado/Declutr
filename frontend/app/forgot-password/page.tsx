"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../../features/auth/schemas/auth-schemas";
import { AuthCardLayout } from "../../features/auth/components/auth-card-layout";
import { Input } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import { Alert } from "../../shared/components/feedback/alert";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <AuthCardLayout
      title="Reset Vault Passphrase"
      subtitle="Enter your email to receive a passphrase recovery instructions token."
      footer={
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Return to Sign In
        </Link>
      }
    >
      {submitted ? (
        <div className="space-y-4 text-center">
          <Alert variant="success" title="Recovery Link Dispatched">
            If an account exists for that email, recovery instructions have been sent.
          </Alert>
          <Link href="/magic-link-waiting">
            <Button variant="outline" className="w-full">
              View Waiting Screen
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button type="submit" variant="default" className="w-full" isLoading={isSubmitting}>
            Send Passphrase Recovery Email
          </Button>
        </form>
      )}
    </AuthCardLayout>
  );
}
