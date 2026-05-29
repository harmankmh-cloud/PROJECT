"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SetupBusinessForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("car wash");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, businessType, googleReviewUrl }),
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Set up your business</h1>
      <p className="text-sm text-zinc-600">This creates your review link and default prompts.</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Business name"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
        required
      />
      <input
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        placeholder="Business type (barber, restaurant, cleaner)"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
        required
      />
      <input
        value={googleReviewUrl}
        onChange={(e) => setGoogleReviewUrl(e.target.value)}
        placeholder="Google review link (optional for now)"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
      >
        {loading ? "Creating..." : "Create my review page"}
      </button>
    </form>
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

    try {
      const supabase = createClient();
      const result =
        mode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

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
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {mode === "signup" ? "Create account" : "Log in"}
      </h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
      >
        {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
      </button>
    </form>
  );
}
