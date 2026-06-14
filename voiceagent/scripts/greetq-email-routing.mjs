#!/usr/bin/env node
/**
 * Provision Cloudflare Email Routing for greetq.com.
 *
 * Forwards hello@, sales@, support@ → INBOX_EMAIL (default harmankmh@gmail.com).
 * Merges SPF so Brevo outbound + Cloudflare inbound both pass.
 *
 * Auth: Cloudflare API token with Zone.DNS + Email Routing permissions,
 * or run via Cursor Cloudflare MCP execute tool.
 *
 * Usage:
 *   node scripts/greetq-email-routing.mjs           # provision
 *   node scripts/greetq-email-routing.mjs --status  # read-only audit
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || "a324ec75e1915d0cca4d8106bda5eb52";
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "69d269cbe5f4a12c1f5c977e1d3e32c9";
const DOMAIN = "greetq.com";
const INBOX = process.env.GREETQ_INBOX_EMAIL || "harmankmh@gmail.com";
const LOCAL_PARTS = ["hello", "sales", "support"];
const COMBINED_SPF = '"v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all"';
const STATUS_ONLY = process.argv.includes("--status");

async function cf(path, opts = {}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN not set");
  const base = path.startsWith("/accounts/")
    ? `https://api.cloudflare.com/client/v4${path}`
    : `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}${path}`;
  const res = await fetch(base, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const body = await res.json();
  if (!body.success) {
    throw new Error(`Cloudflare ${path}: ${JSON.stringify(body.errors || body)}`);
  }
  return body.result;
}

async function ensureDestination() {
  const existing = await cf(`/accounts/${ACCOUNT_ID}/email/routing/addresses`);
  const hit = existing.find((a) => a.email === INBOX);
  if (hit?.verified) return hit;
  return cf(`/accounts/${ACCOUNT_ID}/email/routing/addresses`, {
    method: "POST",
    body: JSON.stringify({ email: INBOX }),
  });
}

async function ensureRules() {
  const rules = await cf("/email/routing/rules");
  const out = [];
  for (const local of LOCAL_PARTS) {
    const addr = `${local}@${DOMAIN}`;
    const existing = rules.find(
      (r) =>
        r.enabled &&
        r.matchers?.some((m) => m.type === "literal" && m.field === "to" && m.value === addr)
    );
    if (existing) {
      out.push({ addr, status: "exists", id: existing.id });
      continue;
    }
    const created = await cf("/email/routing/rules", {
      method: "POST",
      body: JSON.stringify({
        name: addr,
        enabled: true,
        priority: 0,
        matchers: [{ type: "literal", field: "to", value: addr }],
        actions: [{ type: "forward", value: [INBOX] }],
      }),
    });
    out.push({ addr, status: "created", id: created.id });
  }
  const drop = rules.find((r) => r.actions?.[0]?.type === "drop");
  if (drop?.enabled) {
    await cf(`/email/routing/rules/${drop.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...drop, enabled: false }),
    });
    out.push({ addr: "*", status: "disabled catch-all drop" });
  }
  return out;
}

async function mergeSpf() {
  const records = await cf("/dns_records?per_page=100");
  const spf = records.find((r) => r.type === "TXT" && r.name === DOMAIN && r.content.includes("spf1"));
  if (!spf) return { status: "no spf yet — enable routing first" };
  if (spf.content.includes("spf.brevo.com")) return { status: "spf already merged" };
  await cf(`/dns_records/${spf.id}`, {
    method: "PUT",
    body: JSON.stringify({
      type: "TXT",
      name: DOMAIN,
      content: COMBINED_SPF,
      ttl: 1,
      proxied: false,
    }),
  });
  return { status: "spf updated with brevo include" };
}

async function enableRouting() {
  const state = await cf("/email/routing");
  if (state.enabled && state.status === "ready") return { status: "already ready" };
  const enabled = await cf("/email/routing/enable", { method: "POST" });
  return { status: enabled.status, enabled: enabled.enabled };
}

async function printStatus() {
  const routing = await cf("/email/routing");
  const rules = await cf("/email/routing/rules");
  const records = await cf("/dns_records?per_page=100");
  const mx = records.filter((r) => r.type === "MX");
  const txt = records.filter((r) => r.type === "TXT" && r.name.includes(DOMAIN));
  console.log("GreetQ email routing status\n");
  console.log(`  Zone:     ${DOMAIN} (${ZONE_ID})`);
  console.log(`  Inbox:    ${INBOX}`);
  console.log(`  Routing:  ${routing.status} (enabled=${routing.enabled})`);
  console.log(`  MX:       ${mx.length} record(s)`);
  for (const r of rules.filter((x) => x.enabled)) {
    const to = r.matchers?.find((m) => m.field === "to")?.value || "(all)";
    const fwd = r.actions?.find((a) => a.type === "forward")?.value?.join(", ") || r.actions?.[0]?.type;
    console.log(`  Rule:     ${to} → ${fwd}`);
  }
  const spf = txt.find((r) => r.content.includes("spf1"));
  if (spf) console.log(`  SPF:      ${spf.content}`);
}

async function main() {
  if (STATUS_ONLY) {
    await printStatus();
    return;
  }

  const steps = [];
  steps.push(`destination: ${(await ensureDestination()).email}`);
  for (const r of await ensureRules()) {
    steps.push(`rule ${r.addr}: ${r.status}`);
  }
  steps.push(`routing: ${JSON.stringify(await enableRouting())}`);
  steps.push(`spf: ${JSON.stringify(await mergeSpf())}`);

  console.log("GreetQ email routing provisioned:\n");
  for (const s of steps) console.log(`  • ${s}`);
  console.log("\nReplies to hello@greetq.com forward to", INBOX);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
