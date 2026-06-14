"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AUTH } from "@/content/copy";
import { friendlyAuthError } from "@/lib/auth-errors";
import { loginSchema, type LoginData } from "@/lib/schemas/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function LoginFormNew({ message = "" }: { message?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-danger">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: LoginData) {
    setError("");
    setInfo("");
    try {
      const supabase = createClient();
      const result = await supabase.auth.signInWithPassword(data);
      if (result.error) throw result.error;
      router.push("/auth/after-login");
      router.refresh();
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Sign in failed"));
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
  }

  async function handleForgot() {
    const email = form.getValues("email");
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    });
    if (resetError) setError(friendlyAuthError(resetError.message));
    else setInfo("Password reset email sent.");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {message && <p className="alert-warning">{message}</p>}
      <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
      <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register("password")} />
      <button type="button" onClick={handleForgot} className="text-sm font-medium text-primary hover:underline">
        {AUTH.forgot}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
      {info && <p className="alert-success">{info}</p>}
      <Button type="submit" className="w-full" pill loading={form.formState.isSubmitting}>
        Sign in
      </Button>
      {GOOGLE_ENABLED && (
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
          {AUTH.google}
        </Button>
      )}
      <p className="text-center text-sm text-muted">
        {AUTH.noAccount}{" "}
        <Link href="/signup" className="link-accent">
          Create account
        </Link>
      </p>
    </form>
  );
}
