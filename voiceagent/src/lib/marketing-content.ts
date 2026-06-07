export const TRUST_STATS = [
  { value: "24/7", label: "AI coverage" },
  { value: "<2s", label: "Avg. answer time", note: "Median on Telnyx inbound" },
  { value: "100%", label: "Call logs retained" },
  { value: "Voice · SMS · WA", label: "Channels supported" },
] as const;

export const SETUP_STEPS = [
  {
    step: "1",
    icon: "🤖",
    title: "Create your agent",
    text: "Set greeting, system prompt, and escalation number. Test in the text sandbox before going live.",
  },
  {
    step: "2",
    icon: "📞",
    title: "Connect your number",
    text: "Point Telnyx or Twilio to Intellivo webhooks. Map the line to your agent in the dashboard.",
  },
  {
    step: "3",
    icon: "📚",
    title: "Add knowledge & flows",
    text: "Upload FAQs, hours, and services. Publish call flows for booking, routing, and warm transfer.",
  },
  {
    step: "4",
    icon: "📊",
    title: "Go live & measure",
    text: "Review transcripts, analytics, and quality scores. Tune prompts from real caller intents.",
  },
] as const;

export const FEATURE_CARDS = [
  {
    title: "Inbound AI receptionist",
    desc: "Natural voice conversations with live transcription, knowledge retrieval, and intent detection.",
    bullets: ["24/7 call answering", "Live transcription", "Knowledge-base answers", "Voicemail fallback"],
  },
  {
    title: "Warm transfer with context",
    desc: "Escalate to your team with full transcript, caller intent, and summary — no repeat explanations.",
    bullets: ["Intent + summary handoff", "Configurable escalation rules", "Human takeover mid-call"],
  },
  {
    title: "Outbound & campaigns",
    desc: "TCPA-aware outbound dialing with consent tracking and calling-hours enforcement.",
    bullets: ["Consent records", "Calling-hours windows", "Campaign analytics"],
  },
  {
    title: "Analytics dashboard",
    desc: "Track call volume, intents, quality scores, and conversion trends from one view.",
    bullets: ["Intent breakdown", "Quality scoring", "Usage metering"],
  },
  {
    title: "Compliance & audit trail",
    desc: "TCPA consent tracking, configurable retention, audit logs, and Enterprise HIPAA mode with BAA.",
    bullets: ["Full audit log", "TCPA tooling", "HIPAA on Enterprise"],
  },
  {
    title: "Multilingual (beta)",
    desc: "English-first with Spanish support expanding — configure per agent in settings.",
    bullets: ["English + Spanish (beta)", "Per-agent language config"],
  },
] as const;

export const USE_CASES = [
  {
    industry: "Salons & spas",
    headline: "Book appointments while stylists stay with clients",
    outcome: "Teams report fewer missed evening bookings",
    points: ["Answer after-hours booking requests", "Capture caller intent and preferred times", "Warm transfer for complex color consults"],
  },
  {
    industry: "Clinics & dental",
    headline: "HIPAA-aware intake without hold music",
    outcome: "Reduce front-desk hold time on routine calls",
    points: ["Route urgent vs routine calls", "Sync with Google Calendar", "Enterprise HIPAA mode with BAA"],
  },
  {
    industry: "Home services",
    headline: "Qualify leads before dispatch",
    outcome: "Capture address and urgency before dispatch",
    points: ["Capture address, issue, and urgency", "Quote FAQs from your knowledge base", "SMS follow-up on Growth+ plans"],
  },
  {
    industry: "Professional services",
    headline: "Screen calls and log every conversation",
    outcome: "Every call logged with intent for follow-up",
    points: ["HubSpot call logging", "Audit trail for compliance", "API access for custom CRM workflows"],
  },
] as const;

