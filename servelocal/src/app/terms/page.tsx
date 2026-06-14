import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { SERVE_LOCAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of use for ${SERVE_LOCAL.name} — local trades directory in British Columbia.`,
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-sm text-slate-500">Last updated: May 29, 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Agreement</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          By using {SERVE_LOCAL.name} at servelocal.ca, you agree to these Terms. If you do not agree, do not
          use the service. Questions:{" "}
          <a href="mailto:hello@servelocal.ca" className="font-semibold text-teal-600 hover:underline">
            hello@servelocal.ca
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">What we provide</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {SERVE_LOCAL.name} is a directory and lead tool. We display business listings and job requests so
          customers and trades can connect directly. We are not a contractor, employer, or payment processor.
          You hire pros at your own risk — verify licence, insurance, and references before work begins.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Accounts</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>You must provide accurate information and keep your password secure.</li>
          <li>You must be at least 18 years old to create an account.</li>
          <li>We may suspend accounts that violate these Terms or applicable law.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Listings and content</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Pros are responsible for the accuracy of their listings, licence claims, and pricing. You grant us a
          licence to display content you submit. We may remove content that is misleading, offensive, or
          unlawful.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Fees</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Basic listings may be free; featured plans are billed as described on our pricing page. Fees are
          non-refundable except where required by BC consumer law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Verified and insured badges</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          &quot;Verified&quot; and &quot;Insured&quot; badges on pro profiles indicate that ServeLocal&apos;s admin team
          has reviewed submitted licence or insurance documentation. We do not perform criminal background
          checks unless explicitly stated on a specific program page. Badges are not a guarantee of work
          quality — always confirm credentials, references, and written quotes before hiring.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Disclaimer of warranties</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The service is provided &quot;as is.&quot; We do not guarantee uninterrupted access, the quality of
          any tradesperson, or outcomes of jobs arranged through the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Limitation of liability</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          To the fullest extent permitted by law in British Columbia, {SERVE_LOCAL.name} and its operators are
          not liable for indirect, incidental, or consequential damages arising from use of the service or
          dealings with third-party pros. Our total liability is limited to fees you paid us in the 12 months
          before the claim.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Governing law</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          These Terms are governed by the laws of British Columbia and the federal laws of Canada applicable
          therein. Disputes are subject to the courts of British Columbia.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Privacy</h2>
        <p className="text-sm text-slate-600">
          Our{" "}
          <Link href="/privacy" className="font-semibold text-teal-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          explains how we handle personal information.
        </p>
      </section>
    </LegalLayout>
  );
}
