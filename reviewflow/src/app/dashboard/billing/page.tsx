import { BillingPanel } from "@/components/BillingPanel";
import { UsageMeter } from "@/components/UsageMeter";
import { getDashboardData } from "@/lib/dashboard-data";
import { activateBusinessPlan } from "@/lib/activate-business-plan";
import { getStripeConfigStatus } from "@/lib/stripe-config";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    activated?: string;
    canceled?: string;
    session_id?: string;
  }>;
}) {
  const params = await searchParams;
  const { user, business, usage } = await getDashboardData();
  const stripeStatus = getStripeConfigStatus();

  if (!business || !usage) redirect("/dashboard");

  let activationError: string | undefined;

  const shouldActivate =
    params.activated !== "1" &&
    usage.plan !== "active" &&
    (params.success === "1" || params.session_id);

  if (shouldActivate && isStripeConfigured()) {
    const stripe = getStripe();
    if (stripe) {
      const result = await activateBusinessPlan(
        stripe,
        business,
        user?.email,
        params.session_id
      );
      if (result.ok) {
        redirect("/dashboard/billing?activated=1");
      }
      activationError = result.error;
    }
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">My plan</h1>
          <p className="mt-2 text-sm text-stone-500">Upgrade to collect more reviews each month.</p>
        </header>

        <UsageMeter usage={usage} />

        <BillingPanel
          business={business}
          usage={usage}
          stripeStatus={stripeStatus}
          success={params.success === "1"}
          activated={params.activated === "1"}
          canceled={params.canceled === "1"}
          sessionId={params.session_id}
          activationError={activationError}
        />
      </div>
    </main>
  );
}
