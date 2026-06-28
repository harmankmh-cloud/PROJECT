import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = marketingMetadata({
  title: "Case studies",
  description: "How local businesses use GreetQ for call answering, booking, and compliance.",
  path: "/case-studies",
});

const CASE_STUDY_CARDS = [
  {
    slug: "sample-hvac-after-hours-guide",
    industry: "HVAC",
    metric: "25%",
    metricLabel: "of calls were urgent dispatch — caught instead of lost to voicemail",
    insight:
      "Illustrative dashboard data can show intent breakdowns such as scheduling, pricing FAQs, and urgent dispatch so owners can prioritize hot leads.",
  },
  {
    slug: "ai-receptionist-bc-dental-clinics",
    industry: "Dental",
    metric: "1 day",
    metricLabel: "typical go-live for BC clinics — hours, FAQs, then a sandbox call",
    insight:
      "Dental practices in British Columbia capture after-hours bookings without adding front-desk headcount.",
  },
  {
    slug: "voice-ai-hvac-companies",
    industry: "Home services",
    metric: "24/7",
    metricLabel: "address, issue, and urgency captured before the dispatcher calls back",
    insight:
      "HVAC companies peak in summer and winter. When every tech is on a job, missed calls mean lost revenue.",
  },
] as const;

export default function CaseStudiesPage() {
  const posts = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-4xl">
          <div className="text-center">
            <p className="section-eyebrow mb-3">Case studies</p>
            <h1 className="font-display text-4xl text-ghost-white">Customer stories</h1>
            <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
              Deployment patterns from dental, HVAC, and service businesses — illustrative guides,
              not named customer financial results.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CASE_STUDY_CARDS.map((card) => {
              const post = posts.get(card.slug);
              if (!post) return null;
              return (
                <Link
                  key={card.slug}
                  href={`/blog/${card.slug}`}
                  className="glass-card group flex flex-col p-6 transition hover:border-violet-500/30"
                >
                  <span className="self-start rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                    {card.industry}
                  </span>
                  <p className="mt-5 font-display text-4xl text-text">{card.metric}</p>
                  <p className="mt-1.5 text-sm leading-snug text-muted">{card.metricLabel}</p>
                  <p className="mt-4 flex-1 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted">
                    {card.insight}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition group-hover:text-violet-300">
                    Read the story
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-12 text-center text-sm text-muted">
            More deployment guides on the{" "}
            <Link href="/blog" className="text-violet-400 hover:underline">
              blog
            </Link>
            . Want to be featured?{" "}
            <Link href="/contact" className="text-violet-400 hover:underline">
              Tell us your story
            </Link>
            .
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
