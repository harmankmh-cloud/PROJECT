import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

function migrationKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key ? key.slice(-32) : null;
}

function authorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!auth) return false;

  const vercelToken = process.env.VERCEL_TOKEN;
  if (vercelToken && auth === vercelToken) return true;

  const expected = migrationKey();
  return expected ? auth === expected : false;
}

async function runViaPostgres(sql: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const dbUrl =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL;

  if (!dbUrl) {
    return { ok: false, error: "No POSTGRES_URL / DATABASE_URL on server" };
  }

  try {
    const postgres = (await import("postgres")).default;
    const db = postgres(dbUrl, { ssl: "require", max: 1 });
    await db.unsafe(sql);
    await db.end({ timeout: 5 });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function runViaManagementApi(sql: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!token || !ref) {
    return { ok: false, error: "No SUPABASE_ACCESS_TOKEN or project ref" };
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  const body = await res.text();
  if (!res.ok) {
    return { ok: false, error: `Management API ${res.status}: ${body.slice(0, 300)}` };
  }
  return { ok: true };
}

function loadMigrationSql(): string {
  return readFileSync(
    join(process.cwd(), "supabase/migrations/009_billing_enhancements.sql"),
    "utf8"
  );
}

async function verifyColumns(): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("va_organizations")
      .select("subscription_status")
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}

/** One-shot billing schema migration — callable only with service-role suffix key. */
export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (await verifyColumns()) {
    return NextResponse.json({ ok: true, status: "already_applied" });
  }

  const sql = loadMigrationSql();
  const viaPg = await runViaPostgres(sql);
  if (viaPg.ok) {
    const applied = await verifyColumns();
    return NextResponse.json({ ok: applied, status: applied ? "applied" : "ran_but_unverified" });
  }

  const viaMgmt = await runViaManagementApi(sql);
  if (viaMgmt.ok) {
    const applied = await verifyColumns();
    return NextResponse.json({
      ok: applied,
      status: applied ? "applied_via_management_api" : "ran_but_unverified",
    });
  }

  return NextResponse.json(
    {
      error: "Migration failed",
      postgres: viaPg.error,
      management: viaMgmt.error,
    },
    { status: 503 }
  );
}

/** Report migration status without running DDL. */
export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applied = await verifyColumns();
  return NextResponse.json({
    applied,
    hasPostgresUrl: Boolean(
      process.env.POSTGRES_URL ||
        process.env.POSTGRES_URL_NON_POOLING ||
        process.env.SUPABASE_DB_URL ||
        process.env.DATABASE_URL
    ),
    hasSupabaseAccessToken: Boolean(process.env.SUPABASE_ACCESS_TOKEN),
    projectRef:
      process.env.SUPABASE_PROJECT_REF ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ||
      null,
  });
}
