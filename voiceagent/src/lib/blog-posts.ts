export const BLOG_POSTS = [
  {
    slug: "ai-receptionist-bc-dental-clinics",
    title: "AI Receptionist for BC Dental Clinics",
    excerpt:
      "How dental practices in British Columbia use voice AI to capture after-hours bookings without adding front-desk headcount.",
    date: "2026-06-01",
    readMinutes: 5,
    body: [
      "Dental clinics in BC lose patients when calls go to voicemail after 5 PM. An AI receptionist answers every ring, captures appointment requests, and routes emergencies to on-call staff.",
      "Under PIPEDA, clinics must tell callers when conversations are recorded and store data in Canada where possible. GreetQ provides org-scoped isolation, export, and deletion controls aligned with Canadian privacy law.",
      "Most clinics go live in one day: add hours and FAQs, connect a Telnyx or Twilio number, and test with a sandbox call before routing production traffic.",
    ],
  },
  {
    slug: "voice-ai-hvac-companies",
    title: "How Voice AI Helps HVAC Companies",
    excerpt:
      "Qualify service calls, capture addresses, and dispatch faster — without hiring a full-time phone team.",
    date: "2026-06-03",
    readMinutes: 4,
    body: [
      "HVAC companies peak in summer and winter. When every tech is on a job, missed calls mean lost revenue. Voice AI captures caller address, issue type, and urgency before your dispatcher calls back.",
      "GreetQ pulls answers from your knowledge base — pricing FAQs, service areas, and emergency policies — so callers get immediate help.",
      "After each call, transcripts and summaries land in your dashboard. Connect HubSpot or webhooks to push leads into your CRM automatically.",
    ],
  },
  {
    slug: "pipeda-compliance-ai-phone-systems",
    title: "PIPEDA Compliance for AI Phone Systems",
    excerpt:
      "What Canadian businesses need to know before deploying an AI receptionist that records and processes caller data.",
    date: "2026-06-05",
    readMinutes: 6,
    body: [
      "PIPEDA requires organizations to identify the purposes for collecting personal information, obtain meaningful consent where appropriate, and protect data with reasonable safeguards.",
      "For AI phone systems, that means telling callers the call may be recorded, limiting retention, and ensuring vendors process data under contract with appropriate controls.",
      "GreetQ is built for Canadian operators: org-scoped data, audit logs, configurable retention, and export/deletion on request. Enterprise plans add controls for BC health-sector and US HIPAA use cases.",
    ],
  },
] as const;
