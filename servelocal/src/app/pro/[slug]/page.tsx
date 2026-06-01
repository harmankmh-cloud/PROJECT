import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderBadges } from "@/components/ProviderBadges";
import { ProviderContactButtons } from "@/components/ProviderContactButtons";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StarRating } from "@/components/StarRating";
import { SERVE_LOCAL, cityName } from "@/lib/constants";
import { getCategoryBySlug, getProviderBySlug, getProviderReviews } from "@/lib/data";

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const [category, reviews] = await Promise.all([
    getCategoryBySlug(provider.category_slug),
    getProviderReviews(provider.id),
  ]);

  const photos = provider.portfolio_urls?.filter(Boolean) || [];

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <Link
          href={`/${provider.city_slug}/${provider.category_slug}`}
          className="text-sm font-semibold text-accent-600 hover:underline"
        >
          ← Back to listings
        </Link>

        <div className="surface-card mt-6 overflow-hidden">
          <div className="review-header">
            <ProviderBadges provider={provider} size="md" />
            <h1 className="font-display mt-4 text-3xl sm:text-4xl">{provider.display_name}</h1>
            <p className="mt-1 text-white/60">
              {category?.name || provider.category_slug} · {cityName(provider.city_slug)}, BC
            </p>
            {(provider.avg_rating || 0) > 0 && (
              <div className="mt-4">
                <StarRating rating={provider.avg_rating || 0} count={provider.review_count} />
              </div>
            )}
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            {photos.length > 0 && (
              <div className="portfolio-grid grid gap-3 sm:grid-cols-3">
                {photos.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url} src={url} alt={`${provider.display_name} work sample`} />
                ))}
              </div>
            )}

            {provider.bio && <p className="text-lg leading-relaxed text-slate-700">{provider.bio}</p>}

            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {provider.years_experience != null && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.years_experience}+ years</dd>
                </div>
              )}
              {(provider.jobs_completed || 0) > 0 && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Jobs completed</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.jobs_completed}+</dd>
                </div>
              )}
              {provider.response_time && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Typical response</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.response_time}</dd>
                </div>
              )}
              {provider.min_callout_fee && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Minimum call-out</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.min_callout_fee}</dd>
                </div>
              )}
              {provider.business_hours && (
                <div className="stat-chip sm:col-span-2">
                  <dt className="text-slate-500">Hours</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.business_hours}</dd>
                </div>
              )}
              {provider.license_number && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Licence #</dt>
                  <dd className="mt-1 font-semibold text-brand-950">{provider.license_number}</dd>
                </div>
              )}
              {provider.website && (
                <div className="stat-chip">
                  <dt className="text-slate-500">Website</dt>
                  <dd className="mt-1">
                    <a href={provider.website} target="_blank" rel="noreferrer" className="font-semibold text-accent-600 hover:underline">
                      Visit site ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="sticky bottom-4 z-10 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-xl">
              <ProviderContactButtons provider={provider} />
            </div>

            <p className="text-xs text-slate-500">
              {SERVE_LOCAL.name} is a directory — not the contractor. Agree price & scope directly with them.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl text-brand-950">Reviews</h2>
          <div className="mt-6">
            <ReviewList reviews={reviews} />
          </div>
        </div>

        <div className="mt-8">
          <ReviewForm providerId={provider.id} providerName={provider.display_name} />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
