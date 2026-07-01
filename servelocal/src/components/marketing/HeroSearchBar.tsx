"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { TRADE_CITIES } from "@/lib/constants";
import { POPULAR_CATEGORIES } from "@/content/copy";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>(TRADE_CITIES[0]?.slug ?? "surrey");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-[14px] border border-border bg-background/95 p-2 shadow-[0_12px_40px_-14px_rgba(245,158,11,0.32)] backdrop-blur sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What service do you need?"
            className="input-focus-glow w-full rounded-xl border-0 bg-transparent px-10 py-4 text-base text-foreground outline-none placeholder:text-muted"
            aria-label="What service do you need?"
          />
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="relative flex items-center sm:min-w-[180px]">
          <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input-focus-glow w-full cursor-pointer appearance-none rounded-xl bg-surface py-4 pl-9 pr-4 text-sm font-medium text-foreground outline-none"
            aria-label="Location"
          >
            {TRADE_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}, BC
              </option>
            ))}
          </select>
        </div>
        <ShimmerButton type="submit" size="lg" className="shrink-0">
          Search pros
        </ShimmerButton>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        <span className="text-xs font-medium text-muted">Popular:</span>
        {POPULAR_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setQuery(cat.label);
              router.push(`/search?q=${encodeURIComponent(cat.label)}&city=${city}`);
            }}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition hover:border-amber-400/50 hover:bg-background hover:text-primary"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
