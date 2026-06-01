"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LISTING_PLANS, TRADE_CITIES } from "@/lib/constants";
import type { ServiceCategory } from "@/lib/types";

export function JoinProviderForm({ categories }: { categories: ServiceCategory[] }) {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "free";

  const [displayName, setDisplayName] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "");
  const [citySlug, setCitySlug] = useState<string>(TRADE_CITIES[0].slug);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [years, setYears] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [minCalloutFee, setMinCalloutFee] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [licensed, setLicensed] = useState(false);
  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [requestedPlan, setRequestedPlan] = useState(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          categorySlug,
          citySlug,
          phone,
          email,
          whatsapp,
          bio,
          yearsExperience: years ? Number(years) : undefined,
          licensed,
          licenseNumber,
          website,
          minCalloutFee,
          businessHours,
          emergencyAvailable,
          requestedPlan,
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
    const plan = LISTING_PLANS.find((p) => p.id === requestedPlan);
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-3xl">✓</p>
        <h2 className="font-display mt-3 text-xl text-brand-950">Application sent</h2>
        <p className="mt-2 text-sm text-slate-600">
          We review listings within 1–2 business days.
          {plan && plan.id !== "free" && (
            <> You selected {plan.name} — we will contact you about setup.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="font-semibold text-brand-950">Choose your plan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LISTING_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setRequestedPlan(plan.id)}
              className={requestedPlan === plan.id ? "option-card-selected rounded-xl border p-4 text-left" : "option-card rounded-xl border p-4 text-left"}
            >
              <p className="font-semibold text-brand-950">{plan.name}</p>
              <p className="text-sm text-teal-600">{plan.priceLabel}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card space-y-4 p-6 sm:p-8">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Your name or business name</span>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input-field" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Service</span>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="input-field">
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">City you serve</span>
            <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className="input-field">
              {TRADE_CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Phone (customers will call this)</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" required placeholder="604-555-1234" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">WhatsApp</span>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="input-field" />
          </label>
        </div>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Short bio</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field min-h-24 resize-y" placeholder="What you do, areas served, years in business…" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Years experience</span>
            <input type="number" min={0} max={60} value={years} onChange={(e) => setYears(e.target.value)} className="input-field" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Licence # (BC)</span>
            <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="input-field" placeholder="If applicable" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Min call-out fee</span>
            <input value={minCalloutFee} onChange={(e) => setMinCalloutFee(e.target.value)} className="input-field" placeholder="$89" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Business hours</span>
            <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="input-field" placeholder="Mon–Fri 8am–6pm" />
          </label>
        </div>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Website (optional)</span>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field" placeholder="https://" />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={licensed} onChange={(e) => setLicensed(e.target.checked)} />
          <span>I am licensed for this trade in BC (where required)</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={emergencyAvailable} onChange={(e) => setEmergencyAvailable(e.target.checked)} />
          <span>I offer emergency / after-hours service</span>
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
          {loading ? "Submitting…" : "Apply for listing"}
        </button>
      </div>
    </form>
  );
}
