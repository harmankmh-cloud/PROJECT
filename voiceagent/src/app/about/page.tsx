import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${BRAND.name} — a Vancouver-based voice AI platform for local businesses. Not affiliated with intellivo.com or intellivo.ai.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-display text-3xl text-ghost-white">About {BRAND.name}</h1>
        <p className="mt-3 text-sm text-slate-text">
          {BRAND.legalName} · {BRAND.location.label}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-on-surface-variant">
          <p>
            {BRAND.name} is a voice AI platform that helps local businesses answer inbound calls with agents that
            sound natural, follow your scripts, book appointments, and hand off to humans when needed.
          </p>
          <p>
            We built the platform for operators — salon owners, clinic administrators, and service company
            dispatchers — who cannot afford missed calls but also cannot staff a 24/7 phone team.
          </p>

          <div className="rounded-2xl border border-glass-border-subtle bg-surface-container/60 p-6">
            <h2 className="text-lg font-semibold text-ghost-white">A note on our name</h2>
            <p className="mt-3">
              {BRAND.name} at <strong className="text-ghost-white">{BRAND.domain}</strong> is an independent
              Canadian voice AI product. We are <strong className="text-ghost-white">not affiliated</strong> with
              intellivo.com (U.S. healthcare subrogation) or intellivo.ai (chatbot software). If you reached us
              looking for those companies, you may need a different site.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-ghost-white">What we believe</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Voice AI should be measurable — transcripts, quality scores, and intent trends.</li>
            <li>Compliance is a product feature, not a footnote.</li>
            <li>Setup should take hours, not months.</li>
          </ul>

          <h2 className="text-lg font-semibold text-ghost-white">Contact</h2>
          <ul className="space-y-2">
            <li>
              General:{" "}
              <a href={`mailto:${BRAND.contact.email}`} className="text-primary hover:underline">
                {BRAND.contact.email}
              </a>
            </li>
            <li>
              Sales:{" "}
              <a href={`mailto:${BRAND.contact.salesEmail}`} className="text-primary hover:underline">
                {BRAND.contact.salesEmail}
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href={`tel:${BRAND.contact.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                {BRAND.contact.phone}
              </a>{" "}
              <span className="text-slate-text">({BRAND.contact.phoneNote})</span>
            </li>
            <li>{BRAND.location.label}</li>
          </ul>
          <p>
            Or use our{" "}
            <Link href="/help" className="text-primary hover:underline">
              contact form
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="text-primary hover:underline">
              start a free trial
            </Link>
            .
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
