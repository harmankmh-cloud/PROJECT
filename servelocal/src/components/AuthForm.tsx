"use client";

import { useState } from "react";
import { TermsConsent } from "@/components/TermsConsent";
import { friendlyAuthError } from "@/lib/auth-errors";
import { authConfirmUrl } from "@/lib/auth/redirect-origin";
import { redirectAfterAuth } from "@/lib/auth/client-redirect";
import {
  SIGNUP_ALREADY_REGISTERED_MESSAGE,
  SIGNUP_CONFIRM_EMAIL_MESSAGE,
  signUpAccount,
} from "@/lib/auth/signup-client";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-rose-600">
        App not configured. Add Supabase keys to <code className="text-xs">.env.local</code> and restart.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (completed) return;
    setLoading(true);
    setError("");
    setInfo("");

    if (mode === "signup" && !termsAccepted) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const result = await signUpAccount(supabase, {
          email: email.trim(),
          password,
          metadata: {},
          fallbackOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
        });

        if (result.status === "error") {
          throw new Error(result.message);
        }

        if (result.status === "already_registered") {
          setCompleted(true);
          setInfo(SIGNUP_ALREADY_REGISTERED_MESSAGE);
          return;
        }

        if (result.status === "confirm_email") {
          setCompleted(true);
          setInfo(SIGNUP_CONFIRM_EMAIL_MESSAGE);
          return;
        }

        await redirectAfterAuth("/auth/after-login");
        return;
      }

      const result = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (result.error) throw result.error;

      await redirectAfterAuth("/auth/after-login");
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Authentication failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email first, then tap Forgot password.");
      return;
    }
    setError("");
    setInfo("");
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${authConfirmUrl(window.location.origin)}?next=/dashboard`,
      });
      if (resetError) throw resetError;
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Could not send reset email."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="auth-email" className="block space-y-1.5">
        <span className="text-sm font-semibold text-brand-950">Email</span>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="input-field"
          required
          autoComplete="email"
        />
      </label>
      <label htmlFor="auth-password" className="block space-y-1.5">
        <span className="text-sm font-semibold text-brand-950">Password</span>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
          className="input-field"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {mode === "signup" && (
        <TermsConsent checked={termsAccepted} onChange={setTermsAccepted} />
      )}
      {mode === "login" && (
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm font-medium text-teal-600 hover:underline"
        >
          Forgot password?
        </button>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {info && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {info}
        </p>
      )}
      <button type="submit" disabled={loading || completed} className="btn-gold w-full py-3.5 disabled:opacity-60">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
