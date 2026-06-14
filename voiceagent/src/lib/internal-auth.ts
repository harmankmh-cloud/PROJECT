import "server-only";
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function deployToken(): string {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "";
  return createHash("sha256").update(`greetq-migrate:${sha}`).digest("hex").slice(0, 24);
}

function migrationKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key ? key.slice(-32) : null;
}

export function authorizedInternal(request: NextRequest): boolean {
  const token = request.nextUrl.searchParams.get("token");
  if (token && token === deployToken()) return true;

  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!auth) return false;

  const vercelToken = process.env.VERCEL_TOKEN;
  if (vercelToken && auth === vercelToken) return true;

  const expected = migrationKey();
  return expected ? auth === expected : false;
}

export function unauthorizedInternalResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
