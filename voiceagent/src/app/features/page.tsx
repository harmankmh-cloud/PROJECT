import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturesPageContent } from "@/components/landing/FeaturesPageContent";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything your receptionist should do — AI call answering, booking, transcripts, CRM integrations, and bilingual support for Canadian businesses.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-24">
        <FeaturesPageContent />
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
