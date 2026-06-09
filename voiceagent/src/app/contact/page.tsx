import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactPageClient } from "@/components/landing/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the GreetQ team. We don't ghost you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <LandingNavbar />
      <ContactPageClient />
      <LandingFooter />
    </div>
  );
}
