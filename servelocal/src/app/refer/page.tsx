import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { pageMetadata } from "@/lib/seo";
import { FOUNDING_PRO } from "@/lib/tradie-program";

export const metadata: Metadata = pageMetadata({
  title: "Refer a Friend — Trades & Homeowners",
  description:
    "Refer a BC tradie or homeowner to ServeLocal. Help grow the local directory — no middleman lead fees.",
  path: "/refer",
});

export default function ReferPage() {
  const shareText = encodeURIComponent(
    "Check out ServeLocal — find BC trades and call direct, no lead fees: https://www.servelocal.ca"
  );

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
        <p className="font-label text-primary">Refer a friend</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">Grow the local directory</h1>
        <p className="mt-3 text-muted">
          Know a great tradie who hates paying per-lead fees? Or a homeowner tired of middleman marketplaces? Share
          ServeLocal — it helps us add more verified pros in your area.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[14px] border border-border bg-surface p-6">
            <h2 className="font-semibold text-foreground">Refer a tradie</h2>
            <p className="mt-2 text-sm text-muted">
              Send them to our free listing — Founding Featured is {FOUNDING_PRO.featuredPrice} ({FOUNDING_PRO.duration}
              ), still cheaper than one Thumbtack lead.
            </p>
            <ShimmerButton href="/join" size="sm" className="mt-4">
              Share /join link
            </ShimmerButton>
          </div>
          <div className="rounded-[14px] border border-border bg-surface p-6">
            <h2 className="font-semibold text-foreground">Refer a homeowner</h2>
            <p className="mt-2 text-sm text-muted">They can post jobs free and browse BC cost guides before hiring.</p>
            <Link
              href="/request"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-amber-400/50"
            >
              Share /request link
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:?subject=${encodeURIComponent("ServeLocal — BC trades directory")}&body=${shareText}`}
            className="btn-shimmer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Email a friend
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-amber-400/50"
          >
            Back home
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
