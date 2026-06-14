import Image from "next/image";
import Link from "next/link";
import { HUBSPOT_LOGO, ZAPIER_LOGO } from "@/lib/marketing-content";
import { LANDING_COPY } from "@/lib/copy/landing";

const LOGOS = [
  { name: "HubSpot", logo: HUBSPOT_LOGO, href: "/help/hubspot-integration" },
  { name: "Zapier", logo: ZAPIER_LOGO, href: "/help/outbound-webhooks" },
  { name: "Google Calendar", abbr: "GC", color: "bg-blue-600", href: "/help/google-calendar" },
  { name: "Telnyx", abbr: "TX", color: "bg-emerald-600", href: "/help/connect-telnyx" },
  { name: "Twilio", abbr: "TW", color: "bg-rose-600", href: "/help/connect-twilio" },
  { name: "Stripe", abbr: "ST", color: "bg-violet-500", href: "/help/stripe-billing" },
] as const;

export function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-border bg-surface py-8">
      <p className="marketing-container mb-6 text-center text-sm font-medium text-text/80">
        {LANDING_COPY.marquee.label}
      </p>
      <div className="marquee-pause overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-12 px-4">
          {items.map((item, i) => (
            <Link
              key={`${item.name}-${i}`}
              href={item.href}
              className="flex items-center gap-2.5 whitespace-nowrap opacity-80 transition hover:opacity-100"
            >
              {"logo" in item && item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={72}
                  height={28}
                  className="h-7 w-auto opacity-60 grayscale transition hover:opacity-90 hover:grayscale-0"
                />
              ) : (
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${"color" in item ? item.color : ""}`}
                >
                  {"abbr" in item ? item.abbr : ""}
                </span>
              )}
              <span className="text-sm font-medium text-text/75">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
