import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cityName } from "@/lib/constants";
import { getServiceCategories } from "@/lib/data";
import { getUserServiceRequests, groupRequestsByStatus } from "@/lib/data/requests";
import { createClient } from "@/lib/supabase/server";

type Tab = "all" | "open" | "in-progress" | "completed";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: Tab }>;
}) {
  const { tab = "all" } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const [requests, categories] = await Promise.all([
    getUserServiceRequests(user?.id ?? "", user?.email ?? undefined),
    getServiceCategories(),
  ]);

  const grouped = groupRequestsByStatus(requests);
  const list =
    tab === "open"
      ? grouped.open
      : tab === "in-progress"
        ? grouped.inProgress
        : tab === "completed"
          ? grouped.completed
          : grouped.all;

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name || slug;
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All", count: grouped.all.length },
    { id: "open", label: "Open", count: grouped.open.length },
    { id: "in-progress", label: "In progress", count: grouped.inProgress.length },
    { id: "completed", label: "Completed", count: grouped.completed.length },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">My Jobs</h1>
      <p className="mt-1 text-sm text-muted">Track active, upcoming, and completed jobs.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.id === "all" ? "/dashboard/jobs" : `/dashboard/jobs?tab=${t.id}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              tab === t.id ? "bg-primary/15 text-primary" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {t.label} ({t.count})
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-muted">No jobs in this view.</p>
          <Link href="/request" className="mt-4 inline-block font-semibold text-primary hover:underline">
            Post your first job →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((r) => (
            <li key={r.id} className="rounded-[14px] border border-border bg-surface p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{categoryName(r.category_slug)}</p>
                  <p className="text-xs text-muted">
                    {cityName(r.city_slug)} · {new Date(r.created_at).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <Badge variant={r.status === "open" ? "orange" : "default"}>{r.status}</Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted">{r.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Pros can view this lead
                </span>
                <Link href={`/dashboard/jobs/${r.id}`} className="text-sm font-semibold text-primary hover:underline">
                  View details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
