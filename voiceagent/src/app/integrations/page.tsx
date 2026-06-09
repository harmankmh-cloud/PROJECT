import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { INTEGRATIONS } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Connect GreetQ with Telnyx, Twilio, Google Calendar, HubSpot, Stripe, and more — webhooks for 5,000+ apps.",
  alternates: { canonical: "/integrations" },
};

export default function IntegrationsPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl text-ghost-white">Integrations</h1>
            <p className="mt-4 text-lg text-on-surface-variant">
              GreetQ connects to the tools your business already uses — voice carriers, calendars, CRMs,
              and billing.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((item) => (
              <div key={item.name} className="glass-card p-6">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} font-bold text-white`}
                >
                  {item.abbr}
                </div>
                <h2 className="font-display text-lg text-text">
                  {item.name}
                  {"soon" in item && item.soon && (
                    <span className="ml-2 text-xs text-muted">(coming soon)</span>
                  )}
                </h2>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-sm text-muted">
            Need a custom integration?{" "}
            <Link href="/help?intent=enterprise" className="text-primary-glow hover:underline">
              Contact sales
            </Link>
          </p>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
