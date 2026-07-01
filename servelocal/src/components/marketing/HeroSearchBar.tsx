"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { TRADE_CITIES } from "@/lib/constants";
import { POPULAR_CATEGORIES } from "@/content/copy";

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
        className="flex flex-col gap-2 rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-[0_24px_70px_-34px_rgba(124,92,255,0.7)] backdrop-blur sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What service do you need?"
            className="w-full rounded-xl border-0 bg-transparent px-10 py-4 text-base text-white outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400/40"
            aria-label="What service do you need?"
          />
        </div>
        <div className="hidden h-8 w-px bg-white/12 sm:block" />
        <div className="relative flex items-center sm:min-w-[180px]">
          <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl bg-transparent py-4 pl-9 pr-4 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-violet-400/40 [&>option]:text-slate-900"
            aria-label="Location"
          >
            {TRADE_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}, BC
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="sl-btn-primary shrink-0 !py-4">
          Search pros
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        <span className="text-xs font-medium text-slate-400">Popular:</span>
        {POPULAR_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setQuery(cat.label);
              router.push(`/search?q=${encodeURIComponent(cat.label)}&city=${city}`);
            }}
            className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-400/50 hover:bg-white/10 hover:text-white"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
