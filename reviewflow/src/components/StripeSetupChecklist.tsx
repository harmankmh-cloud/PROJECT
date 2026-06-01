import type { StripeConfigStatus } from "@/lib/stripe-config";

const labels: Record<string, string> = {
  STRIPE_SECRET_KEY: "Stripe secret key (sk_live_... or sk_test_...)",
  STRIPE_PRICE_SETUP: "Setup price ID — $99 one-time (must be price_..., NOT prod_...)",
  STRIPE_PRICE_MONTHLY: "Monthly price ID — $39/mo recurring (must be price_..., NOT prod_...)",
  STRIPE_WEBHOOK_SECRET: "Webhook secret (whsec_...) from Stripe Dashboard",
  SUPABASE_SERVICE_ROLE_KEY: "Supabase service role — activates Pro after payment",
};

export function StripeSetupChecklist({
  status,
  webhookUrl,
}: {
  status: StripeConfigStatus;
  webhookUrl?: string;
}) {
  const items = [
    { key: "STRIPE_SECRET_KEY", ok: status.secretKey },
    { key: "STRIPE_PRICE_SETUP", ok: status.setupPriceValid },
    { key: "STRIPE_PRICE_MONTHLY", ok: status.monthlyPriceValid },
    { key: "STRIPE_WEBHOOK_SECRET", ok: status.webhookSecret },
    { key: "SUPABASE_SERVICE_ROLE_KEY", ok: status.serviceRole },
  ];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
      <p className="font-semibold">Stripe setup checklist</p>
      <p className="mt-1 text-amber-900/80">
        Add these in Vercel → Settings → Environment Variables (or <code className="text-xs">.env.local</code>{" "}
        on your Mac). See <code className="text-xs">STRIPE_SETUP.md</code>.
      </p>
      {webhookUrl && (
        <div className="mt-3 rounded-lg bg-white/70 px-3 py-3 text-xs leading-relaxed text-amber-950">
          <p className="font-semibold">Production webhook (Stripe Dashboard → Developers → Webhooks)</p>
          <p className="mt-1 break-all font-mono">{webhookUrl}</p>
          <p className="mt-2">
            Events: <code>checkout.session.completed</code>,{" "}
            <code>customer.subscription.updated</code>, <code>customer.subscription.deleted</code>
          </p>
          <p className="mt-2">
            Copy the signing secret into <code>STRIPE_WEBHOOK_SECRET</code> in Vercel, then redeploy.
          </p>
        </div>
      )}
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-2">
            <span>{item.ok ? "✓" : "○"}</span>
            <span className={item.ok ? "text-emerald-800" : ""}>{labels[item.key]}</span>
          </li>
        ))}
      </ul>
      {status.invalid.length > 0 && (
        <ul className="mt-3 space-y-2 rounded-lg bg-rose-100 px-3 py-2 text-rose-900">
          {status.invalid.map((msg) => (
            <li key={msg} className="text-xs leading-relaxed">
              {msg}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-amber-900/70">
        Terminal check: <code>npm run stripe:check</code>
      </p>
    </div>
  );
}
