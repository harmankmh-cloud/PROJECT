/** Change the public product name here — one place for the whole app. */
export const BRAND = {
  name: "RateLocal",
  shortName: "RateLocal",
  tagline: "Turn visits into Google reviews",
  footer: "RateLocal — reputation tools for shops that care",
  proPlan: "RateLocal Pro",
  poweredBy: "Powered by RateLocal",
  home: "RateLocal home",
} as const;

export function brandTitle(page?: string) {
  if (!page) return `${BRAND.name} — ${BRAND.tagline}`;
  return `${page} · ${BRAND.name}`;
}
