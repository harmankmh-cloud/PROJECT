import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { GlowButton } from "@/components/ui/GlowButton";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "AI Receptionist Buyer's Guide",
  description:
    "How to evaluate AI phone receptionists for Canadian businesses — pricing traps, compliance checklist, and demo questions.",
  alternates: { canonical: "/resources/buyers-guide" },
};

const SECTIONS = [
  {
    title: "1. Start with the job, not the buzzwords",
    body: "List what must happen on every call: answer within 2 rings, book into your calendar, capture lead details, warm-transfer emergencies, send SMS confirmations. If a vendor can't do your top three outcomes in a sandbox call, stop there.",
  },
  {
    title: "2. Pricing traps to avoid",
    body: "Watch for per-minute overages that spike after marketing campaigns, credit systems that are hard to forecast, and 'enterprise only' features you need on day one (API access, audit logs, CASL tooling). Flat plans with included minutes are easier to budget for local businesses.",
  },
  {
    title: "3. Canadian compliance checklist",
    bullets: [
      "PIPEDA-aligned data handling and subprocessors documented",
      "CASL consent capture for outbound SMS or callbacks",
      "Call recording retention policy you can configure",
      "Audit trail for transfers, bookings, and consent events",
      "Clear answer on where data is processed (and residency options if required)",
    ],
  },
  {
    title: "4. Questions to ask in every demo",
    bullets: [
      "Show me a completed call with AI summary, sentiment, and action items",
      "How do warm transfers work — does my team get context before pickup?",
      "Can I connect Google Calendar and my existing phone number?",
      "What happens after hours vs during business hours?",
      "How do I export call data via API or webhooks?",
    ],
  },
  {
    title: "5. Proof beats promises",
    body: "Run the same three scenarios with every vendor: new customer booking, pricing/hours question, and urgent transfer. Score them on accuracy, tone, and whether you would trust the transcript without listening to the whole recording.",
  },
] as const;

export default function BuyersGuidePage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <article className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Free resource</p>
          <h1 className="font-display text-4xl text-ghost-white md:text-5xl">
            AI Receptionist Buyer&apos;s Guide
          </h1>
          <p className="mt-5 text-lg text-on-surface-variant">
            A practical checklist for Canadian owners evaluating {BRAND.name} and alternatives —
            no fluff, no vendor jargon.
          </p>

          <div className="mt-10 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl text-text">{section.title}</h2>
                {"body" in section ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{section.body}</p>
                ) : null}
                {"bullets" in section && section.bullets ? (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-violet-500/20 bg-violet-500/5 p-8 text-center">
            <h2 className="font-display text-2xl text-text">Try {BRAND.name} on your own calls</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
              30 free minutes, sandbox testing, and a guided setup wizard — see if it fits before you
              commit.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <GlowButton href="/signup">Start free trial</GlowButton>
              <GlowButton href="/demo" variant="ghost">
                Book a demo
              </GlowButton>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted">
            Share this guide with your team —{" "}
            <Link href="/contact" className="text-violet-400 hover:text-violet-300">
              questions welcome
            </Link>
            .
          </p>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
