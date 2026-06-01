"use client";

import type { ServiceCategory } from "@/lib/types";

export function ServiceCategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: ServiceCategory[];
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold">What service do you need?</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {categories.map((cat) => {
          const selected = value === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onChange(cat.slug)}
              className={
                selected
                  ? "service-type-card service-type-card-selected"
                  : "service-type-card"
              }
              aria-pressed={selected}
            >
              <span className="text-2xl" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="mt-1 text-xs font-semibold leading-tight text-brand-950">{cat.name}</span>
            </button>
          );
        })}
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-600">Or pick from list</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field select-field"
          required
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
