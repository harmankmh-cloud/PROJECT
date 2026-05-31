import Link from "next/link";
import { SupportForm } from "@/components/SupportForm";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: `Help & contact · ${BRAND.name}`,
  description: `Get help with ${BRAND.name}, send a suggestion, or report an issue.`,
};

export default function HelpPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-8">
        <BrandLogo />
        <Link href="/login" className="btn-ghost px-4 py-2 text-sm">
          Sign in
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Help center</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Help & suggestions</h1>
        <p className="mt-3 text-lg text-slate-600">
          Talk to the {BRAND.name} team — questions about your account, QR codes, billing, or ideas to
          make the product better.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["💬", "Help", "Stuck on setup or not sure how something works"],
            ["💡", "Ideas", "Features you'd love for your shop"],
            ["🐛", "Issues", "Something broken — we'll fix it"],
          ].map(([icon, title, text]) => (
            <div key={title} className="glass-panel p-5 text-center">
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
    </main>
  );
}
