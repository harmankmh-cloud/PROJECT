import type { StripeConfigStatus } from "@/lib/stripe-config";

const labels: Record<string, string> = {
  STRIPE_SECRET_KEY: "Stripe secret key (sk_test_...)",
  STRIPE_PRICE_SETUP: "Setup price ID — $99 one-time (price_...)",
  STRIPE_PRICE_MONTHLY: "Monthly price ID — $39/mo (price_...)",
  STRIPE_WEBHOOK_SECRET: "Webhook secret (whsec_...) — run npm run stripe:webhook",
  SUPABASE_SERVICE_ROLE_KEY: "Supabase service role — activates Pro after payment",
};

export function StripeSetupChecklist({ status }: { status: StripeConfigStatus }) {
  const items = [
    { key: "STRIPE_SECRET_KEY", ok: status.secretKey },
    { key: "STRIPE_PRICE_SETUP", ok: status.setupPrice },
    { key: "STRIPE_PRICE_MONTHLY", ok: status.monthlyPrice },
    { key: "STRIPE_WEBHOOK_SECRET", ok: status.webhookSecret },
    { key: "SUPABASE_SERVICE_ROLE_KEY", ok: status.serviceRole },
  ];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
      <p className="font-semibold">Stripe setup checklist</p>
      <p className="mt-1 text-amber-900/80">
        Add these to <code className="text-xs">.env.local</code> — see{" "}
        <code className="text-xs">STRIPE_SETUP.md</code> in the reviewflow folder.
      </p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-2">
            <span>{item.ok ? "✓" : "○"}</span>
            <span className={item.ok ? "text-emerald-800" : ""}>{labels[item.key]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-amber-900/70">
        Terminal check: <code>npm run stripe:check</code>
      </p>
    </div>
  );
}
