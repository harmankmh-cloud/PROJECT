"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IndustryPicker } from "@/components/IndustryPicker";
import { PromptEditor } from "@/components/PromptEditor";
import type { AdminFeedbackRow } from "@/lib/admin-data";
import type { Business, PromptTemplate } from "@/lib/types";

type Props = {
  business: Business;
  ownerEmail: string | null;
  appUrl: string;
  prompts: PromptTemplate[];
  reviewCount: number;
  reviewsThisMonth: number;
  pageViews: number;
  googleClicks: number;
  recentFeedback: AdminFeedbackRow[];
};

export function AdminBusinessManagePanel({
  business,
  ownerEmail,
  appUrl,
  prompts,
  reviewCount,
  reviewsThisMonth,
  pageViews,
  googleClicks,
  recentFeedback,
}: Props) {
  const router = useRouter();
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  const [name, setName] = useState(business.name);
  const [businessType, setBusinessType] = useState(business.business_type);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business.google_review_url || "");
  const [tone, setTone] = useState(business.tone || "friendly");
  const [slug, setSlug] = useState(business.slug);
  const [plan, setPlan] = useState(business.plan || "trial");
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    business.subscription_status || ""
  );

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    setSaveErr("");

    try {
      const response = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          businessType: businessType.trim(),
          googleReviewUrl: googleReviewUrl.trim(),
          tone,
          slug: slug.trim(),
          plan,
          subscriptionStatus: subscriptionStatus.trim() || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setSaveMsg("Saved — customer page updated.");
      router.refresh();
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (confirmName.trim() !== business.name.trim()) return;
    setDeleting(true);
    setDeleteErr("");

    try {
      const response = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmName: confirmName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed");
      router.push("/admin/businesses");
      router.refresh();
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {!googleReviewUrl.trim() && (
        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 px-5 py-4 text-sm text-rose-900">
          <p className="font-semibold">Google review link missing — reviews will not post to Google</p>
          <p className="mt-1 text-rose-800/90">
            Customers can still leave private feedback on RateLocal, but nothing opens Google Maps until you
            paste their Maps &quot;Write a review&quot; URL below (usually{" "}
            <code className="text-xs">g.page/r/...</code>).
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Reviews", reviewCount],
          ["This month", reviewsThisMonth],
          ["Page visits", pageViews],
          ["Google opens", googleClicks],
        ].map(([label, value]) => (
          <div key={label as string} className="stat-chip">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="font-display mt-1 text-2xl text-brand-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={reviewUrl} target="_blank" rel="noreferrer" className="btn-gold px-4 py-2 text-sm">
          Open customer page ↗
        </Link>
        <Link href="/admin/reviews" className="btn-ghost px-4 py-2 text-sm">
          All reviews →
        </Link>
      </div>

      <form onSubmit={handleSave} className="surface-card overflow-hidden">
        <div className="review-header">
          <h2 className="font-display text-lg">Fix their account — edit everything here</h2>
          <p className="mt-1 text-sm text-white/55">
            Owner:{" "}
            <span className="font-medium text-white">{ownerEmail || "Unknown email"}</span>
            {" · "}
            User ID: <span className="font-mono text-xs text-white/40">{business.user_id}</span>
          </p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-semibold text-brand-950">Business name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </label>
          <div className="sm:col-span-2">
            <span className="text-sm font-semibold text-brand-950">Industry</span>
            <IndustryPicker value={businessType} onChange={setBusinessType} />
          </div>
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-semibold text-brand-950">Google review link</span>
            <input
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="input-field"
              placeholder="https://g.page/r/..."
            />
            <span className="text-xs text-slate-500">
              Paste their Maps &quot;Write a review&quot; URL — fixes &quot;can&apos;t post to Google&quot; issues.
            </span>
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Review page slug</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">/r/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="input-field"
                required
              />
            </div>
            <span className="text-xs text-amber-800">Changing slug breaks old QR codes — only change if needed.</span>
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">AI tone</span>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field">
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Plan (support override)</span>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="input-field">
              <option value="trial">Trial</option>
              <option value="active">Active / Pro</option>
              <option value="past_due">Past due</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Stripe subscription status</span>
            <input
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              className="input-field"
              placeholder="trialing, active, canceled…"
            />
          </label>
          {saveErr && <p className="text-sm text-rose-600 sm:col-span-2">{saveErr}</p>}
          {saveMsg && <p className="text-sm text-emerald-700 sm:col-span-2">{saveMsg}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-dark px-8 py-3 disabled:opacity-60">
              {saving ? "Saving…" : "Save all business settings"}
            </button>
          </div>
        </div>
      </form>

      <div id="scripts" className="scroll-mt-8">
        <h2 className="font-display text-xl text-brand-950">Review scripts (AI wording)</h2>
        <p className="mt-1 text-sm text-slate-500">Edit what customers see for each star level.</p>
        <div className="mt-4">
          <PromptEditor businessId={business.id} prompts={prompts} adminMode />
        </div>
      </div>

      {recentFeedback.length > 0 && (
        <div className="surface-card overflow-hidden">
          <div className="border-b border-slate-200/80 px-6 py-4">
            <h2 className="font-display text-lg text-brand-950">Recent customer feedback</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentFeedback.map((row) => (
              <li key={row.id} className="px-6 py-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-brand-950">
                    {row.star_rating ? `${row.star_rating}★` : "Review"}
                  </span>
                  {row.is_private && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800">Private</span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                </div>
                {row.customer_notes && (
                  <p className="mt-2 text-slate-600">{row.customer_notes}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[1.35rem] border border-rose-200/80 bg-rose-50/50 p-6">
        <h2 className="font-display text-lg text-rose-950">Remove business (platform)</h2>
        <p className="mt-2 text-sm text-rose-900/80">
          Deletes review page, all feedback, and analytics. Owner login stays.
        </p>
        {!deleteOpen ? (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-4 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800"
          >
            Delete this business…
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={`Type ${business.name} to confirm`}
              className="input-field border-rose-200"
            />
            {deleteErr && <p className="text-sm text-rose-700">{deleteErr}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || confirmName.trim() !== business.name.trim()}
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Permanently delete"}
              </button>
              <button type="button" onClick={() => setDeleteOpen(false)} className="btn-ghost py-2">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
