#!/usr/bin/env node
/**
 * Audit (and optionally fix) Vercel domain DNS for RateLocal, ServeLocal, and GreetQ.
 *
 * Usage:
 *   VERCEL_TOKEN=... node scripts/dns-audit.mjs
 *   VERCEL_TOKEN=... node scripts/dns-audit.mjs --json
 *   VERCEL_TOKEN=... node scripts/dns-audit.mjs --fix
 *
 * --fix: attach GreetQ domains on Vercel and set NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_APP_NAME.
 * Does not change Cloudflare — public DNS must still be set there.
 */

const TEAM_ID = process.env.VERCEL_TEAM_ID ?? "team_oKVA7rxDj8Zu4wfRgJQNBlkK";
const TOKEN = process.env.VERCEL_TOKEN;
const FIX = process.argv.includes("--fix");

const GREETQ = {
  product: "GreetQ",
  project: "voiceagent",
  projectId: "prj_SYy3FDPrl0ERVs5mwVcGc1vNanpC",
  domains: ["greetq.com", "www.greetq.com", "intellivo.ca", "www.intellivo.ca"],
  appUrl: "https://greetq.com",
  appName: "GreetQ",
};

const PRODUCTS = [
  GREETQ,
  {
    product: "RateLocal",
    project: "project",
    projectId: "prj_lk7hLK0YJrLzMoYSSMz2li6p9KHY",
    domains: ["ratelocal.ca", "www.ratelocal.ca"],
  },
  {
    product: "ServeLocal",
    project: "project-pqhe",
    projectId: "prj_RqM8ioPNgxTPAUxo0sKdYVS7aTaK",
    domains: ["servelocal.ca", "www.servelocal.ca"],
  },
];

async function vercel(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message ?? res.statusText;
    throw new Error(`${path}: ${msg}`);
  }
  return data;
}

async function ensureTeamDomain(name) {
  try {
    return await vercel(`/v4/domains/${name}?teamId=${TEAM_ID}`);
  } catch {
    return vercel(`/v5/domains?teamId=${TEAM_ID}`, { method: "POST", body: { name } });
  }
}

async function ensureProjectDomain(projectId, name, { redirect, redirectStatusCode = 308 } = {}) {
  const existing = await projectDomains(projectId);
  const found = existing.find((d) => d.name === name);
  if (found) {
    if (redirect && found.redirect !== redirect) {
      return vercel(`/v9/projects/${projectId}/domains/${name}?teamId=${TEAM_ID}`, {
        method: "PATCH",
        body: { redirect, redirectStatusCode },
      });
    }
    return found;
  }
  const body = { name };
  if (redirect) {
    body.redirect = redirect;
    body.redirectStatusCode = redirectStatusCode;
  }
  return vercel(`/v10/projects/${projectId}/domains?teamId=${TEAM_ID}`, { method: "POST", body });
}

async function ensureEnvVar(projectId, key, value, targets = ["production", "preview"]) {
  const { envs = [] } = await vercel(`/v9/projects/${projectId}/env?teamId=${TEAM_ID}`);
  const existing = envs.find((e) => e.key === key);
  if (existing) {
    return vercel(`/v9/projects/${projectId}/env/${existing.id}?teamId=${TEAM_ID}`, {
      method: "PATCH",
      body: { value, target: targets, type: existing.type ?? "plain" },
    });
  }
  return vercel(`/v10/projects/${projectId}/env?teamId=${TEAM_ID}`, {
    method: "POST",
    body: { key, value, type: "plain", target: targets },
  });
}

async function fixGreetQ() {
  console.log("Applying Vercel fixes for GreetQ...\n");
  const { projectId, appUrl, appName } = GREETQ;

  for (const name of ["greetq.com", "intellivo.ca"]) {
    await ensureTeamDomain(name);
  }

  await ensureProjectDomain(projectId, "greetq.com");
  await ensureProjectDomain(projectId, "www.greetq.com", { redirect: "greetq.com" });
  await ensureProjectDomain(projectId, "intellivo.ca", { redirect: "greetq.com" });
  await ensureProjectDomain(projectId, "www.intellivo.ca", { redirect: "greetq.com" });

  await ensureEnvVar(projectId, "NEXT_PUBLIC_APP_URL", appUrl);
  await ensureEnvVar(projectId, "NEXT_PUBLIC_APP_NAME", appName);

  console.log("  greetq.com + www.greetq.com attached to voiceagent");
  console.log("  intellivo.ca + www.intellivo.ca redirect to greetq.com");
  console.log(`  NEXT_PUBLIC_APP_URL=${appUrl}`);
  console.log(`  NEXT_PUBLIC_APP_NAME=${appName}\n`);
}

