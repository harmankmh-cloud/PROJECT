import Link from "next/link";
import type { ServiceCategory } from "@/lib/types";
import { getCategoryIcon } from "@/lib/category-icons";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { cn } from "@/lib/utils";

const DISPLAY_SLUGS = [
  "plumber",
  "electrician",
  "cleaner",
  "landscaper",
  "roofer",
  "hvac",
  "painter",
  "mover",
  "snow-removal",
  "renovation",
  "pest-control",
  "appliance-repair",
] as const;

const SLUG_LABELS: Record<string, string> = {
  plumber: "Plumbing",
  electrician: "Electrical",
  cleaner: "Cleaning",
  landscaper: "Landscaping",
  roofer: "Roofing",
  hvac: "HVAC",
  painter: "Painting",
  mover: "Moving",
  "snow-removal": "Snow Removal 🍁",
  renovation: "Renovation",
  "pest-control": "Pest Control",
  "appliance-repair": "Appliance Repair",
};

type Props = {
  categories: ServiceCategory[];
  proCounts?: Record<string, number>;
  defaultCity?: string;
};

export function CategoryGrid({ categories, proCounts = {}, defaultCity = "surrey" }: Props) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const display = DISPLAY_SLUGS.map((slug) => {
    const cat = bySlug[slug];
    return {
      slug,
      name: cat?.name ?? SLUG_LABELS[slug] ?? slug,
      id: cat?.id ?? slug,
    };
  });

  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <p className="font-label text-primary">Popular services in BC</p>
          <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
            Start with the right trade
          </h2>
        </FadeUp>

        <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const count = proCounts[cat.slug] ?? 0;
            return (
              <StaggerItem key={cat.slug}>
                <Link
                  href={`/services/${cat.slug}?city=${defaultCity}`}
                  className={cn(
                    "card-glow group flex flex-col items-center gap-3 rounded-[14px] border border-border bg-surface p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1"
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-primary transition group-hover:bg-amber-400/25 group-hover:shadow-[0_0_20px_-4px_rgba(245,158,11,0.4)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <span className="font-label text-muted">
                    {count > 0 ? `${count} pros near you` : "Find pros near you"}
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <FadeUp className="mt-8 text-center">
          <Link
            href="/search"
            className="text-sm font-semibold text-primary transition hover:text-primary-light"
          >
            View all services →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
