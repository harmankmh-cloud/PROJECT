import { redirect } from "next/navigation";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { PricingCards } from "@/components/PricingCards";
import { LISTING_PLANS } from "@/lib/constants";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProSubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const plan = LISTING_PLANS.find((p) => p.id === listing.listing_tier);
  const isPaid = listing.listing_tier === "featured" || listing.listing_tier === "premium";

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">Subscription</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your plan and billing.</p>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-white p-6">
        <p className="font-label text-slate-500">Current plan</p>
        <p className="font-display mt-1 text-xl font-bold text-slate-900">{plan?.name ?? "Starter"}</p>
        <p className="text-sm text-slate-500">{plan?.monthlyLabel}</p>
        {isPaid && (
          <div className="mt-4 max-w-xs">
            <ManageBillingButton />
          </div>
        )}
      </div>

      <div className="mt-10">
        <PricingCards />
      </div>
    </div>
  );
}
