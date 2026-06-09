import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description: `How ${BRAND.name} handles security, PIPEDA, CASL, audit logging, and optional US HIPAA for AI phone agents.`,
  alternates: { canonical: "/security" },
};

const SECTIONS = [
  {
    title: "Canadian privacy (PIPEDA)",
    body: `${BRAND.legalName} is based in ${BRAND.location.label}. We handle personal information under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), with org-scoped data isolation, access controls, export, and deletion on request. You are responsible for telling callers when calls are recorded and obtaining consent where required.`,
  },
  {
    title: "CASL & outbound communications",
    body: "Outbound voice and SMS campaigns require documented consent before contact, quiet-hours enforcement, and do-not-call list support. These controls align with Canada's Anti-Spam Legislation (CASL). US customers with US lists may additionally configure TCPA-oriented consent fields.",
  },
  {
    title: "BC health-sector clients",
    body: "Clinics and dental practices in British Columbia can use Enterprise plans for controls aligned with provincial health privacy expectations, including configurable retention and audit logging. Review your own professional obligations before routing patient information through any third-party system.",
  },
  {
    title: "US HIPAA (Enterprise, optional)",
    body: "For US healthcare customers, HIPAA mode is available on Enterprise with a signed Business Associate Agreement (BAA). Not all integrations are HIPAA-eligible — review your stack before enabling PHI workflows.",
  },
  {
    title: "Infrastructure",
    body: "Hosted on Vercel with HTTPS everywhere. Database and auth via Supabase with row-level security per organization. Service-role operations are limited to server-side API routes.",
  },
  {
    title: "SSO (Enterprise)",
    body: "Enterprise SSO supports SAML 2.0 and OpenID Connect, including common identity providers such as Google Workspace and Microsoft Entra ID. Contact sales for setup guides and metadata exchange.",
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
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-24">
        <h1 className="font-display text-3xl text-ghost-white">Security & compliance</h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          How {BRAND.name} supports regulated and high-trust buyers in Canada and the United States. This page
          explains our controls — it is not legal advice.
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
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          . Enterprise security reviews:{" "}
          <Link href="/help?intent=enterprise" className="text-primary hover:underline">
            contact sales
          </Link>
          .
        </p>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
