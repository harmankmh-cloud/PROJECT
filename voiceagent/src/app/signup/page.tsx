"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { MarketingFooter } from "@/components/MarketingFooter";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

function SignupForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const validPlan =
    planParam === "starter" || planParam === "pro" || planParam === "enterprise"
      ? (planParam as PlanKey)
      : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    const setupRes = await fetch("/api/org/setup", { method: "POST" });
    if (!setupRes.ok) {
      const data = await setupRes.json().catch(() => ({}));
      setError(
        (data as { error?: string }).error ||
          "Account created but organization setup failed. Try signing in again."
      );
      setLoading(false);
      return;
    }

    if (validPlan && validPlan !== "enterprise") {
      window.location.href = `/dashboard/billing?subscribe=${validPlan}`;
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="mesh-bg flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AuthMarketingPanel footer={`Start with ${BRAND.name}`} />

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo href="/" />
            </div>
            <div className="auth-card">
              <p className="page-eyebrow">Get started</p>
              <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-900">Create account</h1>
              <p className="mt-2 text-sm text-slate-500">
                {validPlan
                  ? `We'll set up your org, then continue to ${validPlan} checkout.`
                  : "We'll set up your org and default agent."}
              </p>

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
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  minLength={8}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="btn-gold w-full py-3">
                  {loading ? "Creating…" : "Start free trial"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="link-accent">
                  Sign in
                </Link>
              </p>
              <p className="mt-3 text-center text-xs text-slate-400">
                By signing up you agree to our{" "}
                <Link href="/terms" className="link-accent">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="link-accent">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <MarketingFooter />
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="mesh-bg flex min-h-screen items-center justify-center text-slate-400">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
