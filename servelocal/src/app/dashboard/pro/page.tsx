import Link from "next/link";
import { redirect } from "next/navigation";
import { ProJobLeadsFeed } from "@/components/dashboard/ProJobLeadsFeed";
import { ProPlanStatus } from "@/components/dashboard/ProPlanStatus";
import { UpgradeCheckoutButton } from "@/components/UpgradeCheckoutButton";
import { UpgradeSuccessBanner } from "@/components/UpgradeSuccessBanner";
import { cityName, LISTING_PLANS } from "@/lib/constants";
import { getJobLeadsForProvider, getProvidersForUser } from "@/lib/data";
import { FOUNDING_PRO } from "@/lib/tradie-program";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { Suspense } from "react";

export default async function ProOverviewPage() {
  const supabase = await createClient();
  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="font-display text-2xl font-black text-slate-900">No listing linked yet</h1>
        <p className="mt-3 text-slate-600">Complete onboarding to get your profile reviewed.</p>
        <Link href="/onboarding" className="btn-orange mt-6 inline-flex px-8 py-3">
          Finish setup
        </Link>
      </div>
    );
  }

  const listing = listings[0];
  const jobLeads = listing.status === "approved" ? await getJobLeadsForProvider(listing) : [];
  const plan = LISTING_PLANS.find((p) => p.id === listing.listing_tier);
  const isPaid = listing.listing_tier === "featured" || listing.listing_tier === "premium";

  const stats = [
    { label: "Profile views", value: listing.contact_clicks },
    { label: "Job leads", value: jobLeads.length },
    { label: "Reviews", value: listing.review_count ?? 0 },
    { label: "Avg rating", value: listing.avg_rating || "—" },
  ];

  return (
    <div>
      <Suspense fallback={null}>
        <UpgradeSuccessBanner />
      </Suspense>

      <h1 className="font-display text-2xl font-black text-slate-900">{listing.display_name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {cityName(listing.city_slug)} · {listing.status} · {plan?.name ?? "Starter"}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ProPlanStatus listing={listing} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={`/pro/${listing.slug}`} className="font-semibold text-primary hover:underline">
                View public profile ↗
              </Link>
            </li>
            <li>
              <Link href="/dashboard/pro/leads" className="font-semibold text-primary hover:underline">
                All job leads →
              </Link>
            </li>
            <li>
              <Link href="/dashboard/pro/profile" className="font-semibold text-primary hover:underline">
                Edit profile & portfolio →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {!isPaid && listing.status === "approved" && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-orange-50 p-6 lg:hidden">
          <h2 className="font-semibold text-slate-900">Upgrade for full job lead access</h2>
          <p className="mt-2 text-sm text-slate-600">
            Featured plan unlocks homeowner contact info and priority placement — {FOUNDING_PRO.featuredPrice} founding rate.
          </p>
          <div className="mt-4 max-w-xs">
            <UpgradeCheckoutButton plan="featured" label="Upgrade to Featured" />
          </div>
        </div>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Latest job leads</h2>
          <Link href="/dashboard/pro/leads" className="text-sm font-semibold text-primary">
            View all →
          </Link>
        </div>
        <div className="mt-4">
          <ProJobLeadsFeed leads={jobLeads.slice(0, 3)} tier={listing.listing_tier ?? "free"} />
        </div>
      </section>
    </div>
  );
}
