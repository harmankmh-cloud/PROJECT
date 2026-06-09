import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FadeUp } from "@/components/motion/FadeUp";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { SERVE_LOCAL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { ABOUT_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "About ServeLocal — Canada's Home Services Marketplace",
  description:
    "ServeLocal connects Canadian homeowners with vetted local contractors. Mission, values, and team — proudly built in BC.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <FadeUp>
          <p className="font-label text-primary">About us</p>
          <h1 className="font-display mt-2 text-4xl font-black text-foreground">Who we are</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{ABOUT_CONTENT.mission}</p>
          <p className="mt-4 leading-relaxed text-muted">{ABOUT_CONTENT.story}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium">
            🍁 Proudly built in BC, Canada
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {ABOUT_CONTENT.values.map((v) => (
            <FadeUp key={v.title}>
              <div className="card-glow rounded-[14px] border border-border bg-surface p-5">
                <h2 className="font-semibold text-foreground">{v.title}</h2>
                <p className="mt-2 text-sm text-muted">{v.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-12 flex flex-wrap gap-3">
          <ShimmerButton href="/for-pros">List your business</ShimmerButton>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-amber-400/50"
          >
            Contact us
          </Link>
        </FadeUp>

        <div className="mt-16">
          <NewsletterSignup />
        </div>

        <p className="mt-8 text-sm text-muted">
          {SERVE_LOCAL.name} · Serving Canada — starting in BC
        </p>
      </div>
    </MarketingPageShell>
  );
}
