import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { COST_GUIDES } from "@/lib/constants";
import { getServiceCategories } from "@/lib/data";

export default async function GuidesPage() {
  const categories = await getServiceCategories();

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">Cost guides</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">What trades cost in BC</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Typical price ranges for Fraser Valley & Metro Vancouver — like Angi cost guides. Always get 2–3 quotes before hiring.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const guide = COST_GUIDES[cat.slug];
            return (
              <Link key={cat.slug} href={`/guides/${cat.slug}`} className="surface-card-hover p-6">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="mt-3 font-semibold text-brand-950">{cat.name}</h2>
                {guide && guide.low > 0 && (
                  <p className="mt-1 text-sm text-accent-600">
                    ${guide.low}–${guide.high} {guide.unit}
                  </p>
                )}
                <p className="mt-3 text-sm text-slate-500">View guide →</p>
              </Link>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
