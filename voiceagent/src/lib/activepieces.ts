import type { CallIntelligence } from "./intelligence";

type WebhookPayload = Record<string, unknown>;

async function postActivepiecesWebhook(
  url: string | undefined,
  secret: string,
  payload: WebhookPayload
): Promise<void> {
  const endpoint = url?.trim();
  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-GreetQ-Secret": secret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[activepieces] webhook failed", response.status, detail);
    }
  } catch (error) {
    console.error("[activepieces] webhook error", error);
  }
}

export type SupportLeadPayload = {
  email: string;
  orgName?: string | null;
  category: string;
  message: string;
};

export async function notifyActivepiecesSupportLead(payload: SupportLeadPayload): Promise<void> {
  const secret =
    process.env.ACTIVEPIECES_SUPPORT_WEBHOOK_SECRET?.trim() || "greetq-support-webhook-2026";

  await postActivepiecesWebhook(process.env.ACTIVEPIECES_SUPPORT_WEBHOOK_URL, secret, {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}

export type SignupPayload = {
  orgId: string;
  orgName: string;
  ownerEmail?: string | null;
  plan?: string | null;
};

export async function notifyActivepiecesSignup(payload: SignupPayload): Promise<void> {
  const secret =
    process.env.ACTIVEPIECES_SIGNUP_WEBHOOK_SECRET?.trim() || "greetq-signup-webhook-2026";

  await postActivepiecesWebhook(process.env.ACTIVEPIECES_SIGNUP_WEBHOOK_URL, secret, {
    ...payload,
    createdAt: new Date().toISOString(),
  });
}

export type CallCompletedPayload = {
  event: "call.completed";
  orgId: string;
  orgName: string;
  call: Record<string, unknown>;
  analysis: CallIntelligence;
};

export async function notifyActivepiecesCallCompleted(
  payload: CallCompletedPayload
): Promise<void> {
  const secret =
    process.env.ACTIVEPIECES_CALL_WEBHOOK_SECRET?.trim() || "greetq-call-webhook-2026";

  await postActivepiecesWebhook(process.env.ACTIVEPIECES_CALL_WEBHOOK_URL, secret, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

export type MarketingLeadPayload = {
  email: string;
  businessName?: string | null;
  source?: string;
};

export async function notifyActivepiecesMarketingLead(payload: MarketingLeadPayload): Promise<void> {
  const secret =
    process.env.ACTIVEPIECES_MARKETING_WEBHOOK_SECRET?.trim() || "greetq-marketing-webhook-2026";

  await postActivepiecesWebhook(process.env.ACTIVEPIECES_MARKETING_WEBHOOK_URL, secret, {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}
