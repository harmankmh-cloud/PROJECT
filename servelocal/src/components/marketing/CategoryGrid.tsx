import Link from "next/link";
import type { ServiceCategory } from "@/lib/types";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

type Props = {
  categories: ServiceCategory[];
  proCounts?: Record<string, number>;
  defaultCity?: string;
};

export function CategoryGrid({ categories, proCounts = {}, defaultCity = "surrey" }: Props) {
  const display = categories.slice(0, 12);

  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-label text-primary">Browse trades</p>
        <h2 className="font-display mt-2 text-3xl font-black text-slate-50 sm:text-4xl">
          Popular categories in BC
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const count = proCounts[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`/${defaultCity}/${cat.slug}`}
                className={cn(
                  "card-dark-hover group flex flex-col items-center gap-3 p-6 text-center",
                  "hover:scale-[1.02]"
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary/25">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-semibold text-slate-50">{cat.name}</span>
                <span className="font-label text-slate-500">
                  {count > 0 ? `${count} pros near you` : "Find pros near you"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
