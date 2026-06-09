#!/usr/bin/env node
/**
 * GreetQ lead email scraper — URLs in, leads.csv out.
 *
 * Usage:
 *   node scrape.mjs --input urls.txt --output leads.csv
 *   node scrape.mjs --url https://example.com --name "Example Co" --vertical dental
 *
 * Input file format (one per line):
 *   Business Name|https://website.com|vertical
 *   https://website.com
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMAIL_RE =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;

const JUNK_EMAIL =
  /(noreply|no-reply|donotreply|sentry|wixpress|example\.com|@2x\.|\.png|\.jpg|cloudflare|facebook|instagram|twitter|linkedin|youtube|google|schema\.org)/i;

const CONTACT_PATH_RE = /contact|about|team|staff|connect|reach|location|office|book|appointment/i;

const MAX_PAGES = 6;
const FETCH_TIMEOUT_MS = 12_000;
const DEFAULT_CITY = "Abbotsford";

function parseArgs(argv) {
  const args = { input: null, output: "leads.csv", url: null, name: "", vertical: "other", city: DEFAULT_CITY, emailsOnly: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--input") args.input = argv[++i];
    else if (a === "--output") args.output = argv[++i];
    else if (a === "--emails-only") args.emailsOnly = true;
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--name") args.name = argv[++i];
    else if (a === "--vertical") args.vertical = argv[++i];
    else if (a === "--city") args.city = argv[++i];
    else if (a === "--help") {
      console.log(`Usage:
  node scrape.mjs --input urls.txt --output leads.csv
  node scrape.mjs --url https://site.com --name "Biz" --vertical dental

Input lines: Business|URL|vertical  or  URL`);
      process.exit(0);
    }
  }
  return args;
}

function decodeCfEmail(hex) {
  try {
    const key = parseInt(hex.slice(0, 2), 16);
    let out = "";
    for (let i = 2; i < hex.length; i += 2) {
      out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    }
    return out;
  } catch {
    return null;
  }
}

function extractEmails(html, pageUrl) {
  const found = new Set();

  for (const m of html.matchAll(/data-cfemail="([a-f0-9]+)"/gi)) {
    const decoded = decodeCfEmail(m[1]);
    if (decoded && decoded.includes("@")) found.add(decoded.toLowerCase());
  }

  for (const m of html.matchAll(/mailto:([^\s"'<>?#]+)/gi)) {
    const email = m[1].split("?")[0].trim().toLowerCase();
    if (email.includes("@")) found.add(email);
  }

  for (const m of html.matchAll(EMAIL_RE)) {
    found.add(m[0].toLowerCase().replace(/\.$/, ""));
  }

  const host = new URL(pageUrl).hostname.replace(/^www\./, "");
  return [...found].filter((e) => {
    if (JUNK_EMAIL.test(e)) return false;
    if (!e.includes(".")) return false;
    const domain = e.split("@")[1] || "";
    if (domain.length < 4) return false;
    const pageBase = host.split(".").slice(-2).join(".");
    const emailBase = domain.split(".").slice(-2).join(".");
    return emailBase === pageBase || domain.endsWith(pageBase) || host.endsWith(emailBase);
  });
}

function extractLinks(html, baseUrl) {
  const base = new URL(baseUrl);
  const links = new Set();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    try {
      const u = new URL(m[1], baseUrl);
      if (u.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
      if (!["http:", "https:"].includes(u.protocol)) continue;
      links.add(u.href.split("#")[0]);
    } catch {
      /* skip */
    }
  }
  return [...links];
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GreetQ-LeadScraper/1.0 (+https://greetq.com; local business outreach)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, status: res.status, html: "", finalUrl: url };
    const html = await res.text();
    return { ok: true, status: res.status, html, finalUrl: res.url || url };
  } catch (err) {
    return { ok: false, status: 0, html: "", finalUrl: url, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

function seedUrls(website) {
  const start = website.startsWith("http") ? website : `https://${website}`;
  const base = new URL(start);
  const paths = ["", "/contact", "/contact-us", "/about", "/about-us", "/team", "/locations"];
  const hosts = [base.origin];
  if (!base.hostname.startsWith("www.")) {
    hosts.push(`${base.protocol}//www.${base.hostname}`);
  }
  const urls = [];
  for (const host of hosts) {
    for (const path of paths) urls.push(`${host}${path}`);
  }
  return [...new Set(urls)];
}

async function scrapeSite(website) {
  const start = website.startsWith("http") ? website : `https://${website}`;
  const visited = new Set();
  const queue = seedUrls(start);
  const emails = new Set();
  const pages = [];

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    const page = await fetchHtml(url);
    pages.push({ url: page.finalUrl, ok: page.ok, status: page.status });
    if (!page.ok || !page.html) continue;

    for (const e of extractEmails(page.html, page.finalUrl)) emails.add(e);

    if (emails.size) break;

    const ranked = extractLinks(page.html, page.finalUrl)
      .filter((l) => CONTACT_PATH_RE.test(l))
      .sort((a, b) => {
        const score = (u) => (/\/contact/i.test(u) ? 3 : /about|team/i.test(u) ? 2 : 1);
        return score(b) - score(a);
      });

    for (const link of ranked.slice(0, 4)) {
      if (!visited.has(link)) queue.push(link);
    }
  }

  return {
    website: start,
    emails: [...emails],
    pagesChecked: pages.length,
    pages,
  };
}

function parseInputLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (trimmed.startsWith("//")) return null;
  const parts = trimmed.split("|").map((p) => p.trim());
  if (parts.length >= 2 && parts[1].includes(".")) {
    return {
      business_name: parts[0],
      website: parts[1],
      vertical: parts[2] || "other",
    };
  }
  const url = parts[0];
  let name = "";
  try {
    name = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    name = url;
  }
  return { business_name: name, website: url, vertical: "other" };
}

