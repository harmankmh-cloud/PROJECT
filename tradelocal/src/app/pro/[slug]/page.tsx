import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderContactButtons } from "@/components/ProviderContactButtons";
import { TRADE_LOCAL, cityName } from "@/lib/constants";
import { getCategoryBySlug, getProviderBySlug } from "@/lib/data";

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const category = await getCategoryBySlug(provider.category_slug);

  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header px-4 py-4 sm:px-8">
        <Link
          href={`/${provider.city_slug}/${provider.category_slug}`}
          className="text-sm font-semibold text-teal-600 hover:underline"
        >
          ← Back to listings
        </Link>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
        <div className="surface-card overflow-hidden">
          <div className="review-header">
            {provider.featured && (
              <span className="mb-2 inline-block text-xs font-bold uppercase text-gold-400">Featured</span>
            )}
            <h1 className="font-display text-3xl">{provider.display_name}</h1>
            <p className="mt-1 text-white/60">
              {category?.name || provider.category_slug} · {cityName(provider.city_slug)}, BC
            </p>
          </div>
          <div className="space-y-6 p-6 sm:p-8">
            {provider.bio && <p className="leading-relaxed text-slate-700">{provider.bio}</p>}
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {provider.years_experience != null && (
                <div>
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="font-medium text-brand-950">{provider.years_experience}+ years</dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">Licensed in BC</dt>
                <dd className="font-medium text-brand-950">{provider.licensed ? "Yes" : "Not listed"}</dd>
              </div>
            </dl>
            <ProviderContactButtons provider={provider} />
            <p className="text-xs text-slate-500">
              {TRADE_LOCAL.name} is a directory — not the contractor. Agree price & scope directly with them.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
