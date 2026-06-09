"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Globe, MapPin, Phone } from "lucide-react";
import type { PublicBusiness } from "@/lib/types";
import { StarDisplay } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";

const PRICE_LABELS = ["", "$", "$$", "$$$", "$$$$"];

function getTodayHours(hours: PublicBusiness["hours"]): string {
  if (!hours) return "";
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = days[new Date().getDay()];
  const today = hours[dayKey];
  if (!today) return "";
  if (today.closed) return "Closed today";
  return `Open until ${formatTime(today.close)}`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${period}` : `${hour}${period}`;
}

export function BusinessHero({ business }: { business: PublicBusiness }) {
  const hoursSnippet = getTodayHours(business.hours);
  const fullAddress = [business.address, business.city, business.province]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="relative">
      <div className="relative h-48 overflow-hidden bg-surface md:h-64 lg:h-80">
        {business.cover_photo_url ? (
          <Image
            src={business.cover_photo_url}
            alt={`${business.name} cover`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-primary/20 to-star/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <div className="marketing-container relative -mt-16 pb-8 md:-mt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            {business.logo_url && (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-4 border-bg bg-surface shadow-lg md:h-24 md:w-24">
                <Image
                  src={business.logo_url}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="muted">{business.business_type}</Badge>
                {business.is_open_now ? (
                  <Badge variant="success">Open Now</Badge>
                ) : (
                  <Badge variant="muted">Closed</Badge>
                )}
                {business.price_range ? (
                  <span className="text-star">{PRICE_LABELS[business.price_range]}</span>
                ) : null}
              </div>
              <h1 className="font-display text-3xl font-bold text-text md:text-4xl">
                {business.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StarDisplay
                  value={business.avg_rating ?? 0}
                  size="md"
                  showValue
                  animateOnLoad
                />
                <span className="text-sm text-muted">
                  {business.review_count} reviews
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/r/${business.slug}`}
            className="btn-primary-pill shrink-0 px-8 py-3.5 text-center"
          >
            Write a Review
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          {fullAddress && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {fullAddress}
            </span>
          )}
          {hoursSnippet && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              {hoursSnippet}
            </span>
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 hover:text-text">
              <Phone className="h-4 w-4 text-primary" />
              {business.phone}
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-text"
            >
              <Globe className="h-4 w-4 text-primary" />
              Website
            </a>
          )}
        </div>

        {business.description && (
          <p className="mt-4 max-w-3xl text-muted">{business.description}</p>
        )}
      </div>
    </section>
  );
}
