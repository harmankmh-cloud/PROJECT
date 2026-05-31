"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/lib/types";
import { BRAND } from "@/lib/brand";
import { INDUSTRY_OPTIONS } from "@/lib/defaults";

export function BusinessSettingsForm({
  business,
  simple = true,
}: {
  business: Business;
  simple?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(business.name);
  const [businessType, setBusinessType] = useState(business.business_type);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business.google_review_url || "");
  const [tone, setTone] = useState(business.tone || "friendly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          businessType: businessType.trim(),
          googleReviewUrl: googleReviewUrl.trim(),
          tone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setMessage("Saved — your review link stays the same (QR codes keep working).");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-white px-6 py-4">
        <h1 className="font-display text-lg text-brand-950">My business</h1>
        <p className="mt-0.5 text-sm text-stone-500">Name, industry, and Google link — that&apos;s all you need</p>
      </div>
      <div className="space-y-4 p-6">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-brand-950">Business name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
        </label>

        <div>
          <span className="text-sm font-semibold text-brand-950">Industry</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {INDUSTRY_OPTIONS.map((industry) => (
              <button
                key={industry.id}
                type="button"
                onClick={() => setBusinessType(industry.label)}
                className={`rounded-xl border p-2.5 text-left transition ${
                  businessType === industry.label
                    ? "border-gold-500 bg-amber-50 ring-2 ring-gold-500/30"
                    : "border-[#e8e2d9] bg-cream hover:border-gold-500/40"
                }`}
              >
                <span className="text-base">{industry.emoji}</span>
                <p className="mt-0.5 text-xs font-medium text-brand-950">{industry.label}</p>
              </button>
            ))}
          </div>
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-brand-950">Google review link</span>
          <input
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
            placeholder="https://g.page/r/..."
            className="input-field"
          />
          <span className="block text-xs leading-relaxed text-stone-500">
            Paste your Google &quot;Write a review&quot; link — not your {BRAND.name} link. Customers
            scan your QR ({BRAND.name} page), then open Google after they copy a draft.
          </span>
        </label>

        <div className="rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-stone-600">
          <p className="font-semibold text-brand-950">Two links — don&apos;t mix them up</p>
          <p className="mt-1">
            <strong>QR / review page</strong> (auto):{" "}
            <span className="font-medium">/r/{business.slug}</span> — put this on posters & texts.
          </p>
          <p className="mt-1">
            <strong>Google link</strong> (above): where happy customers post on Google Maps.
          </p>
        </div>

        {!simple && (
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">AI writing tone</span>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field">
              <option value="friendly">Friendly & warm</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual & fun</option>
            </select>
          </label>
        )}

        <p className="text-xs text-stone-500">
          Review page: <span className="font-medium">/r/{business.slug}</span>
        </p>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}

        <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
          {loading ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
