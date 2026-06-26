import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { Reveal } from "@/components/ui/Reveal";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About ${BRAND.name}`,
  description: `${BRAND.name} is a BC-built review-collection tool that helps local businesses earn honest Google reviews and route private feedback before it goes public.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${BRAND.name}`,
    description: `${BRAND.name} is a BC-built review-collection tool that helps local businesses earn honest Google reviews and route private feedback before it goes public.`,
    url: `https://${BRAND.domain}/about`,
    siteName: BRAND.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${BRAND.name}`,
    description: `${BRAND.name} is a BC-built review-collection tool that helps local businesses earn honest Google reviews and route private feedback before it goes public.`,
  },
};

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28">
        <div className="pointer-events-none absolute -right-12 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="marketing-container relative max-w-3xl">
          <Reveal>
            <p className="section-eyebrow mb-5 w-fit">About us</p>
            <h1 className="font-display text-4xl text-text md:text-5xl">
              Honest reviews for the local shops that earn them
            </h1>
          </Reveal>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              {BRAND.name} is built in the Fraser Valley for British Columbia&apos;s local
              service businesses — auto shops, salons, restaurants, trades, and the small teams
              behind them. We started {BRAND.name} because great shops were losing customers to
              competitors with louder online reputations, not better work.
            </p>
            <p>
              Our tools make it effortless to ask for a review at the right moment: a branded QR
              poster, AI-assisted review drafts, and SMS and email follow-ups. Just as important,
              we route unhappy customers to a private feedback channel first — so you can fix
              problems before they become public one-star reviews.
            </p>
            <p>
              No setup fee, one flat price, and a 14-day money-back guarantee. We&apos;d rather earn
              your trust than lock you in.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ShimmerButton href="/signup" className="px-8 py-3.5 text-base">
              Start free
            </ShimmerButton>
            <Link href="/help" className="btn-ghost px-8 py-3.5 text-base">
              Talk to the team
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
