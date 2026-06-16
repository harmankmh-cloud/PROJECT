#!/usr/bin/env node
/**
 * Push Stripe env vars to Vercel for Intellivo + RateLocal.
 *
 * Requires:
 *   VERCEL_TOKEN   — Vercel → Account Settings → Tokens
 *   STRIPE_SECRET_KEY — already in Cloud Agent secrets
 *
 * Usage:
 *   VERCEL_TOKEN=... STRIPE_SECRET_KEY=... node scripts/sync-stripe-vercel.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const TEAM_ID = "team_oKVA7rxDj8Zu4wfRgJQNBlkK";

const PROJECTS = {
  voiceagent: {
    id: "prj_SYy3FDPrl0ERVs5mwVcGc1vNanpC",
    appUrl: "https://intellivo.ca",
    setupScript: "../voiceagent/scripts/stripe-setup.mjs",
    envKeys: (out) => {
      const vars = {};
      for (const line of out.split("\n")) {
        const m = line.match(/^(STRIPE_[A-Z_]+)=(.+)$/);
        if (m) vars[m[1]] = m[2];
      }
      return vars;
    },
  },
  project: {
    id: "prj_lk7hLK0YJrLzMoYSSMz2li6p9KHY",
    appUrl: "https://ratelocal.ca",
    setupScript: "../reviewflow/scripts/stripe-setup.mjs",
    envKeys: (out) => {
      const vars = {};
      for (const line of out.split("\n")) {
        const m = line.match(/^(STRIPE_[A-Z_]+)=(.+)$/);
        if (m) vars[m[1]] = m[2];
      }
      return vars;
    },
  },
};

async function vercelApi(token, method, path, body) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function upsertEnv(token, projectId, key, value) {
  const existing = await vercelApi(
    token,
    "GET",
    `/v10/projects/${projectId}/env?teamId=${TEAM_ID}`
  );
  const found = (existing.envs || existing.env || []).find((e) => e.key === key);

  const payload = {
    key,
    value,
    type: "encrypted",
    target: ["production", "preview", "development"],
  };

  if (found?.id) {
    await vercelApi(token, "PATCH", `/v10/projects/${projectId}/env/${found.id}?teamId=${TEAM_ID}`, {
      value,
      target: payload.target,
    });
    console.log(`  ↻ updated ${key}`);
  } else {
    await vercelApi(token, "POST", `/v10/projects/${projectId}/env?teamId=${TEAM_ID}`, payload);
    console.log(`  ✓ added ${key}`);
  }
}

function runStripeSetup(scriptRel, appUrl) {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const script = path.resolve(root, scriptRel);
  const result = spawnSync("node", [script], {
    env: { ...process.env, NEXT_PUBLIC_APP_URL: appUrl },
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error(`Stripe setup failed: ${script}`);
  }
  return result.stdout;
}

async function main() {
  const token = process.env.VERCEL_TOKEN;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!token) {
    console.error("Missing VERCEL_TOKEN — add it to Cloud Agent secrets (Vercel → Account → Tokens).");
    process.exit(1);
  }
  if (!stripeKey) {
    console.error("Missing STRIPE_SECRET_KEY.");
    process.exit(1);
  }

  for (const [name, cfg] of Object.entries(PROJECTS)) {
    console.log(`\n=== ${name} (${cfg.appUrl}) ===\n`);
    const out = runStripeSetup(cfg.setupScript, cfg.appUrl);
    const vars = cfg.envKeys(out);
    vars.STRIPE_SECRET_KEY = stripeKey;

    for (const [key, value] of Object.entries(vars)) {
      if (!value || value.includes("...")) continue;
      await upsertEnv(token, cfg.id, key, value);
    }

    console.log(`\n  → Redeploy ${name} in Vercel to pick up new env vars.`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
