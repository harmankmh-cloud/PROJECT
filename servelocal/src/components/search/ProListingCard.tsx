import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Star } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

type Props = {
  provider: ServiceProvider;
  categoryName?: string;
  distance?: string;
  sponsored?: boolean;
};

export function ProListingCard({ provider, categoryName, distance, sponsored }: Props) {
  const isTopPro = provider.listing_tier === "premium" || provider.featured;

  return (
    <article
      className={`card-glow rounded-[14px] border bg-surface p-5 shadow-sm ${
        sponsored ? "border-amber-400/40 ring-1 ring-amber-400/20" : "border-border"
      }`}
    >
      {sponsored && (
        <span className="mb-3 inline-block rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Featured
        </span>
      )}
      <div className="flex gap-4">
        <Avatar name={provider.display_name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{provider.display_name}</h3>
            {isTopPro && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                Top Pro
              </span>
            )}
            {provider.verified && <BadgeCheck className="h-4 w-4 text-success" />}
          </div>
          <p className="text-sm text-muted">
            {categoryName ?? provider.category_slug} · {cityName(provider.city_slug)}
          </p>
          {(provider.avg_rating ?? 0) > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-amber-500">{provider.avg_rating}</span>
              <span className="text-muted">({provider.review_count ?? 0})</span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            {provider.response_time && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {provider.response_time}
              </span>
            )}
            {distance && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {distance}
              </span>
            )}
            {provider.min_callout_fee && <span>From {provider.min_callout_fee}</span>}
          </div>
        </div>
      </div>
      {provider.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-muted">{provider.bio}</p>
      )}
      <div className="mt-4 flex gap-2">
        <Link
          href={`/pro/${provider.slug}`}
          className="flex-1 rounded-full border border-border py-2 text-center text-sm font-semibold text-foreground transition hover:border-amber-400/50"
        >
          View Profile
        </Link>
        <ShimmerButton href={`/request?pro=${provider.slug}`} size="sm" className="flex-1">
          Get Quote
        </ShimmerButton>
      </div>
    </article>
  );
}
