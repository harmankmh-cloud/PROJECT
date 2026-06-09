#!/usr/bin/env node
/**
 * Discover local business websites in Fraser Valley via OpenStreetMap (free, no API key).
 * Output: seeds/fraser-valley-discovered.txt  (Business|URL|vertical)
 *
 *   node discover-overpass.mjs
 *   node discover-overpass.mjs --city abbotsford --limit 200
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CITIES = {
  abbotsford: { name: "Abbotsford", south: 49.0, west: -122.55, north: 49.12, east: -122.2 },
  langley: { name: "Langley", south: 49.0, west: -122.75, north: 49.2, east: -122.45 },
  surrey: { name: "Surrey", south: 49.0, west: -122.95, north: 49.25, east: -122.6 },
  chilliwack: { name: "Chilliwack", south: 49.08, west: -122.05, north: 49.22, east: -121.85 },
  mission: { name: "Mission", south: 49.08, west: -122.4, north: 49.2, east: -122.2 },
  maple_ridge: { name: "Maple Ridge", south: 49.15, west: -122.8, north: 49.35, east: -122.45 },
};

const VERTICAL_MAP = [
  { re: /dent|ortho|dental/i, vertical: "dental" },
  { re: /clinic|medical|health|physio|chiro|pharmacy|veterinar/i, vertical: "clinic" },
  { re: /insur/i, vertical: "insurance" },
  { re: /law|legal|barrister|solicitor/i, vertical: "legal" },
  { re: /strata|property|realty|real estate|rental/i, vertical: "property_mgmt" },
  { re: /plumb|hvac|electric|roof|heat|cool|contractor|construction|auto|mechanic/i, vertical: "home_services" },
  { re: /salon|spa|beauty|barber/i, vertical: "other" },
  { re: /restaurant|cafe|food/i, vertical: "other" },
];

function guessVertical(name, tags) {
  const blob = `${name} ${tags.shop || ""} ${tags.amenity || ""} ${tags.office || ""}`;
  for (const v of VERTICAL_MAP) {
    if (v.re.test(blob)) return v.vertical;
  }
  return "other";
}

function parseArgs() {
  const args = { city: "all", limit: 1200, output: "seeds/fraser-valley-discovered.txt" };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--city") args.city = process.argv[++i];
    else if (process.argv[i] === "--limit") args.limit = Number(process.argv[++i]);
    else if (process.argv[i] === "--output") args.output = process.argv[++i];
  }
  return args;
}

async function overpassQuery(bbox) {
  const { south, west, north, east } = bbox;
  const q = `
[out:json][timeout:180];
(
  node["website"](${south},${west},${north},${east});
  way["website"](${south},${west},${north},${east});
  relation["website"](${south},${west},${north},${east});
);
out body;
`;
  const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return res.json();
}

function normalizeUrl(url) {
  let u = url.trim();
  if (!u.startsWith("http")) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    return parsed.origin + parsed.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs();
  const cities =
    args.city === "all" ? Object.entries(CITIES) : [[args.city, CITIES[args.city]]].filter(([, v]) => v);

  const seen = new Set();
  const rows = [];

  for (const [slug, cfg] of cities) {
    console.log(`Discovering ${cfg.name}…`);
    const data = await overpassQuery(cfg);
    for (const el of data.elements || []) {
      const tags = el.tags || {};
      const website = tags.website || tags["contact:website"];
      if (!website) continue;
      const url = normalizeUrl(website);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      const name = tags.name || tags.brand || url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
      rows.push({
        business_name: name.slice(0, 120),
        website: url,
        vertical: guessVertical(name, tags),
        city: cfg.name,
      });
      if (rows.length >= args.limit) break;
    }
    if (rows.length >= args.limit) break;
    await new Promise((r) => setTimeout(r, 2000));
  }

  const lines = rows.map((r) => `${r.business_name}|${r.website}|${r.vertical}|${r.city}`);
  const out = resolve(__dirname, args.output);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, lines.join("\n") + "\n", "utf8");
  console.log(`\nWrote ${rows.length} businesses → ${out}`);
  console.log("Next: node scrape-batch.mjs --input seeds/fraser-valley-discovered.txt");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
