#!/usr/bin/env node
/**
 * Apply ServeLocal + shared-project Supabase auth hardening.
 *
 * Requires SUPABASE_ACCESS_TOKEN (Account → Access Tokens).
 *
 *   SUPABASE_ACCESS_TOKEN=sbp_... node servelocal/scripts/harden-supabase-auth.mjs
 *
 * Optional:
 *   SUPABASE_PROJECT_REF — defaults to avytxgfkncpacqewnrvz (ServeLocal TRADELOCAL only)
 *   SUPABASE_SITE_URL — defaults to https://www.servelocal.ca
 *
 * Never run with RateLocal ref unless SUPABASE_SITE_URL=https://ratelocal.ca and RateLocal-only redirects.
 *   AUTH_DB_CONN_PERCENTAGE — defaults to 15 (percentage of Postgres max_connections)
 */

const ref = process.env.SUPABASE_PROJECT_REF || "avytxgfkncpacqewnrvz";
const token = process.env.SUPABASE_ACCESS_TOKEN;
const connPct = Number(process.env.AUTH_DB_CONN_PERCENTAGE || "15");

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const siteUrl = process.env.SUPABASE_SITE_URL || "https://www.servelocal.ca";
const defaultRedirects = [
  "https://www.servelocal.ca/auth/confirm",
  "https://servelocal.ca/auth/confirm",
  "https://www.servelocal.ca/auth/callback",
  "https://servelocal.ca/auth/callback",
  "https://www.servelocal.ca/auth/after-login",
  "https://servelocal.ca/auth/after-login",
  "http://localhost:3001/auth/confirm",
  "http://localhost:3001/auth/callback",
  "http://localhost:3001/auth/after-login",
  "https://www.ratelocal.ca/auth/callback",
  "https://ratelocal.ca/auth/callback",
  "https://www.ratelocal.ca/auth/confirm",
  "https://ratelocal.ca/auth/confirm",
  "http://localhost:3000/auth/callback",
  "http://localhost:3000/auth/confirm",
];
const allowList = process.env.SUPABASE_AUTH_REDIRECTS ?? defaultRedirects.join(",");

async function patchAuthConfig() {
  const body = {
    site_url: siteUrl,
    uri_allow_list: allowList,
    password_hibp_enabled: true,
  };

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Auth config PATCH failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

async function upsertSecrets(entries) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/secrets`, {
    method: "POST",
    headers,
    body: JSON.stringify(entries),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Secrets POST failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

async function deleteSecrets(names) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/secrets`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(names),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Secrets DELETE failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

const steps = [];

try {
  await patchAuthConfig();
  steps.push("✓ Auth config: site_url, redirect allowlist, leaked-password protection (HIBP)");
} catch (err) {
  steps.push(`✗ Auth config: ${err.message}`);
}

try {
  await upsertSecrets([{ name: "GOTRUE_DB_CONN_PERCENTAGE", value: String(connPct) }]);
  steps.push(`✓ Secret GOTRUE_DB_CONN_PERCENTAGE=${connPct}`);
} catch (err) {
  steps.push(`✗ GOTRUE_DB_CONN_PERCENTAGE: ${err.message}`);
}

for (const name of ["GOTRUE_DB_MAX_POOL_SIZE", "GOTRUE_DB_MAX_IDLE_POOL_SIZE"]) {
  try {
    await deleteSecrets([name]);
    steps.push(`✓ Removed deprecated fixed-pool secret ${name}`);
  } catch {
    steps.push(`· ${name} not present (ok)`);
  }
}

for (const name of ["GOTRUE_JWT_DEFAULT_GROUP_NAME", "GOTRUE_JWT_ADMIN_GROUP_NAME"]) {
  try {
    await deleteSecrets([name]);
    steps.push(`✓ Removed deprecated JWT group secret ${name}`);
  } catch {
    steps.push(`· ${name} not present (ok)`);
  }
}

console.log(`Supabase auth hardening for ${ref}:`);
for (const line of steps) console.log(" ", line);
