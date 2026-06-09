import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getFeaturedBusinesses } from "@/lib/public-businesses";
import { FeaturedBusinesses } from "@/components/landing/FeaturedBusinesses";

export const metadata: Metadata = {
  title: "Discover Local",
  description: "Explore top-rated businesses and hidden gems across Canada.",
};

export default async function DiscoverPage() {
  const featured = await getFeaturedBusinesses(undefined, 8);

  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container py-16">
        <h1 className="font-display text-3xl font-bold text-text md:text-4xl">Discover</h1>
        <p className="mt-3 text-muted">Top-rated local businesses — full discovery coming soon.</p>
        <Link href="/search" className="btn-primary-pill mt-6 inline-block px-6 py-2.5 text-sm">
          Search all businesses →
        </Link>
      </div>
      <FeaturedBusinesses businesses={featured} />
      <LandingFooter />
    </main>
  );
}
