"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { INDUSTRY_OPTIONS } from "@/lib/defaults";

export function SetupBusinessForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessType: businessType || "local business",
          googleReviewUrl,
          tone,
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
    <div className="mx-auto max-w-xl">
      <div className="surface-card overflow-hidden">
        <div className="border-b border-[#e8e2d9] bg-brand-950 px-8 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Step {step} of 3
          </p>
          <h1 className="font-display mt-2 text-2xl">Launch your review page</h1>
          <p className="mt-1 text-sm text-white/60">
            Takes about 2 minutes. You can change everything later.
          </p>
          <div className="mt-4 flex gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${n <= step ? "bg-gold-500" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-brand-950">Business name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mike's Car Wash"
                  className="input-field"
                  autoFocus
                />
              </label>
              <button
                type="button"
                disabled={name.trim().length < 2}
                onClick={() => setStep(2)}
                className="btn-gold w-full py-3"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm font-semibold text-brand-950">What type of business?</p>
              <div className="grid grid-cols-2 gap-3">
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
                    <span className="text-xl">{industry.emoji}</span>
                    <p className="mt-1 text-sm font-medium text-brand-950">{industry.label}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1 py-3">
                  Back
                </button>
                <button
                  type="button"
                  disabled={!businessType}
                  onClick={() => setStep(3)}
                  className="btn-gold flex-1 py-3"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-brand-950">Review writing tone</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="input-field"
                >
                  <option value="friendly">Friendly & warm</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual & fun</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-brand-950">
                  Google review link <span className="font-normal text-stone-400">(optional)</span>
                </span>
                <input
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/..."
                  className="input-field"
                />
                <p className="text-xs text-stone-500">
                  Find this in Google Business Profile → Ask for reviews
                </p>
              </label>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1 py-3">
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="btn-gold flex-1 py-3"
                >
                  {loading ? "Creating…" : "Launch review page"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

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
          setError(
            "Account created. Check your email to confirm, then log in. Or turn off Confirm email in Supabase → Authentication → Email."
          );
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
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full py-3">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
