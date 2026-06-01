"use client";

import { useState } from "react";
import { TRADE_CITIES, isValidCitySlug } from "@/lib/constants";
import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { MatchProsPanel } from "@/components/MatchProsPanel";

export function ServiceRequestForm({
  categories,
  defaultCity,
  defaultCategory,
}: {
  categories: ServiceCategory[];
  defaultCity?: string;
  defaultCategory?: string;
}) {
  const initialCity = isValidCitySlug(defaultCity) ? defaultCity : TRADE_CITIES[0].slug;
  const initialCategory =
    categories.find((c) => c.slug === defaultCategory)?.slug || categories[0]?.slug || "";

  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [citySlug, setCitySlug] = useState<string>(initialCity);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<ServiceProvider[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/requests", {
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
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  if (matches !== null) {
    return (
      <div>
        <div className="surface-card p-8 text-center">
          <p className="text-3xl">✓</p>
          <h2 className="font-display mt-3 text-xl text-brand-950">Request posted</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your job is saved. Call matching pros below — no middleman, no lead fee.
          </p>
        </div>
        <MatchProsPanel providers={matches} city={citySlug} category={categorySlug} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6 sm:p-8">
      <p className="text-sm text-slate-600">Describe what you need — we&apos;ll show matching local pros you can call right away.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Service needed</span>
          <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="input-field">
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">City</span>
          <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="input-field">
            {TRADE_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
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
        {loading ? "Finding pros…" : "Get matching pros"}
      </button>
    </form>
  );
}
