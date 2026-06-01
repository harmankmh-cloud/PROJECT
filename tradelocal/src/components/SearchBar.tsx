"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plumber, electrician, Surrey…"
        className="input-field pr-24"
        aria-label="Search local trades"
      />
      <button type="submit" className="absolute right-1.5 top-1.5 btn-gold px-4 py-2 text-xs">
        Search
      </button>
    </form>
  );
}
