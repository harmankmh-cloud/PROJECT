import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND } from "@/lib/brand";
import { COMPANY } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of use for ${BRAND.name} — review tools for local businesses in British Columbia.`,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `Terms of Service · ${BRAND.name}`,
    description: `Terms of use for ${BRAND.name} — review tools for local businesses in British Columbia.`,
    url: `https://${BRAND.domain}/terms`,
    siteName: BRAND.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Service · ${BRAND.name}`,
    description: `Terms of use for ${BRAND.name} — review tools for local businesses in British Columbia.`,
  },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-sm text-slate-500">Last updated: May 29, 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Agreement</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          By using {BRAND.name} at ratelocal.ca, you agree to these Terms.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>Operator:</strong> {COMPANY.name} · {COMPANY.address}
          <br />
          <strong>Contact:</strong>{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-gold-600 hover:underline">
            {COMPANY.email}
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Service</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {BRAND.name} provides software to collect customer feedback, route private complaints, and guide
          happy customers to public reviews (including Google). We do not guarantee any specific review volume
          or search ranking outcome.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Accounts</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>Provide accurate business information and keep credentials secure.</li>
          <li>You must be at least 18 and authorized to represent your business.</li>
          <li>Do not use the service for spam, fake reviews, or deceptive practices.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Acceptable use</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You are responsible for complying with Google&apos;s review policies and applicable Canadian law. Do
          not solicit fake reviews or suppress legitimate criticism unlawfully.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Fees</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Paid plans are billed as shown at signup. New paid subscriptions include a 14-day
          money-back guarantee: if you cancel within 14 days of your first payment, contact us at{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-gold-600 hover:underline">
            {COMPANY.email}
          </a>{" "}
          for a full refund of that payment. After the 14-day window, fees are non-refundable
          except where required by BC consumer law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Disclaimer</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The service is provided &quot;as is&quot; without warranties of merchantability or fitness for a
          particular purpose.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Limitation of liability</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          To the fullest extent permitted by BC law, {BRAND.name} is not liable for indirect or consequential
          damages. Total liability is limited to fees paid in the 12 months before the claim.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Governing law</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Governed by the laws of British Columbia and applicable federal laws of Canada.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Privacy</h2>
        <p className="text-sm text-slate-600">
          See our{" "}
          <Link href="/privacy" className="font-semibold text-gold-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
