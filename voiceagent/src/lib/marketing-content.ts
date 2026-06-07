export const TRUST_STATS = [
  { value: "24/7", label: "AI coverage" },
  { value: "<2s", label: "Avg. answer time", note: "Median on Telnyx inbound" },
  { value: "100%", label: "Complete call records" },
  { value: "99.9%", label: "Uptime SLA" },
] as const;

export const HOME_FEATURES = [
  {
    icon: "headset_mic",
    title: "Inbound AI Receptionist",
    desc: "Natural voice conversations with live transcription and intent detection.",
    bullets: ["24/7 call answering", "Knowledge-base answers"],
  },
  {
    icon: "call_merge",
    title: "Warm Transfer",
    desc: "Escalate to your team with full transcript and context handoff.",
    bullets: ["Intent + summary handoff", "Human takeover mid-call"],
  },
  {
    icon: "campaign",
    title: "Outbound Campaigns",
    desc: "CASL-compliant outreach with recorded consent, quiet hours, and do-not-call lists.",
    bullets: ["Consent records", "Calling-hours windows"],
  },
  {
    icon: "security",
    title: "Audit & Compliance",
    desc: "PIPEDA-aligned controls, audit logging, and optional US HIPAA mode on Enterprise.",
    bullets: ["Full audit log", "PIPEDA & CASL tooling"],
  },
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

export const SALON_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACO7gwLxUNCE7e9a7e-n2xqRuIpXUhJWJ6k0wpdpBiLfTvrQP1sWAUj3tvE2zYK1luVJhEKQ7m5tacd-V0Kla1Q7UPnhfH_A4R6ROtoySzJaShwco39_HnNB-ER_anpB1gF8fMYDa6dhZHy7q1eEeIrgg5vMdtJrqgpf3OozGTmcGhDWnGHqnwic5prGYM21adTEtlbcODANQ5ixfDoiDf66eQCwNlxe5QteezSX4cA1rnEWi1D2VzJcHh6o1uxF7qKS4_R9aPgw";

export const HOME_SERVICES_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB53bz9SIJ4F280FP10Oydc39b69f2KDx7xUgjmqIZaT8PYltkNj9S4que7bqJeMPgpNVvhb7tZPuuzCuceq5kzvGZDw2LMPxeTzEGZPIr_qcE1YTI1RdIXRzWVpfT6QArsJHEkAYbXrQlWOeyr3I0Oc1r2vjWZl7ki_dg4PgseNwZHrtgNBKQEnBXMGkE5TTlyuypOreLdwFd0xlmqTMf_GqckzfPqQd1SuFYxO8HR4gMvFPzGYD_tNsnpc5cKzE5Mft-G_4QNHQ";

export const HUBSPOT_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQWxkSZ5wNm5MuG7lPHg03Hf9XuWsETyG_JYwQ0YqJZZnqtFNj1xT3d2ZIYhBEIIXI26TNonGlNit8FA5KbjgHwdBvXpZ54QqWnTJ6t5__6GEseCbs2R7851riq1htmKYuxdi8GSv35EpZ_QxcU3ujaw68aAWLlezKSB47jPlstjKlzYZFhD74RfMCkks5iaM1KAZ5U4yRH0xA2CCKtdJBRdTXNJxPybZVGJRW6e88UxflpPf0LXvMlz3q18uck7pa6Btx7KKa8g";

export const ZAPIER_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0z2laAo9LS4fJwtitJvcSXg8u79FTVm_SotFFgBUoNurzDFWInjqROMmdUvPTJ3CPFeka0m2Oi_SCQ4punu1T2-ue-RzHEF5lPVt60QPfgFFuZ5i7DYqptdxKyVgNm_a9VA-QH_WVs57qJ8mQIIZQ2oYbCpaXYdGdlXmjxDJ8JCn63pn8w4WdXmut52d-TlldfiD7h6Vx18cuMx4G7vSv3XvkefP8c08T7-NmtbRXMTZcGKklcWbEOhqFazxDPd9IeqwSCeSWvg";

export const USE_CASES = [
  {
    industry: "Salons & spas",
    headline: "Book appointments while stylists stay with clients",
    outcome: "Fewer missed evening bookings — our salon customers report smoother after-hours scheduling.",
    outcomeAttribution: "Elena R., Salon Manager, Glow Studio Collective",
    points: ["Answer after-hours booking requests", "Capture caller intent and preferred times"],
    image: SALON_IMAGE,
    variant: "salon" as const,
  },
  {
    industry: "Clinics & dental",
    headline: "Privacy-aware intake without hold music",
    outcome: "Reduce front-desk hold time on routine scheduling and FAQ calls.",
    points: [
      "Route urgent vs routine calls",
      "Sync with Google Calendar",
      "PIPEDA-aligned handling; BC health-sector controls on Enterprise",
    ],
    variant: "clinic" as const,
  },
  {
    industry: "Home services",
    headline: "Qualify leads before dispatch",
    outcome: "Capture address, issue, and urgency before your team rolls a truck.",
    points: ["Capture address, issue, and urgency", "Quote FAQs from your knowledge base"],
    image: HOME_SERVICES_IMAGE,
    variant: "home" as const,
  },
  {
    industry: "Professional services",
    headline: "Screen calls and log every conversation",
    outcome: "Every call logged with intent for follow-up and compliance review.",
    points: ["HubSpot call logging", "Audit trail for compliance"],
    variant: "pro" as const,
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
    q: "How do you handle Canadian privacy law?",
    a: "We are built for Canadian operators. Personal information is handled under PIPEDA with org-scoped data isolation, export, and deletion options. For BC health-sector clients, Enterprise plans add controls aligned with provincial health privacy requirements. See our Security page and Privacy Policy.",
  },
  {
    q: "What does HIPAA-ready mean?",
    a: "For US healthcare customers, Enterprise plans can enable HIPAA mode with a signed Business Associate Agreement (BAA), configurable retention, and audit logging. Canadian clinics typically use our PIPEDA and provincial privacy controls instead. You remain responsible for lawful call recording consent in your jurisdiction.",
  },
  {
    q: "Which phone providers work?",
    a: "Telnyx is the primary path for inbound AI with live transcription. Twilio supports ConversationRelay, simple gather/reply, SMS, and WhatsApp via omnichannel webhooks.",
  },
  {
    q: "How is usage billed?",
    a: "Each plan is a flat monthly fee that includes a block of voice minutes (300 on Starter, 1,000 on Growth, 2,500 on Pro). If you go over, extra minutes are billed at your plan's per-minute rate. Cancel anytime from the billing portal.",
  },
  {
    q: "Can we try before buying a number?",
    a: "Yes. Use the Agent Sandbox in your dashboard to simulate conversations in text, or place a short test call to your mobile before routing production traffic. No credit card required to explore.",
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
