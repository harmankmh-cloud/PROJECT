"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { IndustryPicker } from "@/components/IndustryPicker";

async function createBusiness(
  name: string,
  businessType: string,
  googleReviewUrl: string
) {
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
}

export function SignupWithBusinessForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
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

    if (name.trim().length < 2 || !businessType) {
      setError("Add your business name and pick an industry.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;

      const result = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            pending_business_name: name.trim(),
            pending_business_type: businessType,
            pending_google_url: googleReviewUrl.trim(),
          },
        },
      });

      if (result.error) throw result.error;

      if (result.data.session) {
        await createBusiness(name, businessType, googleReviewUrl);
        router.push("/auth/after-login");
        router.refresh();
        return;
      }

      setInfo(
        "Almost done — check your email and tap Confirm once. You'll go straight to your dashboard (no need to sign in again)."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Your account</p>
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
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-4 border-t border-[#e8e2d9] pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Your business</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mike's Barber Shop"
          className="input-field"
          required
        />
        <div>
          <p className="mb-2 text-sm font-medium text-brand-950">Industry</p>
          <IndustryPicker value={businessType} onChange={setBusinessType} />
        </div>
        <input
          value={googleReviewUrl}
          onChange={(e) => setGoogleReviewUrl(e.target.value)}
          placeholder="Google review link (optional — add later)"
          className="input-field"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {info && <p className="rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">{info}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full py-3">
        {loading ? "Creating your account…" : "Create account & go live"}
      </button>
    </form>
  );
}
