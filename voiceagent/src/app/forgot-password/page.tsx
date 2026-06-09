"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlowButton } from "@/components/ui/GlowButton";
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
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-text">Check your email</h2>
            <p className="text-sm text-success">
              We sent a password reset link. It may take a few minutes to arrive — check spam if you
              don&apos;t see it.
            </p>
            <GlowButton type="button" variant="outline" className="w-full" onClick={() => setSent(false)}>
              Send another link
            </GlowButton>
          </div>
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
            <GlowButton type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </GlowButton>
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
