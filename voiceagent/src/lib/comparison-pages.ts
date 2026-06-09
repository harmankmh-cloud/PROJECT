export type ComparisonSlug =
  | "greetq-vs-retell"
  | "greetq-vs-bland"
  | "greetq-vs-justcall"
  | "vs-receptionist";

export const COMPARISON_PAGES: Record<
  ComparisonSlug,
  {
    slug: ComparisonSlug;
    title: string;
    competitor: string;
    headline: string;
    summary: string;
    greetqPoints: string[];
    competitorPoints: string[];
    cta: string;
  }
> = {
  "greetq-vs-retell": {
    slug: "greetq-vs-retell",
    title: "GreetQ vs Retell AI",
    competitor: "Retell AI",
    headline: "Flat pricing with included minutes — built for Canadian businesses",
    summary:
      "Retell is usage-based with credit grants. GreetQ offers predictable monthly plans with included minutes, PIPEDA-aware controls, and a BC-first support model.",
    greetqPoints: [
      "Flat monthly plans from $79 with 300+ included minutes",
      "30 free trial minutes + sandbox — no card to explore",
      "PIPEDA & CASL tooling built in",
      "Warm transfer with full transcript handoff",
    ],
    competitorPoints: [
      "Usage-based pricing with free credits on signup",
      "Strong developer API and agent builder",
      "Card required before production phone numbers",
    ],
    cta: "Try GreetQ free",
  },
  "greetq-vs-bland": {
    slug: "greetq-vs-bland",
    title: "GreetQ vs Bland.ai",
    competitor: "Bland.ai",
    headline: "Predictable receptionist pricing vs per-minute API scale",
    summary:
      "Bland targets high-volume API users. GreetQ is optimized for local businesses that want a receptionist replacement with included minutes and Canadian compliance.",
    greetqPoints: [
      "Receptionist-first UX — no engineering required",
      "Included minute blocks — no surprise bills at low volume",
      "Google Calendar + HubSpot integrations",
      "Enterprise HIPAA + BAA available",
    ],
    competitorPoints: [
      "Permanent free tier with starter credits",
      "Pathway builder for complex call flows",
      "Per-minute pricing after credits",
    ],
    cta: "Get started free",
  },
  "greetq-vs-justcall": {
    slug: "greetq-vs-justcall",
    title: "GreetQ vs JustCall",
    competitor: "JustCall",
    headline: "AI-native receptionist vs cloud phone system add-ons",
    summary:
      "JustCall is a business phone system with AI features. GreetQ is purpose-built for AI call answering, booking, and warm transfer from day one.",
    greetqPoints: [
      "AI answers every call by default — not an add-on",
      "Knowledge base + flow builder for booking logic",
      "Voice stack tuned for under 2s median answer time",
      "Bundle with RateLocal for reputation + reception",
    ],
    competitorPoints: [
      "Full cloud phone system with team dialing",
      "CRM integrations across 100+ tools",
      "AI features vary by plan tier",
    ],
    cta: "Compare with a live demo",
  },
  "vs-receptionist": {
    slug: "vs-receptionist",
    title: "GreetQ vs hiring a receptionist",
    competitor: "Part-time receptionist",
    headline: "24/7 coverage for less than a part-time hire",
    summary:
      "A part-time receptionist in BC costs $2,500–3,500/month for limited hours. GreetQ Starter is $79/month with 300 included minutes and never misses a call.",
    greetqPoints: [
      "$79–399/mo flat with included minutes",
      "24/7 answering — evenings, weekends, holidays",
      "Every call logged with transcript and intent",
      "Scale minutes without hiring",
    ],
    competitorPoints: [
      "$2,500+/mo for part-time coverage",
      "Voicemail after hours",
      "Sick days and turnover",
      "Limited concurrent call capacity",
    ],
    cta: "See ROI calculator",
  },
};

export const COMPARISON_HUB = [
  { slug: "greetq-vs-retell" as const, label: "vs Retell AI" },
  { slug: "greetq-vs-bland" as const, label: "vs Bland.ai" },
  { slug: "greetq-vs-justcall" as const, label: "vs JustCall" },
  { slug: "vs-receptionist" as const, label: "vs Receptionist" },
];
