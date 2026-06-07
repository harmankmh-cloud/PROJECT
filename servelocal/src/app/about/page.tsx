import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SERVE_LOCAL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { ABOUT_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "About ServeLocal — BC Trades Directory",
  description:
    "ServeLocal connects Fraser Valley and Metro Vancouver homeowners with local trades they can call direct — no middleman lead fees.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">About us</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Who we are</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{ABOUT_CONTENT.mission}</p>
        <p className="mt-4 leading-relaxed text-slate-600">{ABOUT_CONTENT.story}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {ABOUT_CONTENT.values.map((v) => (
            <div key={v.title} className="surface-card p-5">
              <h2 className="font-semibold text-brand-950">{v.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/join" className="btn-gold px-6 py-3">
            List your business
          </Link>
          <Link href="/contact" className="btn-ghost px-6 py-3">
            Contact us
          </Link>
        </div>

        <div className="mt-16">
          <NewsletterSignup />
        </div>

        <p className="mt-8 text-sm text-slate-500">
          {SERVE_LOCAL.name} · {ABOUT_CONTENT.mission.slice(0, 80)}…
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
