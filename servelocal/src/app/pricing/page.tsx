import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PricingCards } from "@/components/PricingCards";
import { FoundingProBanner, TradieBenefits } from "@/components/TradieBenefits";
import { SERVE_LOCAL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pro Plans — Founding Pro from $29/mo",
  description:
    "ServeLocal plans for BC trades. Free listing, Founding Featured $29/mo with job alerts and top placement. No per-lead fees.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">{SERVE_LOCAL.name} for pros</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Get clients, not lead bills</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Thumbtack charges <strong>$25–75 per shared lead</strong>. ServeLocal sends job alerts to your inbox and
          puts your phone on your profile — <strong>one flat monthly fee</strong>, zero per-click charges.
        </p>
        <div className="mt-8">
          <FoundingProBanner />
        </div>
        <div className="mt-10">
          <TradieBenefits />
        </div>
        <div className="mt-12">
          <PricingCards />
        </div>
        <div className="surface-card mt-12 p-8">
          <h2 className="font-display text-xl text-brand-950">What every plan includes</h2>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>✓ Phone & WhatsApp on your profile</li>
            <li>✓ Customer reviews (moderated)</li>
            <li>✓ Listed in city + category pages</li>
            <li>✓ Job alerts when homeowners post in your trade + city</li>
            <li>✓ BC-focused Fraser Valley & Metro coverage</li>
            <li>✓ No per-lead fees for customers</li>
          </ul>
          <p className="mt-6 text-xs text-slate-500">
            Founding Pro rate for early listings. Pay via card after approval (Stripe) or contact us. Cancel anytime.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