function cloudflareRecords(domain, config) {
  const cname = config.recommendedCNAME?.[0]?.value?.replace(/\.$/, "");
  const ips = config.recommendedIPv4?.[0]?.value ?? ["76.76.21.21"];
  const isWww = domain.startsWith("www.");

  if (isWww) {
    return [
      { type: "CNAME", name: "www", content: cname ?? "cname.vercel-dns.com", proxy: "DNS only" },
    ];
  }

  return [
    {
      type: "A",
      name: "@",
      content: ips.join(" or "),
      proxy: "DNS only",
      note: "Use both A records if Vercel lists two IPs",
    },
    {
      type: "CNAME",
      name: "www",
      content: cname ?? "cname.vercel-dns.com",
      proxy: "DNS only",
      note: "Alternative: CNAME www to project-specific target above",
    },
  ];
}

async function auditDomain(domain) {
  const [config, projectDomain] = await Promise.all([
    vercel(`/v6/domains/${domain}/config?teamId=${TEAM_ID}`),
    vercel(`/v4/domains/${domain}?teamId=${TEAM_ID}`).catch(() => null),
  ]);

  return {
    domain,
    misconfigured: Boolean(config.misconfigured),
    configuredBy: config.configuredBy ?? null,
    aValues: config.aValues ?? [],
    cnames: config.cnames ?? [],
    nameservers: config.nameservers ?? [],
    recommendedCNAME: config.recommendedCNAME?.[0]?.value ?? null,
    recommendedIPv4: config.recommendedIPv4?.[0]?.value ?? null,
    verified: projectDomain?.verified ?? null,
    cloudflareRecords: cloudflareRecords(domain, config),
  };
}

async function projectDomains(projectId) {
  const data = await vercel(`/v9/projects/${projectId}/domains?teamId=${TEAM_ID}`);
  return data.domains ?? [];
}

async function main() {
  if (!TOKEN) {
    console.error("VERCEL_TOKEN is not set in this VM.");
    console.error("Add VERCEL_TOKEN under Cursor → Cloud Agents → Secrets, then start a new agent run.");
    process.exit(1);
  }

  if (FIX) {
    await fixGreetQ();
  }

  const jsonMode = process.argv.includes("--json");
  const report = { teamId: TEAM_ID, checkedAt: new Date().toISOString(), products: [] };

  for (const product of PRODUCTS) {
    const bindings = await projectDomains(product.projectId);
    const bindingByName = Object.fromEntries(bindings.map((d) => [d.name, d]));
    const domains = [];

    for (const name of product.domains) {
      const audit = await auditDomain(name);
      const binding = bindingByName[name];
      domains.push({
        ...audit,
        onProject: Boolean(binding),
        redirect: binding?.redirect ?? null,
      });
    }

    report.products.push({
      product: product.product,
      project: product.project,
      projectId: product.projectId,
      domains,
      issues: domains.filter((d) => d.misconfigured).map((d) => d.domain),
    });
  }

  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("Vercel DNS audit\n");
  for (const { product, project, domains, issues } of report.products) {
    console.log(`## ${product} (${project})`);
    for (const d of domains) {
      const status = d.misconfigured ? "NEEDS DNS" : "OK";
      const redirect = d.redirect ? ` → ${d.redirect}` : "";
      console.log(`  ${status.padEnd(10)} ${d.domain}${redirect}`);
      if (d.misconfigured) {
        for (const rec of d.cloudflareRecords) {
          console.log(`             Cloudflare: ${rec.type} ${rec.name} → ${rec.content} (${rec.proxy})`);
        }
      }
    }
    if (issues.length === 0) {
      console.log("  All domains configured.\n");
    } else {
      console.log(`  Fix in Cloudflare: ${issues.join(", ")}\n`);
    }
  }

  const allIssues = report.products.flatMap((p) => p.issues);
  if (allIssues.length > 0) {
    console.log("Cloudflare tips: SSL/TLS = Full (strict); apex/www = DNS only (grey cloud).");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
