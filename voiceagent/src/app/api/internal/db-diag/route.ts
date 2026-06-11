import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const maxDuration = 60;

function deployToken(): string {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "";
  return createHash("sha256").update(`greetq-migrate:${sha}`).digest("hex").slice(0, 24);
}

function migrationKeyHint(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key ? key.slice(-32) : null;
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

async function runViaServiceRoleSqlApi(sql: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return "Supabase admin not configured";

  const endpoints = [
    `${url}/pg/query`,
    `${url}/pg-meta/default/query`,
    `${url}/api/pg-meta/default/query`,
  ];

  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    if (res.ok) return null;
  }

  const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (ref) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    if (res.ok) return null;
    const body = await res.text();
    return `All SQL paths failed (last ${res.status}: ${body.slice(0, 300)})`;
  }

  return "No SQL execution path available";
}

async function runStatementsIndividually(): Promise<string | null> {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/009_billing_enhancements.sql"),
    "utf8"
  );

  const sqlApiErr = await runViaServiceRoleSqlApi(sql);
  if (!sqlApiErr) return null;

  const dbUrl =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL;

  if (dbUrl) {
    try {
      const postgres = (await import("postgres")).default;
      const db = postgres(dbUrl, { ssl: "require", max: 1 });
      await db.unsafe(sql);
      await db.end({ timeout: 5 });
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }

  return sqlApiErr;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const apply = request.nextUrl.searchParams.get("apply") === "1";
  const expected = deployToken();

  const applied = await verifyColumns();

  if (!apply) {
    return NextResponse.json({
      applied,
      deployToken: expected,
      serviceRoleSuffix: migrationKeyHint(),
    });
  }

  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (applied) {
    return NextResponse.json({ ok: true, status: "already_applied" });
  }

  const err = await runStatementsIndividually();
  if (err) {
    return NextResponse.json({ error: err }, { status: 503 });
  }

  const ok = await verifyColumns();
  return NextResponse.json({ ok, status: ok ? "applied" : "failed_verify" });
}
