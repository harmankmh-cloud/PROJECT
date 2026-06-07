export const TRUST_STATS = [
  { value: "24/7", label: "AI coverage" },
  { value: "<2s", label: "Avg. answer time" },
  { value: "100%", label: "Call logs retained" },
  { value: "3+", label: "Channels supported" },
] as const;

export const SETUP_STEPS = [
  {
    step: "1",
    title: "Create your agent",
    text: "Set greeting, system prompt, and escalation number. Test in the text sandbox before going live.",
  },
  {
    step: "2",
    title: "Connect your number",
    text: "Point Telnyx or Twilio to Intellivo webhooks. Map the line to your agent in the dashboard.",
  },
  {
    step: "3",
    title: "Add knowledge & flows",
    text: "Upload FAQs, hours, and services. Publish call flows for booking, routing, and warm transfer.",
  },
  {
    step: "4",
    title: "Go live & measure",
    text: "Review transcripts, analytics, and quality scores. Tune prompts from real caller intents.",
  },
] as const;

export const USE_CASES = [
  {
    industry: "Salons & spas",
    headline: "Book appointments while stylists stay with clients",
    points: ["Answer after-hours booking requests", "Capture caller intent and preferred times", "Warm transfer for complex color consults"],
  },
  {
    industry: "Clinics & dental",
    headline: "HIPAA-aware intake without hold music",
    points: ["Route urgent vs routine calls", "Sync with Google Calendar", "Enterprise HIPAA mode with BAA"],
  },
  {
    industry: "Home services",
    headline: "Qualify leads before dispatch",
    points: ["Capture address, issue, and urgency", "Quote FAQs from your knowledge base", "SMS follow-up on Pro plans"],
  },
  {
    industry: "Professional services",
    headline: "Screen calls and log every conversation",
    points: ["HubSpot call logging", "Audit trail for compliance", "API access for custom CRM workflows"],
  },
] as const;

export const INTEGRATIONS = [
  { name: "Telnyx", desc: "Primary voice carrier with transcription and TTS" },
  { name: "Twilio", desc: "Voice relay, SMS, and WhatsApp omnichannel" },
  { name: "Google Calendar", desc: "Live appointment booking during calls" },
  { name: "HubSpot", desc: "Post-call logging and contact updates" },
  { name: "Stripe", desc: "Subscription + metered minute billing" },
  { name: "OpenRouter", desc: "LLM backbone for natural conversations" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We stopped missing evening calls. The agent books consults and only transfers when it needs a human.",
    name: "Operations lead",
    company: "Multi-location dental group",
  },
  {
    quote:
      "Setup took an afternoon — sandbox, knowledge docs, then we pointed our Telnyx number. Analytics showed intent trends within a week.",
    name: "Owner",
    company: "Regional HVAC company",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "How fast can we go live?",
    a: "Most teams launch in one day: create an agent, add knowledge, connect a phone number, and test in the sandbox. Complex flows or Enterprise compliance may take longer.",
  },
  {
    q: "What does HIPAA-ready mean?",
    a: "Enterprise plans support HIPAA mode with a signed Business Associate Agreement (BAA), configurable retention, and audit logging. You remain responsible for lawful call recording consent in your jurisdiction.",
  },
  {
    q: "Which phone providers work?",
    a: "Telnyx is the primary path for inbound AI with live transcription. Twilio supports ConversationRelay, simple gather/reply, SMS, and WhatsApp via omnichannel webhooks.",
  },
  {
    q: "How is usage billed?",
    a: "Each plan includes a monthly subscription plus metered per-minute voice usage. Pricing cards show example totals at ~500 minutes per month.",
  },
  {
    q: "Can we try before buying a number?",
    a: "Yes. Use the Agent Sandbox in your dashboard to simulate conversations in text before routing production traffic.",
  },
  {
    q: "Do you offer a demo?",
    a: "Start a free trial to explore the product, or contact us for an Enterprise walkthrough with compliance and integration review.",
  },
] as const;
