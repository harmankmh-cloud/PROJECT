import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cityName } from "@/lib/constants";
import { getServiceCategories, getUserServiceRequests } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function JobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const [requests, categories] = await Promise.all([
    getUserServiceRequests(user?.id ?? "", user?.email ?? undefined),
    getServiceCategories(),
  ]);

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">My Jobs</h1>
      <p className="mt-1 text-sm text-slate-500">Track job posts and pro interest.</p>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-600">No jobs posted yet.</p>
          <Link href="/request" className="btn-orange mt-4 inline-flex px-6 py-3">
            Post your first job
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{categoryName(r.category_slug)}</p>
                  <p className="text-xs text-slate-500">
                    {cityName(r.city_slug)} · {new Date(r.created_at).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <Badge variant={r.status === "open" ? "orange" : "default"}>{r.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">{r.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Pros can view this lead
                </span>
                <Link
                  href={`/${r.city_slug}/${r.category_slug}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Browse pros →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
