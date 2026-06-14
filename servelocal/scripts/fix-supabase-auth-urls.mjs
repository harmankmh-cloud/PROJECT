#!/usr/bin/env node
/**
 * @deprecated Use servelocal/scripts/harden-supabase-auth.mjs
 *
 * Patch Supabase Auth URL config for ServeLocal email confirm flows.
 *
 * Requires:
 *   SUPABASE_ACCESS_TOKEN — Supabase dashboard → Account → Access Tokens
 *   SUPABASE_PROJECT_REF  — defaults to RateLocal/ServeLocal shared project
 *
 * Usage (from repo root):
 *   SUPABASE_ACCESS_TOKEN=sbp_... node servelocal/scripts/fix-supabase-auth-urls.mjs
 */

const ref = process.env.SUPABASE_PROJECT_REF || "otnddwopphhxstteqizw";
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const siteUrl = "https://www.servelocal.ca";
const allowList = [
  "https://www.servelocal.ca/auth/confirm",
  "https://servelocal.ca/auth/confirm",
  "https://www.servelocal.ca/auth/callback",
  "https://servelocal.ca/auth/callback",
  "https://www.servelocal.ca/auth/after-login",
  "https://servelocal.ca/auth/after-login",
  "http://localhost:3001/auth/confirm",
  "http://localhost:3001/auth/callback",
  "http://localhost:3001/auth/after-login",
  // RateLocal (same Supabase project)
  "https://www.ratelocal.ca/auth/callback",
  "https://ratelocal.ca/auth/callback",
  "https://www.ratelocal.ca/auth/confirm",
  "https://ratelocal.ca/auth/confirm",
  "http://localhost:3000/auth/callback",
  "http://localhost:3000/auth/confirm",
].join(",");

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    site_url: siteUrl,
    uri_allow_list: allowList,
  }),
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("Supabase auth config update failed:", res.status, body);
  process.exit(1);
}

console.log("Supabase auth URLs updated for project", ref);
console.log("  site_url:", siteUrl);
console.log("  redirect URLs:", allowList.split(",").length, "entries");
