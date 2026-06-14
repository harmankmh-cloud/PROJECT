#!/usr/bin/env node
/**
 * Discover local business websites via Nominatim (OSM search, no API key).
 * Output: seeds/fraser-valley-discovered.txt
 *
 *   node discover-nominatim.mjs
 *   node discover-nominatim.mjs --limit 2500
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const USER_AGENT = "greetq-lead-scraper/1.0 (outreach@greetq.com)";

const CITIES = [
  "Abbotsford",
  "Langley",
  "Surrey",
  "Chilliwack",
  "Mission",
  "Maple Ridge",
  "White Rock",
  "Delta",
  "Coquitlam",
  "Burnaby",
  "Richmond",
  "Vancouver",
];

const QUERIES = [
  { q: "dentist", vertical: "dental" },
  { q: "dental clinic", vertical: "dental" },
  { q: "orthodontist", vertical: "dental" },
  { q: "insurance agency", vertical: "insurance" },
  { q: "insurance broker", vertical: "insurance" },
  { q: "law firm", vertical: "legal" },
  { q: "lawyer", vertical: "legal" },
  { q: "property management", vertical: "property_mgmt" },
  { q: "strata management", vertical: "property_mgmt" },
  { q: "plumber", vertical: "home_services" },
  { q: "hvac", vertical: "home_services" },
  { q: "electrician", vertical: "home_services" },
  { q: "roofing contractor", vertical: "home_services" },
  { q: "auto repair", vertical: "home_services" },
  { q: "medical clinic", vertical: "clinic" },
  { q: "chiropractor", vertical: "clinic" },
  { q: "physiotherapy", vertical: "clinic" },
  { q: "veterinary clinic", vertical: "clinic" },
  { q: "accounting firm", vertical: "other" },
  { q: "real estate agency", vertical: "other" },
  { q: "mortgage broker", vertical: "other" },
  { q: "optometrist", vertical: "clinic" },
  { q: "pharmacy", vertical: "clinic" },
  { q: "spa", vertical: "other" },
  { q: "salon", vertical: "other" },
];

const VERTICAL_MAP = [
  { re: /dent|ortho|dental/i, vertical: "dental" },
  { re: /clinic|medical|health|physio|chiro|pharmacy|veterinar|optomet/i, vertical: "clinic" },
  { re: /insur/i, vertical: "insurance" },
  { re: /law|legal|barrister|solicitor/i, vertical: "legal" },
  { re: /strata|property|realty|real estate|rental/i, vertical: "property_mgmt" },
  { re: /plumb|hvac|electric|roof|heat|cool|contractor|construction|auto|mechanic/i, vertical: "home_services" },
];

function parseArgs() {
  const args = { limit: 2500, output: "seeds/fraser-valley-discovered.txt", delay: 1100 };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--limit") args.limit = Number(process.argv[++i]);
    else if (process.argv[i] === "--output") args.output = process.argv[++i];
    else if (process.argv[i] === "--delay") args.delay = Number(process.argv[++i]);
  }
  return args;
}

function guessVertical(name, fallback) {
  for (const v of VERTICAL_MAP) {
    if (v.re.test(name)) return v.vertical;
  }
  return fallback;
}

function normalizeUrl(url) {
  let u = url.trim();
  if (!u.startsWith("http")) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.origin + parsed.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function cityFromDisplay(displayName) {
  for (const c of CITIES) {
    if (displayName.includes(c)) return c;
  }
  return "Fraser Valley";
}

async function nominatimSearch(query, city) {
  const params = new URLSearchParams({
    q: `${query} ${city} BC Canada`,
    format: "json",
    limit: "50",
    extratags: "1",
    addressdetails: "1",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status} for ${query} ${city}`);
  return res.json();
}

async function main() {
  const args = parseArgs();
  const seen = new Set();
  const rows = [];

  const existingPath = resolve(__dirname, args.output);
  if (existsSync(existingPath)) {
    for (const line of readFileSync(existingPath, "utf8").split("\n")) {
      const parts = line.split("|");
      if (parts[1]) seen.add(normalizeUrl(parts[1]) || parts[1]);
    }
  }

  for (const city of CITIES) {
    for (const { q, vertical } of QUERIES) {
      if (rows.length >= args.limit) break;
      process.stdout.write(`Search: ${q} in ${city}… `);
      try {
        const results = await nominatimSearch(q, city);
        let added = 0;
        for (const r of results) {
          const website = r.extratags?.website || r.extratags?.["contact:website"];
          if (!website) continue;
          const url = normalizeUrl(website);
          if (!url || seen.has(url)) continue;
          seen.add(url);
          const name = (r.name || r.display_name?.split(",")[0] || url).slice(0, 120);
          rows.push({
            business_name: name,
            website: url,
            vertical: guessVertical(name, vertical),
            city: cityFromDisplay(r.display_name || city),
          });
          added++;
          if (rows.length >= args.limit) break;
        }
        console.log(`+${added} (total ${rows.length})`);
      } catch (e) {
        console.log(`err: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, args.delay));
    }
    if (rows.length >= args.limit) break;
  }

  const lines = rows.map((r) => `${r.business_name}|${r.website}|${r.vertical}|${r.city}`);
  const out = resolve(__dirname, args.output);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, lines.join("\n") + (lines.length ? "\n" : ""), "utf8");
  console.log(`\nWrote ${rows.length} businesses → ${out}`);
  console.log("Next: node scrape-batch.mjs --input seeds/fraser-valley-discovered.txt --output leads-batch.csv");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
