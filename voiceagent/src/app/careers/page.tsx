import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Careers",
  description: `Open roles at ${BRAND.legalName} — founding team stage, based in BC.`,
  path: "/careers",
});


const ROLES = [
  {
    title: "Founding Engineer (Voice AI)",
    location: "Remote (Canada) · Contract or equity",
    summary:
      "Own telephony integrations, real-time voice latency, and dashboard features. TypeScript, Next.js, Telnyx/Twilio experience a plus.",
  },
  {
    title: "Founding GTM — Local BC",
    location: "BC · Part-time or contract",
    summary:
      "Help salons, clinics, and trades discover GreetQ through demos, partnerships, and honest outbound. You know BC local business culture.",
  },
] as const;

export default function CareersPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-2xl">
          <p className="section-eyebrow mb-3">Careers</p>
          <h1 className="font-display text-4xl text-ghost-white">Work with us</h1>
          <p className="mt-4 text-on-surface-variant">
            {BRAND.legalName} is an early-stage solo-founder product. We&apos;re honest about that —
            these are founding roles, not a 500-person org.
          </p>

          <ul className="mt-10 space-y-6">
            {ROLES.map((role) => (
              <li key={role.title} className="glass-card p-6">
                <h2 className="font-display text-xl text-text">{role.title}</h2>
                <p className="mt-1 text-xs text-muted">{role.location}</p>
                <p className="mt-3 text-sm text-muted">{role.summary}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 glass-card p-6 text-center">
            <p className="text-sm text-muted">
              Send your resume and a short note to{" "}
              <a href={`mailto:${BRAND.contact.email}`} className="text-primary-glow hover:underline">
                {BRAND.contact.email}
              </a>
              , or use our{" "}
              <Link href="/help" className="text-primary-glow hover:underline">
                contact form
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
