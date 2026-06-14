import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { PublicBusiness } from "@/lib/types";
import { StarDisplay } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";

const PRICE = ["", "$", "$$", "$$$", "$$$$"];

export function BusinessListingCard({ business }: { business: PublicBusiness }) {
  return (
    <Link
      href={`/business/${business.slug}`}
      className="card-glow group flex flex-col overflow-hidden p-0 sm:flex-row"
    >
      <div className="relative h-40 w-full flex-shrink-0 bg-surface sm:h-auto sm:w-48">
        {business.cover_photo_url ? (
          <Image
            src={business.cover_photo_url}
            alt={business.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No photo</div>
        )}
        {business.is_sponsored && (
          <Badge className="absolute left-2 top-2 bg-star/90 text-bg">Sponsored</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-text group-hover:text-primary">{business.name}</h3>
            <p className="text-sm text-muted">{business.business_type}</p>
          </div>
          {business.is_open_now ? (
            <Badge variant="success">Open</Badge>
          ) : (
            <Badge variant="muted">Closed</Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <StarDisplay value={business.avg_rating ?? 0} size="sm" showValue />
          <span className="text-sm text-muted">{business.review_count} reviews</span>
          {business.price_range ? (
            <span className="text-sm text-star">{PRICE[business.price_range]}</span>
          ) : null}
          {business.distance_km != null && (
            <span className="text-sm text-muted">{business.distance_km.toFixed(1)} km</span>
          )}
        </div>
        {business.top_review_snippet && (
          <p className="mt-2 line-clamp-2 text-sm italic text-muted">
            &ldquo;{business.top_review_snippet}&rdquo;
          </p>
        )}
        <p className="mt-auto flex items-center gap-1 pt-2 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {business.city}
        </p>
      </div>
    </Link>
  );
}
