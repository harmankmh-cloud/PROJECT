export type Locale = "en" | "fr";

export const translations = {
  en: {
    "nav.findPros": "Find Pros",
    "nav.howItWorks": "How It Works",
    "nav.forPros": "For Pros",
    "nav.blog": "Blog",
    "nav.postJob": "Post a Job",
    "nav.signIn": "Sign In",
    "footer.proud": "Proudly Canadian",
    "footer.serving": "Serving Canada — starting in BC",
    "hero.headline": "Find Trusted Local Pros in Minutes",
    "common.bookNow": "Book Now",
    "common.getQuote": "Get a Quote",
    "common.viewProfile": "View Profile",
  },
  fr: {
    "nav.findPros": "Trouver un pro",
    "nav.howItWorks": "Comment ça marche",
    "nav.forPros": "Pour les pros",
    "nav.blog": "Blogue",
    "nav.postJob": "Publier un travail",
    "nav.signIn": "Connexion",
    "footer.proud": "Fierement canadien",
    "footer.serving": "Au service du Canada — à partir de la C.-B.",
    "hero.headline": "Trouvez des pros locaux de confiance en quelques minutes",
    "common.bookNow": "Réserver",
    "common.getQuote": "Obtenir un devis",
    "common.viewProfile": "Voir le profil",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}
