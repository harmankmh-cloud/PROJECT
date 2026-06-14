import Image from "next/image";
import Link from "next/link";
import type { PublicBusiness } from "@/lib/types";
import { StarDisplay } from "@/components/ui/StarRating";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function NearbySimilar({ businesses }: { businesses: PublicBusiness[] }) {
  if (businesses.length === 0) return null;

  return (
    <FadeInSection className="marketing-container py-12">
      <h2 className="font-display mb-6 text-xl font-bold text-text md:text-2xl">
        Similar businesses nearby
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businesses.map((biz) => (
          <Link key={biz.slug} href={`/business/${biz.slug}`} className="card-glow group overflow-hidden p-0">
            <div className="relative h-28 overflow-hidden bg-surface">
              {biz.cover_photo_url ? (
                <Image
                  src={biz.cover_photo_url}
                  alt={biz.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="250px"
                />
              ) : null}
            </div>
            <div className="p-3">
              <h3 className="truncate font-semibold text-text">{biz.name}</h3>
              <p className="text-xs text-muted">{biz.business_type}</p>
              <div className="mt-2">
                <StarDisplay value={biz.avg_rating ?? 0} size="sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </FadeInSection>
  );
}
