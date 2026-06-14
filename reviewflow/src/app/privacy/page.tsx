import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND } from "@/lib/brand";
import { COMPANY } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} collects, uses, and protects your personal information in British Columbia.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm text-slate-500">Last updated: May 29, 2026</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Who we are</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          {BRAND.name} ({BRAND.tagline}) operates at ratelocal.ca. We provide review-collection tools for local
          businesses in British Columbia.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>Mailing address:</strong> {COMPANY.address}
          <br />
          <strong>Email:</strong>{" "}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-gold-600 hover:underline">
            {COMPANY.email}
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>Account details: email address, password, and business profile you provide.</li>
          <li>Customer feedback: star ratings and comments submitted through your review pages and QR flows.</li>
          <li>Usage data: dashboard activity, device/browser type, and IP address.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">How we use your information</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>To operate your account, review pages, and QR codes.</li>
          <li>To route unhappy feedback privately and help happy customers reach Google reviews.</li>
          <li>To send transactional emails (confirmations, password resets) via Resend.</li>
          <li>To improve the product and provide support.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Legal basis (PIPEDA)</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We collect personal information with your consent when you sign up or submit feedback, and as needed
          to deliver the service. You may withdraw marketing consent at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Where data is stored</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Data is hosted by Supabase. Email is sent through Resend. These providers may process data in Canada
          or the United States under contractual safeguards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Marketing (CASL)</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Promotional email requires your opt-in. Account and billing messages are transactional, not marketing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Your rights</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Request access, correction, or deletion by emailing{" "}
          <a href="mailto:hello@ratelocal.ca" className="font-semibold text-gold-600 hover:underline">
            hello@ratelocal.ca
          </a>
          . We respond within 30 days where required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-950">Related policies</h2>
        <p className="text-sm text-slate-600">
          See our{" "}
          <Link href="/terms" className="font-semibold text-gold-600 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
