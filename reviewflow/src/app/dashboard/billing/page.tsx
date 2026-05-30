import { BillingPanel } from "@/components/BillingPanel";
import { UsageMeter } from "@/components/UsageMeter";
import { getDashboardData } from "@/lib/dashboard-data";
import { isStripeConfigured } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const { business, usage } = await getDashboardData();

  if (!business || !usage) redirect("/dashboard");

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Billing</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Plan & payments</h1>
          <p className="mt-2 text-sm text-stone-500">Upgrade to collect more reviews each month.</p>
        </header>

        <UsageMeter usage={usage} />

        <BillingPanel
          business={business}
          usage={usage}
          stripeReady={isStripeConfigured()}
          success={params.success === "1"}
          canceled={params.canceled === "1"}
        />
      </div>
    </main>
  );
}
