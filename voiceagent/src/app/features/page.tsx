import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturesPageStatic } from "@/components/landing/FeaturesPageStatic";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata = marketingMetadata({
  title: "Features",
  description: "Everything your receptionist should do — AI call answering, booking, transcripts, CRM integrations, and English voice with French on the roadmap.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-24">
        <FeaturesPageStatic />
        <section className="border-t border-border py-16">
          <div className="marketing-container text-center">
            <h2 className="font-display text-2xl text-text">Ready to never miss a call?</h2>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
