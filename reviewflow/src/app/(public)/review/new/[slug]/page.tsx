import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { WriteReviewFlow } from "@/components/reviews/WriteReviewFlow";
import { getBusinessProfile } from "@/lib/business-profile";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  return { title: business ? `Review ${business.name}` : "Write a Review" };
}

export default async function WriteReviewPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  if (!business) notFound();

  return (
    <main>
      <LandingNavbar />
      <WriteReviewFlow business={business} />
    </main>
  );
}
