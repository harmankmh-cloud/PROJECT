#!/usr/bin/env node
/**
 * GreetQ Lead Agent — discovers businesses + scrapes emails. No URL pasting.
 *
 *   node run.mjs --sector dental_medical --city Abbotsford --limit 30
 *   node run.mjs --all-sectors --city Abbotsford --per-sector 20
 *   node run.mjs --campaign --city Abbotsford   # all 10 sectors, 50 each
 *   node run.mjs --campaign --emails-only
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverSector } from "./lib/discover.mjs";
import { scrapeEmail } from "./lib/scrape.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECTORS = JSON.parse(readFileSync(join(__dirname, "sectors.json"), "utf8"));
const OUTPUT = join(__dirname, "output");
const STATE_FILE = join(__dirname, "seen-domains.json");

function parseArgs() {
  const a = {
    sector: null,
    allSectors: false,
    campaign: false,
    city: "Abbotsford",
    limit: 30,
    perSector: 50,
    concurrency: 4,
    emailsOnly: false,
  };
  for (let i = 2; i < process.argv.length; i++) {
    const x = process.argv[i];
    if (x === "--sector") a.sector = process.argv[++i];
    else if (x === "--city") a.city = process.argv[++i];
    else if (x === "--limit") a.limit = Number(process.argv[++i]) || 30;
    else if (x === "--per-sector") a.perSector = Number(process.argv[++i]) || 50;
    else if (x === "--concurrency") a.concurrency = Number(process.argv[++i]) || 4;
    else if (x === "--all-sectors") a.allSectors = true;
    else if (x === "--campaign") a.campaign = true;
    else if (x === "--emails-only") a.emailsOnly = true;
    else if (x === "--help") {
      console.log(`GreetQ Lead Agent — auto-discover + scrape emails

  node run.mjs --sector dental_medical --city Abbotsford --limit 30
  node run.mjs --all-sectors --city Chilliwack --per-sector 20
  node run.mjs --campaign --city Abbotsford --emails-only

Sectors: ${Object.keys(SECTORS).join(", ")}`);
      process.exit(0);
    }
  }
  if (a.campaign) {
    a.allSectors = true;
    a.perSector = 50;
  }
  return a;
}

function loadSeen() {
  if (!existsSync(STATE_FILE)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(STATE_FILE, "utf8")));
  } catch {
    return new Set();
  }
}

function saveSeen(seen) {
  writeFileSync(STATE_FILE, JSON.stringify([...seen], null, 2));
}

async function runPool(items, fn, concurrency) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

function csvEscape(s) {
  const v = String(s ?? "");
  return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
}

async function main() {
  const args = parseArgs();
  mkdirSync(OUTPUT, { recursive: true });

  const sectorKeys = args.sector
    ? [args.sector]
    : args.allSectors
      ? Object.keys(SECTORS)
      : null;

  if (!sectorKeys?.length) {
    console.error("Use --sector dental_medical or --all-sectors or --campaign");
    process.exit(1);
  }

  for (const k of sectorKeys) {
    if (!SECTORS[k]) {
      console.error(`Unknown sector: ${k}`);
      process.exit(1);
    }
  }

  const seen = loadSeen();
  const allResults = [];

  console.log(`GreetQ Lead Agent — ${args.city}`);
  console.log(`Sectors: ${sectorKeys.length} | Discover + scrape\n`);

  for (const key of sectorKeys) {
    const sector = SECTORS[key];
    const limit = args.allSectors || args.campaign ? args.perSector : args.limit;
    console.log(`▸ ${sector.label} (discover up to ${limit})…`);

    const discovered = await discoverSector({ sector, city: args.city, limit });
    const fresh = discovered.filter((b) => {
      const host = new URL(b.website).hostname.replace(/^www\./, "");
      return !seen.has(host);
    });

    console.log(`  found ${discovered.length} sites (${fresh.length} new)`);

    const scraped = await runPool(
      fresh,
      async (biz) => {
        const emails = await scrapeEmail(biz.website);
        const host = new URL(biz.website).hostname.replace(/^www\./, "");
        seen.add(host);
        return {
          business_name: biz.business_name,
          email: (emails[0] || "").trim(),
          city: args.city,
          vertical: biz.vertical,
          website: biz.website,
          sector: key,
          status: emails[0] ? "pending" : "no_email",
        };
      },
      args.concurrency
    );

    const withEmail = scraped.filter((r) => r.email).length;
    console.log(`  emails: ${withEmail}/${scraped.length}\n`);
    allResults.push(...scraped);
  }

  saveSeen(seen);

  const emails = allResults.filter((r) => r.email).map((r) => r.email);
  const uniqueEmails = [...new Set(emails)];

  const headers = ["business_name", "email", "city", "vertical", "website", "sector", "status"];
  const csv = [headers.join(",")];
  for (const r of allResults) {
    csv.push(headers.map((h) => csvEscape(r[h])).join(","));
  }

  const stamp = new Date().toISOString().slice(0, 10);
  writeFileSync(join(OUTPUT, `leads-${stamp}.csv`), csv.join("\n") + "\n");
  writeFileSync(join(OUTPUT, "emails-only.txt"), uniqueEmails.join("\n") + (uniqueEmails.length ? "\n" : ""));

  console.log("── Done ──");
  console.log(`  Discovered & scraped: ${allResults.length} businesses`);
  console.log(`  Emails found:         ${uniqueEmails.length}`);
  console.log(`  Hit rate:             ${allResults.length ? Math.round((uniqueEmails.length / allResults.length) * 100) : 0}%`);
  console.log(`  Output:               output/leads-${stamp}.csv`);
  console.log(`                        output/emails-only.txt`);

  if (args.emailsOnly) {
    for (const e of uniqueEmails) console.log(e);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
