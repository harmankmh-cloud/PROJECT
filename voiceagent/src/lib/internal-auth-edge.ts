import type { NextRequest } from "next/server";

/** Edge-safe internal gate (Bearer only). Deploy ?token= is checked in route handlers. */
export function authorizedInternalEdge(request: NextRequest): boolean {
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!auth) return false;

  const vercelToken = process.env.VERCEL_TOKEN;
  if (vercelToken && auth === vercelToken) return true;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const migrationKey = serviceKey ? serviceKey.slice(-32) : null;
  return migrationKey ? auth === migrationKey : false;
}
