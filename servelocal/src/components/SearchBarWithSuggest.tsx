"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DEFAULT_SERVICE_CATEGORIES, TRADE_CITIES } from "@/lib/constants";

const SUGGESTIONS = [
  ...DEFAULT_SERVICE_CATEGORIES.flatMap((c) =>
    TRADE_CITIES.slice(0, 4).map((city) => ({
      label: `${c.name} in ${city.name}`,
      href: `/search?q=${encodeURIComponent(`${c.name} ${city.name}`)}`,
    }))
  ),
];

export function SearchBarWithSuggest({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Plumber, electrician, Surrey…"
          className="input-field pl-11 pr-28"
          aria-label="Search local trades"
          aria-autocomplete="list"
        />
        <button type="submit" className="absolute right-1.5 top-1.5 btn-gold px-5 py-2 text-xs">
          Search
        </button>
      </form>
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {filtered.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                onMouseDown={(e) => e.preventDefault()}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
