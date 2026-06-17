import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactPageClient } from "@/components/landing/ContactPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Contact",
  description: "Get in touch with the GreetQ team. We don't ghost you.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${BRAND.name}`,
          url: `https://${BRAND.domain}/contact`,
          description: "Get in touch with the GreetQ team. We don't ghost you.",
        }}
      />
      <LandingNavbar />
      <ContactPageClient />
      <LandingFooter />
    </div>
  );
}
