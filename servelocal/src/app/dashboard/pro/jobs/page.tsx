import Link from "next/link";
import { redirect } from "next/navigation";
import { ProJobLeadsFeed } from "@/components/dashboard/ProJobLeadsFeed";
import { cityName } from "@/lib/constants";
import { getJobLeadsForProvider, getProvidersForUser } from "@/lib/data";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";

export default async function ProJobsPage() {
  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const leads = listing.status === "approved" ? await getJobLeadsForProvider(listing) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Open inquiries</h1>
      <p className="mt-1 text-sm text-muted">
        Homeowner job posts in {cityName(listing.city_slug)} — call or text direct. No middleman fees.
      </p>
      <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-foreground">
        <strong>How it works:</strong> When a homeowner posts on ServeLocal, matching pros get an alert.
        Featured pros see full contact info here and in email. Starter pros see previews until they upgrade.
      </p>
      <div className="mt-6">
        <ProJobLeadsFeed leads={leads} tier={listing.listing_tier ?? "free"} />
      </div>
      {leads.length === 0 && listing.status === "approved" && (
        <p className="mt-6 text-sm text-muted">
          Tip: Complete your profile and ask homeowners to post at{" "}
          <Link href="/request" className="font-semibold text-primary hover:underline">
            /request
          </Link>{" "}
          to start receiving leads.
        </p>
      )}
    </div>
  );
}
