import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
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
    <MarketingPageShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <p className="font-label text-primary">{SERVE_LOCAL.name} for pros</p>
        <h1 className="font-display mt-2 text-4xl font-black text-foreground">Get clients, not lead bills</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Thumbtack charges <strong className="text-foreground">$25–75 per shared lead</strong>. ServeLocal sends job
          alerts to your inbox and puts your phone on your profile —{" "}
          <strong className="text-foreground">one flat monthly fee</strong>, zero per-click charges.
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
        <div className="mt-12 rounded-[14px] border border-border bg-surface p-8">
          <h2 className="font-display text-xl font-bold text-foreground">What every plan includes</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <li>✓ Phone &amp; WhatsApp on your profile</li>
            <li>✓ Customer reviews (moderated)</li>
            <li>✓ Listed in city + category pages</li>
            <li>✓ Job alerts when homeowners post in your trade + city</li>
            <li>✓ BC-focused Fraser Valley &amp; Metro coverage</li>
            <li>✓ No per-lead fees for customers</li>
          </ul>
          <p className="mt-6 text-xs text-muted">
            Founding Pro rate for early listings. Pay via card after approval (Stripe) or contact us. Cancel anytime.
          </p>
        </div>
      </div>
    </MarketingPageShell>
  );
}
