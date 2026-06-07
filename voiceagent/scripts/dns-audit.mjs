#!/usr/bin/env node
/**
 * Audit greetq.com DNS + Vercel project domain attachment.
 *
 * Requires VERCEL_TOKEN (Cursor Cloud Agent secret or env).
 * Optional: CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID for zone record audit.
 *
 * Usage:
 *   node scripts/dns-audit.mjs              # audit public DNS (+ Cloudflare API if token set)
 *   node scripts/dns-audit.mjs --fix        # add missing Vercel domains + env vars
 *   node scripts/dns-audit.mjs --skip-vercel  # DNS/Cloudflare only (Vercel already configured)
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve4, resolveCname } from "node:dns/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDotEnv() {
  for (const file of [join(__dirname, "../.env"), join(__dirname, "../../.env")]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

loadDotEnv();

const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_oKVA7rxDj8Zu4wfRgJQNBlkK";
const PROJECT = process.env.VERCEL_PROJECT || "voiceagent";
const APEX = "greetq.com";
const WWW = "www.greetq.com";
const EXPECTED_DOMAINS = [APEX, WWW];
const VERCEL_APEX = "76.76.21.21";
const VERCEL_WWW_CNAME = "cname.vercel-dns.com";
const DEFAULT_CF_ZONE_ID = "a324ec75e1915d0cca4d8106bda5eb52";
const FIX = process.argv.includes("--fix");
const SKIP_VERCEL = process.argv.includes("--skip-vercel");

async function vercel(path, opts = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN not set");
  const q = new URLSearchParams({ teamId: TEAM_ID });
  const res = await fetch(`https://api.vercel.com${path}?${q}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Vercel ${path} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function cloudflareRecords() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID || DEFAULT_CF_ZONE_ID;
  if (!token) return null;
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zone}/dns_records?per_page=100`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const body = await res.json();
  if (!body.success) {
    throw new Error(`Cloudflare: ${JSON.stringify(body.errors || body)}`);
  }
  return body.result;
}

async function resolveHost(host) {
  const out = { host, a: [], cname: null, error: null };
  try {
    out.a = await resolve4(host);
  } catch (e) {
    out.error = e.code || String(e);
  }
  try {
    const cnames = await resolveCname(host);
    out.cname = cnames[0] || null;
  } catch {
    /* no cname */
  }
  return out;
}

function ok(cond, pass, fail) {
  return cond ? { status: "ok", message: pass } : { status: "fail", message: fail };
}

async function auditPublicDns() {
  const apex = await resolveHost(APEX);
  const www = await resolveHost(WWW);
  const checks = [];

  checks.push(
    ok(
      !apex.error && apex.a.length > 0,
      `${APEX} resolves to ${apex.a.join(", ")}`,
      `${APEX} DNS error: ${apex.error || "no A records"}`
    )
  );

  const wwwTarget = www.cname || (www.a.length ? www.a.join(", ") : null);
  checks.push(
    ok(
      !www.error && wwwTarget,
      `${WWW} resolves (${www.cname ? `CNAME ${www.cname}` : `A ${www.a.join(", ")}`})`,
      `${WWW} DNS error: ${www.error || "no records"}`
    )
  );
  if (www.cname) {
    const normalized = www.cname.replace(/\.$/, "");
    checks.push(
      ok(
        normalized === VERCEL_WWW_CNAME,
        `${WWW} CNAME target is ${VERCEL_WWW_CNAME}`,
        `${WWW} CNAME expected ${VERCEL_WWW_CNAME}, got ${normalized}`
      )
    );
  }

  return { apex, www, checks };
}

async function auditCloudflare() {
  const records = await cloudflareRecords();
  if (!records) {
    return [{ status: "skip", message: "Cloudflare API — set CLOUDFLARE_API_TOKEN (zone ID defaults to greetq.com)" }];
  }
  const checks = [];
  const apexA = records.find((r) => r.name === APEX && r.type === "A");
  const wwwC = records.find((r) => r.name === WWW && r.type === "CNAME");

  checks.push(
    ok(
      apexA?.content === VERCEL_APEX,
      `Cloudflare A ${APEX} → ${apexA?.content}`,
      `Cloudflare A ${APEX} expected ${VERCEL_APEX}, got ${apexA?.content || "missing"}`
    )
  );
  checks.push(
    ok(
      wwwC?.content === VERCEL_WWW_CNAME,
      `Cloudflare CNAME ${WWW} → ${wwwC?.content}`,
      `Cloudflare CNAME ${WWW} expected ${VERCEL_WWW_CNAME}, got ${wwwC?.content || "missing"}`
    )
  );
  return checks;
}

