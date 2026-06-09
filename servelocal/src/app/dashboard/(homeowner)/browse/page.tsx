import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

export default async function BrowseProsPage() {
  const [providers, categories] = await Promise.all([
    getApprovedProviders({ sort: "recommended" }),
    getServiceCategories(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900">Browse Pros</h1>
          <p className="mt-1 text-sm text-slate-500">Verified BC contractors — contact direct.</p>
        </div>
        <Link href="/search" className="text-sm font-semibold text-primary hover:underline">
          Advanced search →
        </Link>
      </div>

      {providers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">No pros listed yet in your area.</p>
          <Link href="/search" className="mt-4 inline-block text-sm font-semibold text-primary">
            Try search
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.slice(0, 12).map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        {categories.length} trade categories · Map view coming soon
      </p>
    </div>
  );
}
