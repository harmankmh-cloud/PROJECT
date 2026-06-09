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
    cta: "Get started free for your clinic",
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
    cta: "Get started free for your HVAC business",
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
    cta: "Get started free for your firm",
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
    cta: "Get started free for your contracting business",
  },
  "real-estate": {
    slug: "real-estate",
    title: "AI Receptionist for Real Estate",
    headline: "Never miss a showing request",
    description:
      "GreetQ captures buyer and seller intent, schedules viewings, and routes callers to the right agent — 24/7.",
    points: [
      "Capture buyer intent and budget",
      "Schedule property viewings",
      "Route to listing agent",
      "After-hours inquiry capture",
    ],
    cta: "Get started free for your brokerage",
  },
  restaurants: {
    slug: "restaurants",
    title: "AI Receptionist for Restaurants",
    headline: "Handle reservations while you serve",
    description:
      "GreetQ books tables, answers hours and menu FAQs, and routes large parties — so your staff stays on the floor.",
    points: [
      "Table reservations during rush",
      "Hours, location, and menu FAQs",
      "Large party and catering routing",
      "SMS summary to manager",
    ],
    cta: "Get started free for your restaurant",
  },
  salons: {
    slug: "salons",
    title: "AI Receptionist for Salons & Spas",
    headline: "Book while stylists stay with clients",
    description:
      "GreetQ handles after-hours booking, service-specific scheduling, and cancellation requests without pulling staff off the chair.",
    points: [
      "After-hours appointment booking",
      "Service-specific scheduling",
      "Cancellation and reschedule handling",
      "Google Calendar sync",
    ],
    cta: "Get started free for your salon",
  },
  "property-managers": {
    slug: "property-managers",
    title: "AI Receptionist for Property Managers",
    headline: "Triage maintenance calls 24/7",
    description:
      "GreetQ distinguishes urgent maintenance from routine requests, captures tenant details, and escalates to on-call staff.",
    points: [
      "Urgent vs routine maintenance routing",
      "Tenant message capture",
      "On-call escalation",
      "Audit trail for every call",
    ],
    cta: "Get started free for your portfolio",
  },
} as const;

export type IndustrySlug = keyof typeof INDUSTRY_PAGES;
