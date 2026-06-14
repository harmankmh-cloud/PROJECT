import Link from "next/link";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { tradeNoun, tradeSeoPlural } from "@/lib/category-copy";
import { cityName } from "@/lib/constants";

type Props = {
  citySlug: string;
  categorySlug?: string;
  categoryName?: string;
  reason?: "zero-pros" | "filtered-out";
  compact?: boolean;
};

export function EmptyDirectoryState({
  citySlug,
  categorySlug,
  categoryName,
  reason = "zero-pros",
  compact = false,
}: Props) {
  const city = cityName(citySlug);
  const trade = categorySlug
    ? tradeNoun(categorySlug, categoryName ?? "local trade")
    : "local trades";
  const tradePlural = categoryName
    ? tradeSeoPlural(categorySlug, categoryName)
    : "local trades";
  const requestHref = categorySlug
    ? `/request?city=${citySlug}&category=${categorySlug}`
    : `/request?city=${citySlug}`;
  const joinHref = categorySlug
    ? `/join?city=${citySlug}&category=${categorySlug}`
    : `/join?city=${citySlug}`;
  const guideHref = categorySlug ? `/guides/${categorySlug}` : "/guides";

  const headline =
    reason === "filtered-out"
      ? "No pros match your filters"
      : categoryName
        ? `We're onboarding top ${tradePlural.toLowerCase()} in ${city}!`
        : `Directory growing in ${city}`;

  const body =
    reason === "filtered-out"
      ? "Try clearing filters or post your project — we'll manually match you with a vetted local pro within 24 hours."
      : `Post your project for free — our team will manually match you with a vetted local pro in ${city} within 24 hours.`;

  if (compact) {
    return (
      <div className="rounded-[14px] border border-dashed border-border p-8 text-center">
        <p className="font-medium text-foreground">{headline}</p>
        <p className="mt-2 text-sm text-muted">{body}</p>
        <Link href={requestHref} className="mt-4 inline-block text-primary hover:underline">
          Post a job to get matched →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-border bg-surface p-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {reason === "filtered-out" ? "Adjust your search" : `Growing in ${city}`}
        </p>
        <h2 className="font-display mt-4 text-2xl font-bold text-foreground">{headline}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
        <ShimmerButton href={requestHref} className="mt-6">
          Post a job in {city}
        </ShimmerButton>
        {categorySlug && (
          <p className="mt-4 text-sm text-muted">
            <Link href={guideHref} className="text-primary hover:underline">
              See {trade} cost guide for {city}
            </Link>
          </p>
        )}
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-sm font-medium text-foreground">
          Are you a {trade} in {city}?
        </p>
        <p className="mt-1 text-sm text-muted">Be among the first listed — free starter plan available.</p>
        <Link
          href={joinHref}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-amber-400/50"
        >
          List my business
        </Link>
      </div>
    </div>
  );
}
