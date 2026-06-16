"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceProvider } from "@/lib/types";
import { portfolioLimitForTier } from "@/lib/plan-benefits";
import { isFeaturedTier } from "@/lib/schemas/db/normalize";

export function ProProfileEditor({ listing }: { listing: ServiceProvider }) {
  const router = useRouter();
  const tier = listing.listing_tier ?? "free";
  const portfolioLimit = isFeaturedTier(tier) || listing.featured ? portfolioLimitForTier(tier) : 0;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [portfolioInput, setPortfolioInput] = useState(
    (listing.portfolio_urls ?? []).join("\n")
  );
  const [form, setForm] = useState({
    displayName: listing.display_name,
    phone: listing.phone,
    whatsapp: listing.whatsapp ?? "",
    bio: listing.bio ?? "",
    yearsExperience: listing.years_experience?.toString() ?? "",
    licenseNumber: listing.license_number ?? "",
    website: listing.website ?? "",
    minCalloutFee: listing.min_callout_fee ?? "",
    businessHours: listing.business_hours ?? "",
    emergencyAvailable: listing.emergency_available ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const portfolioUrls = portfolioInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch(`/api/providers/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        bio: form.bio,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        licenseNumber: form.licenseNumber || undefined,
        website: form.website || undefined,
        minCalloutFee: form.minCalloutFee || undefined,
        businessHours: form.businessHours || undefined,
        emergencyAvailable: form.emergencyAvailable,
        portfolioUrls: portfolioLimit > 0 ? portfolioUrls.slice(0, portfolioLimit) : [],
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error ?? "Could not save");
      return;
    }

    setMessage("Profile saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-[14px] border border-border bg-surface p-6">
      <div>
        <label className="text-xs font-medium text-muted">Business name</label>
        <input
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted">Phone</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">WhatsApp</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted">Bio</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell homeowners about your experience and services…"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted">Years experience</label>
          <input
            type="number"
            min={0}
            max={60}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.yearsExperience}
            onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">License #</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.licenseNumber}
            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted">Website</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Min callout fee</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={form.minCalloutFee}
            onChange={(e) => setForm({ ...form, minCalloutFee: e.target.value })}
            placeholder="$89"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted">Business hours</label>
        <input
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          value={form.businessHours}
          onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
          placeholder="Mon–Fri 8am–6pm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.emergencyAvailable}
          onChange={(e) => setForm({ ...form, emergencyAvailable: e.target.checked })}
          className="rounded border-border"
        />
        Available for emergency calls
      </label>
      <div>
        <label className="text-xs font-medium text-muted">
          Portfolio photo URLs {portfolioLimit > 0 ? `(up to ${portfolioLimit})` : ""}
        </label>
        {portfolioLimit > 0 ? (
          <textarea
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            rows={3}
            value={portfolioInput}
            onChange={(e) => setPortfolioInput(e.target.value)}
            placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
          />
        ) : (
          <p className="mt-1 text-xs text-muted">
            Upgrade to Featured to add portfolio photos on your public profile.
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        {message && (
          <span className={`text-sm ${message === "Profile saved" ? "text-success" : "text-red-500"}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
