import Link from "next/link";
import { InteractiveMap } from "@/components/search/InteractiveMap";
import { ProListingCard } from "@/components/search/ProListingCard";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

export default async function BrowseProsPage() {
  const [providers, categories] = await Promise.all([
    getApprovedProviders({ sort: "recommended" }),
    getServiceCategories(),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">Browse Pros</h1>
          <p className="mt-1 text-sm text-muted">Verified Canadian contractors near you.</p>
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
            {providers.slice(0, 8).map((p) => (
              <ProListingCard key={p.id} provider={p} categoryName={categoryNames[p.category_slug]} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
