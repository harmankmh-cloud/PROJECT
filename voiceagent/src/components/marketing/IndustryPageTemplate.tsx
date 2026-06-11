import Link from "next/link";
import { ArrowRight, Check, PhoneIncoming, ShieldCheck, Sparkles } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { GlowButton } from "@/components/ui/GlowButton";
import { APP_URL, BRAND } from "@/lib/brand";
import type { IndustrySlug } from "@/lib/industry-pages";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";
import { TESTIMONIALS } from "@/lib/marketing-content";

export function IndustryPageTemplate({ slug }: { slug: IndustrySlug }) {
  const page = INDUSTRY_PAGES[slug];
  const testimonial = page.testimonialIndustry
    ? TESTIMONIALS.find((t) => t.industry === page.testimonialIndustry)
    : undefined;
  const related = page.related
    .map((r) => INDUSTRY_PAGES[r as IndustrySlug])
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.title,
        provider: { "@type": "Organization", name: BRAND.legalName, url: APP_URL },
        areaServed: "Canada",
        description: page.description,
        url: `${APP_URL}/${page.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
          { "@type": "ListItem", position: 2, name: page.title, item: `${APP_URL}/${page.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        {/* Hero */}
        <section className="marketing-container mx-auto max-w-4xl text-center">
          <p className="section-eyebrow mb-3">Industry</p>
          <h1 className="font-display text-4xl text-ghost-white md:text-5xl">{page.headline}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">{page.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton href="/signup">{page.cta}</GlowButton>
            <GlowButton href="/demo" variant="ghost">
              Explore demo dashboard
            </GlowButton>
          </div>
          <div className="mx-auto mt-10 inline-flex items-baseline gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-6 py-4">
            <span className="font-display text-3xl text-violet-300">{page.stat.value}</span>
            <span className="text-sm text-muted">{page.stat.label}</span>
          </div>
        </section>

        {/* Common calls handled */}
        <section className="marketing-container mx-auto mt-20 max-w-4xl">
          <div className="mb-10 text-center">
            <p className="section-eyebrow mb-3">Real scenarios</p>
            <h2 className="font-display text-3xl text-text">
              Calls {BRAND.name} handles for you
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {page.commonCalls.map((call) => (
              <div key={call.caller} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg/70">
                    <PhoneIncoming className="h-4 w-4 text-muted" />
                  </span>
                  <p className="rounded-2xl rounded-tl-sm bg-bg/70 p-3 text-sm italic text-text">
                    &ldquo;{call.caller}&rdquo;
                  </p>
                </div>
                <div className="mt-3 flex items-start gap-3 pl-11">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  <p className="text-sm text-muted">{call.handled}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="marketing-container mx-auto mt-20 max-w-3xl">
          <div className="glass-card p-8">
            <h2 className="font-display text-2xl text-text">What your business gets</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {page.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-text">
                  <Check className="h-4 w-4 shrink-0 text-violet-400" />
                  {point}
                </li>
              ))}
            </ul>
            {page.compliance ? (
              <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {page.compliance}
              </p>
            ) : null}
          </div>
        </section>

        {/* Testimonial */}
        {testimonial ? (
          <section className="marketing-container mx-auto mt-20 max-w-3xl">
            <blockquote className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-8 text-center">
              <p className="text-lg leading-relaxed text-text">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-muted">
                <span className="font-medium text-text">{testimonial.name}</span>
                {" · "}
                {testimonial.role}, {testimonial.company}
              </footer>
            </blockquote>
          </section>
        ) : null}

        {/* FAQ */}
        <section className="marketing-container mx-auto mt-20 max-w-3xl">
          <h2 className="font-display mb-8 text-center text-2xl text-text">Common questions</h2>
          <div className="space-y-4">
            {page.faq.map((item) => (
              <article key={item.q} className="rounded-xl border border-border bg-surface p-6">
                <h3 className="font-medium text-text">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA + cross-links */}
        <section className="marketing-container mx-auto mt-20 max-w-3xl text-center">
          <h2 className="font-display text-2xl text-text">Ready to stop missing calls?</h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton href="/signup">{page.cta}</GlowButton>
            <GlowButton href="/pricing" variant="ghost">
              See pricing
            </GlowButton>
          </div>
          {related.length > 0 ? (
            <p className="mt-10 text-sm text-muted">
              Also serving:{" "}
              {related.map((r, i) => (
                <span key={r.slug}>
                  <Link
                    href={`/${r.slug}`}
                    className="inline-flex items-center gap-1 text-violet-400 transition hover:text-violet-300"
                  >
                    {r.title.replace("AI Receptionist for ", "")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {i < related.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          ) : null}
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingFooter />
    </div>
  );
}
