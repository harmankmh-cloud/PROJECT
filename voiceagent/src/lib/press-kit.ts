import { BRAND } from "@/lib/brand";

export const PRESS_KIT = {
  headline: `${BRAND.name} — AI receptionist for Canadian businesses`,
  boilerplate: `${BRAND.legalName} builds ${BRAND.name}, a voice AI platform that answers business phone calls 24/7, books appointments, and warm-transfers with full context. Based in ${BRAND.location.label}, ${BRAND.name} is designed for PIPEDA-aware operators with flat pricing and included voice minutes.`,
  founded: "2025",
  contact: BRAND.contact.email,
  social: {
    linkedin: "https://www.linkedin.com/company/greetq",
    x: "https://x.com/greetq",
  },
  assets: [
    { label: "Wordmark (SVG)", href: "/icon" },
    { label: "Open Graph image", href: "/opengraph-image" },
  ],
  facts: [
    "30 free trial minutes — no card to explore",
    "Flat plans from $79/mo with included minutes",
    "Telnyx + Twilio telephony support",
    "PIPEDA-aware controls; Enterprise HIPAA + BAA",
  ],
} as const;
