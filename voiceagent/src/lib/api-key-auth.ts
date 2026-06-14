import "server-only";
import { createHash, randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const token = randomBytes(24).toString("hex");
  const key = `grtq_${token}`;
  const prefix = key.slice(0, 12);
  return { key, prefix, hash: hashApiKey(key) };
}

export async function verifyApiKey(
  request: Request
): Promise<{ orgId: string; keyId: string } | null> {
  const header = request.headers.get("authorization") || request.headers.get("x-api-key");
  if (!header) return null;

  const key = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();
  if (!key.startsWith("grtq_") && !key.startsWith("ivo_")) return null;

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("va_api_keys")
    .select("id, org_id")
    .eq("key_hash", hashApiKey(key))
    .maybeSingle();

  if (!row) return null;

  await admin
    .from("va_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", row.id);

  return { orgId: row.org_id, keyId: row.id };
}
