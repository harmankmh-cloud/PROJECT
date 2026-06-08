import { BRAND } from "@/lib/brand";
import { chatCompletion } from "@/lib/openrouter";
import { emailFooter } from "@/lib/email";

export type OutreachInput = {
  businessName: string;
  city: string;
  vertical: string;
  contactName?: string;
  painNote?: string;
  sequence: "initial" | "followup_1" | "followup_2";
};

export type OutreachDraft = { subject: string; body: string };

const VERTICAL_PAIN: Record<string, string> = {
  dental: "after-hours booking calls and long hold times",
  clinic: "front-desk overload and missed scheduling calls",
  hvac: "emergency calls after hours going to voicemail",
  plumbing: "after-hours emergency calls you miss on the road",
  salon: "phones ringing while your team is with clients",
  spa: "evening booking calls when the desk is closed",
  legal: "every call needing a log and proper screening",
  home_services: "qualifying jobs before you roll a truck",
  insurance:
    "ICBC renewals, quote requests, and policy questions stacking up while your team is already on the phone",
  property_mgmt:
    "tenant maintenance calls, showing requests, and after-hours emergencies hitting the same small team",
};

function templateDraft(input: OutreachInput): OutreachDraft {
  const who = input.contactName?.trim() || "there";
  const pain = input.painNote?.trim() || VERTICAL_PAIN[input.vertical.toLowerCase()] || "missed calls when you're busy or closed";
  const biz = input.businessName.trim();
  const city = input.city.trim();

  if (input.sequence === "followup_1") {
    return {
      subject: `Re: ${biz} — still missing calls?`,
      body: `Hi ${who},

Bumping this — ${pain} is pretty common for ${input.vertical} shops in ${city}.

${BRAND.name} answers your line 24/7, books appointments, and warm-transfers with a transcript. Free sandbox at ${BRAND.domain} — no credit card.

Reply YES if you want the link.

Harman${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_2") {
    return {
      subject: `Last note — ${BRAND.name} sandbox`,
      body: `Hi ${who},

Last quick note — if ${pain} is costing ${biz} jobs, ${BRAND.name} might help. AI receptionist, BC-built, free to test.

${BRAND.domain} · reply YES for sandbox setup help.

Harman${emailFooter()}`,
    };
  }

  return {
    subject: `${city} ${input.vertical} — after-hours calls?`,
    body: `Hi ${who},

I'm Harman — built ${BRAND.name} here in BC (${BRAND.domain}).

For ${biz} in ${city}, the pattern I hear is ${pain}. ${BRAND.name} is an AI phone agent that answers 24/7, books into your calendar, and transfers to your team with full context.

Free sandbox — no credit card. Want the link? Reply YES or book 15 min: ${BRAND.contact.email}

Harman${emailFooter()}`,
  };
}

export async function generateOutreachEmail(input: OutreachInput): Promise<OutreachDraft> {
  const ai = await chatCompletion({
    jsonMode: true,
    max_tokens: 1000,
    temperature: 0.65,
    messages: [
      {
        role: "system",
        content: `You write cold B2B emails for ${BRAND.name} (${BRAND.domain}) — AI phone agent for BC local businesses.

Structure (plain text, 160–220 words):
1. One-line subject: specific to their business + city (not generic)
2. Opening: show you understand their world (1–2 sentences)
3. Problem: the call-volume pain for their vertical — be concrete
4. What ${BRAND.name} does: answers 24/7, books appointments, captures lead info, warm-transfers with transcript — 2–3 sentences
5. Why now / local angle: built in BC, Fraser Valley businesses, no enterprise sales pitch
6. CTA: low friction — free sandbox, reply YES, or 15-min demo (${BRAND.contact.email})

Rules: Sound like a real founder emailing a local business owner — warm, direct, not corporate. No "hope this finds you well", no buzzword soup. Sign as Harman only (footer added separately).
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
