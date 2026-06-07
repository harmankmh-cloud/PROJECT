import "server-only";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CallIntelligence } from "./intelligence";

export async function dispatchCallWebhook(
  orgId: string,
  payload: {
    event: "call.completed";
    call: Record<string, unknown>;
    analysis: CallIntelligence;
  }
) {
  const admin = createAdminClient();
  const { data: org } = await admin
    .from("va_organizations")
    .select("webhook_url, webhook_secret")
    .eq("id", orgId)
    .maybeSingle();

  const url = org?.webhook_url?.trim();
  if (!url) return;

  const body = JSON.stringify({
    ...payload,
    timestamp: new Date().toISOString(),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Intellivo-Webhooks/1.0",
  };

  if (org?.webhook_secret) {
    const signature = createHmac("sha256", org.webhook_secret).update(body).digest("hex");
    headers["X-Intellivo-Signature"] = `sha256=${signature}`;
  }

  await fetch(url, { method: "POST", headers, body }).catch(() => {});
}
