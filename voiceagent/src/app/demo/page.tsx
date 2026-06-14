import type { Metadata } from "next";
import { DemoPageStatic } from "@/components/landing/DemoPageStatic";
import { DemoSalesPage } from "@/components/landing/DemoSalesPage";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "See GreetQ answer a simulated call for your industry. Book a live demo call and hear the AI receptionist yourself.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-24">
        <DemoPageStatic />
        <DemoSalesPage />
      </main>
      <LandingFooter />
    </div>
  );
}
