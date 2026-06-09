import { PLANS } from "@/lib/plans";
import { TRIAL_MARKETING } from "@/lib/trial";

export const LANDING_COPY = {
  hero: {
    eyebrow: "Your receptionist never calls in sick",
    headline: "Your AI Receptionist.",
    wordSwap: ["Always On.", "Never Late.", "Never Forgets."] as const,
    subhead:
      "GreetQ answers calls, books appointments, and greets every customer like a pro — so you don't have to.",
    ctaPrimary: "Start free trial",
    ctaSecondary: "Watch demo",
    footnote: `${TRIAL_MARKETING.exploreShort} · ${TRIAL_MARKETING.goLiveShort}`,
  },
  marquee: {
    label: "Trusted by businesses across Canada",
  },
  stats: [
    { value: 10000, suffix: "+", label: "Calls handled" },
    { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
    { value: 2, suffix: " min", label: "Avg. setup" },
    { value: 500, suffix: "+", label: "Businesses" },
  ],
  pricingTeaser: {
    headline: `Plans from $${PLANS.starter.monthlyPrice}/month`,
    subhead: "Cheaper than a part-time receptionist — with better attendance.",
    cta: "See all plans",
  },
  finalCta: {
    headline: "Never miss another customer call",
    subhead: "No credit card required. Cancel anytime. We don't ghost you.",
    cta: TRIAL_MARKETING.cta,
  },
  footer: {
    tagline: "Made with love in Canada",
  },
} as const;

export const BENTO_FEATURES = [
  {
    id: "calls",
    title: "Answers Every Call",
    desc: "Natural voice AI picks up in under 2 seconds — no hold music, no voicemail black hole.",
    large: true,
  },
  {
    id: "booking",
    title: "Books Appointments",
    desc: "Syncs with Google Calendar and logs every booking while you stay focused.",
    large: false,
  },
  {
    id: "greeting",
    title: "Custom Greetings",
    desc: "Your brand voice, your script — not a robotic phone tree.",
    large: false,
  },
  {
    id: "afterhours",
    title: "After-Hours Coverage",
    desc: "Capture leads at 2am. Your competitor's voicemail can't compete.",
    large: false,
  },
  {
    id: "transcripts",
    title: "Call Transcripts",
    desc: "Every conversation logged, searchable, and ready for follow-up.",
    large: false,
  },
  {
    id: "integrations",
    title: "Works With Your Tools",
    desc: "HubSpot, Stripe, Telnyx, Twilio, Zapier — connect what you already use.",
    large: true,
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Sign up & set your hours",
    desc: "Tell us your business name, industry, and when you're open. Takes about 30 seconds.",
  },
  {
    step: 2,
    title: "Customize your greeting",
    desc: "Write your welcome script and tone. Preview how GreetQ sounds before going live.",
  },
  {
    step: 3,
    title: "Go live in minutes",
    desc: "Connect your calendar, point your number at GreetQ, and start answering every call.",
  },
] as const;

export const FEATURES_PAGE = [
  {
    slug: "ai-call-answering",
    title: "AI Call Answering",
    desc: "Natural language conversations — no robotic IVR menus. GreetQ understands intent and responds like a trained receptionist.",
    detail: "Handles FAQs, routing, and warm transfers with full context so callers never repeat themselves.",
  },
  {
    slug: "appointment-booking",
    title: "Smart Appointment Booking",
    desc: "Books directly into Google Calendar during the call. Callers pick a time; you get a confirmed appointment.",
    detail: "Calendly integration coming soon. SMS confirmations keep no-shows down.",
  },
  {
    slug: "custom-greetings",
    title: "Custom Business Greetings",
    desc: "Set your own script, tone, and personality. Sound like your brand — not a generic bot.",
    detail: "Edit anytime from the dashboard. Preview voice before publishing.",
  },
  {
    slug: "after-hours",
    title: "After-Hours Handling",
    desc: "Never miss a lead at 2am. GreetQ captures intent, books if possible, and texts you a summary.",
    detail: "Perfect for salons, clinics, and trades that can't staff phones 24/7.",
  },
  {
    slug: "transcripts",
    title: "Call Transcripts & Summaries",
    desc: "Every call logged with intent, duration, and outcome. Search past conversations in seconds.",
    detail: "Export for compliance or share summaries with your team.",
  },
  {
    slug: "sms-followup",
    title: "SMS Follow-Up",
    desc: "Auto-text callers after the call with booking confirmations or next steps.",
    detail: "Available on Growth and Pro plans.",
  },
  {
    slug: "multi-location",
    title: "Multi-Location Support",
    desc: "One account, many locations. Route calls by area code or custom rules.",
    detail: "Enterprise plans support unlimited locations.",
  },
  {
    slug: "crm",
    title: "CRM Integrations",
    desc: "HubSpot logging, webhook exports, and Zapier for 5,000+ apps.",
    detail: "Salesforce and custom CRM connectors on Enterprise.",
  },
  {
    slug: "analytics",
    title: "Analytics Dashboard",
    desc: "See call volume, booking rate, missed calls, and intent trends at a glance.",
    detail: "Export CSV for board reports or weekly standups.",
  },
  {
    slug: "bilingual",
    title: "Bilingual Support (EN/FR)",
    desc: "Because Canada. English fully supported; French expanding per agent.",
    detail: "Spanish in beta. Contact us for Enterprise language requirements.",
  },
] as const;
