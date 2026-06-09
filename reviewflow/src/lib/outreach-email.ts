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

const VERTICAL_PAIN: Record<string, string> = {
  dental: "patients comparing Google ratings before they book — under 4.5 stars and you lose the call",
  clinic: "new patients shortlisting clinics by star count and recent review volume",
  restaurant: "diners checking reviews before reserving — stale or thin profiles cost covers",
  salon: "clients choosing between salons on Maps; the one with 80+ recent 5-stars wins",
  spa: "high-intent bookings driven by trust signals on Google, not just Instagram",
  legal: "prospects treating review depth as a proxy for responsiveness and credibility",
  home_services: "homeowners filtering contractors by rating and review recency before requesting quotes",
  insurance: "renewal-season shoppers comparing agencies on Google before they phone",
  property_mgmt: "owners and tenants researching management firms by public reputation",
  auto: "drivers trusting shops with visible, recent customer stories on Maps",
  retail: "foot traffic influenced by local search stars and review freshness",
  other: "buyers defaulting to whoever looks most trusted on Google Maps",
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
      subject: `${biz} — quick note on your Google reviews`,
      body: `Hi ${who},

I was comparing ${input.vertical} businesses in ${city} on Google Maps and landed on ${biz}. Strong operation — but your public review story looks thinner than nearby competitors who are winning the "who do I trust?" moment.

That gap shows up as ${pain}.

${BRAND.name} helps BC shops turn happy customers into real Google reviews — AI prompts, QR/SMS flow, policy-safe (customers write their own words). Pro is $39/mo; you can claim your listing and try the flow free: ${trialUrl}

If useful, reply YES and I'll send a 5-minute setup link.

Harman${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_1") {
    return {
      subject: `Re: ${biz} — Google review momentum`,
      body: `Hi ${who},

One follow-up. In ${city}, ${pain}. The fix is usually not "ask harder" — it's a system that asks at the right moment with wording customers actually use.

${BRAND.name} does that: private low-star feedback, public 4–5★ paths to Google, owner dashboard. Claim free at ${trialUrl}.

Worth a look? Reply YES.

Harman${emailFooter()}`,
    };
  }

  if (input.sequence === "followup_2") {
    return {
      subject: `Closing the loop — ${BRAND.name}`,
      body: `Hi ${who},

Last note from me. If Google review volume is a growth lever for ${biz}, ${BRAND.name} may be worth 10 minutes.

BC-built, Google-policy compliant, $39/mo Pro. Claim your page: ${trialUrl} — or reply YES for help.

Harman${emailFooter()}`,
    };
  }

  return {
    subject: `${biz} — more Google reviews without the awkward ask`,
    body: `Hi ${who},

I run ${BRAND.name} (${BRAND.domain}) — we help Fraser Valley businesses collect more authentic Google reviews.

For ${biz}, the pattern in ${input.vertical} is familiar: ${pain}. Most owners mean to ask — but front desk is busy and the moment passes.

${BRAND.name} fixes that with a simple customer link, smart AI prompts, and a dashboard so you see what's working. No fake reviews, no incentives — customers post themselves.

Claim your business free: ${trialUrl}
Pro ($39/mo) adds analytics, QR posters, and response tools when you're ready.

Reply YES if you want a quick walkthrough.

Harman${emailFooter()}`,
  };
}
