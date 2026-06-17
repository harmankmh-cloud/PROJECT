/** Localized labels for marketing chrome (nav / footer / trust bar). */

export type MarketingLocale = "en" | "fr";

type MenuCopy = { label: string; desc: string };
type FooterLink = { href: string; labelKey: string };

const PRODUCT_ITEMS = [
  { href: "/features", key: "features" },
  { href: "/integrations", key: "integrations" },
  { href: "/docs", key: "docs" },
  { href: "/security", key: "security" },
  { href: "/status", key: "status" },
  { href: "/compare", key: "compare" },
  { href: "/changelog", key: "changelog" },
  { href: "/resources/buyers-guide", key: "buyersGuide" },
] as const;

const INDUSTRY_ITEMS = [
  { href: "/dental", key: "dental" },
  { href: "/hvac", key: "hvac" },
  { href: "/legal", key: "legal" },
  { href: "/contractors", key: "contractors" },
  { href: "/real-estate", key: "realEstate" },
  { href: "/salons", key: "salons" },
  { href: "/restaurants", key: "restaurants" },
  { href: "/property-managers", key: "propertyManagers" },
] as const;

const FOOTER_SECTIONS = [
  {
    titleKey: "footerProduct" as const,
    links: [
      { href: "/features", labelKey: "features" },
      { href: "/pricing", labelKey: "pricing" },
      { href: "/integrations", labelKey: "integrations" },
      { href: "/docs", labelKey: "docs" },
      { href: "/compare", labelKey: "compare" },
      { href: "/demo", labelKey: "demo" },
      { href: "/changelog", labelKey: "changelog" },
      { href: "/resources/buyers-guide", labelKey: "buyersGuide" },
      { href: "/status", labelKey: "systemStatus" },
    ],
  },
  {
    titleKey: "footerIndustries" as const,
    links: [
      { href: "/dental", labelKey: "dental" },
      { href: "/hvac", labelKey: "hvac" },
      { href: "/legal", labelKey: "legal" },
      { href: "/contractors", labelKey: "contractors" },
      { href: "/real-estate", labelKey: "realEstate" },
      { href: "/salons", labelKey: "salons" },
      { href: "/restaurants", labelKey: "restaurants" },
      { href: "/property-managers", labelKey: "propertyManagers" },
    ],
  },
  {
    titleKey: "footerCompany" as const,
    links: [
      { href: "/about", labelKey: "about" },
      { href: "/blog", labelKey: "blog" },
      { href: "/testimonials", labelKey: "testimonials" },
      { href: "/case-studies", labelKey: "caseStudies" },
      { href: "/press", labelKey: "press" },
      { href: "/careers", labelKey: "careers" },
      { href: "/partners", labelKey: "partners" },
      { href: "/community", labelKey: "community" },
      { href: "/contact", labelKey: "contact" },
    ],
  },
  {
    titleKey: "footerTrust" as const,
    links: [
      { href: "/security", labelKey: "securityCompliance" },
      { href: "/privacy", labelKey: "privacy" },
      { href: "/terms", labelKey: "terms" },
      { href: "/languages", labelKey: "languages" },
      { href: "/fr", labelKey: "french" },
      { href: "/help", labelKey: "helpCenter" },
    ],
  },
] as const;

