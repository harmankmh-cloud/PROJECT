"use client";

import Link from "next/link";
import type { ServiceProvider } from "@/lib/tradelocal/types";
import { cityName } from "@/lib/tradelocal/constants";

export function ProviderCard({
  provider,
  categoryName,
}: {
  provider: ServiceProvider;
  categoryName?: string;
}) {
  return (
    <Link
      href={`/trade/pro/${provider.slug}`}
      className="surface-card-hover block p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {provider.featured && (
            <span className="mb-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
              Featured
            </span>
          )}
          <h3 className="font-semibold text-brand-950">{provider.display_name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {categoryName || provider.category_slug} · {cityName(provider.city_slug)}
          </p>
        </div>
        {provider.licensed && (
          <span className="shrink-0 rounded-lg bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
            Licensed
          </span>
        )}
      </div>
      {provider.bio && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{provider.bio}</p>
      )}
      <p className="mt-4 text-sm font-semibold text-teal-600">View contact →</p>
    </Link>
  );
}
