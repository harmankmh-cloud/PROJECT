"use client";

import confetti from "canvas-confetti";
import { BadgeCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { TRADE_CITIES, SERVICE_SUBCATEGORIES } from "@/lib/constants";
import { isValidPhone, normalizePhone } from "@/lib/form-utils";
import type { ServiceCategory } from "@/lib/types";

const STEPS = ["Business", "Photos", "Areas", "Services", "Verify"] as const;

type WizardData = {
  name: string;
  businessName: string;
  categorySlug: string;
  citySlug: string;
  phone: string;
  photoUrl: string;
  logoUrl: string;
  serviceAreas: string[];
  services: string[];
  hourlyMin: string;
  hourlyMax: string;
  licenseNumber: string;
  wcbNumber: string;
};

export function ContractorOnboardingWizard({
  categories,
  userEmail,
}: {
  categories: ServiceCategory[];
  userEmail: string;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const [data, setData] = useState<WizardData>({
    name: "",
    businessName: "",
    categorySlug: categories[0]?.slug ?? "plumber",
    citySlug: TRADE_CITIES[0]?.slug ?? "surrey",
    phone: "",
    photoUrl: "",
    logoUrl: "",
    serviceAreas: [TRADE_CITIES[0]?.slug ?? "surrey"],
    services: [],
    hourlyMin: "",
    hourlyMax: "",
    licenseNumber: "",
    wcbNumber: "",
  });

  const subcategories = useMemo(
    () => SERVICE_SUBCATEGORIES[data.categorySlug] ?? [],
    [data.categorySlug]
  );

  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggleArea(slug: string) {
    setData((d) => ({
      ...d,
      serviceAreas: d.serviceAreas.includes(slug)
        ? d.serviceAreas.filter((s) => s !== slug)
        : [...d.serviceAreas, slug],
    }));
  }

  function toggleService(slug: string) {
    setData((d) => ({
      ...d,
      services: d.services.includes(slug)
        ? d.services.filter((s) => s !== slug)
        : [...d.services, slug],
    }));
  }

  async function submitApplication() {
    setLoading(true);
    setError("");
    const bioParts = [
      data.services.length ? `Services: ${data.services.join(", ")}` : null,
      data.hourlyMin || data.hourlyMax
        ? `Rate: $${data.hourlyMin || "?"}–$${data.hourlyMax || "?"}/hr`
        : null,
      data.serviceAreas.length ? `Areas: ${data.serviceAreas.join(", ")}` : null,
    ].filter(Boolean);

    const res = await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: data.businessName || data.name,
        categorySlug: data.categorySlug,
        citySlug: data.citySlug,
        phone: normalizePhone(data.phone),
        email: userEmail,
        bio: bioParts.join(" · ") || undefined,
        licensed: Boolean(data.licenseNumber),
        licenseNumber: data.licenseNumber || undefined,
        requestedPlan: "free",
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Could not submit application");
      return;
    }

    const previewSlug = (data.businessName || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setSlug(previewSlug);
    setDone(true);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }

  function next() {
    if (step === 0) {
      if (!data.name || !data.businessName || !data.phone) {
        setError("Fill in name, business name, and phone.");
        return;
      }
      if (!isValidPhone(data.phone)) {
        setError("Enter a valid 10-digit phone number.");
        return;
      }
    }
    if (step === 2 && data.serviceAreas.length === 0) {
      setError("Select at least one service area.");
      return;
    }
    if (step === 3 && data.services.length === 0) {
      setError("Select at least one service.");
      return;
    }
    setError("");
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      void submitApplication();
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-slate-700 bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="font-display mt-6 text-3xl font-black text-slate-50">Your profile is live!</h1>
        <p className="mt-3 text-slate-400">
          We&apos;re reviewing your verification details. You&apos;ll see an &ldquo;Under Review&rdquo; badge until approved.
        </p>
        <Badge variant="warning" className="mt-4">
          Under Review
        </Badge>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/pro" className="btn-orange px-6 py-3">
            Go to pro dashboard
          </Link>
          {slug && (
            <Link
              href={`/join`}
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-50"
            >
              View application status
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-surface p-6 sm:p-10">
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-slate-700"}`}
          />
        ))}
      </div>
      <p className="font-label mt-4 text-primary">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Your name</label>
              <Input value={data.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Business name</label>
              <Input value={data.businessName} onChange={(e) => update("businessName", e.target.value)} />
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Trade category</label>
              <select
                value={data.categorySlug}
                onChange={(e) => update("categorySlug", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-50"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Primary city</label>
              <select
                value={data.citySlug}
                onChange={(e) => update("citySlug", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-50"
              >
                {TRADE_CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Business phone</label>
              <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="604-555-1234" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm text-slate-400">Add photo URLs for now (upload coming soon). Max 2MB when upload is enabled.</p>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Profile photo URL</label>
              <Input value={data.photoUrl} onChange={(e) => update("photoUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">Business logo URL</label>
              <Input value={data.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://..." />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {TRADE_CITIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleArea(c.slug)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  data.serviceAreas.includes(c.slug)
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-wrap gap-2">
              {(subcategories.length ? subcategories : [{ slug: "general", label: "General services" }]).map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => toggleService(s.slug)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    data.services.includes(s.slug)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-slate-700 text-slate-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="font-label mb-1.5 block text-slate-400">Hourly min ($)</label>
                <Input value={data.hourlyMin} onChange={(e) => update("hourlyMin", e.target.value)} type="number" />
              </div>
              <div>
                <label className="font-label mb-1.5 block text-slate-400">Hourly max ($)</label>
                <Input value={data.hourlyMax} onChange={(e) => update("hourlyMax", e.target.value)} type="number" />
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-slate-400">
              Upload BC business license or enter your WCB number. Profiles show a verified badge after review.
            </p>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">BC business license #</label>
              <Input value={data.licenseNumber} onChange={(e) => update("licenseNumber", e.target.value)} />
            </div>
            <div>
              <label className="font-label mb-1.5 block text-slate-400">WCB / WorkSafeBC #</label>
              <Input value={data.wcbNumber} onChange={(e) => update("wcbNumber", e.target.value)} />
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-amber-400">
              <BadgeCheck className="h-4 w-4" />
              Under Review badge shown until our team verifies
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 flex justify-between gap-3">
        <Button
          type="button"
          variant="ghost-dark"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        <Button type="button" onClick={next} loading={loading} pill>
          {step === STEPS.length - 1 ? "Submit profile" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
