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
    <form onSubmit={handleSubmit} className="card mx-auto max-w-lg space-y-4 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Set up your business</h1>
        <p className="mt-1 text-sm text-slate-600">
          This creates your review link, QR code, and default prompts.
        </p>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Business name"
        className="input-field"
        required
      />
      <input
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        placeholder="Business type (barber, restaurant, cleaner)"
        className="input-field"
        required
      />
      <input
        value={googleReviewUrl}
        onChange={(e) => setGoogleReviewUrl(e.target.value)}
        placeholder="Google review link (optional for now)"
        className="input-field"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
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
        placeholder="Email"
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
