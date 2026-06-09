import { redirect } from "next/navigation";
import { ProJobLeadsFeed } from "@/components/dashboard/ProJobLeadsFeed";
import { cityName } from "@/lib/constants";
import { getJobLeadsForProvider, getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProLeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id, user.email ?? undefined);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const leads = listing.status === "approved" ? await getJobLeadsForProvider(listing) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">Job Leads</h1>
      <p className="mt-1 text-sm text-slate-500">
        Homeowner requests in {cityName(listing.city_slug)} matching your trade.
      </p>
      <div className="mt-6">
        <ProJobLeadsFeed leads={leads} tier={listing.listing_tier ?? "free"} />
      </div>
    </div>
  );
}
