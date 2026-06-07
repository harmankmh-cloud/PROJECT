"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
    await fetch("/api/org/setup", { method: "POST" });
    window.location.href = "/dashboard";
  }

  return (
    <main className="mesh-bg flex min-h-screen">
      <AuthMarketingPanel footer="Sign in to your command center" />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="auth-card">
            <p className="page-eyebrow">Welcome back</p>
            <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Your dashboard opens next.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-3 text-center text-sm">
              <Link href="/forgot-password" className="link-accent">
                Forgot password?
              </Link>
            </p>
            <p className="mt-6 text-center text-sm text-slate-500">
              No account?{" "}
              <Link href="/signup" className="link-accent">
                Start free trial
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-slate-400">
              <a href="/api/auth/sso" className="hover:text-violet-600 hover:underline">
                Enterprise SSO
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mesh-bg flex min-h-screen items-center justify-center text-slate-400">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
