import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { FadeUp } from "@/components/motion/FadeUp";
import { COMPANY } from "@/lib/marketing-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Help",
  description: "Contact ServeLocal for listing help, billing questions, or general support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2">
        <FadeUp>
          <p className="font-label text-primary">Help &amp; contact</p>
          <h1 className="font-display mt-2 text-4xl font-black text-foreground">Get in touch</h1>
          <p className="mt-3 text-muted">
            Questions about listings, job posts, or your account? We reply within 1–2 business days.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">Email</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Region</dt>
              <dd className="text-muted">{COMPANY.address}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Pros</dt>
              <dd>
                <Link href="/for-pros" className="text-primary hover:underline">
                  Join as a pro →
                </Link>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Homeowners</dt>
              <dd>
                <Link href="/request" className="text-primary hover:underline">
                  Post a free job →
                </Link>
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted">🍁 Proudly built in BC, Canada</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="rounded-[14px] border border-border bg-surface p-6">
            <ContactForm />
          </div>
        </FadeUp>
      </div>
    </MarketingPageShell>
  );
}
