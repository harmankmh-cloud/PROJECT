"use client";

import { useState } from "react";
import { List, Map } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { InteractiveMap } from "@/components/search/InteractiveMap";
import { ProListingCard } from "@/components/search/ProListingCard";
import { cityName } from "@/lib/constants";

type Props = {
  providers: ServiceProvider[];
  categoryNames: Record<string, string>;
  citySlug?: string;
  query?: string;
};

export function SearchSplitView({ providers, categoryNames, citySlug, query }: Props) {
  const [view, setView] = useState<"split" | "list" | "map">("split");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium ${
            view === "list" ? "bg-primary text-white" : "border border-border"
          }`}
        >
          <List className="h-4 w-4" /> List
        </button>
        <button
          type="button"
          onClick={() => setView("map")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium ${
            view === "map" ? "bg-primary text-white" : "border border-border"
          }`}
        >
          <Map className="h-4 w-4" /> Map
        </button>
      </div>

      <div
        className={`grid gap-6 ${
          view === "split" ? "lg:grid-cols-[1fr_1fr]" : view === "map" ? "grid-cols-1" : "grid-cols-1"
        }`}
      >
        {(view === "split" || view === "list") && (
          <div className="space-y-4">
            {providers.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-border p-8 text-center">
                <p className="font-medium text-foreground">No results found</p>
                <p className="mt-2 text-sm text-muted">
                  {query
                    ? `We couldn't find pros for "${query}" nearby.`
                    : "Try adjusting your filters."}
                </p>
                <p className="mt-4 text-sm text-muted">
                  We found these pros in nearby cities — expand your search radius or{" "}
                  <a href="/request" className="text-primary hover:underline">
                    post a job
                  </a>{" "}
                  to get matched.
                </p>
              </div>
            ) : (
              providers.map((p, i) => (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={hoveredId === p.id ? "ring-2 ring-amber-400/30 rounded-[14px]" : ""}
                >
                  <ProListingCard
                    provider={p}
                    categoryName={categoryNames[p.category_slug]}
                    distance={citySlug ? `In ${cityName(p.city_slug)}` : undefined}
                    sponsored={i === 0 && p.featured}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {(view === "split" || view === "map") && (
          <div className="sticky top-24 h-fit">
            <InteractiveMap providers={providers} citySlug={citySlug} />
          </div>
        )}
      </div>
    </div>
  );
}
