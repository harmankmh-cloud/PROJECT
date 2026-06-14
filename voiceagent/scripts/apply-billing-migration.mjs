#!/usr/bin/env node
/**
 * Apply billing migration using production env (run via vercel env run).
 * Usage: vercel env run --environment production -- node scripts/apply-billing-migration.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sqlText = readFileSync(
  join(__dirname, "../supabase/migrations/009_billing_enhancements.sql"),
  "utf8"
);

async function verify() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  const admin = createClient(url, key);
  const { error } = await admin.from("va_organizations").select("subscription_status").limit(1);
  return !error;
}

async function runViaPostgres() {
  const dbUrl =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("No POSTGRES_URL / DATABASE_URL in environment");
  const sql = postgres(dbUrl, { ssl: "require", max: 1 });
  await sql.unsafe(sqlText);
  await sql.end({ timeout: 5 });
}

async function runViaManagementApi() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref =
    process.env.SUPABASE_PROJECT_REF ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!token || !ref) throw new Error("No SUPABASE_ACCESS_TOKEN or project ref");

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sqlText }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Management API ${res.status}: ${body}`);
}

async function main() {
  if (await verify()) {
    console.log("✓ Migration already applied (subscription_status exists)");
    return;
  }

  try {
    await runViaPostgres();
    console.log("✓ Applied via Postgres connection");
  } catch (pgErr) {
    console.warn("Postgres path failed:", pgErr.message || pgErr);
    await runViaManagementApi();
    console.log("✓ Applied via Supabase Management API");
  }

  if (await verify()) {
    console.log("✓ Verified: billing columns exist");
  } else {
    console.error("Migration ran but subscription_status still missing");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
