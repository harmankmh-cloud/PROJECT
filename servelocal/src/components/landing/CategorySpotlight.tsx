import Link from "next/link";
import { getSeasonalSpotlights } from "@/lib/seasonal-spotlights";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export function CategorySpotlight() {
  const spotlights = getSeasonalSpotlights();

  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <p className="font-label text-primary">Trending now</p>
          <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
            Seasonal services
          </h2>
        </FadeUp>

        <StaggerGrid className="mt-8 grid gap-4 lg:grid-cols-3">
          {spotlights.map((spot) => (
            <StaggerItem key={spot.slug}>
              <Link
                href={spot.href}
                className={`card-glow group relative block overflow-hidden rounded-[14px] bg-gradient-to-br ${spot.gradient} p-6 text-white shadow-lg transition hover:-translate-y-1`}
              >
                <span className="text-3xl">{spot.emoji}</span>
                <h3 className="font-display mt-4 text-xl font-bold">{spot.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{spot.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition group-hover:gap-2">
                  {spot.cta} →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
