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

const SIGN_OFF = `Best,\nHarman\nFounder, ${BRAND.name}`;

const VERTICAL_PAIN: Record<string, string> = {
  dental: "missed calls and after-hours voicemails when the front desk is with patients",
  clinic: "scheduling calls that go to voicemail while staff are in appointments",
  hvac: "emergency calls that hit voicemail when dispatch is tied up",
  plumbing: "urgent leads lost when crews are on jobs and nobody picks up",
  salon: "booking calls missed during busy service hours",
  spa: "evening and weekend calls that go unanswered",
  legal: "intake calls that need a quick response but stack up at the desk",
  home_services: "quote requests that go to voicemail before you can call back",
  insurance: "renewal and quote calls piling up while your team is on live lines",
  property_mgmt: "tenant and showing calls converging on a small office team",
};

const MARKETING_VOICE = `You are Harman, founder of ${BRAND.name} (${BRAND.domain}), writing a short plain-text cold email to a local business owner.

Style (standard B2B cold email — like Lemlist, Apollo, or a founder sending manually):
- Conversational and direct. No jargon, no "hope this finds you well," no consultant voice.
- 90–130 words total. Short paragraphs (1–3 sentences each). Blank line between paragraphs.
- Structure: greeting → hook → problem → what we do → one CTA.
- Sign off exactly: "Best,\\nHarman\\nFounder, ${BRAND.name}" (footer added separately — do not include unsubscribe line).
- Subject: short, specific to business name; natural, not salesy or ALL CAPS.

CTA options: reply YES, try free demo at ${BRAND.domain}, or ${BRAND.contact.email}. Pick one.`;

function templateDraft(input: OutreachInput): OutreachDraft {
  const who = input.contactName?.trim() || "there";
  const pain =
    input.painNote?.trim() ||
    VERTICAL_PAIN[input.vertical.toLowerCase()] ||
    "calls going to voicemail when your team is busy or closed";
  const biz = input.businessName.trim();
  const city = input.city.trim();

  if (input.sequence === "morning_call") {
    return {
      subject: `Quick question — ${biz}`,
      body: `Hi ${who},

I tried calling ${biz} earlier today and got voicemail.

When the team's with customers, those calls add up — especially for ${input.vertical} businesses in ${city}. That's usually ${pain}.

${BRAND.name} is an AI phone agent we built in BC. It answers 24/7, books appointments, and sends your team a transcript so you only jump in when needed.

Open to a quick look? Reply YES or try the free demo at ${BRAND.domain}.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_1") {
    return {
      subject: `Re: ${biz}`,
      body: `Hi ${who},

Following up once — wanted to make sure this didn't get buried.

A lot of ${input.vertical} shops in ${city} deal with ${pain}. ${BRAND.name} handles the calls you're missing: answers, books, and hands off to your team with context.

Free to try at ${BRAND.domain}. Reply YES if you want me to send setup details.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_2") {
    return {
      subject: `Last note — ${biz}`,
      body: `Hi ${who},

Last email from me on this.

If ${pain} is an issue for ${biz}, ${BRAND.name} might be worth 10 minutes. It answers calls, books appointments, and keeps your team in the loop.

Demo is free at ${BRAND.domain}, or reply YES and I'll help you set it up.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  return {
    subject: `Missed calls at ${biz}?`,
    body: `Hi ${who},

I run ${BRAND.name} — we help local businesses in ${city} stop losing calls when the desk is busy or you're closed.

For ${biz}, the common issue in ${input.vertical} is ${pain}.

Our AI agent answers every call, books appointments, and sends your team a summary. No extra hire needed.

Want to see it? Reply YES or try the free demo at ${BRAND.domain}.

${SIGN_OFF}${emailFooter()}`,
  };
}

export async function generateOutreachEmail(input: OutreachInput): Promise<OutreachDraft> {
  const ai = await chatCompletion({
    jsonMode: true,
    max_tokens: 800,
    temperature: 0.45,
    messages: [
      {
        role: "system",
        content: `${MARKETING_VOICE}

Sequence notes:
- morning_call: open with trying to call them earlier and getting voicemail
- followup_1: one polite bump
- followup_2: final short note, no pressure
- initial: direct pitch without the call hook

Return JSON only: {"subject":"...","body":"..."}. Body is plain text with blank lines between paragraphs. End body with the sign-off lines (Best, Harman, Founder, ${BRAND.name}).`,
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
        let body = parsed.body.trim();
        if (!body.includes("Best,")) {
          body += `\n\n${SIGN_OFF}`;
        }
        return {
          subject: parsed.subject.trim(),
          body: body + emailFooter(),
        };
      }
    } catch {
      // fall through to template
    }
  }

  return templateDraft(input);
}
