import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SignOutButton } from "@/components/SignOutButton";
import { cityName } from "@/lib/constants";
import { getServiceCategories, getUserServiceRequests } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [requests, categories] = await Promise.all([
    getUserServiceRequests(user.id, user.email ?? undefined),
    getServiceCategories(),
  ]);

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="page-eyebrow">My account</p>
            <h1 className="font-display mt-1 text-3xl text-brand-950">Your dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/request" className="surface-card-hover p-5">
            <p className="font-semibold text-brand-950">Post a new job</p>
            <p className="mt-1 text-sm text-slate-500">Get free quotes from local pros</p>
          </Link>
          <Link href="/dashboard/pro" className="surface-card-hover p-5">
            <p className="font-semibold text-brand-950">Pro dashboard</p>
            <p className="mt-1 text-sm text-slate-500">View listing stats, clicks & reviews</p>
          </Link>
          <Link href="/join" className="surface-card-hover p-5 sm:col-span-2">
            <p className="font-semibold text-brand-950">List my business</p>
            <p className="mt-1 text-sm text-slate-500">Apply as a tradie on ServeLocal</p>
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl text-brand-950">Your job requests</h2>
          {requests.length === 0 ? (
            <div className="surface-card mt-4 p-6 text-center">
              <p className="text-slate-600">No requests yet.</p>
              <Link href="/request" className="btn-gold mt-4 inline-flex px-6 py-3">
                Post your first job
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="surface-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-brand-950">{categoryName(r.category_slug)}</p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {cityName(r.city_slug)} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 line-clamp-2">{r.description}</p>
                  <Link
                    href={`/${r.city_slug}/${r.category_slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:underline"
                  >
                    Browse pros in this category →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
