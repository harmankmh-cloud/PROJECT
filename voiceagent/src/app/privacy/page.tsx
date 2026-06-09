import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} collects, uses, and protects personal information under PIPEDA and applicable Canadian privacy law.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-24">
        <h1 className="font-display text-3xl text-ghost-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Last updated: June 2026</p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-on-surface-variant">
          <section>
            <h2 className="text-lg font-semibold text-ghost-white">Who we are</h2>
            <p>
              {BRAND.name} ({BRAND.domain}) provides AI phone agent software for businesses. This policy
              describes how we collect, use, and protect information when you use our website and platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">Information we collect</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>Account data: email, organization name, and authentication records via Supabase.</li>
              <li>Call data: phone numbers, transcripts, recordings (if enabled), and AI-generated summaries.</li>
              <li>Usage data: call duration, billing meter events, and product analytics.</li>
              <li>Support messages submitted through our help form.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">How we use data</h2>
            <p>
              We use your data to operate the service, route calls, generate AI responses, bill your
              subscription, provide support, and improve product reliability. We do not sell personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">Third-party processors</h2>
            <p>
              We use trusted providers including Supabase (auth/database), Stripe (billing), Telnyx/Twilio
              (telephony), and OpenRouter (AI inference). Each processor is bound by their own privacy and
              security terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">HIPAA & compliance</h2>
            <p>
              HIPAA mode is available on Enterprise plans with a signed Business Associate Agreement (BAA).
              Customers are responsible for obtaining appropriate consent for call recording and outbound
              campaigns under TCPA and applicable local laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">Your rights</h2>
            <p>
              You may request access, correction, or deletion of your account data by contacting us through{" "}
              <Link href="/help" className="text-teal-600 hover:underline">
                Help & contact
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ghost-white">Contact</h2>
            <p>
              Questions about this policy:{" "}
              <Link href="/help" className="text-teal-600 hover:underline">
                {BRAND.domain}/help
              </Link>
            </p>
          </section>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
