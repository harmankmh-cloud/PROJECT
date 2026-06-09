import Link from "next/link";
import { redirect } from "next/navigation";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id, user.email ?? undefined);
  if (listings.length === 0) redirect("/onboarding");

  const listing = listings[0];
  const completeness = [
    listing.bio,
    listing.portfolio_urls?.length,
    listing.license_number,
    listing.years_experience,
  ].filter(Boolean).length;
  const pct = Math.round((completeness / 4) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-black text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Edit how homeowners see you.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Profile completeness</span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          {pct < 100 && (
            <p className="mt-2 text-xs text-slate-500">Add a bio and photos to unlock more leads.</p>
          )}
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm">
          <p><span className="text-slate-500">Business:</span> {listing.display_name}</p>
          <p><span className="text-slate-500">Bio:</span> {listing.bio || "—"}</p>
          <p><span className="text-slate-500">Status:</span> {listing.status}</p>
          <p className="text-xs text-slate-400">
            Full self-serve editing coming soon — contact hello@servelocal.ca for updates.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
        <p className="font-label text-primary">Live preview</p>
        <h2 className="font-display mt-4 text-2xl font-bold">{listing.display_name}</h2>
        <p className="mt-1 text-sm text-slate-400">{listing.category_slug} · {listing.city_slug}</p>
        {listing.bio && <p className="mt-4 text-sm text-slate-300">{listing.bio}</p>}
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
