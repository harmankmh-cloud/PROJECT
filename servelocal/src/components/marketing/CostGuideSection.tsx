import Link from "next/link";
import { COST_ESTIMATES } from "@/content/copy";

export function CostGuideSection() {
  return (
    <section className="border-t border-slate-700/80 bg-surface/30 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-label text-primary">Cost guides</p>
        <h2 className="font-display mt-2 text-3xl font-black text-slate-50 sm:text-4xl">
          How much does it cost?
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">
          BC-specific estimates for popular jobs. Tap a card for the full cost guide.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COST_ESTIMATES.map((item) => (
            <Link
              key={item.slug}
              href={`/guides/${item.slug}`}
              className="card-dark-hover group"
            >
              <p className="font-semibold text-slate-50 group-hover:text-primary">{item.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">{item.range}</p>
              <p className="mt-2 text-xs text-slate-500">View full BC cost guide →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
