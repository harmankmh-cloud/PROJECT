import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">Refer a friend</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Grow the local directory</h1>
        <p className="mt-3 text-slate-600">
          Know a great tradie who hates paying per-lead fees? Or a homeowner tired of middleman marketplaces?
          Share ServeLocal — it helps us add more verified pros in your area.
        </p>

        <div className="mt-8 space-y-4">
          <div className="surface-card p-6">
            <h2 className="font-semibold text-brand-950">Refer a tradie</h2>
            <p className="mt-2 text-sm text-slate-600">
              Send them to our free listing — Founding Featured is {FOUNDING_PRO.featuredPrice} ({FOUNDING_PRO.duration}), still cheaper than one Thumbtack lead.
            </p>
            <Link href="/join" className="btn-gold mt-4 inline-flex px-6 py-2.5 text-sm">
              Share /join link
            </Link>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-semibold text-brand-950">Refer a homeowner</h2>
            <p className="mt-2 text-sm text-slate-600">
              They can post jobs free and browse BC cost guides before hiring.
            </p>
            <Link href="/request" className="btn-ghost mt-4 inline-flex px-6 py-2.5 text-sm">
              Share /request link
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:?subject=${encodeURIComponent("ServeLocal — BC trades directory")}&body=${shareText}`}
            className="btn-gold px-6 py-3"
          >
            Email a friend
          </a>
          <Link href="/" className="btn-ghost px-6 py-3">
            Back home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