const COPY = {
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
    trustPipeda: "PIPEDA-aware",
    trustCasl: "CASL tooling built in",
    trustCanadian: "Canadian-owned · Made in BC",
    trustStatus: "System status",
    productMenu: {
      features: { label: "Features", desc: "Everything your AI receptionist does" },
      integrations: { label: "Integrations", desc: "Calendar, CRM, SMS, and webhooks" },
      docs: { label: "Developers & API", desc: "REST API, webhooks, and docs" },
      security: { label: "Security", desc: "PIPEDA, CASL, and HIPAA controls" },
      status: { label: "Status", desc: "Live uptime and incident history" },
      compare: { label: "Compare", desc: "GreetQ vs the alternatives" },
      changelog: { label: "Changelog", desc: "Product updates and release notes" },
      buyersGuide: { label: "Buyer's guide", desc: "Evaluate AI receptionists — free checklist" },
    },
    industryMenu: {
      dental: { label: "Dental & medical", desc: "After-hours booking, privacy-aware intake" },
      hvac: { label: "HVAC", desc: "Qualify and triage before dispatch" },
      legal: { label: "Legal", desc: "Screened intake with full audit trail" },
      contractors: { label: "Contractors", desc: "Capture job details on first ring" },
      realEstate: { label: "Real estate", desc: "Never miss a listing inquiry" },
      salons: { label: "Salons & spas", desc: "Book while stylists stay with clients" },
      restaurants: { label: "Restaurants", desc: "Reservations and hours, answered" },
      propertyManagers: { label: "Property managers", desc: "Tenant calls routed and logged" },
    },
    footerLinks: {
      features: "Features",
      pricing: "Pricing",
      integrations: "Integrations",
      docs: "Developers & API",
      compare: "Compare",
      demo: "Demo",
      changelog: "Changelog",
      buyersGuide: "Buyer's guide",
      systemStatus: "System status",
      dental: "Dental & medical",
      hvac: "HVAC",
      legal: "Legal",
      contractors: "Contractors",
      realEstate: "Real estate",
      salons: "Salons & spas",
      restaurants: "Restaurants",
      propertyManagers: "Property managers",
      about: "About",
      blog: "Blog",
      testimonials: "Testimonials",
      caseStudies: "Case studies",
      press: "Press",
      careers: "Careers",
      partners: "Partners",
      community: "Community",
      contact: "Contact",
      securityCompliance: "Security & compliance",
      privacy: "Privacy policy",
      terms: "Terms of service",
      languages: "Languages",
      french: "Français",
      helpCenter: "Help center",
    },
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
    trustPipeda: "Conforme LPRPDE",
    trustCasl: "Outils LCAP intégrés",
    trustCanadian: "Entreprise canadienne · C.-B.",
    trustStatus: "État du système",
    productMenu: {
      features: { label: "Fonctionnalités", desc: "Tout ce que fait votre réceptionniste IA" },
      integrations: { label: "Intégrations", desc: "Agenda, CRM, SMS et webhooks" },
      docs: { label: "Développeurs et API", desc: "API REST, webhooks et documentation" },
      security: { label: "Sécurité", desc: "LPRPDE, LCAP et contrôles HIPAA" },
      status: { label: "État", desc: "Disponibilité et historique des incidents" },
      compare: { label: "Comparer", desc: "GreetQ vs les alternatives" },
      changelog: { label: "Nouveautés", desc: "Mises à jour produit" },
      buyersGuide: { label: "Guide d'achat", desc: "Évaluer les réceptionnistes IA — liste gratuite" },
    },
    industryMenu: {
      dental: { label: "Cliniques dentaires", desc: "Réservations hors heures, accueil confidentiel" },
      hvac: { label: "CVC", desc: "Qualification avant envoi" },
      legal: { label: "Services juridiques", desc: "Accueil filtré avec piste d'audit" },
      contractors: { label: "Entrepreneurs", desc: "Détails du chantier dès la première sonnerie" },
      realEstate: { label: "Immobilier", desc: "Ne manquez aucune demande de visite" },
      salons: { label: "Salons et spas", desc: "Réservez pendant que l'équipe est occupée" },
      restaurants: { label: "Restaurants", desc: "Réservations et heures, répondues" },
      propertyManagers: { label: "Gestionnaires", desc: "Appels locataires routés et journalisés" },
    },
    footerLinks: {
      features: "Fonctionnalités",
      pricing: "Tarifs",
      integrations: "Intégrations",
      docs: "Développeurs et API",
      compare: "Comparer",
      demo: "Démo",
      changelog: "Nouveautés",
      buyersGuide: "Guide d'achat",
      systemStatus: "État du système",
      dental: "Cliniques dentaires",
      hvac: "CVC",
      legal: "Services juridiques",
      contractors: "Entrepreneurs",
      realEstate: "Immobilier",
      salons: "Salons et spas",
      restaurants: "Restaurants",
      propertyManagers: "Gestionnaires",
      about: "À propos",
      blog: "Blogue",
      testimonials: "Témoignages",
      caseStudies: "Études de cas",
      press: "Presse",
      careers: "Carrières",
      partners: "Partenaires",
      community: "Communauté",
      contact: "Contact",
      securityCompliance: "Sécurité et conformité",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      languages: "Langues",
      french: "Français",
      helpCenter: "Centre d'aide",
    },
  },
} as const;

export const MARKETING_CHROME = COPY;

export type NavMenuItem = { href: string; label: string; desc: string };

export function getProductMenu(locale: MarketingLocale): NavMenuItem[] {
  const menu = COPY[locale].productMenu;
  return PRODUCT_ITEMS.map((item) => ({
    href: item.href,
    label: menu[item.key].label,
    desc: menu[item.key].desc,
  }));
}

export function getIndustriesMenu(locale: MarketingLocale): NavMenuItem[] {
  const menu = COPY[locale].industryMenu;
  return INDUSTRY_ITEMS.map((item) => ({
    href: item.href,
    label: menu[item.key].label,
    desc: menu[item.key].desc,
  }));
}

export function getFooterColumns(locale: MarketingLocale, contactEmail: string) {
  const links = COPY[locale].footerLinks;
  return FOOTER_SECTIONS.map((section) => ({
    title: COPY[locale][section.titleKey],
    links: [
      ...section.links.map((link) => ({
        href: link.href,
        label: links[link.labelKey as keyof typeof links],
      })),
      ...(section.titleKey === "footerTrust"
        ? [{ href: `mailto:${contactEmail}`, label: contactEmail }]
        : []),
    ],
  }));
}

export function getTrustBadges(locale: MarketingLocale) {
  const c = COPY[locale];
  return [
    { label: c.trustPipeda, href: "/security" },
    { label: c.trustCasl, href: "/security" },
    { label: c.trustCanadian, href: "/about" },
    { label: c.trustStatus, href: "/status" },
  ] as const;
}
