import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-display text-3xl text-brand-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="text-lg font-semibold text-brand-900">Agreement</h2>
            <p>
              By using {BRAND.name}, you agree to these terms. If you use the service on behalf of a
              business, you represent that you have authority to bind that organization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Service description</h2>
            <p>
              {BRAND.name} provides AI-powered phone answering, call routing, integrations, and related
              tools. Features vary by subscription plan. We may update the service with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Acceptable use</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>No illegal, harassing, or fraudulent calls or messages.</li>
              <li>No robocalling or outbound campaigns without proper TCPA consent.</li>
              <li>No attempts to bypass security, abuse APIs, or resell access without authorization.</li>
              <li>You are responsible for content your agents say and actions they take on your behalf.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Billing</h2>
            <p>
              Paid plans include a monthly subscription plus metered per-minute voice usage as described on
              our pricing page. Fees are processed through Stripe. Failed payments may result in service
              suspension after notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Telephony compliance</h2>
            <p>
              You are solely responsible for compliance with TCPA, CAN-SPAM, recording consent laws, and
              industry regulations in your jurisdiction. {BRAND.name} provides compliance tooling but does not
              provide legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Limitation of liability</h2>
            <p>
              The service is provided &quot;as is&quot; to the maximum extent permitted by law. We are not
              liable for missed calls, AI errors, third-party outages, or indirect damages arising from use
              of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-900">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <Link href="/help" className="text-teal-600 hover:underline">
                Help & contact
              </Link>
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
