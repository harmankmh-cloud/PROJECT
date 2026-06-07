"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cityName, LISTING_PLANS } from "@/lib/constants";
import type { ProviderReview, ServiceProvider, ServiceRequest, SiteSuggestion } from "@/lib/types";
import { StarRating } from "@/components/StarRating";

export function AdminTradePanel({
  providers,
  requests,
  reviews,
  suggestions,
}: {
  providers: ServiceProvider[];
  requests: ServiceRequest[];
  reviews: ProviderReview[];
  suggestions: SiteSuggestion[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateProvider(id: string, patch: Record<string, unknown>) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function updateReview(id: string, status: "approved" | "rejected") {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Review update failed");
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function updateSuggestion(id: string, status: "read" | "done") {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Suggestion update failed");
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  const pending = providers.filter((p) => p.status === "pending");
  const newSuggestions = suggestions.filter((s) => s.status === "new");

  return (
    <div className="space-y-8">
      {newSuggestions.length > 0 && (
        <div className="surface-card overflow-hidden">
          <div className="review-header">
            <h2 className="font-display text-lg font-semibold text-zinc-900">
              Site suggestions ({newSuggestions.length})
            </h2>
          </div>
          <ul className="divide-y divide-zinc-100">
            {newSuggestions.map((s) => (
              <li key={s.id} className="px-6 py-4">
                <p className="text-sm leading-relaxed text-zinc-700">{s.message}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {s.email && `${s.email} · `}
                  {s.page_url && `${s.page_url} · `}
                  {new Date(s.created_at).toLocaleString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={loadingId === s.id}
                    onClick={() => updateSuggestion(s.id, "read")}
                    className="btn-ghost px-3 py-1.5 text-xs"
                  >
                    Mark read
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === s.id}
                    onClick={() => updateSuggestion(s.id, "done")}
                    className="btn-teal px-3 py-1.5 text-xs"
                  >
                    Done
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pending.length > 0 && (
        <div id="pending-listings" className="surface-card overflow-hidden scroll-mt-24">
          <div className="review-header">
            <h2 className="font-display text-lg">Pending listings ({pending.length})</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {pending.map((p) => (
              <li key={p.id} className="space-y-3 px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-brand-950">{p.display_name}</p>
                    <p className="text-sm text-slate-500">
                      {p.category_slug} · {cityName(p.city_slug)} · {p.phone}
                    </p>
                    {p.requested_plan && p.requested_plan !== "free" && (
                      <p className="mt-1 text-xs font-bold uppercase text-teal-600">
                        Wants {LISTING_PLANS.find((plan) => plan.id === p.requested_plan)?.name || p.requested_plan}
                      </p>
                    )}
                    {p.bio && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.bio}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={loadingId === p.id}
                      onClick={() => updateProvider(p.id, { status: "approved" })}
                      className="btn-gold px-4 py-2 text-sm disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === p.id}
                      onClick={() => updateProvider(p.id, { status: "rejected" })}
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="surface-card overflow-hidden">
          <div className="review-header">
            <h2 className="font-display text-lg">Pending reviews ({reviews.length})</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <li key={r.id} className="px-6 py-4">
                <StarRating rating={r.rating} />
                <p className="mt-2 font-semibold text-brand-950">{r.reviewer_name}{r.title ? ` — ${r.title}` : ""}</p>
                <p className="mt-1 text-sm text-slate-600">{r.body}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={loadingId === r.id} onClick={() => updateReview(r.id, "approved")} className="btn-gold px-3 py-1.5 text-xs">
                    Approve
                  </button>
                  <button type="button" disabled={loadingId === r.id} onClick={() => updateReview(r.id, "rejected")} className="btn-ghost px-3 py-1.5 text-xs">
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="listings" className="surface-card overflow-hidden scroll-mt-24">
        <div className="border-b border-slate-200/80 px-6 py-4">
          <h2 className="font-display text-lg">Approved pros</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {providers
            .filter((p) => p.status === "approved")
            .map((p) => (
              <li key={p.id} className="space-y-3 px-6 py-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <a href={`/pro/${p.slug}`} className="font-semibold text-teal-600 hover:underline" target="_blank" rel="noreferrer">
                      {p.display_name}
                    </a>
                    <span className="text-slate-500">
                      {" "}· {cityName(p.city_slug)} · {p.contact_clicks} clicks
                      {(p.avg_rating || 0) > 0 && ` · ${p.avg_rating}★`}
                    </span>
                  </div>
                  <select
                    value={p.listing_tier || "free"}
                    disabled={loadingId === p.id}
                    onChange={(e) => updateProvider(p.id, { listingTier: e.target.value })}
                    className="input-field w-auto py-2 text-xs"
                  >
                    <option value="free">Free</option>
                    <option value="featured">Featured $49</option>
                    <option value="premium">Premium $99</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={loadingId === p.id} onClick={() => updateProvider(p.id, { verified: !p.verified })} className="chip-tag text-xs">
                    {p.verified ? "✓ Verified" : "Mark verified"}
                  </button>
                  <button type="button" disabled={loadingId === p.id} onClick={() => updateProvider(p.id, { insuranceVerified: !p.insurance_verified })} className="chip-tag text-xs">
                    {p.insurance_verified ? "✓ Insured" : "Mark insured"}
                  </button>
                  <button type="button" disabled={loadingId === p.id} onClick={() => updateProvider(p.id, { featured: !p.featured })} className="chip-tag text-xs">
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === p.id}
                    onClick={() => updateProvider(p.id, { responseTime: p.response_time ? "" : "Within 2 hours" })}
                    className="chip-tag text-xs"
                  >
                    {p.response_time || "Set response time"}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div id="requests" className="surface-card overflow-hidden scroll-mt-24">
        <div className="border-b border-slate-200/80 px-6 py-4">
          <h2 className="font-display text-lg">Customer requests</h2>
        </div>
        {requests.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No requests yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((r) => (
              <li key={r.id} className="px-6 py-4 text-sm">
                <p className="font-semibold text-brand-950">
                  {r.customer_name} · {r.customer_phone}
                </p>
                <p className="text-slate-500">
                  {r.category_slug} · {cityName(r.city_slug)} · {new Date(r.created_at).toLocaleString()}
                </p>
                <p className="mt-2 text-slate-700">{r.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
