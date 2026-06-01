"use client";

import Link from "next/link";
import type { ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { ProviderBadges } from "@/components/ProviderBadges";
import { StarRating } from "@/components/StarRating";

export function ProviderCard({
  provider,
  categoryName,
}: {
  provider: ServiceProvider;
  categoryName?: string;
}) {
  return (
    <Link href={`/pro/${provider.slug}`} className="surface-card-hover group block">
      <ProviderBadges provider={provider} />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-900 group-hover:text-accent-600">{provider.display_name}</h3>
          <p className="mt-1 text-sm text-zinc-500">
            {categoryName || provider.category_slug} · {cityName(provider.city_slug)}
          </p>
        </div>
      </div>
      {(provider.avg_rating || 0) > 0 && (
        <div className="mt-3">
          <StarRating rating={provider.avg_rating || 0} count={provider.review_count} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
        {provider.response_time && <span>{provider.response_time}</span>}
        {(provider.jobs_completed || 0) > 0 && <span>{provider.jobs_completed}+ jobs</span>}
        {provider.min_callout_fee && <span>From {provider.min_callout_fee}</span>}
      </div>
      {provider.bio && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600">{provider.bio}</p>
      )}
      <p className="mt-4 text-sm font-semibold text-accent-600">View profile →</p>
    </Link>
  );
}
