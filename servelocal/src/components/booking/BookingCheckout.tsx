"use client";

import { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { formatSubmitError } from "@/lib/form-utils";

const ADDONS = [
  { id: "materials", label: "Materials pickup", price: 2500 },
  { id: "disposal", label: "Waste disposal", price: 5000 },
  { id: "weekend", label: "Weekend surcharge", price: 7500 },
] as const;

type Props = {
  provider: ServiceProvider;
  bookingId?: string;
};

export function BookingCheckout({ provider, bookingId }: Props) {
  const baseCents = 15000;
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const addonsCents = ADDONS.filter((a) => selectedAddons.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );
  const platformFee = Math.round((baseCents + addonsCents) * 0.1);
  const tax = Math.round((baseCents + addonsCents + platformFee) * 0.12);
  const total = baseCents + addonsCents + platformFee + tax;

  function formatCents(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider.id,
          customerName,
          customerEmail,
          customerPhone,
          serviceDescription: `Booking with ${provider.display_name}`,
          scheduledAt: scheduledAt || undefined,
          baseAmountCents: baseCents,
          addonsCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setConfirmed(true);
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Booking failed"));
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-[14px] border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h2 className="font-display mt-4 text-2xl font-bold text-foreground">Booking confirmed!</h2>
        <p className="mt-2 text-sm text-muted">
          Confirmation sent to {customerEmail}. {provider.display_name} will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-[14px] border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Job summary</h2>
          <p className="mt-2 text-sm text-muted">
            Service with <strong className="text-foreground">{provider.display_name}</strong>
          </p>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-6">
          <h3 className="font-semibold text-foreground">Select date &amp; time</h3>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="input-focus-glow mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
          />
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-6">
          <h3 className="font-semibold text-foreground">Optional add-ons</h3>
          <div className="mt-3 space-y-2">
            {ADDONS.map((addon) => (
              <label
                key={addon.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 transition hover:border-amber-400/50"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="accent-amber-500"
                  />
                  {addon.label}
                </span>
                <span className="text-sm font-semibold text-primary">
                  +{formatCents(addon.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-6">
          <h3 className="font-semibold text-foreground">Contact info</h3>
          <div className="mt-3 space-y-3">
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
            <input
              required
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email"
              className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone"
              className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="h-fit lg:sticky lg:top-24">
        <div className="rounded-[14px] border border-border bg-surface p-6 shadow-lg">
          <h3 className="font-display text-lg font-bold text-foreground">Price breakdown</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Base rate</dt>
              <dd className="text-foreground">{formatCents(baseCents)}</dd>
            </div>
            {addonsCents > 0 && (
              <div className="flex justify-between text-muted">
                <dt>Add-ons</dt>
                <dd className="text-foreground">{formatCents(addonsCents)}</dd>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <dt>Platform fee</dt>
              <dd className="text-foreground">{formatCents(platformFee)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Tax (GST)</dt>
              <dd className="text-foreground">{formatCents(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground">
              <dt>Total</dt>
              <dd>{formatCents(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/10 p-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-primary">ServeLocal Guarantee</p>
              <p className="text-xs text-muted">Payment held until job is complete</p>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted">
            Pay with Credit, Debit, Apple Pay, or Google Pay (Stripe)
          </p>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <ShimmerButton type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? "Processing..." : `Pay ${formatCents(total)}`}
          </ShimmerButton>
        </div>
      </div>
    </form>
  );
}
