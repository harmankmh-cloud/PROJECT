import type { Metadata } from "next";
import Link from "next/link";
import { BadgeDollarSign, Headset, Layers, Rocket } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { GlowButton } from "@/components/ui/GlowButton";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Partners & resellers",
  description: `Agencies and consultants: offer ${BRAND.name} AI receptionists to your local-business clients with partner pricing and white-label options.`,
  alternates: { canonical: "/partners" },
};

const BENEFITS = [
  {
    icon: <BadgeDollarSign className="h-5 w-5 text-violet-300" />,
    title: "Recurring revenue share",
    desc: "Earn ongoing margin on every client you bring — not a one-time bounty.",
  },
  {
    icon: <Layers className="h-5 w-5 text-teal-400" />,
    title: "White-label ready",
    desc: "Enterprise white-label options let you offer AI reception under your own brand.",
  },
  {
    icon: <Rocket className="h-5 w-5 text-violet-300" />,
    title: "Fast client onboarding",
    desc: "Industry setup templates mean a typical client goes live in a day, not a sprint.",
  },
  {
    icon: <Headset className="h-5 w-5 text-teal-400" />,
    title: "Partner support",
    desc: "Direct line to our team for pre-sales questions and technical onboarding.",
  },
] as const;

const FITS = [
  "Marketing agencies serving local businesses",
  "MSPs and IT consultants",
  "Telecom and VoIP resellers",
  "Bookkeepers and business advisors with SMB rosters",
] as const;

export default function PartnersPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mb-3">Partners</p>
          <h1 className="font-display text-4xl text-ghost-white md:text-5xl">
            Sell the receptionist that never sleeps
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">
            Your clients are losing calls every week. Add {BRAND.name} to your service stack and
            turn that leak into recurring revenue — for them and for you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton href={`mailto:${BRAND.contact.salesEmail}?subject=Partner%20program`}>
              Apply to partner
            </GlowButton>
            <GlowButton href="/contact" variant="ghost">
              Ask a question first
            </GlowButton>
          </div>
        </div>

        <div className="marketing-container mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                {b.icon}
              </span>
              <h2 className="mt-4 font-display text-lg text-text">{b.title}</h2>
              <p className="mt-2 text-sm text-muted">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="marketing-container mx-auto mt-16 max-w-3xl">
          <div className="glass-card p-8">
            <h2 className="font-display text-xl text-text">Who it&apos;s for</h2>
            <ul className="mt-4 space-y-2.5">
              {FITS.map((fit) => (
                <li key={fit} className="flex items-center gap-2.5 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  {fit}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Email{" "}
              <Link href={`mailto:${BRAND.contact.salesEmail}`} className="text-violet-400 hover:underline">
                {BRAND.contact.salesEmail}
              </Link>{" "}
              with your agency name, client base, and how you&apos;d like to work together. We reply
              within one business day.
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
