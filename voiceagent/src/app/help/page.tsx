import Link from "next/link";
import type { Metadata } from "next";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SkipToContent } from "@/components/SkipToContent";
import { SupportForm } from "@/components/SupportForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Help & contact",
  description: `Contact ${BRAND.name} for product questions, demos, Enterprise pricing, or support. Based in ${BRAND.location.label}.`,
  alternates: { canonical: "/help" },
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const params = await searchParams;
  const isEnterprise = params.intent === "enterprise";
  const isDemo = params.intent === "demo";

  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingHeader />
      <main id="main-content" className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-4 py-12">
        <header>
          <h1 className="font-display text-3xl text-ghost-white">Help & contact</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {isEnterprise
              ? `Tell us about your Enterprise needs — the ${BRAND.name} team will follow up.`
              : isDemo
                ? `Book a product walkthrough — we'll reply with next steps and scheduling options.`
                : `Questions about ${BRAND.name}? Send us a message.`}
          </p>
          <p className="mt-4 text-sm text-on-surface-variant">
            {BRAND.legalName} · {BRAND.location.label}
            <br />
            <a href={`mailto:${BRAND.contact.email}`} className="text-primary hover:underline">
              {BRAND.contact.email}
            </a>
            {" · "}
            <a href={`tel:${BRAND.contact.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
              {BRAND.contact.phone}
            </a>
          </p>
        </header>
        <SupportForm
          defaultCategory={isEnterprise || isDemo ? "billing" : "help"}
          defaultMessage={
            isEnterprise
              ? "I'm interested in the Enterprise plan. Please contact me about pricing, HIPAA, and SLA options."
              : isDemo
                ? "I'd like to book a demo of GreetQ. Please share availability for a 30-minute walkthrough."
                : ""
          }
        />
        <p className="text-center text-sm text-on-surface-variant">
          Have an account?{" "}
          <Link href="/login" className="link-accent">
            Sign in
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
