#!/usr/bin/env node
/**
 * Discover businesses from Yellow Pages Canada search (JSON-LD, no API key).
 * Guesses website from business name slug; scrape step validates emails.
 *
 *   node discover-yellowpages.mjs --pages 5
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const USER_AGENT = "Mozilla/5.0 (compatible; greetq-lead-scraper/1.0)";

const CITIES = {
  abbotsford: { query: "Abbotsford+BC", name: "Abbotsford" },
  langley: { query: "Langley+BC", name: "Langley" },
  surrey: { query: "Surrey+BC", name: "Surrey" },
  chilliwack: { query: "Chilliwack+BC", name: "Chilliwack" },
  mission: { query: "Mission+BC", name: "Mission" },
  "maple-ridge": { query: "Maple+Ridge+BC", name: "Maple Ridge" },
  burnaby: { query: "Burnaby+BC", name: "Burnaby" },
  richmond: { query: "Richmond+BC", name: "Richmond" },
  coquitlam: { query: "Coquitlam+BC", name: "Coquitlam" },
  delta: { query: "Delta+BC", name: "Delta" },
  vancouver: { query: "Vancouver+BC", name: "Vancouver" },
  kelowna: { query: "Kelowna+BC", name: "Kelowna" },
  victoria: { query: "Victoria+BC", name: "Victoria" },
  kamloops: { query: "Kamloops+BC", name: "Kamloops" },
};

const CATEGORIES = [
  { slug: "Dentists", vertical: "dental" },
  { slug: "Insurance", vertical: "insurance" },
  { slug: "Lawyers", vertical: "legal" },
  { slug: "Plumbers", vertical: "home_services" },
  { slug: "Heating-Contractors", vertical: "home_services" },
  { slug: "Electricians", vertical: "home_services" },
  { slug: "Auto-Repair", vertical: "home_services" },
  { slug: "Chiropractors", vertical: "clinic" },
  { slug: "Physiotherapists", vertical: "clinic" },
  { slug: "Veterinarians", vertical: "clinic" },
  { slug: "Real-Estate-Agents", vertical: "other" },
  { slug: "Accountants", vertical: "other" },
  { slug: "Property-Management", vertical: "property_mgmt" },
  { slug: "Medical-Clinics", vertical: "clinic" },
  { slug: "Pharmacies", vertical: "clinic" },
  { slug: "Optometrists", vertical: "clinic" },
  { slug: "Roofing-Contractors", vertical: "home_services" },
  { slug: "Hair-Salons", vertical: "other" },
  { slug: "Spas", vertical: "other" },
  { slug: "Mortgage-Brokers", vertical: "other" },
  { slug: "Restaurants", vertical: "other" },
  { slug: "Auto-Body-Repair", vertical: "home_services" },
  { slug: "General-Contractors", vertical: "home_services" },
  { slug: "Pest-Control", vertical: "home_services" },
];

function parseArgs() {
  const args = { city: "all", limit: 5000, output: "seeds/fraser-valley-discovered.txt", delay: 1200, pages: 5 };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--city") args.city = process.argv[++i];
    else if (process.argv[i] === "--limit") args.limit = Number(process.argv[++i]);
    else if (process.argv[i] === "--output") args.output = process.argv[++i];
    else if (process.argv[i] === "--delay") args.delay = Number(process.argv[++i]);
    else if (process.argv[i] === "--pages") args.pages = Number(process.argv[++i]);
  }
  return args;
}

function slugDomain(name) {
  const slug = name
    .toLowerCase()
    .replace(/\b(dr|inc|ltd|llp|corp|co)\b\.?/gi, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
  if (slug.length < 4) return null;
  return `https://${slug}.ca`;
}

function parseJsonLd(html) {
  const rows = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1]);
      const graphs = data["@graph"] || [data];
      for (const node of graphs) {
        const list = node.itemListElement || node.mainEntity?.itemListElement;
        if (!list) continue;
        for (const el of list) {
          const item = el.item || el;
          const name = item.name;
          const city = item.address?.addressLocality;
          if (!name) continue;
          rows.push({ business_name: name.slice(0, 120), city: city || "" });
        }
      }
    } catch {
      /* skip */
    }
  }
  return rows;
}

async function fetchSearchPage(category, cityQuery, page) {
  const url = `https://www.yellowpages.ca/search/si/${page}/${category}/${cityQuery}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } });
  if (!res.ok) throw new Error(`YP ${res.status}`);
  return res.text();
}

async function main() {
  const args = parseArgs();
  const out = resolve(__dirname, args.output);
  const seen = new Set();
  if (existsSync(out)) {
    for (const line of readFileSync(out, "utf8").split("\n")) {
      const parts = line.split("|");
      if (parts[1]) seen.add(parts[1].toLowerCase());
    }
  }

  const cities = args.city === "all" ? Object.entries(CITIES) : [[args.city, CITIES[args.city]]].filter(([, v]) => v);
  const newRows = [];

  for (const [slug, cfg] of cities) {
    for (const cat of CATEGORIES) {
      if (newRows.length >= args.limit) break;
      for (let page = 1; page <= args.pages; page++) {
        process.stdout.write(`YP ${cat.slug} ${slug} p${page}… `);
        try {
          const html = await fetchSearchPage(cat.slug, cfg.query, page);
          const listings = parseJsonLd(html);
          let added = 0;
          for (const l of listings) {
            const website = slugDomain(l.business_name);
            if (!website || seen.has(website)) continue;
            seen.add(website);
            newRows.push({
              business_name: l.business_name,
              website,
              vertical: cat.vertical,
              city: l.city || cfg.name,
            });
            added++;
            if (newRows.length >= args.limit) break;
          }
          console.log(`+${added} (${newRows.length})`);
          if (listings.length === 0) break;
        } catch (e) {
          console.log(`err ${e.message}`);
          break;
        }
        await new Promise((r) => setTimeout(r, args.delay));
      }
      if (newRows.length >= args.limit) break;
    }
    if (newRows.length >= args.limit) break;
  }

  const lines = newRows.map((r) => `${r.business_name}|${r.website}|${r.vertical}|${r.city}`);
  if (lines.length) appendFileSync(out, lines.join("\n") + "\n", "utf8");
  console.log(`\nAppended ${lines.length} guessed URLs → ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
