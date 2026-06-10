import { BRAND } from "@/lib/brand";
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
  dental: "patients checking Google ratings before they book — weaker profiles lose the appointment",
  clinic: "new patients picking clinics with more recent reviews on Maps",
  restaurant: "diners reading reviews before they reserve a table",
  salon: "clients choosing the salon with more 5-star reviews nearby",
  spa: "bookings driven by Google trust signals, not just social",
  legal: "prospects judging responsiveness by your public reviews",
  home_services: "homeowners filtering contractors by star rating before they call",
  insurance: "shoppers comparing agencies on Google during renewal season",
  property_mgmt: "owners researching managers by online reputation",
  auto: "drivers trusting shops with recent customer reviews",
  retail: "local shoppers influenced by review count and freshness",
  other: "customers picking whoever looks most trusted on Google Maps",
};

export function generateOutreachEmail(input: OutreachInput): OutreachDraft {
  const who = input.contactName?.trim() || "there";
  const pain =
    input.painNote?.trim() ||
    VERTICAL_PAIN[input.vertical.toLowerCase()] ||
    "customers choosing competitors with stronger Google review profiles";
  const biz = input.businessName.trim();
  const city = input.city.trim();
  const trialUrl = `https://${BRAND.domain}/claim-business`;

  if (input.sequence === "morning_call") {
    return {
      subject: `Google reviews — ${biz}`,
      body: `Hi ${who},

I was looking at ${biz} on Google Maps in ${city}. Good business — but your review count looks lighter than nearby ${input.vertical} competitors.

That matters because ${pain}.

${BRAND.name} helps you collect real Google reviews with a simple customer link and follow-up prompts. Customers write their own review — no incentives, Google-policy safe.

Claim your listing free: ${trialUrl}

Reply YES if you'd like a quick setup walkthrough.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_1") {
    return {
      subject: `Re: ${biz}`,
      body: `Hi ${who},

Quick follow-up on my last note.

In ${city}, ${pain}. ${BRAND.name} makes it easy to ask at the right moment — private feedback for low stars, happy customers guided to Google.

Free to claim your page: ${trialUrl}

Reply YES if you want help getting started.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_2") {
    return {
      subject: `Last note — ${biz}`,
      body: `Hi ${who},

Last email from me on this.

If more Google reviews would help ${biz} win local searches, ${BRAND.name} is worth a look. Pro is $39/mo; you can claim free first: ${trialUrl}

Reply YES anytime if you want help.

${SIGN_OFF}${emailFooter()}`,
    };
  }

  return {
    subject: `Google reviews for ${biz}?`,
    body: `Hi ${who},

I run ${BRAND.name} — we help Fraser Valley businesses get more authentic Google reviews.

For ${biz}, the usual issue in ${input.vertical} is ${pain}. Most owners want to ask — but the front desk is busy and the moment passes.

${BRAND.name} sends customers a simple link with smart prompts. They post their own review. You get a dashboard to track what's working.

Claim your business free: ${trialUrl}
Pro ($39/mo) adds analytics and QR tools when you're ready.

Reply YES for a 5-minute walkthrough.

${SIGN_OFF}${emailFooter()}`,
  };
}
