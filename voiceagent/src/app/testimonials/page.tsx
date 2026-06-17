import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { TestimonialsGrid } from "@/components/marketing/TestimonialsGrid";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata = marketingMetadata({
  title: "Testimonials",
  description: "What local businesses say about GreetQ AI receptionist.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container">
          <p className="section-eyebrow mb-3 text-center">Testimonials</p>
          <h1 className="font-display text-center text-4xl text-ghost-white">
            Operator feedback
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-on-surface-variant">
            Representative feedback from early operators testing GreetQ. Not third-party verified
            reviews — share your experience at /contact.
          </p>
          <TestimonialsGrid />
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
