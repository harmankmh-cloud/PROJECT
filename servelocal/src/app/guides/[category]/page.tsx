import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProviderCard } from "@/components/ProviderCard";
import { COST_GUIDES } from "@/lib/constants";
import { getApprovedProviders, getCategoryBySlug } from "@/lib/data";

export default async function GuideCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const guide = COST_GUIDES[category];
  const pros = await getApprovedProviders({ categorySlug: category, sort: "rating" });

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <Link href="/guides" className="text-sm font-semibold text-teal-600 hover:underline">← All guides</Link>
        <h1 className="font-display mt-4 text-4xl text-brand-950">
          {cat.icon} {cat.name} costs in BC
        </h1>

        {guide ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">Typical pricing</h2>
              {guide.low > 0 ? (
                <p className="font-display mt-2 text-3xl text-teal-600">
                  ${guide.low}–${guide.high} <span className="text-base text-slate-500">{guide.unit}</span>
                </p>
              ) : (
                <p className="mt-2 text-slate-600">Project-based — get multiple quotes</p>
              )}
              <h3 className="mt-6 font-semibold text-brand-950">Common jobs</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {guide.commonJobs.map((job) => (
                  <li key={job.name} className="flex justify-between border-b border-slate-100 pb-2">
                    <span>{job.name}</span>
                    <span className="font-medium text-brand-950">{job.range}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-950">Tips before you hire</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <Link href={`/request?category=${category}`} className="btn-gold mt-6 inline-flex px-6 py-3">
                Get quotes for {cat.name}
              </Link>
            </div>
          </div>
        ) : (
          <div className="surface-card mt-8 p-8 text-center">
            <p className="text-slate-600">Pricing guide coming soon for this service.</p>
            <Link href={`/request?category=${category}`} className="btn-gold mt-6 inline-flex px-6 py-3">
              Get quotes for {cat.name}
            </Link>
          </div>
        )}

        {pros.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-brand-950">Top-rated {cat.name.toLowerCase()} pros</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pros.slice(0, 6).map((p) => (
                <ProviderCard key={p.id} provider={p} categoryName={cat.name} />
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
