export type HelpCategory = "getting-started" | "billing" | "telephony" | "compliance" | "api";

export type HelpArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: HelpCategory;
  body: string[];
};

export const HELP_CATEGORIES: { id: HelpCategory; label: string }[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "billing", label: "Billing" },
  { id: "telephony", label: "Telephony" },
  { id: "compliance", label: "Compliance" },
  { id: "api", label: "API" },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "create-account",
    title: "Create your GreetQ account",
    excerpt: "Sign up free with 30 trial minutes — no card required.",
    category: "getting-started",
    body: [
      "Visit greetq.com/signup and enter your business name, phone, email, and password.",
      "After signup, GreetQ creates your organization automatically. You'll land in onboarding to configure your first agent.",
      "Explore the text sandbox and place up to three one-minute test calls before subscribing for a live number.",
    ],
  },
  {
    slug: "configure-agent",
    title: "Configure your AI agent",
    excerpt: "Set greeting, system prompt, and escalation number.",
    category: "getting-started",
    body: [
      "Open Dashboard → Agent settings. Set your greeting — what callers hear first.",
      "Add a system prompt with your business hours, services, and tone guidelines.",
      "Set an escalation number for warm transfers when callers need a human.",
    ],
  },
  {
    slug: "sandbox-testing",
    title: "Test in the sandbox",
    excerpt: "Try conversations before connecting a live phone line.",
    category: "getting-started",
    body: [
      "The text sandbox lets you chat with your agent without telephony costs.",
      "Trial accounts include 30 free voice minutes and up to three one-minute test calls to your mobile.",
      "Voice test calls require Telnyx or Twilio to be configured on the server. If the Call my phone button is disabled, use text chat — it works the same agent logic.",
      "Review transcripts in Dashboard → Calls after each test.",
    ],
  },
  {
    slug: "connect-telnyx",
    title: "Connect Telnyx",
    excerpt: "Point your Telnyx number to GreetQ webhooks.",
    category: "telephony",
    body: [
      "In Telnyx Mission Control, set the voice webhook URL to your GreetQ /api/telnyx/webhook endpoint.",
      "Map the phone number to your agent in Dashboard → Phone numbers.",
      "Telnyx is our recommended carrier for Canadian inbound with live transcription.",
    ],
  },
  {
    slug: "connect-twilio",
    title: "Connect Twilio",
    excerpt: "Use Twilio ConversationRelay or simple gather mode.",
    category: "telephony",
    body: [
      "Set your Twilio voice webhook to /api/twilio/voice on your GreetQ app URL.",
      "Relay mode uses real-time AI voice; simple mode is for demos only.",
      "Twilio also supports SMS and WhatsApp via omnichannel settings.",
    ],
  },
  {
    slug: "knowledge-base",
    title: "Add knowledge base content",
    excerpt: "Upload FAQs, hours, and services for accurate answers.",
    category: "getting-started",
    body: [
      "Go to Dashboard → Knowledge and add documents or paste FAQ text.",
      "The agent retrieves relevant chunks during calls to answer pricing, hours, and policy questions.",
      "Update content anytime — changes apply to the next call.",
    ],
  },
  {
    slug: "call-flows",
    title: "Build call flows",
    excerpt: "Route booking, FAQ, and transfer paths with the flow builder.",
    category: "getting-started",
    body: [
      "Dashboard → Flows lets you design greet, ask, branch, tool, transfer, and end nodes.",
      "Publish a flow to attach it to your agent for structured conversations.",
      "Start from the default template and customize for your booking logic.",
    ],
  },
  {
    slug: "trial-minutes",
    title: "Trial minutes and sandbox limits",
    excerpt: "What's included before you subscribe.",
    category: "billing",
    body: [
      "New accounts get 30 free voice minutes and unlimited text sandbox — no credit card.",
      "Sandbox test calls are capped at three one-minute calls to your verified mobile.",
      "When you're ready for production, start a 14-day Stripe trial (card required).",
    ],
  },
  {
    slug: "plans-and-pricing",
    title: "Plans and included minutes",
    excerpt: "Starter, Growth, Pro, and Enterprise tiers.",
    category: "billing",
    body: [
      "Starter ($79/mo) includes 300 minutes. Growth ($199/mo) includes 900. Pro ($399/mo) includes 2,000.",
      "Overage minutes bill at your plan's per-minute rate via Stripe metered billing.",
      "Cancel anytime from the billing portal — no long-term contracts on standard plans.",
    ],
  },
  {
    slug: "stripe-billing",
    title: "Manage billing in Stripe",
    excerpt: "Update payment method, invoices, and cancellation.",
    category: "billing",
    body: [
      "Dashboard → Billing opens the Stripe customer portal.",
      "Download invoices, update cards, and cancel subscriptions there.",
      "Access continues through the end of your billing period after cancellation.",
    ],
  },
  {
    slug: "pipeda-overview",
    title: "PIPEDA and Canadian privacy",
    excerpt: "How GreetQ handles caller personal information.",
    category: "compliance",
    body: [
      "GreetQ processes caller data under PIPEDA with org-scoped isolation.",
      "You can export and delete organization data from settings.",
      "Tell callers when calls are recorded — consent is your responsibility under Canadian law.",
    ],
  },
  {
    slug: "hipaa-enterprise",
    title: "HIPAA on Enterprise",
    excerpt: "BAA, retention controls, and US healthcare use cases.",
    category: "compliance",
    body: [
      "Enterprise plans can enable HIPAA mode with a signed Business Associate Agreement.",
      "Configurable retention and audit logging support healthcare compliance reviews.",
      "Canadian clinics typically use PIPEDA controls instead — contact us for your jurisdiction.",
    ],
  },
  {
    slug: "casl-outbound",
    title: "CASL and outbound campaigns",
    excerpt: "Consent records and quiet hours for outreach.",
    category: "compliance",
    body: [
      "Outbound campaigns require documented consent under CASL.",
      "GreetQ tracks consent records and enforces calling-hours windows.",
      "Maintain do-not-call lists in Dashboard → Campaigns.",
    ],
  },
  {
    slug: "api-keys",
    title: "Create API keys",
    excerpt: "Generate Bearer tokens for the Calls API.",
    category: "api",
    body: [
      "Dashboard → Developer → API keys. Keys are scoped to your organization.",
      "Use Authorization: Bearer grtq_… on all /api/v1 requests.",
      "Rotate keys from the dashboard if compromised.",
    ],
  },
  {
    slug: "outbound-webhooks",
    title: "Outbound webhooks",
    excerpt: "Receive call.completed events after each call.",
    category: "api",
    body: [
      "Set your webhook URL in Dashboard → Developer → Webhooks.",
      "GreetQ POSTs JSON with call metadata and analysis when a call completes.",
      "Verify X-GreetQ-Signature when a webhook secret is configured.",
    ],
  },
  {
    slug: "hubspot-integration",
    title: "Connect HubSpot",
    excerpt: "Log calls and update contacts automatically.",
    category: "getting-started",
    body: [
      "Dashboard → Integrations → HubSpot. OAuth connects your portal.",
      "After each call, summaries and intents can sync to contact records.",
      "See /integrations for the full connector list.",
    ],
  },
  {
    slug: "google-calendar",
    title: "Google Calendar booking",
    excerpt: "Book appointments during live calls.",
    category: "getting-started",
    body: [
      "Connect Google Calendar from Dashboard → Integrations.",
      "Enable the book_appointment tool in your agent or flow.",
      "The agent proposes available slots based on your calendar.",
    ],
  },
  {
    slug: "warm-transfer",
    title: "Warm transfer to your team",
    excerpt: "Escalate with transcript and caller context.",
    category: "telephony",
    body: [
      "Set an escalation number in agent settings.",
      "When the agent transfers, your team receives context from the live transcript.",
      "Configure branch nodes in flows to route 'speak to someone' intents.",
    ],
  },
  {
    slug: "leave-review",
    title: "Leave a review",
    excerpt: "Share feedback as an early adopter.",
    category: "getting-started",
    body: [
      "GreetQ is in early adopter phase — your review helps other local businesses find us.",
      "Contact hello@greetq.com with your experience or use this form for a testimonial request.",
      "We'll never fabricate ratings — authentic feedback only.",
    ],
  },
];

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}
