import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getFeaturedBusinesses } from "@/lib/public-businesses";
import { FeaturedBusinesses } from "@/components/landing/FeaturedBusinesses";

export const metadata: Metadata = {
  title: "Search",
  description: "Search businesses, services, and locations across Canada.",
};

type Props = { searchParams: Promise<{ q?: string; city?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q, city, category } = await searchParams;
  const featured = await getFeaturedBusinesses(city, 8);

  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container py-12">
        <h1 className="font-display text-2xl font-bold text-text md:text-3xl">
          {q ? `Results for "${q}"` : category ? category : "Search"}
        </h1>
        <p className="mt-2 text-muted">
          {city ? `in ${city}` : "Canada"} — advanced filters and map view coming soon.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </div>
      <FeaturedBusinesses businesses={featured} />
      <LandingFooter />
    </main>
  );
}
