export const INDUSTRY_PAGES = {
  dental: {
    slug: "dental",
    title: "AI Receptionist for Dental Clinics",
    headline: "Stop losing patients to voicemail",
    description:
      "GreetQ answers after-hours calls, books appointments, and routes urgent cases — PIPEDA-aware for Canadian dental practices.",
    points: [
      "After-hours booking capture",
      "HIPAA/PIPEDA-aware intake routing",
      "Google Calendar sync",
      "Warm transfer to on-call staff",
    ],
    cta: "Start free trial for your clinic",
  },
  hvac: {
    slug: "hvac",
    title: "AI Receptionist for HVAC Companies",
    headline: "Qualify leads before dispatch",
    description:
      "Capture address, urgency, and issue details on the first ring. GreetQ books service calls while your techs are on the job.",
    points: [
      "Capture address and urgency",
      "Quote FAQs from knowledge base",
      "SMS summary to dispatch",
      "24/7 emergency triage",
    ],
    cta: "Start free trial for your HVAC business",
  },
  legal: {
    slug: "legal",
    title: "AI Receptionist for Law Firms",
    headline: "Screen every call with full audit trail",
    description:
      "GreetQ logs intent, captures consult requests, and warm-transfers with context — built for professional services compliance.",
    points: [
      "Intent logging for follow-up",
      "Warm transfer to partners",
      "Compliance records and audit trail",
      "HubSpot call logging",
    ],
    cta: "Start free trial for your firm",
  },
  contractors: {
    slug: "contractors",
    title: "AI Receptionist for Contractors",
    headline: "Capture job details on first ring",
    description:
      "Never miss an estimate request. GreetQ qualifies projects, schedules site visits, and escalates urgent jobs.",
    points: [
      "Project scope intake",
      "Estimate scheduling",
      "Direct line to owner escalation",
      "After-hours lead capture",
    ],
    cta: "Start free trial for your contracting business",
  },
} as const;

export type IndustrySlug = keyof typeof INDUSTRY_PAGES;
