import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { ProAbout } from "@/components/pro/ProAbout";
import { ProAvailability } from "@/components/pro/ProAvailability";
import { ProCredentials } from "@/components/pro/ProCredentials";
import { ProHero } from "@/components/pro/ProHero";
import { ProPortfolioGallery } from "@/components/pro/ProPortfolioGallery";
import { ProQASection } from "@/components/pro/ProQASection";
import { ProReviewsSection } from "@/components/pro/ProReviewsSection";
import { ProServicesPricing } from "@/components/pro/ProServicesPricing";
import { RequestQuoteForm } from "@/components/pro/RequestQuoteForm";
import { SimilarProsCarousel } from "@/components/pro/SimilarProsCarousel";
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
    description: `Contact ${provider.display_name} for ${category?.name.toLowerCase() || "local trade"} work in ${cityName(provider.city_slug)}, BC. Vetted, reviewed, and ready to quote on ${SERVE_LOCAL.name}.`,
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
  const relatedPros = related.filter((p) => p.id !== provider.id).slice(0, 6);
  const cityCategoryHref = `/${provider.city_slug}/${provider.category_slug}`;

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
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      <ProHero provider={provider} category={category} cityCategoryHref={cityCategoryHref} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div className="space-y-12">
            <ProAbout provider={provider} />
            <ProServicesPricing provider={provider} category={category} />
            <ProPortfolioGallery photos={photos} providerName={provider.display_name} />
            <ProReviewsSection
              reviews={reviews}
              providerId={provider.id}
              providerName={provider.display_name}
              avgRating={provider.avg_rating}
            />
            <ProCredentials provider={provider} />
            <ProAvailability providerId={provider.id} />
            <ProQASection proName={provider.display_name} providerId={provider.id} />
            <SimilarProsCarousel
              providers={relatedPros}
              category={category}
              citySlug={provider.city_slug}
            />
          </div>

          <aside className="hidden lg:block">
            <RequestQuoteForm
              providerId={provider.id}
              providerSlug={provider.slug}
              providerName={provider.display_name}
            />
          </aside>
        </div>

        <div className="mt-8 lg:hidden">
          <RequestQuoteForm
            providerId={provider.id}
            providerSlug={provider.slug}
            providerName={provider.display_name}
          />
        </div>
      </div>

      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
