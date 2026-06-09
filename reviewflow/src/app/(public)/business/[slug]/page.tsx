import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessInfoPanel } from "@/components/business/BusinessInfoPanel";
import { NearbySimilar } from "@/components/business/NearbySimilar";
import { PhotoGallery } from "@/components/business/PhotoGallery";
import { ReviewsSection } from "@/components/business/ReviewsSection";
import { WriteReviewCTA } from "@/components/business/WriteReviewCTA";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  getBusinessProfile,
  getBusinessReviews,
  getRatingBreakdown,
} from "@/lib/business-profile";
import { getSimilarBusinesses } from "@/lib/public-businesses";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  if (!business) return { title: "Business not found" };

  const title = `${business.name} — ${business.city ?? "Canada"}`;
  const description =
    business.description ??
    `Read ${business.review_count ?? 0} reviews for ${business.name}. ${business.avg_rating ?? 0}★ average rating on RateLocal.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: business.cover_photo_url ? [{ url: business.cover_photo_url }] : undefined,
    },
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);

  if (!business) notFound();

  const reviews = await getBusinessReviews(slug);
  const breakdown = getRatingBreakdown(reviews);
  const similar = await getSimilarBusinesses(
    business.business_type,
    business.city,
    business.slug,
    4
  );

  const galleryPhotos = [
    ...(business.gallery_photos ?? []),
    ...(business.cover_photo_url ? [business.cover_photo_url] : []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <main>
      <LandingNavbar />
      <BusinessHero business={business} />
      <PhotoGallery photos={galleryPhotos} businessName={business.name} />
      <ReviewsSection
        reviews={reviews}
        breakdown={breakdown}
        aiSummary={business.ai_summary}
        aiTags={business.ai_summary_tags}
      />
      <div className="marketing-container pb-12">
        <BusinessInfoPanel business={business} />
      </div>
      <NearbySimilar businesses={similar} />
      <WriteReviewCTA slug={business.slug} businessName={business.name} />
      <LandingFooter />
    </main>
  );
}
