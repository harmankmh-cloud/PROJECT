export type ReviewWebhookPayload = {
  businessId: string;
  businessName: string;
  starRating: number;
  customerName?: string | null;
  customerNotes?: string | null;
  aiDraft: string;
  isPrivate: boolean;
  ownerEmail?: string | null;
  receivedAt: string;
};

export async function notifyActivepiecesReview(payload: ReviewWebhookPayload): Promise<void> {
  const url = process.env.ACTIVEPIECES_REVIEW_WEBHOOK_URL?.trim();
  if (!url) return;

  const secret = process.env.ACTIVEPIECES_WEBHOOK_SECRET?.trim();
  if (!secret) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RateLocal-Secret": secret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[activepieces] review webhook failed", response.status, detail);
    }
  } catch (error) {
    console.error("[activepieces] review webhook error", error);
  }
}
