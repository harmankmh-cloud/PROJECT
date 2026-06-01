"use client";

import { useMemo, useState } from "react";
import { TRADE_CITIES, isValidCitySlug } from "@/lib/constants";
import {
  formatSubmitError,
  isValidPhone,
  normalizePhone,
  resolveCategories,
} from "@/lib/form-utils";
import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { MatchProsPanel } from "@/components/MatchProsPanel";
import { ServiceCategoryPicker } from "@/components/ServiceCategoryPicker";

export function ServiceRequestForm({
  categories,
  defaultCity,
  defaultCategory,
  defaultName = "",
  defaultEmail = "",
}: {
  categories: ServiceCategory[];
  defaultCity?: string;
  defaultCategory?: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const safeCategories = useMemo(() => resolveCategories(categories), [categories]);
  const initialCity = isValidCitySlug(defaultCity) ? defaultCity : TRADE_CITIES[0].slug;
  const initialCategory =
    safeCategories.find((c) => c.slug === defaultCategory)?.slug || safeCategories[0]?.slug || "";

  const [categorySlugRaw, setCategorySlug] = useState(initialCategory);
  const categorySlug = useMemo(() => {
    if (categorySlugRaw && safeCategories.some((c) => c.slug === categorySlugRaw)) {
      return categorySlugRaw;
    }
    return safeCategories[0]?.slug || "";
  }, [categorySlugRaw, safeCategories]);
  const [citySlug, setCitySlug] = useState<string>(initialCity);
  const [customerName, setCustomerName] = useState(defaultName);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState(defaultEmail);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<ServiceProvider[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!categorySlug) {
      setError("Please pick a service type above.");
      return;
    }

    if (!isValidPhone(customerPhone)) {
      setError("Enter a valid 10-digit phone number (e.g. 604-555-1234).");
      return;
    }

    if (description.trim().length < 10) {
      setError("Describe your job in at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug,
          citySlug,
          customerName: customerName.trim(),
          customerPhone: normalizePhone(customerPhone),
          customerEmail: customerEmail.trim(),
          description: description.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submit failed");
      setMatches(data.matches || []);
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Submit failed"));
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
    <form onSubmit={handleSubmit} className="surface-card space-y-5 p-6 sm:p-8">
      <ServiceCategoryPicker
        categories={safeCategories}
        value={categorySlug}
        onChange={setCategorySlug}
      />

      <label className="block space-y-2 text-sm">
        <span className="font-semibold">City</span>
        <select
          value={citySlug}
          onChange={(e) => setCitySlug(e.target.value)}
          className="input-field select-field"
          required
        >
          {TRADE_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your name</span>
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your phone</span>
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="input-field"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="604-555-1234"
        />
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
      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="status">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading || !categorySlug} className="btn-dark w-full py-3.5 disabled:opacity-60">
        {loading ? "Finding pros…" : "Get matching pros"}
      </button>
    </form>
  );
}
