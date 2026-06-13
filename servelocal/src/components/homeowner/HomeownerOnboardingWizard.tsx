"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TRADE_CITIES } from "@/lib/constants";

const STEPS = ["Location", "First job", "Notifications"] as const;

export function HomeownerOnboardingWizard({ defaultCity }: { defaultCity?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(defaultCity || TRADE_CITIES[0]?.slug || "surrey");
  const [intent, setIntent] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferred_city_slug: city,
        notification_email: emailAlerts,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_step: STEPS.length,
      }),
    });
    setLoading(false);
    router.push(intent.trim() ? "/request" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-[14px] border border-border bg-surface p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Step {step + 1} of {STEPS.length}
      </p>
      <h1 className="mt-2 font-display text-2xl font-black text-foreground">{STEPS[step]}</h1>

      {step === 0 ? (
        <div className="mt-6">
          <label className="font-label mb-2 block text-muted">Your city</label>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {TRADE_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6">
          <label className="font-label mb-2 block text-muted">What do you need help with?</label>
          <Input
            placeholder="e.g. Fix a leaky faucet, lawn mowing, roof inspection…"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <label className="mt-6 flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          Email me when pros respond or send quotes
        </label>
      ) : null}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button type="button" disabled={loading} onClick={finish}>
            {loading ? "Saving…" : "Go to dashboard"}
          </Button>
        )}
      </div>
    </div>
  );
}
