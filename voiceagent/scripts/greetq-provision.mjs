#!/usr/bin/env node
/**
 * One-shot GreetQ production provisioning.
 * Requires env vars (add to Cursor Secrets or export locally):
 *   VERCEL_TOKEN          — Vercel → Settings → Tokens
 *   CLOUDFLARE_API_TOKEN  — Cloudflare → API Tokens (Zone.DNS Edit)
 *   CLOUDFLARE_ZONE_ID    — greetq.com zone id
 *   SUPABASE_ACCESS_TOKEN — Supabase → Account → Access Tokens
 *   SUPABASE_PROJECT_REF  — project ref from dashboard URL
 */

const TEAM_ID = "team_oKVA7rxDj8Zu4wfRgJQNBlkK";
const PROJECT = "voiceagent";
const DOMAINS = ["greetq.com", "www.greetq.com"];

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

async function cloudflare(path, opts = {}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) throw new Error("CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set");
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}${path}`, {
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

async function supabaseAuthConfig() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!token || !ref) throw new Error("SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_REF not set");
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site_url: "https://greetq.com",
      uri_allow_list: "https://greetq.com/auth/callback,http://localhost:3002/auth/callback",
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Supabase auth config ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function upsertDns(name, content, type = "CNAME") {
  const records = await cloudflare("/dns_records");
  const existing = records.find((r) => r.name === name && r.type === type);
  const payload = {
    type,
    name,
    content,
    proxied: false,
    ttl: 1,
  };
  if (existing) {
    await cloudflare(`/dns_records/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return `updated ${name}`;
  }
  await cloudflare("/dns_records", { method: "POST", body: JSON.stringify(payload) });
  return `created ${name}`;
}

async function main() {
  const steps = [];

  if (process.env.VERCEL_TOKEN) {
    for (const domain of DOMAINS) {
      try {
        await vercel(`/v10/projects/${PROJECT}/domains`, {
          method: "POST",
          body: JSON.stringify({ name: domain }),
        });
        steps.push(`Vercel: added ${domain}`);
      } catch (e) {
        if (String(e.message).includes("400") && String(e.message).includes("already")) {
          steps.push(`Vercel: ${domain} already on project`);
        } else {
          steps.push(`Vercel: ${domain} — ${e.message}`);
        }
      }
    }

    for (const [key, value, target] of [
      ["NEXT_PUBLIC_APP_URL", "https://greetq.com", "production"],
      ["NEXT_PUBLIC_APP_NAME", "GreetQ", "production"],
      ["NEXT_PUBLIC_APP_URL", "https://greetq.com", "preview"],
      ["NEXT_PUBLIC_APP_NAME", "GreetQ", "preview"],
    ]) {
      try {
        await vercel(`/v10/projects/${PROJECT}/env`, {
          method: "POST",
          body: JSON.stringify({
            key,
            value,
            type: "plain",
            target: [target],
          }),
        });
        steps.push(`Vercel env: ${key} (${target})`);
      } catch (e) {
        steps.push(`Vercel env ${key}: ${e.message}`);
      }
    }
  } else {
    steps.push("SKIP Vercel — set VERCEL_TOKEN");
  }

  if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ZONE_ID) {
    try {
      steps.push(await upsertDns("greetq.com", "cname.vercel-dns.com"));
      steps.push(await upsertDns("www.greetq.com", "cname.vercel-dns.com"));
    } catch (e) {
      steps.push(`Cloudflare DNS: ${e.message}`);
    }
  } else {
    steps.push("SKIP Cloudflare — set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID");
  }

  if (process.env.SUPABASE_ACCESS_TOKEN && process.env.SUPABASE_PROJECT_REF) {
    try {
      await supabaseAuthConfig();
      steps.push("Supabase: site_url + redirect URLs updated");
    } catch (e) {
      steps.push(`Supabase: ${e.message}`);
    }
  } else {
    steps.push("SKIP Supabase — set SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF");
  }

  console.log("GreetQ provision results:\n");
  for (const s of steps) console.log(`  • ${s}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
