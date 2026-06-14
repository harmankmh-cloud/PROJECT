import Link from "next/link";
import { SupportForm } from "@/components/SupportForm";
import { MarketingHeader } from "@/components/MarketingHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: `Help & contact · ${BRAND.name}`,
  description: `Get help with ${BRAND.name}, send a suggestion, or report an issue.`,
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc]">
      <section className="hero-dark relative overflow-hidden pb-10 pt-6 sm:pb-12 sm:pt-8">
        <div className="hero-glow right-0 top-0 h-48 w-48 bg-gold-600/10" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-8">
          <MarketingHeader />
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Help center</p>
            <h1 className="font-display mt-2 text-4xl text-white">Help & suggestions</h1>
            <p className="mt-3 text-lg text-white/55">
              Talk to the {BRAND.name} team — questions about your account, QR codes, billing, or ideas to
              make the product better.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["💬", "Help", "Stuck on setup or not sure how something works"],
            ["💡", "Ideas", "Features you'd love for your shop"],
            ["🐛", "Issues", "Something broken — we'll fix it"],
          ].map(([icon, title, text]) => (
            <div key={title} className="surface-card-hover p-5 text-center">
              <p className="text-2xl">{icon}</p>
              <p className="mt-2 font-semibold text-brand-950">{title}</p>
              <p className="mt-1 text-xs text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <SupportForm />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/dashboard/help" className="font-semibold text-gold-600 hover:underline">
            Open help from your dashboard
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
