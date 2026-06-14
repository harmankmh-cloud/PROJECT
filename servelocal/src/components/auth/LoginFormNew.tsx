"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import { loginSchema, type LoginData } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

import type { UserRole } from "@/lib/user-profiles";

export function LoginFormNew({
  initialError,
  intent,
}: {
  initialError?: string | null;
  intent?: UserRole;
}) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [resetSent, setResetSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-red-400">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: LoginData) {
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const afterLogin = intent
      ? `/auth/after-login?intent=${intent}`
      : "/auth/after-login";
    await redirectAfterAuth(afterLogin);
  }

  async function handleForgot() {
    const email = getValues("email");
    if (!email) {
      setError("Enter your email first, then tap forgot password.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard/settings`,
    });
    setResetSent(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Email</label>
        <Input type="email" {...register("email")} autoComplete="email" />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="font-label mb-1.5 block text-slate-400">Password</label>
        <Input type="password" {...register("password")} autoComplete="current-password" />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {resetSent && <p className="text-sm text-green-400">Password reset email sent.</p>}
      <Button type="submit" className="w-full" loading={isSubmitting} pill>
        Sign in
      </Button>
      <button type="button" onClick={handleForgot} className="w-full text-center text-xs text-slate-500 hover:text-primary">
        Forgot password?
      </button>
      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link
          href={intent === "pro" ? "/signup/pro" : intent === "homeowner" ? "/signup/homeowner" : "/signup"}
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
