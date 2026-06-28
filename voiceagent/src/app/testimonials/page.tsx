import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { TestimonialsGrid } from "@/components/marketing/TestimonialsGrid";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata = marketingMetadata({
  title: "Sample product scenarios",
  description: "Illustrative examples showing how GreetQ AI receptionist workflows can support local businesses.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container">
          <p className="section-eyebrow mb-3 text-center">Sample scenarios</p>
          <h1 className="font-display text-center text-4xl text-ghost-white">
            Illustrative product examples
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-on-surface-variant">
            These are sample workflows, not customer testimonials or third-party verified reviews.
          </p>
          <TestimonialsGrid />
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
