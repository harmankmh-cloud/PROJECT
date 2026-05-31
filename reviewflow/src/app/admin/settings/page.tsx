import { StripeSetupChecklist } from "@/components/StripeSetupChecklist";
import { getAppUrl } from "@/lib/app-url-server";
import { getStripeConfigStatus } from "@/lib/stripe-config";
import { PLAN_LIMITS, PRICING, pricingLabel } from "@/lib/plans";

export default async function AdminSettingsPage() {
  const stripeStatus = getStripeConfigStatus();
  const appUrl = await getAppUrl();
  const webhookUrl = `${appUrl}/api/stripe/webhook`;
  const supabaseReady = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const openRouterReady = !!process.env.OPENROUTER_API_KEY;
  const adminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "(not set)";

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Platform settings</h1>
          <p className="mt-2 text-sm text-stone-500">
            Server config and plan rules — only visible in your platform panel.
          </p>
        </header>

        <div className="surface-card divide-y divide-[#e8e2d9]">
          {[
            { label: "Supabase", ok: supabaseReady, detail: "Database & login" },
            { label: "OpenRouter", ok: openRouterReady, detail: "AI review drafts" },
            { label: "Stripe checkout", ok: stripeStatus.ready, detail: "Secret key + both price IDs" },
            { label: "Stripe webhooks", ok: stripeStatus.webhookReady, detail: "Auto-upgrade to Pro after pay" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-brand-950">{item.label}</p>
                <p className="text-sm text-stone-500">{item.detail}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  item.ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                }`}
              >
                {item.ok ? "Connected" : "Missing keys"}
              </span>
            </div>
          ))}
        </div>

        {!stripeStatus.webhookReady && (
          <StripeSetupChecklist status={stripeStatus} webhookUrl={webhookUrl} />
        )}

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Stripe Customer Portal</h2>
          <p className="mt-2 text-sm text-stone-600">
            Enable in Stripe Dashboard → Settings → Billing → Customer portal → Activate. Required
            for &quot;Manage subscription&quot; after payment.
          </p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Live payments checklist</h2>
          <ul className="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-600">
            <li>Stripe Dashboard → turn OFF Test mode for real cards</li>
            <li>
              Use live keys in Vercel: <code className="text-xs">sk_live_...</code> and live{" "}
              <code className="text-xs">price_...</code> IDs
            </li>
            <li>
              Webhook endpoint: <code className="text-xs break-all">{webhookUrl}</code>
            </li>
            <li>
              Test card in Test mode only: <code className="text-xs">4242 4242 4242 4242</code>
            </li>
          </ul>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Pricing & limits</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li>Pro price: {pricingLabel()}</li>
            <li>Free trial: {PLAN_LIMITS.trial.monthlyReviews} reviews/month</li>
            <li>Pro plan: {PLAN_LIMITS.active.monthlyReviews} reviews/month</li>
            <li>Setup fee: ${PRICING.setupUsd} · Monthly: ${PRICING.monthlyUsd}</li>
          </ul>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Platform admins</h2>
          <p className="mt-2 text-sm text-stone-600">
            Only these emails can access this panel (<code className="text-xs">ADMIN_EMAILS</code>
            ):
          </p>
          <p className="mt-2 rounded-xl bg-cream px-4 py-3 text-sm text-brand-950">{adminEmails}</p>
        </div>
      </div>
    </main>
  );
}
