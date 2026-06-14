/** Change the public product name here — one place for the whole app. */
export const BRAND = {
  name: "RateLocal",
  shortName: "RateLocal",
  legalName: "RateLocal",
  domain: "ratelocal.ca",
  tagline: "Turn visits into Google reviews",
  footer: "RateLocal — reputation tools for shops that care",
  proPlan: "RateLocal Pro",
  poweredBy: "Powered by RateLocal",
  home: "RateLocal home",
  location: {
    city: "Abbotsford",
    region: "BC",
    country: "Canada",
    label: "Fraser Valley, British Columbia, Canada",
  },
  contact: {
    email: "hello@ratelocal.ca",
    salesEmail: "hello@ratelocal.ca",
  },
} as const;

export function brandTitle(page?: string) {
  if (!page) return `${BRAND.name} — ${BRAND.tagline}`;
  return `${page} · ${BRAND.name}`;
}
