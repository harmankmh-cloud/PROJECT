import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;
  const stripeReady = isStripeConfigured();

  const { data: usage } = org
    ? await supabase
        .from("va_usage_events")
        .select("quantity")
        .eq("org_id", org.id)
        .eq("event_type", "voice_minute")
    : { data: [] };

  const totalMinutes = usage?.reduce((s, e) => s + Number(e.quantity), 0) || 0;
  const plan = org?.plan || "starter";
  const planInfo = PLANS[plan as keyof typeof PLANS] || PLANS.starter;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Billing</h1>
      <p className="mt-1 text-slate-500">Usage-based voice minutes + subscription.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-slate-500">Current plan</p>
          <p className="text-2xl font-bold capitalize">{planInfo.name}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-slate-500">Minutes this period</p>
          <p className="text-2xl font-bold">{totalMinutes}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-slate-500">Est. overage</p>
          <p className="text-2xl font-bold">${(totalMinutes * planInfo.perMinute).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 surface-card p-6">
        <h2 className="font-semibold">Stripe metered billing</h2>
        <p className="mt-2 text-sm text-slate-600">
          {stripeReady
            ? "Stripe is configured. Voice minutes are reported via meter events on invoice creation."
            : "Add STRIPE_SECRET_KEY and STRIPE_METER_VOICE_MINUTES to enable billing."}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          Webhook endpoint: /api/webhooks/stripe
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Object.entries(PLANS).map(([key, p]) => (
          <div key={key} className={`surface-card p-5 ${plan === key ? "ring-2 ring-teal-500" : ""}`}>
            <h3 className="font-bold">{p.name}</h3>
            <p className="mt-1 text-2xl font-bold">${p.monthlyPrice}/mo</p>
            <p className="text-sm text-slate-500">+ ${p.perMinute}/min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
