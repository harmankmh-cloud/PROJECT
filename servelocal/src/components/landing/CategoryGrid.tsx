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
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <p className="sl-eyebrow">Popular services in BC</p>
          <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start with the right trade
          </h2>
        </FadeUp>

        <StaggerGrid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const count = proCounts[cat.slug] ?? 0;
            return (
              <StaggerItem key={cat.slug}>
                <Link
                  href={`/services/${cat.slug}?city=${defaultCity}`}
                  className={cn("sl-card sl-card-hover group relative block overflow-hidden p-6 text-center")}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7c5cff] via-[#ff45a8] to-[#ff7738] opacity-0 transition group-hover:opacity-100" />
                  <span className="sl-icon-tile mx-auto flex h-12 w-12 transition group-hover:shadow-[0_0_28px_-4px_rgba(124,92,255,0.6)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-3 block font-semibold text-white">{cat.name}</span>
                  <span className="mt-1 block font-label text-slate-400">
                    {count > 0 ? `${count} pros near you` : "Find pros near you"}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-300 transition group-hover:gap-2">
                    Browse {cat.name.toLowerCase()} &rarr;
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <FadeUp className="mt-8 text-center">
          <Link
            href="/search"
            className="text-sm font-semibold text-violet-300 transition hover:text-violet-200"
          >
            View all services &rarr;
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
