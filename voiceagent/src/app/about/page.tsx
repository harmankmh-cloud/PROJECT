import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${BRAND.name} — AI phone agents built for local businesses that need reliable inbound coverage.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-display text-3xl text-brand-900">About {BRAND.name}</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            {BRAND.name} helps local businesses answer every inbound call with AI agents that sound natural,
            follow your scripts, book appointments, and hand off to humans when needed.
          </p>
          <p>
            We built the platform for operators — salon owners, clinic administrators, and service company
            dispatchers — who cannot afford missed calls but also cannot staff a 24/7 phone team.
          </p>
          <h2 className="text-lg font-semibold text-brand-900">What we believe</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Voice AI should be measurable — transcripts, quality scores, and intent trends.</li>
            <li>Compliance is a product feature, not a footnote.</li>
            <li>Setup should take hours, not months.</li>
          </ul>
          <h2 className="text-lg font-semibold text-brand-900">Contact</h2>
          <p>
            Questions? Reach us through{" "}
            <Link href="/help" className="text-teal-600 hover:underline">
              Help & contact
            </Link>{" "}
            or start a{" "}
            <Link href="/signup" className="text-teal-600 hover:underline">
              free trial
            </Link>
            .
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
