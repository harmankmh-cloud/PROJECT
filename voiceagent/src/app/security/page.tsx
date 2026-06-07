import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description: `How ${BRAND.name} handles security, TCPA, HIPAA, audit logging, and data protection for AI phone agents.`,
  alternates: { canonical: "/security" },
};

const SECTIONS = [
  {
    title: "Infrastructure",
    body: "Hosted on Vercel with HTTPS everywhere. Database and auth via Supabase with row-level security per organization. Service-role operations are limited to server-side API routes.",
  },
  {
    title: "TCPA & outbound calling",
    body: "Campaigns require recorded consent before dialing. Calling hours enforcement blocks starts outside permitted windows. You are responsible for maintaining accurate consent records for your contact lists.",
  },
  {
    title: "HIPAA (Enterprise)",
    body: "HIPAA mode is available on Enterprise plans with a signed Business Associate Agreement (BAA). Includes configurable recording retention and audit logging. Not all integrations are HIPAA-eligible — review your stack before enabling PHI workflows.",
  },
  {
    title: "SOC 2",
    body: "We follow SOC 2-aligned controls across access management, logging, and change management. Formal SOC 2 Type II certification is in progress — contact sales for current status and security questionnaire responses.",
  },
  {
    title: "Audit logs",
    body: "Dashboard changes to agents, settings, API keys, and team membership are recorded in org-scoped audit logs. Call intelligence (summary, sentiment, quality score) is stored per call for review.",
  },
  {
    title: "Data retention",
    body: "Recording retention is configurable per organization. Transcripts and call metadata are retained according to your plan settings. Request deletion via Help & contact.",
  },
] as const;

export default function SecurityPage() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-display text-3xl text-ghost-white">Security & compliance</h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          How {BRAND.name} supports regulated and high-trust buyers. This page explains our controls — it is
          not legal advice.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-ghost-white">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-on-surface-variant">
          See also{" "}
          <Link href="/privacy" className="text-teal-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-teal-600 hover:underline">
            Terms of Service
          </Link>
          . Enterprise security reviews:{" "}
          <Link href="/help?intent=enterprise" className="text-teal-600 hover:underline">
            contact sales
          </Link>
          .
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
