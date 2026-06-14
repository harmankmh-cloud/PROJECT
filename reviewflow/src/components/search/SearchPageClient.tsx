"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { List, Map, Search, SlidersHorizontal } from "lucide-react";
import type { PublicBusiness } from "@/lib/types";
import { BusinessListingCard } from "./BusinessListingCard";
import { Skeleton } from "@/components/ui/Skeleton";

type ViewMode = "list" | "map";

export function SearchPageClient({ initialBusinesses, initialTotal }: {
  initialBusinesses: PublicBusiness[];
  initialTotal: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const q = searchParams.get("q") ?? "";
  const city = searchParams.get("city") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "match";
  const openNow = searchParams.get("openNow") === "true";
  const minRating = searchParams.get("minRating") ?? "";
  const hasPhotos = searchParams.get("hasPhotos") === "true";

  const buildParams = useCallback(
    (pageNum: number) => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (city) p.set("city", city);
      if (category) p.set("category", category);
      if (sort) p.set("sort", sort);
      if (openNow) p.set("openNow", "true");
      if (minRating) p.set("minRating", minRating);
      if (hasPhotos) p.set("hasPhotos", "true");
      p.set("page", String(pageNum));
      p.set("limit", "10");
      return p;
    },
    [q, city, category, sort, openNow, minRating, hasPhotos]
  );

  const fetchPage = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/businesses/search?${buildParams(pageNum)}`);
        const data = await res.json();
        setTotal(data.total);
        setBusinesses((prev) => (append ? [...prev, ...data.businesses] : data.businesses));
        setPage(pageNum);
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  useEffect(() => {
    setBusinesses(initialBusinesses);
    setTotal(initialTotal);
    setPage(1);
  }, [initialBusinesses, initialTotal]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && businesses.length < total) {
          fetchPage(page + 1, true);
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [businesses.length, total, loading, page, fetchPage]);

  function updateFilter(key: string, value: string | boolean) {
    const p = new URLSearchParams(searchParams.toString());
    if (value === false || value === "") p.delete(key);
    else p.set(key, String(value));
    router.push(`/search?${p.toString()}`);
  }

  return (
    <div className="marketing-container py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const p = new URLSearchParams(searchParams.toString());
          p.set("q", String(fd.get("q") ?? ""));
          router.push(`/search?${p.toString()}`);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search businesses, services, or locations"
            className="input-field pl-10"
          />
        </div>
        <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-ghost px-4">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </form>

      {showFilters && (
        <div className="card-glow mt-4 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => updateFilter("openNow", e.target.checked)}
            />
            Open Now
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasPhotos}
              onChange={(e) => updateFilter("hasPhotos", e.target.checked)}
            />
            Has Photos
          </label>
          <select
            value={minRating}
            onChange={(e) => updateFilter("minRating", e.target.value)}
            className="input-field"
          >
            <option value="">Min rating</option>
            {[4, 3, 2].map((r) => (
              <option key={r} value={r}>
                {r}+ stars
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="input-field"
          >
            <option value="match">Best Match</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="closest">Closest</option>
          </select>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {total} result{total !== 1 ? "s" : ""}
          {city ? ` in ${city}` : ""}
        </p>
        <div className="flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-1.5 text-sm ${view === "list" ? "bg-primary text-white" : "text-muted"}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("map")}
            className={`rounded-md px-3 py-1.5 text-sm ${view === "map" ? "bg-primary text-white" : "text-muted"}`}
          >
            <Map className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "map" ? (
        <div className="card-glow mt-6 flex h-96 items-center justify-center bg-surface">
          <div className="text-center text-muted">
            <Map className="mx-auto mb-3 h-12 w-12 opacity-40" />
            <p>Map view — Google Maps integration coming soon</p>
            <p className="mt-1 text-sm">{businesses.length} businesses in this area</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {businesses.map((b) => (
            <BusinessListingCard key={b.slug} business={b} />
          ))}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          <div ref={loaderRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
