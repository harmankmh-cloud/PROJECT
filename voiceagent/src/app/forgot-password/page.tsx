"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/brand";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [sent, setSent] = useState(false);

  async function onSubmit(data: ForgotPasswordFormData) {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
    if (error) {
      setFormError("root", { message: error.message });
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout panelFooter={`Reset your ${BRAND.name} password`}>
      <div className="auth-card">
        <h1 className="font-display text-3xl text-text">Reset password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your account email and we&apos;ll send a reset link.
        </p>

        {sent ? (
          <p className="mt-6 text-sm text-success">Check your email for a password reset link.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            {errors.root?.message && (
              <p className="text-sm text-danger" role="alert">
                {errors.root.message}
              </p>
            )}
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="text-primary-glow hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
