import Link from "next/link";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { getHomeownerDashboardCounts } from "@/lib/data/bookings";
import { getUserServiceRequests } from "@/lib/data/requests";
import { createClient } from "@/lib/supabase/server";

export default async function HomeownerOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const [counts, requests] = await Promise.all([
    user ? getHomeownerDashboardCounts(user.id) : null,
    user ? getUserServiceRequests(user.id) : [],
  ]);

  const latestJob = requests[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Your jobs, quotes, and messages at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard href="/dashboard/jobs" label="Active jobs" value={counts?.activeJobs ?? 0} />
        <OverviewCard href="/dashboard/quotes" label="Open quotes" value={counts?.openQuotes ?? 0} />
        <OverviewCard href="/dashboard/messages" label="Message threads" value={counts?.unreadMessages ?? 0} />
        <OverviewCard href="/dashboard/reviews" label="Pending reviews" value={counts?.pendingReviews ?? 0} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <ShimmerButton href="/request">Post a New Job</ShimmerButton>
        <Link href="/dashboard/browse" className="text-sm font-semibold text-primary hover:underline">
          Browse pros →
        </Link>
      </div>

      {latestJob ? (
        <div className="mt-8 rounded-[14px] border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Latest job</p>
          <p className="mt-2 font-semibold text-foreground">{latestJob.description.slice(0, 120)}</p>
          <p className="mt-1 text-xs text-muted capitalize">Status: {latestJob.status}</p>
          <Link
            href={`/dashboard/jobs/${latestJob.id}`}
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            View job details →
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-8 text-center">
          <p className="text-muted">No jobs yet. Post your first request to get matched with local pros.</p>
        </div>
      )}
    </div>
  );
}

function OverviewCard({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link
      href={href}
      className="rounded-[14px] border border-border bg-surface p-5 transition hover:border-primary/40"
    >
      <p className="text-3xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Link>
  );
}
