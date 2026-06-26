/** Centralized copy — Pro matches Stripe checkout ($39/mo via STRIPE_PRICE_MONTHLY). */

export const LANDING = {
  nav: {
    links: [
      { label: "Discover", href: "/discover" },
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
      { label: "For Business", href: "/claim-business" },
    ],
    login: "Login",
    cta: "List Your Business",
  },
  hero: {
    headline: "Find. Trust.",
    headlineAccent: "Support Local.",
    subheading:
      "RateLocal is Canada's review platform built for real customers and real businesses — not ads.",
    searchPlaceholder: "Search businesses, services, or locations",
    categories: ["Restaurants", "Salons", "Auto", "Health", "Services"],
  },
  stats: [
    { value: 500, suffix: "+", label: "Reviews helped" },
    { value: 6, suffix: "+", label: "BC businesses" },
    { value: 12, suffix: "", label: "BC cities" },
    { value: 4.9, suffix: "★", label: "Avg generated rating", isDecimal: true },
  ],
  why: [
    {
      title: "Real Reviews",
      description: "Verified visits and authentic feedback from real Canadian customers.",
      icon: "shield",
    },
    {
      title: "AI Insights",
      description: "Smart summaries and sentiment analysis help you decide faster.",
      icon: "sparkles",
    },
    {
      title: "Business Tools",
      description: "Owners get reputation scores, analytics, and review response tools.",
      icon: "briefcase",
    },
    {
      title: "Canada-First",
      description: "Built for Canadian cities, provinces, and local business culture.",
      icon: "maple",
    },
  ],
  categories: [
    { name: "Restaurants", icon: "utensils", href: "/search?category=Restaurants" },
    { name: "Salons", icon: "scissors", href: "/search?category=Salons" },
    { name: "Auto", icon: "car", href: "/search?category=Auto" },
    { name: "Health", icon: "heart", href: "/search?category=Health" },
    { name: "Services", icon: "wrench", href: "/search?category=Services" },
    { name: "Retail", icon: "shopping", href: "/search?category=Retail" },
    { name: "Fitness", icon: "dumbbell", href: "/search?category=Fitness" },
    { name: "Real Estate", icon: "home", href: "/search?category=Real%20Estate" },
  ],
  footer: {
    tagline: "Canada's trusted local review platform.",
    forBusiness: "Join BC businesses building trust on RateLocal",
    madeIn: "Made in Canada 🍁",
  },
} as const;

