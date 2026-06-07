import Link from "next/link";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SupportForm } from "@/components/SupportForm";
import { BRAND } from "@/lib/brand";

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const params = await searchParams;
  const isEnterprise = params.intent === "enterprise";

  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-4 py-12">
        <header>
          <h1 className="font-display text-3xl text-brand-900">Help & contact</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isEnterprise
              ? `Tell us about your Enterprise needs — the ${BRAND.name} team will follow up.`
              : `Questions about ${BRAND.name}? Send us a message.`}
          </p>
        </header>
        <SupportForm
          defaultCategory={isEnterprise ? "billing" : "help"}
          defaultMessage={
            isEnterprise
              ? "I'm interested in the Enterprise plan. Please contact me about pricing, HIPAA, and SLA options."
              : ""
          }
        />
        <p className="text-center text-sm text-slate-500">
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
