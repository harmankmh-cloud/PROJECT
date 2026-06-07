"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    await fetch("/api/org/setup", { method: "POST" });
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-brand-900">Start with {BRAND.name}</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" minLength={8} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating…" : "Create account"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-teal-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
