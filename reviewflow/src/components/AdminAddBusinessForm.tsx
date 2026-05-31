"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IndustryPicker } from "@/components/IndustryPicker";

export function AdminAddBusinessForm() {
  const router = useRouter();
  const [ownerEmail, setOwnerEmail] = useState("");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerEmail: ownerEmail.trim(),
          name: name.trim(),
          businessType: businessType.trim(),
          googleReviewUrl: googleReviewUrl.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.businessId) {
          throw new Error(
            `${data.error} ` +
              `(Manage existing → /admin/business/${data.businessId})`
          );
        }
        throw new Error(data.error || "Could not create business");
      }
      router.push(`/admin/business/${data.businessId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create business");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-teal-950 px-6 py-4 text-white">
        <div>
          <h2 className="font-display text-lg">Add a business for a customer</h2>
          <p className="mt-0.5 text-sm text-white/55">
            They must already have a RateLocal account (email). One business per account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-gold px-4 py-2 text-sm"
        >
          {open ? "Hide form" : "+ Add business"}
        </button>
      </div>
      {open && (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Owner email (login)</span>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="input-field"
              required
              placeholder="customer@shop.com"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Business name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              placeholder="Mike's Barber"
            />
          </label>
          <div>
            <span className="text-sm font-semibold text-brand-950">Industry</span>
            <IndustryPicker value={businessType} onChange={setBusinessType} />
          </div>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-brand-950">Google review link (optional)</span>
            <input
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="input-field"
              placeholder="https://g.page/r/..."
            />
          </label>
          {error && (
            <p className="text-sm text-rose-600">
              {error.includes("/admin/business/") ? (
                <>
                  {error.split("(Manage")[0]}
                  <Link
                    href={error.match(/\/admin\/business\/[a-f0-9-]+/)?.[0] || "/admin/businesses"}
                    className="font-semibold underline"
                  >
                    Open manage page →
                  </Link>
                </>
              ) : (
                error
              )}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-dark px-6 py-3 disabled:opacity-60">
            {loading ? "Creating…" : "Create business"}
          </button>
        </form>
      )}
    </div>
  );
}
