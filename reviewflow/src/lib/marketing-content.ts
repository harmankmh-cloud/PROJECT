export const COMPANY = {
  name: "RateLocal",
  email: "hello@ratelocal.ca",
  /** Update with your registered BC business address when available. */
  address: "Fraser Valley, British Columbia, Canada",
} as const;

export const PRICING = {
  setup: 0,
  monthly: 39,
  annual: 390,
  guarantee: "14-day money-back guarantee on your first month",
} as const;

export const TRUST_BADGES = [
  { icon: "G", label: "Google-ready flow", desc: "Happy customers land on your Google review page" },
  { icon: "BC", label: "Built in BC", desc: "Made for Fraser Valley & Metro Vancouver shops" },
  { icon: "🔒", label: "Stripe-secured", desc: "Billing handled by Stripe — card data never touches our servers" },
  { icon: "★", label: "Private feedback first", desc: "Low ratings stay with you before they go public" },
] as const;

export const TESTIMONIALS = [
  {
    quote: "We got 12 new Google reviews in the first week — customers love that AI writes the draft for them.",
    name: "Maria L.",
    role: "Owner",
    company: "Langley Auto Detail",
    industry: "Auto detailing",
  },
  {
    quote: "Bad experiences come to us privately now. Our public rating went from 4.1 to 4.7 in two months.",
    name: "James T.",
    role: "Manager",
    company: "Chilliwack Barber Co.",
    industry: "Barber shop",
  },
  {
    quote: "Setup took ten minutes. Printed the QR, stuck it on the counter, done. Worth every penny.",
    name: "Priya S.",
    role: "Owner",
    company: "Surrey Nails & Spa",
    industry: "Salon",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Will Google ban me for using RateLocal?",
    a: "No — RateLocal helps real customers leave honest reviews. We never ask for fake reviews. Happy customers choose their rating and can edit the AI draft before posting on Google.",
  },
  {
    q: "How many reviews do I get for free?",
    a: "You get 50 review requests completely free — no credit card required. Once you hit that limit, upgrading to Pro ($39/mo) removes all limits and unlocks AI prompts, analytics, and more.",
  },
  {
    q: "Does this work on Android and iPhone?",
    a: "Yes. Customers scan your QR with any phone camera — no app download required. The review page works in Safari, Chrome, and Samsung Internet.",
  },
  {
    q: "How do I print the QR poster?",
    a: "After signup, open your dashboard → Share. Download the print-ready PDF and put it at checkout, on your door, or in appointment reminder emails.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Manage billing from your dashboard. Your review page stays live through the end of your billing period. We also offer a 14-day money-back guarantee on your first month.",
  },
  {
    q: "What happens with 1–2 star ratings?",
    a: "Low ratings are routed to you privately first so you can resolve issues before anything goes public. You stay in control of your reputation.",
  },
  {
    q: "Do I need a Google Business Profile?",
    a: "Yes — you paste your Google review link during setup (or add it later). RateLocal guides happy customers there in one tap after they pick an AI-written draft.",
  },
  {
    q: "How is this different from a generic QR form?",
    a: "RateLocal adds star routing, AI-written review options, private feedback for unhappy customers, and dashboard stats — not just a static link to Google.",
  },
] as const;

export const COMPARISON_ROWS = [
  { them: "Blank Google form", us: "AI draft from their own words" },
  { them: "Angry public 1-stars", us: "Private feedback first" },
  { them: "No idea who scanned", us: "Dashboard stats on scans & copies" },
  { them: "Generic QR link", us: "Branded review page + poster" },
] as const;

export const FLOW_STEPS = [
  { label: "Scan QR", icon: "📱" },
  { label: "Tap stars", icon: "★" },
  { label: "Pick AI draft", icon: "✍️" },
  { label: "Post on Google", icon: "G" },
] as const;
