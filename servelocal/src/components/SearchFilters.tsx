"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TRADE_CITIES, DEFAULT_SERVICE_CATEGORIES } from "@/lib/constants";

export function SearchFilters({ categories }: { categories: { slug: string; name: string }[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSearch = pathname === "/search";

  function patch(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v === null) next.delete(k);
      else next.set(k, v);
    });
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const licensed = searchParams.get("licensed") === "1";
  const verified = searchParams.get("verified") === "1";
  const emergency = searchParams.get("emergency") === "1";

  if (!isSearch) return null;

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
      <p className="text-sm font-semibold text-brand-950">Filters</p>
      <div className="flex flex-wrap gap-2">
        <select
          value={city}
          onChange={(e) => patch({ city: e.target.value || null })}
          className="input-field w-auto py-2 text-sm"
          aria-label="Filter by city"
        >
          <option value="">All cities</option>
          {TRADE_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => patch({ category: e.target.value || null })}
          className="input-field w-auto py-2 text-sm"
          aria-label="Filter by service"
        >
          <option value="">All services</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { key: "licensed", active: licensed, label: "Licensed" },
          { key: "verified", active: verified, label: "Verified" },
          { key: "emergency", active: emergency, label: "24/7 emergency" },
        ].map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => patch({ [chip.key]: chip.active ? null : "1" })}
            className={chip.active ? "chip-tag-active" : "chip-tag"}
          >
            {chip.label}
          </button>
        ))}
        {(city || category || licensed || verified || emergency) && (
          <Link href="/search" className="text-sm text-teal-600 hover:underline">
            Clear filters
          </Link>
        )}
      </div>
    </div>
  );
}

/** Client-side filters with built-in category list */
export function SearchFiltersWithDefaults() {
  return <SearchFilters categories={DEFAULT_SERVICE_CATEGORIES} />;
}
