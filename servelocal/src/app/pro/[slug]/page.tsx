import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { ProviderContactButtons } from "@/components/ProviderContactButtons";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/Badge";
import { getCategoryIcon } from "@/lib/category-icons";
import { SERVE_LOCAL, cityName } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import {
  getApprovedProviders,
  getCategoryBySlug,
  getProviderBySlug,
  getProviderReviews,
} from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: "Pro not found" };

  const category = await getCategoryBySlug(provider.category_slug);

  return pageMetadata({
    title: `${provider.display_name} — ${category?.name || "Local pro"} in ${cityName(provider.city_slug)}`,
    description: `Contact ${provider.display_name} directly for ${category?.name.toLowerCase() || "local trade"} work in ${cityName(provider.city_slug)}, BC. Call or message — no middleman on ${SERVE_LOCAL.name}.`,
    path: `/pro/${slug}`,
  });
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const [category, reviews, related] = await Promise.all([
    getCategoryBySlug(provider.category_slug),
    getProviderReviews(provider.id),
    getApprovedProviders({
      categorySlug: provider.category_slug,
      citySlug: provider.city_slug,
      sort: "rating",
    }),
  ]);

  const photos = provider.portfolio_urls?.filter(Boolean) || [];
  const Icon = getCategoryIcon(provider.category_slug);
  const relatedPros = related.filter((p) => p.id !== provider.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.display_name,
    description: provider.bio,
    areaServed: cityName(provider.city_slug),
    aggregateRating:
      (provider.review_count ?? 0) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: provider.avg_rating,
            reviewCount: provider.review_count,
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative border-b border-slate-700 bg-gradient-to-br from-slate-900 via-surface to-background px-4 pb-10 pt-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/${provider.city_slug}/${provider.category_slug}`}
            className="text-sm font-medium text-slate-400 hover:text-primary"
          >
            ← {category?.name} in {cityName(provider.city_slug)}
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-800 text-3xl font-bold text-primary">
              {provider.display_name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {provider.verified && (
                  <Badge variant="success">
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Available for new work
                </span>
              </div>
              <h1 className="font-display mt-3 text-4xl font-black text-slate-50 sm:text-5xl">
                {provider.display_name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-slate-400">
                <Icon className="h-4 w-4 text-primary" />
                {category?.name} · <MapPin className="h-3.5 w-3.5" /> {cityName(provider.city_slug)}, BC
              </p>
              {(provider.avg_rating ?? 0) > 0 && (
                <div className="mt-4">
                  <StarRating rating={provider.avg_rating ?? 0} count={provider.review_count} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[200px]">
              <ProviderContactButtons provider={provider} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        {provider.bio && (
          <section>
            <h2 className="font-display text-xl font-bold text-slate-50">About</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">{provider.bio}</p>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-slate-50">Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="card-dark inline-flex items-center gap-2 px-4 py-2 text-sm">
              <Icon className="h-4 w-4 text-primary" />
              {category?.name}
            </span>
            {provider.emergency_available && (
              <span className="card-dark px-4 py-2 text-sm text-amber-400">24/7 emergency</span>
            )}
            {provider.licensed && (
              <span className="card-dark px-4 py-2 text-sm text-slate-300">Licensed in BC</span>
            )}
          </div>
        </section>

        {photos.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-slate-50">Work gallery</h2>
            <div className="mt-4 columns-2 gap-3 sm:columns-3">
              {photos.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`${provider.display_name} portfolio`}
                  className="mb-3 w-full break-inside-avoid rounded-xl object-cover"
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-slate-700 bg-surface p-6">
          <h2 className="font-display text-xl font-bold text-slate-50">Service area</h2>
          <p className="mt-2 text-sm text-slate-400">
            Primarily serves {cityName(provider.city_slug)} and surrounding Fraser Valley communities.
          </p>
          <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-800/50 text-sm text-slate-500">
            <MapPin className="mr-2 h-4 w-4" /> BC map — {cityName(provider.city_slug)} highlighted
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-slate-50">Reviews</h2>
          <div className="mt-6">
            <ReviewList reviews={reviews} />
          </div>
          <div className="mt-8">
            <ReviewForm providerId={provider.id} providerName={provider.display_name} />
          </div>
        </section>

        {relatedPros.length > 0 && (
          <section className="mt-14 border-t border-slate-700 pt-10">
            <h2 className="font-display text-xl font-bold text-slate-50">
              Other {category?.name} pros near {cityName(provider.city_slug)}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedPros.map((p) => (
                <li key={p.id}>
                  <Link href={`/pro/${p.slug}`} className="card-dark-hover block p-4">
                    <p className="font-semibold text-slate-50">{p.display_name}</p>
                    <p className="mt-1 text-xs text-slate-400">{cityName(p.city_slug)}</p>
                    {(p.avg_rating ?? 0) > 0 && (
                      <p className="mt-2 text-sm text-amber-400">★ {p.avg_rating}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 flex items-center gap-2 text-xs text-slate-500">
          <Phone className="h-3.5 w-3.5" />
          {SERVE_LOCAL.name} is a directory — agree price and scope directly with the contractor.
        </p>
      </div>

      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
