import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { StarDisplay } from "@/components/ui/StarRating";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";
import { SEED_BUSINESSES } from "@/data/seed-businesses";

export const metadata: Metadata = {
  title: "Discover Local",
  description: "Top-rated businesses, hidden gems, and seasonal spotlights across Canada.",
};

const CITIES = ["Vancouver", "Calgary", "Toronto", "Abbotsford", "Edmonton"];

const SPOTLIGHTS = [
  { title: "Best Patio Restaurants ☀️", category: "Restaurants", emoji: "☀️" },
  { title: "Top Snow Removal 🍁", category: "Services", emoji: "🍁" },
];

export default function DiscoverPage() {
  const topRated = [...SEED_BUSINESSES].sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
  const hiddenGems = SEED_BUSINESSES.filter((b) => (b.review_count ?? 0) < 100 && (b.avg_rating ?? 0) >= 4.5);
  const mostReviewed = [...SEED_BUSINESSES].sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
  const trending = ["brunch abbotsford", "auto repair vancouver", "hair salon calgary", "dentist toronto"];

  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container py-12">
        <FadeInSection>
          <h1 className="font-display text-3xl font-bold text-text md:text-4xl">Discover</h1>
          <p className="mt-2 text-muted">Curated lists and trending searches across Canada</p>
        </FadeInSection>

        {CITIES.map((city) => {
          const cityBiz = topRated.filter((b) => b.city === city).slice(0, 3);
          if (cityBiz.length === 0) return null;
          return (
            <section key={city} className="mt-12">
              <h2 className="font-display text-xl font-bold text-text">
                Top Rated in {city} This Month
              </h2>
              <StaggerChildren className="mt-4 grid gap-4 sm:grid-cols-3">
                {cityBiz.map((b) => (
                  <StaggerItem key={b.slug}>
                    <Link href={`/business/${b.slug}`} className="card-glow block overflow-hidden p-0">
                      <div className="relative h-28 bg-surface">
                        {b.cover_photo_url && (
                          <Image src={b.cover_photo_url} alt="" fill className="object-cover" sizes="300px" />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-text">{b.name}</h3>
                        <StarDisplay value={b.avg_rating ?? 0} size="sm" showValue />
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </section>
          );
        })}

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text">Hidden Gems</h2>
          <p className="text-sm text-muted">High-rated spots with fewer reviews</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiddenGems.map((b) => (
              <Link key={b.slug} href={`/business/${b.slug}`} className="card-glow p-4">
                <h3 className="font-semibold text-text">{b.name}</h3>
                <p className="text-sm text-muted">{b.city} · {b.review_count} reviews</p>
                <StarDisplay value={b.avg_rating ?? 0} size="sm" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text">Most Reviewed</h2>
          <div className="mt-4 space-y-2">
            {mostReviewed.slice(0, 5).map((b, i) => (
              <Link
                key={b.slug}
                href={`/business/${b.slug}`}
                className="card-glow flex items-center justify-between p-4"
              >
                <span className="font-display text-lg text-star">#{i + 1}</span>
                <span className="flex-1 px-4 font-medium text-text">{b.name}</span>
                <span className="text-sm text-muted">{b.review_count} reviews</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text">Seasonal Spotlights</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SPOTLIGHTS.map((s) => (
              <Link
                key={s.title}
                href={`/search?category=${encodeURIComponent(s.category)}`}
                className="card-glow bg-gradient-to-br from-primary/10 to-star/10 p-6"
              >
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-text">{s.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text">Trending Searches Today</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {trending.map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text hover:border-primary"
              >
                {t}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <LandingFooter />
    </main>
  );
}
