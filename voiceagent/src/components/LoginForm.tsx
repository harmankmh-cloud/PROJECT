"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SkipToContent } from "@/components/SkipToContent";

export function LoginForm({ initialError = "" }: { initialError?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    const setupRes = await fetch("/api/org/setup", { method: "POST" });
    if (!setupRes.ok) {
      const data = await setupRes.json().catch(() => ({}));
      setError(
        (data as { error?: string }).error ||
          "Account signed in but organization setup failed. Contact support."
      );
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <div className="flex flex-1">
        <AuthMarketingPanel footer="Sign in to your command center" />

        <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo href="/" />
            </div>
            <div className="auth-card">
              <p className="page-eyebrow">Welcome back</p>
              <h1 className="font-display mt-2 text-3xl tracking-tight text-ghost-white">Sign in</h1>
              <p className="mt-2 text-sm text-on-surface-variant">Your dashboard opens next.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Work email
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Password
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-error" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className="mt-3 text-center text-sm">
                <Link href="/forgot-password" className="link-accent">
                  Forgot password?
                </Link>
              </p>
              <p className="mt-6 text-center text-sm text-on-surface-variant">
                No account?{" "}
                <Link href="/signup" className="link-accent">
                  Start free trial
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
      <MarketingFooter />
    </div>
  );
}