export const MARKETING = {
  nav: {
    howItWorks: "How It Works",
    pricing: "Pricing",
    industries: "Industries",
    login: "Login",
    cta: "Get More Reviews →",
  },
  hero: {
    h1: "Turn Happy Customers Into",
    h1Highlight: "Google Reviews",
    h1Suffix: "— Automatically",
    subtext:
      "RateLocal helps BC businesses collect more 5-star Google reviews using AI-powered prompts. No fake reviews. No risk. Just results.",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "See How It Works ↓",
    trustBadges: [
      "Google-Safe Method ✓",
      "Used by 6+ BC Businesses ✓",
      "Setup in 5 Minutes ✓",
    ],
  },
  statsBar: [
    { value: "★ 4.9", label: "avg rating generated" },
    { value: "500+", label: "reviews helped" },
    { value: "BC-only", label: "focus" },
  ],
  howItWorks: [
    {
      n: "1",
      title: "Add your business + Google review link",
      text: "2-minute setup. Paste your Maps link and you're ready.",
    },
    {
      n: "2",
      title: "Share your RateLocal page",
      text: "SMS, QR code, or email — customers tap and rate in seconds.",
    },
    {
      n: "3",
      title: "AI shows the perfect prompt",
      text: "Based on their rating, customers get prompts they'll actually use.",
    },
  ],
  whySafe: {
    headline: "100% Google-Policy Compliant",
    subtext: "Your reputation is safe with us. We never cross Google's guidelines.",
    cards: [
      {
        title: "Customers write their own review",
        text: "AI only suggests prompts — customers edit and post themselves.",
      },
      {
        title: "No incentivization",
        text: "Organic flow only. No discounts for reviews, no gating.",
      },
      {
        title: "No fake accounts",
        text: "Real customers, real ratings. Low scores stay private.",
      },
    ],
  },
  industries: {
    chips: [
      "Restaurants",
      "Dental Clinics",
      "Auto Shops",
      "Salons",
      "Contractors",
      "Real Estate",
      "Gyms",
      "Retail",
    ],
    painPoints: {
      Restaurants: { title: "Fill tables, not voicemail", stat: "73% check reviews before booking" },
      "Dental Clinics": { title: "Stop losing patients to competitors", stat: "4.5+ stars = 2x new patients" },
      "Auto Shops": { title: "Win trust before the first visit", stat: "89% trust online reviews" },
      Salons: { title: "Book while stylists stay with clients", stat: "5-star salons get 40% more bookings" },
      Contractors: { title: "Beat competitors on Google Maps", stat: "Reviews are #1 local SEO factor" },
      "Real Estate": { title: "Build credibility before the showing", stat: "Agents with 50+ reviews close faster" },
      Gyms: { title: "Convert trial members to members", stat: "Social proof drives sign-ups" },
      Retail: { title: "Turn shoppers into reviewers", stat: "QR at checkout = instant reviews" },
    },
  },
  pricing: {
    tiers: [
      {
        key: "free",
        name: "Free",
        monthly: 0,
        annual: 0,
        description: "50 reviews included — no credit card needed",
        features: [
          "50 review requests included",
          "QR code page",
          "Private feedback routing",
          "Basic dashboard",
        ],
        missing: ["AI prompts", "SMS templates", "Analytics", "Unlimited requests"],
        cta: "Start Free",
        popular: false,
        limitNote: "After 50 reviews, upgrade to Pro to keep collecting.",
      },
      {
        key: "pro",
        name: "Pro",
        monthly: 39,
        annual: 39,
        description: "Everything included — one flat price, no hidden fees",
        features: [
          "Unlimited review requests",
          "AI prompt generator",
          "QR poster download",
          "SMS & email templates",
          "Analytics dashboard",
          "Auto follow-up reminders",
          "Private feedback routing",
          "14-day money-back guarantee",
        ],
        missing: [],
        cta: "Get Started — $39/mo",
        popular: true,
        stripeNote: "Billed $39/mo via Stripe · no setup fee · cancel anytime",
      },
    ],
  },
  footer: {
    strip: "50 free reviews to start. Then just $39/mo for everything.",
    madeIn: "Made in BC, Canada 🍁",
  },
} as const;

export const AUTH = {
  login: { title: "Welcome back", subtext: "Sign in to your RateLocal dashboard" },
  signup: { title: "Create your account", subtext: "Start collecting Google reviews in minutes" },
  forgot: "Forgot password?",
  google: "Continue with Google",
  noAccount: "Don't have an account?",
  hasAccount: "Already have an account?",
} as const;

export const DASHBOARD = {
  googleBanner: {
    title: "Your Google review link isn't set up yet — customers can't leave reviews",
    cta: "Add Google Link →",
  },
  stats: {
    totalReviews: "Total Reviews Generated",
    requestsSent: "Requests Sent This Month",
    avgRating: "Average Google Rating",
    conversion: "Conversion Rate",
  },
  quickActions: {
    sendRequest: "Send Review Request",
    downloadQr: "Download QR Code",
    copyLink: "Copy Review Link",
    viewPage: "View Public Page",
  },
} as const;

export const PUBLIC_REVIEW = {
  question: (name: string) => `How was your experience at ${name}?`,
  openGoogle: "Open Google Reviews",
  thanks: "Thank you!",
  privateThanks: "Thanks for your feedback — we'll use this to improve",
  poweredBy: "Powered by RateLocal 🍁",
} as const;
