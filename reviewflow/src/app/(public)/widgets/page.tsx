import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WidgetsPageContent } from "@/components/landing/WidgetsPageContent";

export const metadata: Metadata = {
  title: "Widgets & Embeds",
  description: "Embed RateLocal reviews and ratings on your website.",
};

export default function WidgetsPage() {
  return (
    <main>
      <LandingNavbar />
      <WidgetsPageContent />
      <LandingFooter />
    </main>
  );
}