export const INTEGRATIONS = [
  { name: "Telnyx", abbr: "TX", color: "from-emerald-500 to-teal-600", desc: "Primary voice carrier with transcription and TTS" },
  { name: "Twilio", abbr: "TW", color: "from-red-500 to-rose-600", desc: "Voice relay, SMS, and WhatsApp omnichannel" },
  { name: "Google Calendar", abbr: "GC", color: "from-blue-500 to-blue-600", desc: "Live appointment booking during calls" },
  { name: "HubSpot", abbr: "HS", color: "from-orange-500 to-orange-600", desc: "Post-call logging and contact updates" },
  { name: "Stripe", abbr: "ST", color: "from-violet-500 to-purple-600", desc: "Subscription + metered minute billing" },
  { name: "OpenRouter", abbr: "OR", color: "from-slate-600 to-slate-800", desc: "LLM backbone for natural conversations" },
  { name: "Zapier", abbr: "ZP", color: "from-amber-500 to-orange-500", desc: "Connect 5,000+ apps via webhooks", soon: true },
  { name: "Calendly", abbr: "CA", color: "from-blue-600 to-indigo-600", desc: "Scheduling links during live calls", soon: true },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We stopped missing evening calls. The agent books consults and only transfers when it needs a human.",
    name: "Sarah M.",
    role: "Operations Director",
    company: "Pacific Dental Group",
    industry: "Dental",
  },
  {
    quote:
      "Setup took an afternoon — sandbox, knowledge docs, then we pointed our Telnyx number. Analytics showed intent trends within a week.",
    name: "James K.",
    role: "Owner",
    company: "North Shore HVAC",
    industry: "Home services",
  },
  {
    quote:
      "Our front desk used to juggle phones during color services. Now the AI handles booking and we step in for complex consults.",
    name: "Elena R.",
    role: "Salon Manager",
    company: "Glow Studio Collective",
    industry: "Salon",
  },
  {
    quote:
      "HubSpot logging after every call means our team follows up with context. The audit trail helped us pass a client security review.",
    name: "David L.",
    role: "Managing Partner",
    company: "Harbour Legal Services",
    industry: "Professional services",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "How fast can we go live?",
    a: "Most teams launch in one day: create an agent, add knowledge, connect a phone number, and test in the sandbox. Complex flows or Enterprise compliance may take longer.",
  },
  {
    q: "What does HIPAA-ready mean?",
    a: "Enterprise plans support HIPAA mode with a signed Business Associate Agreement (BAA), configurable retention, and audit logging. You remain responsible for lawful call recording consent in your jurisdiction. See our Security page for details.",
  },
  {
    q: "Which phone providers work?",
    a: "Telnyx is the primary path for inbound AI with live transcription. Twilio supports ConversationRelay, simple gather/reply, SMS, and WhatsApp via omnichannel webhooks.",
  },
  {
    q: "How is usage billed?",
    a: "Each plan includes a monthly subscription plus metered per-minute voice usage. Pricing cards show example totals at ~500 minutes per month. Cancel anytime from the billing portal.",
  },
  {
    q: "Can we try before buying a number?",
    a: "Yes. Use the Agent Sandbox in your dashboard to simulate conversations in text before routing production traffic. No credit card required to explore.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Subscriptions are month-to-month. Cancel from the Stripe billing portal — access continues through the end of your billing period. No long-term contracts on Starter, Growth, or Pro.",
  },
  {
    q: "Who owns our call data?",
    a: "You do. Call transcripts, recordings, and knowledge base content belong to your organization. Export and deletion options are available in settings. See our Privacy Policy.",
  },
  {
    q: "What languages are supported?",
    a: "English is fully supported today. Spanish is in beta per-agent. Additional languages are on the roadmap — contact us for Enterprise requirements.",
  },
  {
    q: "How fast does the agent respond?",
    a: "Median answer time is under 2 seconds on Telnyx inbound with our default stack. Latency depends on carrier, region, and LLM provider load.",
  },
  {
    q: "Do you offer a demo?",
    a: "Start a free trial to explore the product, or book a demo for an Enterprise walkthrough with compliance and integration review.",
  },
] as const;
