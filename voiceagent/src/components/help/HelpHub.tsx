"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HELP_ARTICLES, HELP_CATEGORIES } from "@/lib/help-articles";

export function HelpHub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HELP_ARTICLES.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="input-field min-w-0 flex-1"
            aria-label="Search help articles"
          />
          <button
            type="button"
            className="shrink-0 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:border-primary/40"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>('input[aria-label="Search help articles"]');
              el?.blur();
            }}
          >
            Search
          </button>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field sm:max-w-[12rem]"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {HELP_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/help/${article.slug}`}
            className="glass-card block p-5 transition hover:border-primary/30"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary-glow">
              {HELP_CATEGORIES.find((c) => c.id === article.category)?.label}
            </p>
            <h2 className="mt-2 font-display text-lg text-text">{article.title}</h2>
            <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted">No articles match your search.</p>
      )}
    </div>
  );
}
