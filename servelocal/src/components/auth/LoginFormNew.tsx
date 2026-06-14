"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { friendlyAuthError } from "@/lib/auth-errors";
import { authConfirmUrl } from "@/lib/auth/redirect-origin";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import { loginSchema, type LoginData } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type EmailActionState = "idle" | "sending" | "sent";

function isUnconfirmedEmailError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("email not confirmed") || lower.includes("not confirmed");
}

export function LoginFormNew({
  initialError,
  asRole,
}: {
  initialError?: string | null;
  asRole?: "homeowner" | "pro";
}) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resetState, setResetState] = useState<EmailActionState>("idle");
  const [confirmState, setConfirmState] = useState<EmailActionState>("idle");
  const [selectedRole, setSelectedRole] = useState<"homeowner" | "pro" | null>(asRole ?? null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-red-400">Add Supabase keys to .env.local and restart.</p>;
  }

  async function onSubmit(data: LoginData, roleOverride?: "homeowner" | "pro") {
    const role = roleOverride ?? selectedRole ?? asRole;
    if (!role) {
      setError("Choose homeowner or pro before signing in.");
      return;
    }

    setError(null);
    setPendingEmail(null);
    setConfirmState("idle");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      const message = friendlyAuthError(signInError.message);
      setError(message);
      if (isUnconfirmedEmailError(signInError.message)) {
        setPendingEmail(data.email.trim());
      }
      return;
    }

    await redirectAfterAuth(`/auth/after-login?as=${role}`);
  }

  async function handleForgot() {
    if (resetState !== "idle") return;

    const email = getValues("email")?.trim();
    if (!email) {
      setError("Enter your email first, then tap forgot password.");
      return;
    }

    setError(null);
    setResetState("sending");
    const supabase = createClient();
    const confirmUrl = authConfirmUrl(window.location.origin);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${confirmUrl}?next=/dashboard/settings`,
    });

    if (resetError) {
      setError(friendlyAuthError(resetError.message));
      setResetState("idle");
      return;
    }

    setResetState("sent");
  }

  async function handleResendConfirmation() {
    if (confirmState !== "idle") return;

    const email = (pendingEmail ?? getValues("email"))?.trim();
    if (!email) {
      setError("Enter your email, then request a confirmation link.");
      return;
    }

    setError(null);
    setConfirmState("sending");
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: authConfirmUrl(window.location.origin),
      },
    });

    if (resendError) {
      setError(friendlyAuthError(resendError.message));
      setConfirmState("idle");
      return;
    }

    setPendingEmail(email);
    setConfirmState("sent");
  }

  const showResendConfirmation =
    pendingEmail !== null ||
    initialError?.includes("confirmation") ||
    initialError?.includes("verification") ||
    initialError?.includes("already used") ||
    initialError?.includes("expired");

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      {!asRole ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole("homeowner")}
            className={`rounded-xl border px-3 py-3 text-left text-sm ${
              selectedRole === "homeowner"
                ? "border-primary bg-primary/10 text-slate-50"
                : "border-slate-700 text-slate-400"
            }`}
          >
            <span className="block font-semibold text-slate-50">Homeowner</span>
            <span className="mt-1 block text-xs">Post jobs &amp; track quotes</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("pro")}
            className={`rounded-xl border px-3 py-3 text-left text-sm ${
              selectedRole === "pro"
                ? "border-primary bg-primary/10 text-slate-50"
                : "border-slate-700 text-slate-400"
            }`}
          >
            <span className="block font-semibold text-slate-50">Pro</span>
            <span className="mt-1 block text-xs">Contractor dashboard</span>
          </button>
        </div>
      ) : null}
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
      {resetState === "sent" && (
        <p className="text-sm text-green-400">Password reset email sent — check your inbox once.</p>
      )}
      {confirmState === "sent" && (
        <p className="text-sm text-green-400">Confirmation email sent — check your inbox once.</p>
      )}
      <Button type="submit" className="w-full" loading={isSubmitting} pill>
        {selectedRole === "pro" || asRole === "pro" ? "Sign in as pro" : selectedRole === "homeowner" || asRole === "homeowner" ? "Sign in as homeowner" : "Sign in"}
      </Button>
      <button
        type="button"
        onClick={handleForgot}
        disabled={resetState === "sending" || resetState === "sent"}
        className="w-full text-center text-xs text-slate-500 hover:text-primary disabled:opacity-60"
      >
        {resetState === "sent" ? "Reset email sent" : resetState === "sending" ? "Sending…" : "Forgot password?"}
      </button>
      {showResendConfirmation && (
        <button
          type="button"
          onClick={handleResendConfirmation}
          disabled={confirmState === "sending" || confirmState === "sent"}
          className="w-full text-center text-xs text-slate-500 hover:text-primary disabled:opacity-60"
        >
          {confirmState === "sent"
            ? "Confirmation sent"
            : confirmState === "sending"
              ? "Sending…"
              : "Resend confirmation email"}
        </button>
      )}
      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
