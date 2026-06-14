import Link from "next/link";
import { AdminReviewsTable } from "@/components/AdminReviewsTable";
import { getAppUrl } from "@/lib/app-url-server";
import { getPlatformFeedback } from "@/lib/admin-data";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const privateOnly = filter === "private";
  const [reviews, appUrl] = await Promise.all([
    getPlatformFeedback(200, { privateOnly }),
    getAppUrl(),
  ]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">All reviews</h1>
          <p className="mt-2 text-sm text-stone-500">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
            {privateOnly ? " — private feedback only (1–2 stars)" : " across every business"}
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/reviews"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              !privateOnly
                ? "bg-brand-950 text-white"
                : "border border-slate-200/80 bg-white text-slate-700 hover:bg-cream"
            }`}
          >
            All reviews
          </Link>
          <Link
            href="/admin/reviews?filter=private"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              privateOnly
                ? "bg-brand-950 text-white"
                : "border border-slate-200/80 bg-white text-slate-700 hover:bg-cream"
            }`}
          >
            Private (1–2 stars)
          </Link>
        </div>

        <AdminReviewsTable rows={reviews} appUrl={appUrl} />
      </div>
    </main>
  );
}
