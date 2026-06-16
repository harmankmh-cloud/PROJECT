import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { cityName } from "@/lib/constants";
import { getUserBookings } from "@/lib/data/bookings";
import { getServiceCategories, getApprovedProviders } from "@/lib/data";
import { getServiceRequestById } from "@/lib/data/requests";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";

const TIMELINE = [
  { key: "posted", label: "Posted" },
  { key: "matched", label: "Matched" },
  { key: "quoted", label: "Quoted" },
  { key: "booked", label: "Booked" },
  { key: "completed", label: "Completed" },
] as const;

function timelineStep(status: string) {
  if (status === "completed" || status === "closed") return 4;
  if (status === "booked" || status === "confirmed") return 3;
  if (status === "quoted") return 2;
  if (status === "matched" || status === "in_progress" || status === "active") return 1;
  return 0;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getServerAuthUser();

  if (!user) notFound();

  const [request, categories, bookings] = await Promise.all([
    getServiceRequestById(id, user.id),
    getServiceCategories(),
    getUserBookings(user.id),
  ]);

  if (!request) notFound();

  const categoryName = categories.find((c) => c.slug === request.category_slug)?.name || request.category_slug;
  const step = timelineStep(request.status);
  const relatedBookings = bookings.filter(
    (b) =>
      b.service_providers?.category_slug === request.category_slug ||
      b.service_description.toLowerCase().includes(request.description.slice(0, 20).toLowerCase())
  );

  const matchingPros = await getApprovedProviders({
    citySlug: request.city_slug,
    categorySlug: request.category_slug,
    sort: "recommended",
  });

  return (
    <div>
      <Link href="/dashboard/jobs" className="text-sm font-semibold text-primary hover:underline">
        ← Back to jobs
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">{categoryName}</h1>
          <p className="mt-1 text-sm text-muted">
            {cityName(request.city_slug)} · {new Date(request.created_at).toLocaleDateString("en-CA")}
          </p>
        </div>
        <Badge variant={request.status === "open" ? "orange" : "default"}>{request.status}</Badge>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-foreground">{request.description}</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">Timeline</h2>
        <ol className="mt-4 flex flex-wrap gap-2">
          {TIMELINE.map((item, index) => (
            <li
              key={item.key}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                index <= step ? "bg-primary/15 text-primary" : "bg-surface text-muted"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ol>
      </section>

      {relatedBookings.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">Quotes &amp; bookings</h2>
          <ul className="mt-4 space-y-3">
            {relatedBookings.map((b) => (
              <li key={b.id} className="rounded-xl border border-border bg-surface p-4 text-sm">
                <p className="font-semibold text-foreground">{b.service_providers?.display_name ?? "Pro"}</p>
                <p className="text-muted capitalize">
                  {b.status} · ${(b.total_cents / 100).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">Next steps</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <ShimmerButton href={`/${request.city_slug}/${request.category_slug}`} size="sm">
            Browse matching pros
          </ShimmerButton>
          {step >= 3 ? (
            <Link href="/dashboard/reviews" className="text-sm font-semibold text-primary hover:underline">
              Leave a review →
            </Link>
          ) : null}
        </div>
        {matchingPros.length > 0 ? (
          <p className="mt-3 text-xs text-muted">{matchingPros.length} verified pros in your area.</p>
        ) : null}
      </section>
    </div>
  );
}
