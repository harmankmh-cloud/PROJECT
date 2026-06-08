import "server-only";
import { createHmac } from "crypto";
import { notifyActivepiecesCallCompleted } from "@/lib/activepieces";
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
    .select("webhook_url, webhook_secret, name")
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
    "User-Agent": "GreetQ-Webhooks/1.0",
  };

  if (org?.webhook_secret) {
    const signature = createHmac("sha256", org.webhook_secret).update(body).digest("hex");
    headers["X-GreetQ-Signature"] = `sha256=${signature}`;
  }

  await fetch(url, { method: "POST", headers, body }).catch(() => {});

  void notifyActivepiecesCallCompleted({
    event: "call.completed",
    orgId,
    orgName: org?.name || "Unknown org",
    call: payload.call,
    analysis: payload.analysis as Record<string, unknown>,
  });
}
