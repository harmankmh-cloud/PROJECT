import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProviderCard } from "@/components/ProviderCard";
import { SearchBar } from "@/components/SearchBar";
import { searchProviders } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchProviders(query) : [];

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950">Search local pros</h1>
        <div className="mt-6 max-w-xl">
          <SearchBar defaultValue={query} />
        </div>

        {!query && (
          <p className="mt-8 text-slate-600">Try &quot;plumber Surrey&quot;, &quot;electrician&quot;, or a business name.</p>
        )}

        {query && (
          <>
            <p className="mt-8 text-sm text-slate-500">
              {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            {results.length === 0 ? (
              <div className="surface-card mt-6 p-8 text-center">
                <p className="font-medium text-brand-950">No matches yet</p>
                <p className="mt-2 text-sm text-slate-600">Post your job and we&apos;ll help you find someone.</p>
                <Link href="/request" className="btn-gold mt-4 inline-flex px-6 py-3">Post a job</Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
