"use client";

import { useState } from "react";
import { formatSubmitError } from "@/lib/form-utils";

export function NewsletterSignup({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not subscribe");
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  if (done && compact) {
    return <p className="text-sm text-teal-600">Subscribed — thanks!</p>;
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
        <p className="font-semibold text-brand-950">You&apos;re on the list</p>
        <p className="mt-1 text-sm text-slate-600">BC trades tips and new pro alerts — no spam.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex gap-2" : "space-y-3"}>
      {!compact && (
        <p className="text-sm font-semibold text-brand-950">Get BC trades tips in your inbox</p>
      )}
      <div className={compact ? "flex flex-1 gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="input-field flex-1"
          required
          aria-label="Email for newsletter"
        />
        <button type="submit" disabled={loading} className="btn-gold shrink-0 px-5 py-2.5 disabled:opacity-60">
          {loading ? "…" : "Subscribe"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  );
}
