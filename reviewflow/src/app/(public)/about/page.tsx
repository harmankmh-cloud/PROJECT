import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `About ${BRAND.name} — Canada's trusted local review platform.`,
};

export default function AboutPage() {
  return (
    <main>
      <LandingNavbar />
      <div className="marketing-container max-w-3xl py-16">
        <h1 className="font-display text-3xl font-bold text-text">About {BRAND.name}</h1>
        <p className="mt-6 text-lg text-muted">
          RateLocal is Canada&apos;s review platform built for real customers and real businesses — not ads.
          We help consumers discover and support local, while giving business owners the tools to build
          trust through authentic reviews, AI insights, and reputation management.
        </p>
        <p className="mt-4 text-muted">Made in Canada 🍁</p>
      </div>
      <LandingFooter />
    </main>
  );
}
