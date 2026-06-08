import { BRAND } from "@/lib/brand";
import { chatCompletion } from "@/lib/openrouter";
import { emailFooter } from "@/lib/email";

export type OutreachInput = {
  businessName: string;
  city: string;
  vertical: string;
  contactName?: string;
  painNote?: string;
  sequence: "initial" | "morning_call" | "followup_1" | "followup_2";
};

export type OutreachDraft = { subject: string; body: string };

const VERTICAL_PAIN: Record<string, string> = {
  dental: "after-hours booking demand and front-desk capacity during chair time",
  clinic: "scheduling volume that competes with in-room patient care",
  hvac: "emergency calls that arrive when dispatch is unavailable",
  plumbing: "high-intent emergency leads lost while crews are in the field",
  salon: "inbound demand during service hours when staff cannot answer",
  spa: "evening and weekend booking intent with no coverage at the desk",
  legal: "intake calls that require screening, logging, and timely response",
  home_services: "qualification and scheduling before committing a truck roll",
  insurance:
    "ICBC renewals, quote requests, and policy questions stacking up while your team is already on live calls",
  property_mgmt:
    "tenant maintenance, showing requests, and after-hours issues converging on a small ops team",
};

const MARKETING_VOICE = `You are Harman, founder of ${BRAND.name} (${BRAND.domain}), writing as a Harvard-trained marketing strategist who runs the company — not a sales rep blasting a list.

Voice & craft:
- Strategic, precise, respectful of the reader's intelligence. Every sentence earns its place.
- Lead with insight or observed behavior, then implication, then solution. No throat-clearing.
- Use concrete business language (capacity, conversion, coverage, response time, opportunity cost) — never buzzword soup or "hope this finds you well."
- Sound like a peer who has done the homework on their vertical — not a vendor pitching features.
- One clear CTA. Low friction: reply YES, book 15 minutes, or try the sandbox. No pressure tactics.
- 160–220 words. Plain text. Sign as "Harman" only (footer added separately).
- Subject: specific to business + city; curiosity or relevance, never spammy ALL CAPS or fake RE: threads.`;

function templateDraft(input: OutreachInput): OutreachDraft {
  const who = input.contactName?.trim() || "there";
  const pain =
    input.painNote?.trim() ||
    VERTICAL_PAIN[input.vertical.toLowerCase()] ||
    "inbound calls you cannot answer when the team is with customers or closed";
  const biz = input.businessName.trim();
  const city = input.city.trim();

  if (input.sequence === "morning_call") {
    return {
      subject: `${biz} — could not reach your line this morning`,
      body: `Hi ${who},

I called ${biz} earlier today. Busy signal, then voicemail. That pattern usually signals one of two things: high demand (good) or a coverage gap at the moment of intent (expensive).

For ${input.vertical} businesses in ${city}, the cost shows up as ${pain}. Every unanswered ring is a lead, renewal, or appointment that may not come back.

${BRAND.name} is the AI phone layer we built in BC for exactly this — coverage without adding headcount. It answers 24/7, handles routine inquiries, books into your calendar, and warm-transfers priority calls with a full transcript so your team only steps in when judgment matters.

We work with Fraser Valley operators who want enterprise-grade response without enterprise sales theater. Sandbox is free at ${BRAND.domain}.

If worth exploring: reply YES or book 15 minutes — ${BRAND.contact.email}.

Harman${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_1") {
    return {
      subject: `Re: ${biz} — response coverage`,
      body: `Hi ${who},

Following up once. The issue we see repeatedly in ${city} ${input.vertical} shops: ${pain}. It is less about missed calls and more about missed moments of intent — when a prospect is ready to act.

${BRAND.name} closes that gap: always-on answering, appointment capture, structured handoff to your team. BC-built, no long contract, free sandbox at ${BRAND.domain}.

Worth a look? Reply YES and I will send access.

Harman${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_2") {
    return {
      subject: `Closing the loop — ${BRAND.name}`,
      body: `Hi ${who},

Last note from me. If ${pain} is a real constraint for ${biz}, ${BRAND.name} may be worth 15 minutes of your time.

We deploy an AI phone agent that answers, books, and transfers with context — built for local operators, not call-center scale. Try the sandbox at ${BRAND.domain}, or reply YES for setup help.

Harman${emailFooter()}`,
    };
  }

  return {
    subject: `${biz} — inbound call coverage in ${city}`,
    body: `Hi ${who},

I lead ${BRAND.name} (${BRAND.domain}) — we build AI phone infrastructure for BC service businesses.

For ${biz}, the pattern in ${input.vertical} is familiar: ${pain}. The fix is not "more staff on the phone" but better coverage at peak intent — after hours, lunch rush, or when multiple lines ring at once.

${BRAND.name} answers every call, books appointments, captures lead detail, and warm-transfers with transcript. Your team stays focused on work that requires a human.

Sandbox is free. If you want a walkthrough: reply YES or ${BRAND.contact.email}.

Harman${emailFooter()}`,
  };
}

export async function generateOutreachEmail(input: OutreachInput): Promise<OutreachDraft> {
  const ai = await chatCompletion({
    jsonMode: true,
    max_tokens: 1000,
    temperature: 0.55,
    messages: [
      {
        role: "system",
        content: `${MARKETING_VOICE}

Structure:
1. Subject — specific, professional, tied to their business and city
2. Opening — one sharp observation (for morning_call: you called earlier, could not reach them; frame as market signal, not complaint)
3. Problem — vertical-specific pain in business terms (capacity, conversion, coverage)
4. Solution — what ${BRAND.name} does in 2–3 sentences: 24/7 answer, booking, warm-transfer with transcript
5. Positioning — BC-built, Fraser Valley, no enterprise pitch; strategic infrastructure not a gadget
6. CTA — single, low-friction (reply YES, sandbox at ${BRAND.domain}, or ${BRAND.contact.email})

Sequence notes:
- morning_call: open with the call attempt; diagnose coverage gap; authoritative but not salesy
- followup_1: one bump; emphasize opportunity cost of missed intent
- followup_2: final courteous close; respect their time
- initial: direct value prop without the call hook

Return JSON only: {"subject":"...","body":"..."}. Body is plain text, no HTML.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          sequence: input.sequence,
          business: input.businessName,
          city: input.city,
          vertical: input.vertical,
          contact: input.contactName || "there",
          pain: input.painNote,
        }),
      },
    ],
  });

  if (ai) {
    try {
      const parsed = JSON.parse(ai) as { subject?: string; body?: string };
      if (parsed.subject?.trim() && parsed.body?.trim()) {
        return {
          subject: parsed.subject.trim(),
          body: parsed.body.trim() + emailFooter(),
        };
      }
    } catch {
      // fall through to template
    }
  }

  return templateDraft(input);
}
