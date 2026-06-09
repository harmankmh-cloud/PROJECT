/** Centralized copy — marketing UI shows Pro at $49; Stripe still charges via STRIPE_PRICE_MONTHLY ($39 today). */

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
    annualBadge: "Save 20%",
    tiers: [
      {
        key: "free",
        name: "Free",
        monthly: 0,
        annual: 0,
        description: "Get started with review collection",
        features: ["1 business", "QR code page", "Private feedback routing", "Basic dashboard"],
        missing: ["AI prompts", "SMS templates", "Analytics"],
        cta: "Start Free",
        popular: false,
      },
      {
        key: "pro",
        name: "Pro",
        monthly: 49,
        annual: 39,
        description: "Everything you need to grow reviews",
        features: [
          "Unlimited review requests",
          "AI prompt generator",
          "QR poster download",
          "SMS & email templates",
          "Analytics dashboard",
          "Auto follow-up reminders",
        ],
        missing: ["Multi-location"],
        cta: "Start Pro Trial",
        popular: true,
        stripeNote: "Checkout uses existing Stripe monthly price",
      },
      {
        key: "agency",
        name: "Agency",
        monthly: 149,
        annual: 119,
        description: "For agencies managing multiple clients",
        features: [
          "Up to 10 businesses",
          "White-label review pages",
          "Priority support",
          "Team access",
          "Custom branding",
          "API access",
        ],
        missing: [],
        cta: "Contact Sales",
        popular: false,
      },
    ],
  },
  footer: {
    strip: "Start getting reviews today. Free forever.",
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