function loadTargets(args) {
  if (args.url) {
    return [
      {
        business_name: args.name || args.url,
        website: args.url,
        vertical: args.vertical,
        city: args.city,
      },
    ];
  }
  if (!args.input) {
    console.error("Provide --input file or --url");
    process.exit(1);
  }
  const path = resolve(process.cwd(), args.input);
  if (!existsSync(path)) {
    console.error(`Input not found: ${path}`);
    process.exit(1);
  }
  return readFileSync(path, "utf8")
    .split("\n")
    .map(parseInputLine)
    .filter(Boolean)
    .map((t) => ({ ...t, city: args.city }));
}

function csvEscape(v) {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows) {
  const headers = ["business_name", "email", "city", "vertical", "website", "status", "notes"];
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => csvEscape(r[h])).join(","));
  return lines.join("\n") + "\n";
}

async function main() {
  const args = parseArgs(process.argv);
  const targets = loadTargets(args);
  const results = [];

  console.log(`Scraping ${targets.length} site(s)…\n`);

  for (const t of targets) {
    process.stdout.write(`  ${t.business_name} … `);
    const scraped = await scrapeSite(t.website);
    const email = scraped.emails[0] || "";
    const status = email ? "pending" : "no_email";
    const notes =
      scraped.emails.length > 1
        ? `Also found: ${scraped.emails.slice(1).join(", ")}`
        : email
          ? `Scraped from ${scraped.pagesChecked} page(s)`
          : `No email on ${scraped.pagesChecked} page(s) — contact form or phone only`;

    results.push({
      business_name: t.business_name,
      email,
      city: t.city || DEFAULT_CITY,
      vertical: t.vertical,
      website: t.website,
      status,
      notes,
    });

    console.log(email ? email : `(none, ${scraped.pagesChecked} pages)`);
  }

  const outPath = resolve(process.cwd(), args.output);
  writeFileSync(outPath, toCsv(results), "utf8");

  const found = results.filter((r) => r.email).length;
  if (args.emailsOnly) {
    for (const r of results.filter((x) => x.email)) console.log(r.email);
  } else {
    console.log(`\nDone: ${found}/${results.length} emails found → ${outPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
