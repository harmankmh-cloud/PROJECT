"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

export default function SignupPage() {
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
    await fetch("/api/org/setup", { method: "POST" });
    window.location.href = "/dashboard";
  }

  return (
    <main className="mesh-bg flex min-h-screen">
      <AuthMarketingPanel footer={`Start with ${BRAND.name}`} />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="auth-card">
            <p className="page-eyebrow">Get started</p>
            <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-900">Create account</h1>
            <p className="mt-2 text-sm text-slate-500">We&apos;ll set up your org and default agent.</p>

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
          </div>
        </div>
      </div>
    </main>
  );
}
