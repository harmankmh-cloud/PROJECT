import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SignOutButton } from "@/components/SignOutButton";
import { StarRating } from "@/components/StarRating";
import { cityName, LISTING_PLANS } from "@/lib/constants";
import { getCategoryBySlug, getProviderReviewsForProvider, getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ProDashboardPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const listings = await getProvidersForUser(user.id, user.email ?? undefined);

  if (listings.length === 0) {
    return (
      <main className="mesh-bg min-h-screen">
        <SiteHeader compact />
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-8 text-center">
          <p className="page-eyebrow">Pro dashboard</p>
          <h1 className="font-display mt-2 text-3xl text-brand-950">No listing linked yet</h1>
          <p className="mt-3 text-slate-600">
            Apply to get listed — we&apos;ll link your profile to this account when approved.
          </p>
          <Link href="/join" className="btn-gold mt-6 inline-flex px-8 py-3">
            Get listed
          </Link>
          <p className="mt-4">
            <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
              ← Homeowner dashboard
            </Link>
          </p>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const listing = listings[0];
  const category = await getCategoryBySlug(listing.category_slug);
  const reviews = await getProviderReviewsForProvider(listing.id);
  const plan = LISTING_PLANS.find((p) => p.id === listing.listing_tier);

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="page-eyebrow">Pro dashboard</p>
            <h1 className="font-display mt-1 text-3xl text-brand-950">{listing.display_name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {category?.name} · {cityName(listing.city_slug)} · {listing.status}
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{listing.contact_clicks}</p>
            <p className="text-xs text-slate-500">Contact clicks</p>
          </div>
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{listing.review_count || 0}</p>
            <p className="text-xs text-slate-500">Reviews</p>
          </div>
          <div className="stat-hero">
            <p className="font-display text-2xl font-bold text-brand-950">{listing.avg_rating || "—"}</p>
            <p className="text-xs text-slate-500">Avg rating</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href={`/pro/${listing.slug}`} className="surface-card-hover p-5" target="_blank">
            <p className="font-semibold text-brand-950">View public profile ↗</p>
            <p className="mt-1 text-sm text-slate-500">See what homeowners see</p>
          </Link>
          <Link href="/pricing" className="surface-card-hover p-5">
            <p className="font-semibold text-brand-950">Upgrade plan</p>
            <p className="mt-1 text-sm text-slate-500">
              Current: {plan?.name || listing.listing_tier || "Starter"}
            </p>
          </Link>
        </div>

        <section className="surface-card mt-8 p-6">
          <h2 className="font-semibold text-brand-950">Listing performance</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Plan: {plan?.monthlyLabel || "Free"}</li>
            <li>Verified: {listing.verified ? "Yes" : "Pending review"}</li>
            <li>Insurance badge: {listing.insurance_verified ? "Yes" : "Not yet"}</li>
            {listing.response_time && <li>Response time: {listing.response_time}</li>}
            {listing.emergency_available && <li>24/7 emergency: Enabled</li>}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Profile edits go through admin for now — contact us for updates.
          </p>
        </section>

        {reviews.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-xl text-brand-950">Recent reviews</h2>
            <ul className="mt-4 space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <li key={r.id} className="surface-card p-4">
                  <StarRating rating={r.rating} />
                  <p className="mt-2 font-medium text-brand-950">{r.reviewer_name}</p>
                  <p className="mt-1 text-sm text-slate-600">{r.body}</p>
                  <p className="mt-2 text-xs text-slate-400 capitalize">{r.status}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-8">
          <Link href="/dashboard" className="text-sm font-semibold text-teal-600 hover:underline">
            ← Homeowner dashboard
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
