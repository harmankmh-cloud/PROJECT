import Link from "next/link";
import { redirect } from "next/navigation";
import { LISTING_PLANS } from "@/lib/constants";
import { getJobLeadsForProvider, getProvidersForUser } from "@/lib/data";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isFeaturedTier } from "@/lib/schemas/db/normalize";

export default async function ProEarningsPage() {
  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const leads = listing.status === "approved" ? await getJobLeadsForProvider(listing) : [];
  const plan = LISTING_PLANS.find((p) => p.id === listing.listing_tier);
  const isPaid = isFeaturedTier(listing.listing_tier) || listing.featured;

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Performance</h1>
      <p className="mt-1 text-sm text-muted">
        Real stats from your listing — ServeLocal does not take a cut of jobs you book direct.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-primary">{listing.contact_clicks ?? 0}</p>
          <p className="text-xs text-muted">Profile views (contact clicks)</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-foreground">{leads.length}</p>
          <p className="text-xs text-muted">Job leads (last 30 days)</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-foreground">{listing.review_count ?? 0}</p>
          <p className="text-xs text-muted">Reviews on your profile</p>
        </div>
      </div>

      <div className="mt-8 rounded-[14px] border border-border bg-surface p-6">
        <h2 className="font-semibold text-foreground">Subscription</h2>
        <p className="mt-2 text-sm text-muted">
          Plan: <strong className="text-foreground">{plan?.name ?? "Starter"}</strong>
          {isPaid ? ` · ${plan?.priceLabel}` : " · Free"}
        </p>
        <p className="mt-3 text-sm text-muted">
          Payments for actual work happen between you and the homeowner — bank, e-transfer, or invoice.
          This dashboard tracks leads and visibility, not payouts.
        </p>
        {!isPaid && (
          <Link
            href="/dashboard/pro/subscription"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            See upgrade options →
          </Link>
        )}
      </div>
    </div>
  );
}
