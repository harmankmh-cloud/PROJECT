import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { COST_GUIDES } from "@/lib/constants";
import { guidePricePreview } from "@/lib/marketing-content";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "BC Trades Cost Guides",
  description:
    "Typical plumber, electrician, roofer, and handyman prices in Fraser Valley and Metro Vancouver. BC-focused hiring tips before you get quotes.",
  path: "/guides",
});

export default async function GuidesPage() {
  const categories = await getServiceCategories();

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <p className="font-label text-primary">Cost guides</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">What trades cost in BC</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Typical price ranges for Fraser Valley &amp; Metro Vancouver — like Angi cost guides. Always get 2–3 quotes
          before hiring.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const guide = COST_GUIDES[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/guides/${cat.slug}`}
                className="rounded-[14px] border border-border bg-surface p-6 transition-colors hover:border-amber-400/40"
              >
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="mt-3 font-semibold text-foreground">{cat.name}</h2>
                {guide && <p className="mt-1 text-sm text-primary">{guidePricePreview(cat.slug, guide)}</p>}
                <p className="mt-3 text-sm text-muted">View guide →</p>
              </Link>
            );
          })}
        </div>
      </div>
    </MarketingPageShell>
  );
}
