"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

export function SignupForm({
  initialPlan = null,
}: {
  initialPlan?: PlanKey | null;
}) {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: businessName.trim() ? { business_name: businessName.trim() } : undefined,
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    const setupRes = await fetch("/api/org/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: businessName.trim() || undefined }),
    });
    if (!setupRes.ok) {
      const data = await setupRes.json().catch(() => ({}));
      setError(
        (data as { error?: string }).error ||
          "Account created but organization setup failed. Try signing in again."
      );
      setLoading(false);
      return;
    }

    if (initialPlan && initialPlan !== "enterprise") {
      window.location.href = `/dashboard/billing?subscribe=${initialPlan}`;
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <div className="flex flex-1">
        <AuthMarketingPanel footer={`Start with ${BRAND.name}`} />

        <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <BrandLogo href="/" />
            </div>
            <div className="auth-card">
              <p className="page-eyebrow">Get started</p>
              <h1 className="font-display mt-2 text-3xl tracking-tight text-ghost-white">Create account</h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                {initialPlan
                  ? `We'll set up your org, then continue to ${initialPlan} checkout.`
                  : "We'll set up your org and default agent."}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                <div>
                  <label htmlFor="signup-business" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Business name
                  </label>
                  <input
                    id="signup-business"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your business or clinic name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Work email
                  </label>
                  <input
                    id="signup-email"
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
                  <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    minLength={8}
                    required
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="link-accent">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="link-accent">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {error && (
                  <p className="text-sm text-error" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-gold w-full py-3">
                  {loading ? "Creating…" : "Start free trial"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link href="/login" className="link-accent">
                  Sign in
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
