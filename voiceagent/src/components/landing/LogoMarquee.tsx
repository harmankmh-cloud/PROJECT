import Image from "next/image";
import { HUBSPOT_LOGO, ZAPIER_LOGO } from "@/lib/marketing-content";
import { LANDING_COPY } from "@/lib/copy/landing";

const LOGOS = [
  { name: "Pacific Dental", abbr: "PD", color: "bg-violet-600" },
  { name: "North Shore HVAC", abbr: "NH", color: "bg-teal-600" },
  { name: "Glow Studio", abbr: "GS", color: "bg-rose-600" },
  { name: "Harbour Legal", abbr: "HL", color: "bg-slate-600" },
  { name: "HubSpot", logo: HUBSPOT_LOGO },
  { name: "Zapier", logo: ZAPIER_LOGO },
  { name: "Telnyx", abbr: "TX", color: "bg-emerald-600" },
  { name: "Stripe", abbr: "ST", color: "bg-violet-500" },
] as const;

export function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-border bg-surface/40 py-8">
      <p className="marketing-container mb-6 text-center text-sm text-muted">
        {LANDING_COPY.marquee.label}
      </p>
      <div className="marquee-pause overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-12 px-4">
          {items.map((item, i) => (
            <div key={`${item.name}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap">
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
              <span className="text-sm font-medium text-muted/80">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
