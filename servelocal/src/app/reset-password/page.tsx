"use client";

import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPasswordSchema, type ResetPasswordData } from "@/lib/schemas/auth";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setReady(Boolean(session));
      if (!session) {
        setFormError("root", {
          message: "Reset link expired. Request a new one from the login page.",
        });
      }
    });
  }, [setFormError]);

  async function onSubmit(data: ResetPasswordData) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setFormError("root", { message: error.message });
      return;
    }
    setDone(true);
    await redirectAfterAuth("/auth/after-login");
  }

  if (!isSupabaseConfigured()) {
    return (
      <AuthLayout title="Set new password" subtitle="Supabase is not configured.">
        <p className="text-sm text-red-400">Add Supabase keys to .env.local and restart.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your ServeLocal account.">
      {done ? (
        <p className="text-sm text-green-400">Password updated. Redirecting…</p>
      ) : ready ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="font-label mb-1.5 block text-slate-400">New password</label>
            <Input type="password" autoComplete="new-password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div>
            <label className="font-label mb-1.5 block text-slate-400">Confirm password</label>
            <Input type="password" autoComplete="new-password" {...register("confirm")} />
            {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm.message}</p>}
          </div>
          {errors.root?.message && (
            <p className="text-sm text-red-400" role="alert">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" className="w-full" loading={isSubmitting} pill>
            Update password
          </Button>
        </form>
      ) : (
        <div>
          {errors.root?.message && <p className="text-sm text-red-400">{errors.root.message}</p>}
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
