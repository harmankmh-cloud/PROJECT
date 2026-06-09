"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TRADE_CITIES } from "@/lib/constants";
import type { ServiceCategory } from "@/lib/types";

type Props = {
  categories?: ServiceCategory[];
  showCategory?: boolean;
  basePath?: string;
};

export function FilterSidebar({ categories = [], showCategory = true, basePath }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = basePath ?? pathname;

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${path}?${params.toString()}`);
  }

  const radius = searchParams.get("radius") ?? "25";
  const availability = searchParams.get("availability") ?? "";
  const minRating = searchParams.get("minRating") ?? "";
  const sort = searchParams.get("sort") ?? "recommended";
  const instantBook = searchParams.get("instantBook") === "1";
  const fastResponse = searchParams.get("fastResponse") === "1";
  const verifiedOnly = searchParams.get("verified") === "1";
  const licensedOnly = searchParams.get("licensed") === "1";

  return (
    <aside className="space-y-6 rounded-[14px] border border-border bg-surface p-5">
      <div>
        <p className="font-label text-muted">Location radius</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["5", "10", "25", "50"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update("radius", r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                radius === r
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:border-amber-400/50"
              }`}
            >
              {r}km
            </button>
          ))}
        </div>
      </div>

      {showCategory && categories.length > 0 && (
        <div>
          <label htmlFor="filter-category" className="font-label text-muted">
            Category
          </label>
          <select
            id="filter-category"
            value={searchParams.get("category") ?? ""}
            onChange={(e) => update("category", e.target.value || null)}
            className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="filter-city" className="font-label text-muted">
          City
        </label>
        <select
          id="filter-city"
          value={searchParams.get("city") ?? ""}
          onChange={(e) => update("city", e.target.value || null)}
          className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All cities</option>
          {TRADE_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="font-label text-muted">Availability</p>
        <div className="mt-2 space-y-2">
          {[
            { value: "today", label: "Today" },
            { value: "week", label: "This week" },
            { value: "weekends", label: "Weekends" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="availability"
                checked={availability === opt.value}
                onChange={() => update("availability", opt.value)}
                className="accent-amber-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label text-muted">Minimum rating</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["3", "4", "4.5"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update("minRating", minRating === r ? null : r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                minRating === r ? "bg-primary text-white" : "border border-border text-muted"
              }`}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => update("verified", e.target.checked ? "1" : null)}
            className="accent-amber-500"
          />
          Verified only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={licensedOnly}
            onChange={(e) => update("licensed", e.target.checked ? "1" : null)}
            className="accent-amber-500"
          />
          Licensed only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={instantBook}
            onChange={(e) => update("instantBook", e.target.checked ? "1" : null)}
            className="accent-amber-500"
          />
          Instant Book
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fastResponse}
            onChange={(e) => update("fastResponse", e.target.checked ? "1" : null)}
            className="accent-amber-500"
          />
          Responds within 1 hour
        </label>
      </div>

      <div>
        <label htmlFor="filter-sort" className="font-label text-muted">
          Sort by
        </label>
        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="recommended">Best match</option>
          <option value="rating">Highest rated</option>
          <option value="reviews">Most reviews</option>
          <option value="experience">Most experience</option>
        </select>
      </div>
    </aside>
  );
}
