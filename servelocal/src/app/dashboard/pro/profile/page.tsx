import Link from "next/link";
import { redirect } from "next/navigation";
import { ProProfileEditor } from "@/components/dashboard/ProProfileEditor";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const completeness = [
    listing.bio,
    listing.portfolio_urls?.length,
    listing.license_number,
    listing.years_experience,
    listing.business_hours,
  ].filter(Boolean).length;
  const pct = Math.round((completeness / 5) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-black text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted">Edit how homeowners see you.</p>

        <div className="mt-6 rounded-[14px] border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Profile completeness</span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          {pct < 100 && (
            <p className="mt-2 text-xs text-muted">Add a bio, hours, and license to unlock more leads.</p>
          )}
        </div>

        <ProProfileEditor listing={listing} />

        <p className="mt-4 text-xs text-muted">
          Status: <span className="capitalize text-foreground">{listing.status}</span>
        </p>
      </div>

      <div className="rounded-[14px] border border-border bg-foreground p-6 text-background">
        <p className="font-label text-primary">Live preview</p>
        <h2 className="font-display mt-4 text-2xl font-bold">{listing.display_name}</h2>
        <p className="mt-1 text-sm text-background/60">
          {listing.category_slug} · {listing.city_slug}
        </p>
        {listing.bio && <p className="mt-4 text-sm text-background/80">{listing.bio}</p>}
        <Link
          href={`/pro/${listing.slug}`}
          target="_blank"
          className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          View public profile ↗
        </Link>
      </div>
    </div>
  );
}
