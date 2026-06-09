import type { Metadata } from "next";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "System status",
  description: `Current operational status for ${BRAND.name} services.`,
  alternates: { canonical: "/status" },
};

const COMPONENTS = [
  { name: "Voice API", status: "operational" },
  { name: "Dashboard", status: "operational" },
  { name: "Billing (Stripe)", status: "operational" },
  { name: "Telnyx webhooks", status: "operational" },
  { name: "Twilio webhooks", status: "operational" },
] as const;

export default function StatusPage() {
  const embedUrl = process.env.NEXT_PUBLIC_STATUS_PAGE_URL?.trim();

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-2xl">
          <p className="section-eyebrow mb-3">Status</p>
          <h1 className="font-display text-4xl text-ghost-white">System status</h1>

          {embedUrl ? (
            <iframe
              title="GreetQ status page"
              src={embedUrl}
              className="mt-8 h-[480px] w-full rounded-lg border border-border"
            />
          ) : (
            <>
              <div className="glass-card mt-8 flex items-center gap-3 p-6">
                <span className="h-3 w-3 rounded-full bg-success" aria-hidden />
                <p className="font-medium text-text">All systems operational</p>
              </div>

              <ul className="mt-6 space-y-3">
                {COMPONENTS.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3"
                  >
                    <span className="text-sm text-text">{c.name}</span>
                    <span className="flex items-center gap-2 text-xs text-success">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      Operational
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs text-muted">
                This page reflects our last manual check. For incident updates, contact{" "}
                {BRAND.contact.email}. Enterprise SLAs define formal uptime commitments.
              </p>
            </>
          )}
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
