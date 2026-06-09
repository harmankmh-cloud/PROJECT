"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
        className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row sm:items-center"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you need done?"
          className="flex-1 rounded-xl border-0 bg-transparent px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
          aria-label="What do you need done?"
        />
        <div className="h-px bg-slate-200 sm:h-8 sm:w-px" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="cursor-pointer appearance-none rounded-xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 outline-none sm:min-w-[160px]"
          aria-label="City in BC"
        >
          {TRADE_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-orange shrink-0 px-8 py-4 text-base font-bold">
          Find Pros →
        </button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {POPULAR_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setQuery(cat.label);
              router.push(`/search?q=${encodeURIComponent(cat.label)}&city=${city}`);
            }}
            className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-primary/50 hover:text-primary"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
