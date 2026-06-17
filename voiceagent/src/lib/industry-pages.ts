export type IndustryCall = { caller: string; handled: string };
export type IndustryFaq = { q: string; a: string };

export type IndustryPage = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  stat: { value: string; label: string };
  points: readonly string[];
  commonCalls: readonly IndustryCall[];
  faq: readonly IndustryFaq[];
  compliance?: string;
  testimonialIndustry?: string;
  related: readonly string[];
  cta: string;
};

const PAGES = {
  dental: {
    slug: "dental",
    title: "AI Receptionist for Dental Clinics",
    headline: "Stop losing patients to voicemail",
    description:
      "GreetQ answers after-hours calls, books appointments, and routes urgent cases — PIPEDA-aware for Canadian dental practices.",
    stat: { value: "32%", label: "of dental calls arrive outside front-desk hours" },
    points: [
      "After-hours booking capture",
      "HIPAA/PIPEDA-aware intake routing",
      "Google Calendar sync",
      "Warm transfer to on-call staff",
    ],
    commonCalls: [
      { caller: "Hi, I need to book a cleaning sometime next week.", handled: "Checks the calendar, books Tuesday 2 PM, sends SMS confirmation" },
      { caller: "Do you take Pacific Blue Cross?", handled: "Answers from your knowledge base, flags the plan for front-desk verification" },
      { caller: "My crown just fell out — can someone see me today?", handled: "Marks urgent, warm-transfers to on-call staff with full context" },
      { caller: "I need to reschedule Thursday's appointment.", handled: "Moves the booking, updates the calendar, texts the new time" },
      { caller: "How much is a checkup without insurance?", handled: "Quotes your published fee guide, never invents prices" },
      { caller: "Are you open Saturdays?", handled: "Answers hours instantly, offers the next available Saturday slot" },
    ],
    faq: [
      { q: "Is GreetQ compliant for Canadian dental clinics?", a: "GreetQ handles caller information under PIPEDA with org-scoped isolation, export, and deletion. BC clinics on Enterprise get controls aligned with provincial health privacy expectations." },
      { q: "Can it book directly into our schedule?", a: "Yes — GreetQ books into Google Calendar live during the call and sends SMS confirmations. Practice-management integrations are available via API and webhooks." },
      { q: "What happens with a dental emergency?", a: "You define escalation rules. Urgent intents trigger an immediate warm transfer to your on-call line with a transcript and summary handed over." },
    ],
    compliance: "PIPEDA-first handling with BC health-sector controls on Enterprise. US practices can enable HIPAA mode with a signed BAA. Call recording requires lawful consent in your jurisdiction.",
    testimonialIndustry: "Dental",
    related: ["salons", "legal"],
    cta: "Get started free for your clinic",
  },
  hvac: {
    slug: "hvac",
    title: "AI Receptionist for HVAC Companies",
    headline: "Qualify leads before dispatch",
    description:
      "Capture address, urgency, and issue details on the first ring. Peak summer and winter volume handled 24/7 while techs are on jobs.",
    stat: { value: "$300+", label: "average value of a single missed service call" },
    points: [
      "Capture address and urgency",
      "Quote FAQs from knowledge base",
      "SMS summary to dispatch",
      "24/7 emergency triage",
    ],
    commonCalls: [
      { caller: "My furnace died and it's -8 outside.", handled: "Flags emergency, captures address, warm-transfers to on-call tech" },
      { caller: "How much for an AC tune-up?", handled: "Quotes your published rate, offers to book the visit" },
      { caller: "Can someone come look at a noisy heat pump this week?", handled: "Captures issue + address, books the first open slot" },
      { caller: "Do you service Abbotsford?", handled: "Confirms coverage area from your knowledge base" },
      { caller: "I need a quote for a new furnace install.", handled: "Captures home details, schedules an estimate visit" },
      { caller: "What are your weekend rates?", handled: "Answers from your rate card, books if the caller is ready" },
    ],
    faq: [
      { q: "Can GreetQ tell emergencencies from routine calls?", a: "Yes. Intent detection separates no-heat emergencies from tune-up requests. Emergencies follow your escalation rules — warm transfer or instant SMS to dispatch." },
      { q: "How does my dispatcher get the details?", a: "Every call ends with an AI summary, captured address, urgency, and action items — sent by SMS and visible in the dashboard." },
      { q: "Does it work after hours?", a: "24/7 by default. After-hours calls book into your calendar or escalate to your on-call line based on rules you set." },
    ],
    testimonialIndustry: "Home services",
    related: ["contractors", "property-managers"],
    cta: "Get started free for your HVAC business",
  },
  legal: {
    slug: "legal",
    title: "AI Receptionist for Law Firms",
    headline: "Screen every call with full audit trail",
    description:
      "GreetQ logs intent, captures consult requests, and warm-transfers with context — full audit trail for professional services and client confidentiality.",
    stat: { value: "100%", label: "of calls logged with intent and transcript" },
    points: [
      "Intent logging for follow-up",
      "Warm transfer to partners",
      "Compliance records and audit trail",
      "HubSpot call logging",
    ],
    commonCalls: [
      { caller: "I'd like a consultation about a workplace dispute.", handled: "Captures matter type and contact details, books a consult slot" },
      { caller: "Is the firm taking new family law clients?", handled: "Answers from your intake rules, captures details if yes" },
      { caller: "I need to speak with my lawyer about tomorrow's hearing.", handled: "Warm-transfers to the right partner with caller context" },
      { caller: "What are your rates for incorporation?", handled: "Quotes published fees or books a consult — never invents pricing" },
      { caller: "Can I drop off documents this afternoon?", handled: "Answers office hours, leaves a logged message for staff" },
      { caller: "This is opposing counsel — I need a callback.", handled: "Logs the message verbatim with a high-priority action item" },
    ],
    faq: [
      { q: "Does every call get logged?", a: "Yes — transcript, intent, summary, and action items are stored per call with an org-scoped audit trail, useful for client file documentation." },
      { q: "Can callers reach a human?", a: "Warm transfer rules route by matter type, caller, or urgency. The receiving lawyer gets the transcript and summary before picking up." },
      { q: "Is caller information confidential?", a: "Data is org-isolated and handled under PIPEDA with export and deletion controls. See our Security page for the full posture." },
    ],
    compliance: "Full audit trail and intent logs support client-file documentation. PIPEDA-aligned handling with configurable retention.",
    testimonialIndustry: "Professional services",
    related: ["real-estate", "dental"],
    cta: "Get started free for your firm",
  },
  contractors: {
    slug: "contractors",
    title: "AI Receptionist for Contractors",
    headline: "Capture job details on first ring",
    description:
      "Never miss an estimate request. GreetQ qualifies projects, schedules site visits, and escalates urgent jobs.",
    stat: { value: "67%", label: "of homeowners hire the first contractor who answers" },
    points: [
      "Project scope intake",
      "Estimate scheduling",
      "Direct line to owner escalation",
      "After-hours lead capture",
    ],
    commonCalls: [
      { caller: "I need a quote on a bathroom reno.", handled: "Captures scope, photos request by SMS, books an estimate visit" },
      { caller: "Can you fix a fence panel that blew down?", handled: "Captures address and details, offers the first open slot" },
      { caller: "Are you licensed and insured?", handled: "Answers from your knowledge base with license details" },
      { caller: "My basement is flooding — do you do emergency work?", handled: "Flags urgent, escalates straight to your cell" },
      { caller: "How soon could you start a deck build?", handled: "Shares lead times you set, captures the lead either way" },
      { caller: "Just calling to check on my quote from last week.", handled: "Logs the follow-up as an action item with callback number" },
    ],
    faq: [
      { q: "I'm on the tools all day — how do I get my messages?", a: "Every call becomes an SMS summary with the caller's number, job details, and an action item. Review the full transcript in the dashboard later." },
      { q: "Can it tell big jobs from small ones?", a: "Yes — intent detection captures project scope so you can prioritize estimates. You set the questions it asks." },
      { q: "What if the caller insists on talking to me?", a: "Set warm-transfer rules: emergencies ring through to your cell with context; routine quotes book a callback window." },
    ],
    testimonialIndustry: "Home services",
    related: ["hvac", "property-managers"],
    cta: "Get started free for your contracting business",
  },
  "real-estate": {
    slug: "real-estate",
    title: "AI Receptionist for Real Estate",
    headline: "Never miss a showing request",
    description:
      "GreetQ captures buyer and seller intent, schedules viewings, and routes callers to the right agent — 24/7.",
    stat: { value: "5 min", label: "lead response window before buyers call the next agent" },
    points: [
      "Capture buyer intent and budget",
      "Schedule property viewings",
      "Route to listing agent",
      "After-hours inquiry capture",
    ],
    commonCalls: [
      { caller: "Is the house on Maple Street still available?", handled: "Answers from your listings knowledge base, captures buyer details" },
      { caller: "Can I book a viewing for Saturday?", handled: "Schedules the showing and confirms by SMS" },
      { caller: "What's my home worth in this market?", handled: "Captures seller lead details, books a valuation appointment" },
      { caller: "I'm calling about the rental listing.", handled: "Routes to the right agent or captures application intent" },
      { caller: "Does the condo allow pets?", handled: "Answers from listing details, logs the buyer's interest" },
      { caller: "I need to reach my agent about an offer deadline.", handled: "Warm-transfers urgent offer calls with full context" },
    ],
    faq: [
      { q: "Can it route calls to the right agent?", a: "Yes — route by listing, area, or round-robin. The receiving agent sees the caller's intent and transcript before answering." },
      { q: "What about after-hours buyer calls?", a: "GreetQ answers 24/7, captures buyer intent and budget, books showings into shared calendars, and texts the agent a summary." },
      { q: "Does it know my listings?", a: "Upload listing sheets to the knowledge base and the agent answers availability, features, and showing questions accurately." },
    ],
    testimonialIndustry: "Professional services",
    related: ["legal", "property-managers"],
    cta: "Get started free for your brokerage",
  },
  restaurants: {
    slug: "restaurants",
    title: "AI Receptionist for Restaurants",
    headline: "Handle reservations while you serve",
    description:
      "GreetQ books tables, answers hours and menu FAQs, and routes large parties — so your staff stays on the floor.",
    stat: { value: "70%", label: "of restaurant calls are hours, menu, or booking questions" },
    points: [
      "Table reservations during rush",
      "Hours, location, and menu FAQs",
      "Large party and catering routing",
      "SMS summary to manager",
    ],
    commonCalls: [
      { caller: "Table for four tonight around 7?", handled: "Books the reservation and texts a confirmation" },
      { caller: "Are you open on the holiday Monday?", handled: "Answers your holiday hours instantly" },
      { caller: "Do you have gluten-free options?", handled: "Answers from your menu knowledge base" },
      { caller: "I'd like to book a party of 25 for a birthday.", handled: "Captures details and routes large-party requests to the manager" },
      { caller: "Can I change my reservation to 8:30?", handled: "Updates the booking and reconfirms by SMS" },
      { caller: "Do you do catering for offices?", handled: "Captures the catering lead with an action item for follow-up" },
    ],
    faq: [
      { q: "Can it take reservations during the dinner rush?", a: "That's exactly when it shines — every call answered in under 2 seconds while your staff stays on the floor." },
      { q: "What about complicated requests?", a: "Large parties, catering, and special events follow your routing rules — captured in detail and escalated to a manager." },
      { q: "Does it integrate with reservation systems?", a: "Google Calendar booking works today; reservation-platform integrations are available via API and webhooks." },
    ],
    related: ["salons", "dental"],
    cta: "Get started free for your restaurant",
  },
  salons: {
    slug: "salons",
    title: "AI Receptionist for Salons & Spas",
    headline: "Book while stylists stay with clients",
    description:
      "GreetQ handles after-hours booking, service-specific scheduling, and cancellation requests without pulling staff off the chair.",
    stat: { value: "40%", label: "of salon bookings happen outside business hours" },
    points: [
      "After-hours appointment booking",
      "Service-specific scheduling",
      "Cancellation and reschedule handling",
      "Google Calendar sync",
    ],
    commonCalls: [
      { caller: "Can I book a cut and color for Friday?", handled: "Books the right duration for the service combo, confirms by SMS" },
      { caller: "How much is a full balayage?", handled: "Quotes your published service menu" },
      { caller: "I need to cancel tomorrow's appointment.", handled: "Cancels, offers to rebook, frees the slot instantly" },
      { caller: "Is Jess available Saturday morning?", handled: "Checks the stylist's calendar, books or offers alternatives" },
      { caller: "Do you do bridal packages?", handled: "Captures the event lead with details for follow-up" },
      { caller: "What time do you close today?", handled: "Answers hours instantly — no hold music" },
    ],
    faq: [
      { q: "Can it book by stylist and service?", a: "Yes — service durations and per-stylist calendars are configured in setup, so a cut-and-color books the right time with the right person." },
      { q: "What happens when clients cancel by phone?", a: "GreetQ cancels or reschedules, updates the calendar in real time, and logs the change — recovering slots you'd otherwise lose." },
      { q: "Will it sound like my salon?", a: "You set the greeting, tone, and personality. Preview the voice before going live." },
      { q: "Quebec salons and Bill 96?", a: "English voice is live today. French voice and a fully French dashboard are on our roadmap — join the waitlist at /fr for updates." },
    ],
    compliance: "PIPEDA-aware data handling. French-language product experience planned for Quebec operators.",
    testimonialIndustry: "Salon",
    related: ["restaurants", "dental"],
    cta: "Get started free for your salon",
  },
  "property-managers": {
    slug: "property-managers",
    title: "AI Receptionist for Property Managers",
    headline: "Triage maintenance calls 24/7",
    description:
      "GreetQ distinguishes urgent maintenance from routine requests, captures tenant details, and escalates to on-call staff.",
    stat: { value: "24/7", label: "tenant coverage without an answering service contract" },
    points: [
      "Urgent vs routine maintenance routing",
      "Tenant message capture",
      "On-call escalation",
      "Audit trail for every call",
    ],
    commonCalls: [
      { caller: "There's water leaking through my ceiling!", handled: "Flags emergency, captures unit details, escalates to on-call staff" },
      { caller: "My dishwasher stopped working.", handled: "Logs a routine maintenance request with unit and access notes" },
      { caller: "When is rent considered late?", handled: "Answers policy questions from your knowledge base" },
      { caller: "I'm interested in the 2-bedroom you listed.", handled: "Captures the rental lead and books a viewing" },
      { caller: "The parkade gate is stuck open.", handled: "Logs the common-area issue and notifies the right contact" },
      { caller: "I need a copy of my lease.", handled: "Captures the request as an action item for the office" },
    ],
    faq: [
      { q: "How does it tell a flood from a dripping tap?", a: "Urgency detection follows your triage rules: emergencies escalate immediately to on-call staff; routine requests are logged with details for business hours." },
      { q: "Can tenants reach a human at 3 AM?", a: "For genuine emergencies, yes — warm transfer to your on-call line with the unit, issue, and transcript already captured." },
      { q: "Is there a record for disputes?", a: "Every call is transcribed, summarized, and timestamped in an org-scoped audit trail." },
    ],
    testimonialIndustry: "Home services",
    related: ["hvac", "contractors"],
    cta: "Get started free for your portfolio",
  },
} as const satisfies Record<string, IndustryPage>;

export type IndustrySlug = keyof typeof PAGES;

export const INDUSTRY_PAGES: Record<IndustrySlug, IndustryPage> = PAGES;
