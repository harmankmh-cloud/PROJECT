"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { INDUSTRY_OPTIONS } from "@/lib/defaults";

export function SetupBusinessForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isSupabaseConfigured()) {
    return (
      <div className="surface-card mx-auto max-w-lg p-8 text-center">
        <p className="font-semibold text-brand-950">Setup incomplete</p>
        <p className="mt-2 text-sm text-stone-600">
          Add your Supabase keys to <code className="text-xs">.env.local</code> then restart the app.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !businessType) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          businessType,
          googleReviewUrl: googleReviewUrl.trim(),
          tone: "friendly",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Setup failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit} className="surface-card overflow-hidden">
        <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-6 text-white">
          <h1 className="font-display text-2xl">Set up in one minute</h1>
          <p className="mt-1 text-sm text-white/60">Name → industry → Google link. That&apos;s it.</p>
        </div>

        <div className="space-y-5 p-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-950">1. Business name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mike's Car Wash"
              className="input-field"
              required
              autoFocus
            />
          </label>

          <div>
            <span className="text-sm font-semibold text-brand-950">2. Pick your industry</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {INDUSTRY_OPTIONS.map((industry) => (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => setBusinessType(industry.label)}
                  className={`rounded-xl border p-3 text-left transition ${
                    businessType === industry.label
                      ? "border-gold-500 bg-amber-50 ring-2 ring-gold-500/30"
                      : "border-[#e8e2d9] bg-cream hover:border-gold-500/40"
                  }`}
                >
                  <span className="text-lg">{industry.emoji}</span>
                  <p className="mt-0.5 text-xs font-medium text-brand-950">{industry.label}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-950">
              3. Google review link{" "}
              <span className="font-normal text-stone-400">(paste now or add later)</span>
            </span>
            <input
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              placeholder="https://g.page/r/..."
              className="input-field"
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || name.trim().length < 2 || !businessType}
            className="btn-gold w-full py-3.5 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Go live — create my review page"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-rose-600">
        App not configured. Add Supabase keys to .env.local and restart.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const result = await supabase.auth.signUp({ email, password });
        if (result.error) throw result.error;

        if (!result.data.session) {
          setInfo("Account created. Check your email to confirm, then sign in.");
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
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
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourbusiness.com"
        className="input-field"
        required
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (6+ characters)"
        className="input-field"
        required
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />
      {mode === "login" && (
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm font-medium text-gold-600 hover:underline"
        >
          Forgot password?
        </button>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {info && <p className="text-sm text-emerald-700">{info}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full py-3">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
