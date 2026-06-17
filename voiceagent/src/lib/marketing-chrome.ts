/** Localized labels for marketing chrome (nav / footer). */
export const MARKETING_CHROME = {
  en: {
    product: "Product",
    industries: "Industries",
    pricing: "Pricing",
    demo: "Demo",
    blog: "Blog",
    signIn: "Sign in",
    cta: "Start free — 30 min, no card",
    footerProduct: "Product",
    footerIndustries: "Industries",
    footerCompany: "Company",
    footerTrust: "Trust & legal",
    frenchBanner:
      "French voice agent on our roadmap. Join the waitlist below for updates.",
  },
  fr: {
    product: "Produit",
    industries: "Secteurs",
    pricing: "Tarifs",
    demo: "Démo",
    blog: "Blogue",
    signIn: "Connexion",
    cta: "Essai gratuit — 30 min, sans carte",
    footerProduct: "Produit",
    footerIndustries: "Secteurs",
    footerCompany: "Entreprise",
    footerTrust: "Confiance et légal",
    frenchBanner:
      "Interface complète en français à venir. L'agent vocal en français est sur la feuille de route.",
  },
} as const;

export type MarketingLocale = keyof typeof MARKETING_CHROME;