async function auditVercel() {
  if (!process.env.VERCEL_TOKEN) {
    const msg = SKIP_VERCEL
      ? "Vercel — skipped (--skip-vercel; domains configured on project)"
      : "VERCEL_TOKEN not set — skip with --skip-vercel or restart agent";
    return {
      checks: [{ status: "skip", message: msg }],
      domains: [],
      fixes: [],
    };
  }

  const project = await vercel(`/v9/projects/${PROJECT}`);
  const domainList = await vercel(`/v9/projects/${PROJECT}/domains`);
  const attached = new Set((domainList.domains || []).map((d) => d.name));
  const checks = [];
  const fixes = [];

  for (const name of EXPECTED_DOMAINS) {
    const onProject = attached.has(name);
    checks.push(
      ok(onProject, `Vercel project has ${name}`, `Vercel project missing ${name}`)
    );
    if (!onProject && FIX) {
      try {
        const added = await vercel(`/v10/projects/${PROJECT}/domains`, {
          method: "POST",
          body: JSON.stringify({
            name,
            ...(name === WWW ? { redirect: APEX, redirectStatusCode: 308 } : {}),
          }),
        });
        fixes.push(`added ${name} (verified=${added.verified})`);
      } catch (e) {
        fixes.push(`failed to add ${name}: ${e.message}`);
      }
    }
  }

  const hasIntellivo = attached.has("intellivo.ca");
  checks.push(
    ok(hasIntellivo, "intellivo.ca still attached (redirect source)", "intellivo.ca not on project")
  );

  if (FIX) {
    for (const [key, value, target] of [
      ["NEXT_PUBLIC_APP_URL", `https://${APEX}`, "production"],
      ["NEXT_PUBLIC_APP_NAME", "GreetQ", "production"],
      ["NEXT_PUBLIC_APP_URL", `https://${APEX}`, "preview"],
      ["NEXT_PUBLIC_APP_NAME", "GreetQ", "preview"],
    ]) {
      try {
        await vercel(`/v10/projects/${PROJECT}/env`, {
          method: "POST",
          body: JSON.stringify({ key, value, type: "plain", target: [target] }),
        });
        fixes.push(`env ${key} (${target})`);
      } catch (e) {
        if (String(e.message).includes("already exists")) {
          fixes.push(`env ${key} (${target}) already exists`);
        } else {
          fixes.push(`env ${key} (${target}): ${e.message}`);
        }
      }
    }
  }

  return {
    checks,
    domains: [...attached],
    projectId: project.id,
    fixes,
  };
}

function printChecks(title, checks) {
  console.log(`\n${title}`);
  for (const c of checks) {
    const icon = c.status === "ok" ? "✓" : c.status === "skip" ? "·" : "✗";
    console.log(`  ${icon} ${c.message}`);
  }
}

async function main() {
  const tokenSet = Boolean(process.env.VERCEL_TOKEN);
  console.log("GreetQ DNS audit");
  console.log(`  team:    ${TEAM_ID}`);
  console.log(`  project: ${PROJECT}`);
  console.log(`  token:   ${tokenSet ? "set" : "NOT SET"}`);
  if (process.env.CLOUD_AGENT_ALL_SECRET_NAMES) {
    console.log(`  injected secrets: ${process.env.CLOUD_AGENT_ALL_SECRET_NAMES}`);
  }
  console.log(`  mode:    ${FIX ? "audit + fix" : "audit only"}`);

  const publicDns = await auditPublicDns();
  printChecks("Public DNS", publicDns.checks);

  const cf = await auditCloudflare();
  printChecks("Cloudflare zone", cf);

  const vercelAudit = await auditVercel();
  printChecks("Vercel", vercelAudit.checks);
  if (vercelAudit.domains?.length) {
    console.log(`  attached domains: ${vercelAudit.domains.join(", ")}`);
  }
  if (vercelAudit.fixes?.length) {
    console.log("\nFixes applied:");
    for (const f of vercelAudit.fixes) console.log(`  • ${f}`);
  }

  const failed = [
    ...publicDns.checks,
    ...cf,
    ...vercelAudit.checks,
  ].filter((c) => c.status === "fail");

  if (failed.length) {
    console.log(`\n${failed.length} issue(s) remaining.`);
    process.exit(1);
  }

  if (!tokenSet && !SKIP_VERCEL) {
    console.log(
      "\nNote: VERCEL_TOKEN not injected in this VM. Use --skip-vercel if Vercel is already configured."
    );
  }

  console.log("\nAll checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
