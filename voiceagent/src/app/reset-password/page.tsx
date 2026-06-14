"use client";

import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setReady(Boolean(session));
      if (!session) {
        setFormError("root", {
          message: "Reset link expired. Request a new one from the forgot password page.",
        });
      }
    });
  }, [setFormError]);

  async function onSubmit(data: ResetPasswordFormData) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setFormError("root", { message: error.message });
      return;
    }
    setDone(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  }

  return (
    <AuthLayout panelFooter="Set your new password">
      <div className="auth-card">
        {done ? (
          <p className="text-success font-medium">Password updated. Redirecting…</p>
        ) : ready ? (
          <>
            <h1 className="font-display text-3xl text-text">Set new password</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                error={errors.confirm?.message}
                {...register("confirm")}
              />
              {errors.root?.message && (
                <p className="text-sm text-danger" role="alert">
                  {errors.root.message}
                </p>
              )}
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Update password
              </Button>
            </form>
          </>
        ) : (
          <div>
            {errors.root?.message && (
              <p className="text-sm text-danger">{errors.root.message}</p>
            )}
            <p className="mt-4 text-center text-sm text-muted">
              <Link href="/forgot-password" className="text-primary-glow hover:underline">
                Request a new reset link
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
