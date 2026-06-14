import Link from "next/link";
import { InteractiveMap } from "@/components/search/InteractiveMap";
import { ProListingCard } from "@/components/search/ProListingCard";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profiles";

const PAGE_SIZE = 12;

export default async function BrowseProsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, Number(pageParam || "1") - 1);

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const profile = user ? await getUserProfile(user.id) : null;

  const citySlug = profile?.preferred_city_slug ?? undefined;

  const [providers, categories] = await Promise.all([
    getApprovedProviders({ sort: "recommended", citySlug, page, pageSize: PAGE_SIZE }),
    getServiceCategories(),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const hasMore = providers.length === PAGE_SIZE;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">Browse Pros</h1>
          <p className="mt-1 text-sm text-muted">
            Verified Canadian contractors{citySlug ? ` near ${citySlug.replace(/-/g, " ")}` : ""}.
          </p>
        </div>
        <Link href="/search" className="text-sm font-semibold text-primary hover:underline">
          Advanced search →
        </Link>
      </div>

      {providers.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">No pros listed yet in your area.</p>
          <Link href="/search" className="mt-4 inline-block text-sm font-semibold text-primary">
            Try search
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <InteractiveMap providers={providers} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {providers.map((p) => (
              <ProListingCard key={p.id} provider={p} categoryName={categoryNames[p.category_slug]} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between text-sm">
            {page > 0 ? (
              <Link href={`/dashboard/browse?page=${page}`} className="font-semibold text-primary hover:underline">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            {hasMore ? (
              <Link
                href={`/dashboard/browse?page=${page + 2}`}
                className="font-semibold text-primary hover:underline"
              >
                Next →
              </Link>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
