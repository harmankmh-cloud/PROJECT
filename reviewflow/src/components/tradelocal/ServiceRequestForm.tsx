"use client";

import { useState } from "react";
import { TRADE_CITIES } from "@/lib/tradelocal/constants";
import type { ServiceCategory } from "@/lib/tradelocal/types";

export function ServiceRequestForm({
  categories,
  defaultCity,
  defaultCategory,
}: {
  categories: ServiceCategory[];
  defaultCity?: string;
  defaultCategory?: string;
}) {
  const [categorySlug, setCategorySlug] = useState(defaultCategory || categories[0]?.slug || "");
  const [citySlug, setCitySlug] = useState<string>(defaultCity || TRADE_CITIES[0].slug);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trade/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug,
          citySlug,
          customerName,
          customerPhone,
          customerEmail,
          description,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submit failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-3xl">✓</p>
        <h2 className="font-display mt-3 text-xl text-brand-950">Request posted</h2>
        <p className="mt-2 text-sm text-slate-600">
          Browse local pros below and call them directly — or wait for callbacks if you shared your number.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6 sm:p-8">
      <p className="text-sm text-slate-600">Describe what you need. We don&apos;t do the work — we help you find locals to call.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Service needed</span>
          <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="input-field">
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">City</span>
          <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="input-field">
            {TRADE_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your name</span>
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your phone</span>
        <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Email (optional)</span>
        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="input-field" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">What do you need done?</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-28 resize-y"
          required
          minLength={10}
          placeholder="e.g. Leaking kitchen sink, need plumber this week in Surrey…"
        />
      </label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 disabled:opacity-60">
        {loading ? "Posting…" : "Post request"}
      </button>
    </form>
  );
}
