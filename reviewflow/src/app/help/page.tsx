import Link from "next/link";
import { SupportForm } from "@/components/SupportForm";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { BRAND } from "@/lib/brand";

const HELP_CARD_ITEMS = [
  ["💬", "Fast product help", "Stuck on setup, review links, or QR sharing? We can walk you through it."],
  [
    "💳",
    "Billing support",
    "Plan questions, annual billing, or account changes — send the details once and we'll sort it out.",
  ],
  [
    "💡",
    "Real product feedback",
    "Tell us what would help your shop collect more reviews with less friction.",
  ],
] as const;

export const metadata = {
  title: `Help & contact · ${BRAND.name}`,
  description: `Get help with ${BRAND.name}, send a suggestion, or report an issue.`,
  alternates: { canonical: "/help" },
  openGraph: {
    title: `Help & contact · ${BRAND.name}`,
    description: `Get help with ${BRAND.name}, send a suggestion, or report an issue.`,
    url: `https://${BRAND.domain}/help`,
    siteName: BRAND.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Help & contact · ${BRAND.name}`,
    description: `Get help with ${BRAND.name}, send a suggestion, or report an issue.`,
  },
};

export default function HelpPage() {
  return (
    <MarketingPageShell>
      <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28">
        <div className="pointer-events-none absolute -right-12 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="marketing-container relative max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow mx-auto mb-5 w-fit">Help center</p>
            <h1 className="font-display text-4xl text-text md:text-5xl">Questions, fixes, or product ideas — talk to the team</h1>
            <p className="mt-4 text-lg text-muted">
              Reach the {BRAND.name} team for setup questions, billing, QR-code help, or suggestions that would make the product better for your shop.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ShimmerButton href="#support-form" className="px-8 py-3.5 text-base">
                Send a message
              </ShimmerButton>
              <Link href={`mailto:${BRAND.contact.email}`} className="btn-ghost px-8 py-3.5 text-base">
                Email {BRAND.contact.email}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="marketing-container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {HELP_CARD_ITEMS.map(([icon, title, text]) => (
              <div key={title} className="card-glow card-surface p-6 text-center">
                <p className="text-2xl">{icon}</p>
                <p className="mt-3 font-display text-lg text-text">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1fr]">
            <aside className="card-glow card-surface h-fit">
              <p className="section-eyebrow mb-4 w-fit">Before you send</p>
              <h2 className="font-display text-2xl text-text">What to include</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
                <li>• Your business name and the email on your account</li>
                <li>• The page or feature you are using when the issue happens</li>
                <li>• Any screenshots, error text, or steps to reproduce it</li>
                <li>• Whether the issue is urgent because it is blocking review collection</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-border/80 bg-surface/60 p-4">
                <p className="text-sm font-semibold text-text">Prefer direct email?</p>
                <p className="mt-2 text-sm text-muted">{BRAND.contact.email}</p>
              </div>
            </aside>

            <div id="support-form">
              <SupportForm />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/dashboard/help" className="font-semibold text-primary hover:underline">
              Open help from your dashboard
            </Link>
          </p>
        </div>
      </section>
    </MarketingPageShell>
  );
}
