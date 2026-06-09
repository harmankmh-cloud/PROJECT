import Image from "next/image";
import { HUBSPOT_LOGO, ZAPIER_LOGO } from "@/lib/marketing-content";

const CUSTOMERS = [
  "Pacific Dental",
  "North Shore HVAC",
  "Glow Studio",
  "Harbour Legal",
  "Fraser Valley Auto",
] as const;

const INTEGRATIONS = [
  { name: "Telnyx", abbr: "TX", color: "bg-emerald-600" },
  { name: "Twilio", abbr: "TW", color: "bg-rose-600" },
  { name: "Stripe", abbr: "ST", color: "bg-violet-600" },
  { name: "HubSpot", logo: HUBSPOT_LOGO },
  { name: "Zapier", logo: ZAPIER_LOGO },
] as const;

export function TrustMarquee() {
  const customerItems = [...CUSTOMERS, ...CUSTOMERS];
  const integrationItems = [...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <section className="border-y border-border bg-surface/50 py-8">
      <div className="marketing-container mb-6 text-center text-sm text-muted">
        Integration partners
      </div>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10 px-4">
          {integrationItems.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {"logo" in item && item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={80}
                  height={32}
                  className="h-8 w-auto opacity-70 grayscale"
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
      <div className="marketing-container mt-6 mb-2 text-center text-xs text-muted">
        Trusted by businesses across BC
      </div>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 px-4" style={{ animationDirection: "reverse" }}>
          {customerItems.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-sm font-medium text-muted/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
