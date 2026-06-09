#!/usr/bin/env node
/**
 * Bulk scrape all campaign/*.txt files → merged CSV + emails-only.txt
 *
 * Usage:
 *   node scrape-bulk.mjs
 *   node scrape-bulk.mjs --concurrency 8
 *   node scrape-bulk.mjs --emails-only
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMPAIGN_DIR = join(__dirname, "campaign");
const OUTPUT_DIR = join(__dirname, "output");

function parseArgs() {
  const args = { concurrency: 5, emailsOnly: false, city: "Abbotsford" };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--concurrency") args.concurrency = Number(process.argv[++i]) || 5;
    else if (process.argv[i] === "--emails-only") args.emailsOnly = true;
    else if (process.argv[i] === "--city") args.city = process.argv[++i];
  }
  return args;
}

function runScrape(inputFile, outputFile, city) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [join(__dirname, "scrape.mjs"), "--input", inputFile, "--output", outputFile, "--city", city],
      { cwd: __dirname, stdio: ["ignore", "pipe", "pipe"] }
    );
    let stderr = "";
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || `scrape failed for ${inputFile}`));
      else resolve();
    });
  });
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") { vals.push(cur); cur = ""; }
      else cur += c;
    }
    vals.push(cur);
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return row;
  });
}

async function runPool(tasks, concurrency) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

async function main() {
  const args = parseArgs();
  if (!existsSync(CAMPAIGN_DIR)) mkdirSync(CAMPAIGN_DIR, { recursive: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(join(OUTPUT_DIR, "by-category"), { recursive: true });

  const files = readdirSync(CAMPAIGN_DIR)
    .filter((f) => f.endsWith(".txt"))
    .sort();

  if (!files.length) {
    console.log("No files in campaign/. Add URL lists first (see docs/GREETQ_CAMPAIGN_1000.md).");
    process.exit(0);
  }

  let totalUrls = 0;
  for (const f of files) {
    const lines = readFileSync(join(CAMPAIGN_DIR, f), "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.trim().startsWith("#"));
    totalUrls += lines.length;
  }

  console.log(`Bulk scrape: ${files.length} categories, ${totalUrls} URLs, concurrency ${args.concurrency}\n`);

  const tasks = files.map((f) => async () => {
    const input = join(CAMPAIGN_DIR, f);
    const out = join(OUTPUT_DIR, "by-category", f.replace(".txt", ".csv"));
    const lines = readFileSync(input, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).length;
    if (!lines) return { file: f, urls: 0, emails: 0 };
    console.log(`  → ${f} (${lines} URLs)`);
    await runScrape(input, out, args.city);
    const rows = parseCsv(readFileSync(out, "utf8"));
    const emails = rows.filter((r) => r.email?.trim()).length;
    console.log(`    ✓ ${emails}/${rows.length} emails`);
    return { file: f, urls: rows.length, emails, rows };
  });

  const categoryResults = await runPool(tasks, args.concurrency);

  const allRows = [];
  const seenEmails = new Set();
  for (const cr of categoryResults) {
    if (!cr?.rows) continue;
    for (const row of cr.rows) {
      const email = row.email?.trim().toLowerCase();
      if (email && seenEmails.has(email)) continue;
      if (email) seenEmails.add(email);
      allRows.push(row);
    }
  }

  const headers = ["business_name", "email", "city", "vertical", "website", "status", "notes"];
  const csvLines = [headers.join(",")];
  for (const r of allRows) {
    csvLines.push(headers.map((h) => {
      const s = String(r[h] ?? "");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  writeFileSync(join(OUTPUT_DIR, "all-leads.csv"), csvLines.join("\n") + "\n");

  const emailsOnly = allRows.filter((r) => r.email?.trim()).map((r) => r.email.trim());
  writeFileSync(join(OUTPUT_DIR, "emails-only.txt"), emailsOnly.join("\n") + (emailsOnly.length ? "\n" : ""));

  const withEmail = emailsOnly.length;
  const summary = {
    categories: files.length,
    urlsScraped: categoryResults.reduce((n, c) => n + (c?.urls || 0), 0),
    emailsFound: withEmail,
    hitRate: categoryResults.reduce((n, c) => n + (c?.urls || 0), 0)
      ? `${Math.round((withEmail / categoryResults.reduce((n, c) => n + (c?.urls || 0), 0)) * 100)}%`
      : "0%",
    sendDaysAt100: Math.floor(withEmail / 100),
  };

  console.log("\n── Summary ──");
  console.log(`  URLs scraped:  ${summary.urlsScraped}`);
  console.log(`  Emails found:  ${summary.emailsFound} (${summary.hitRate})`);
  console.log(`  Send runway:   ${summary.sendDaysAt100} days @ 100/day`);
  console.log(`  Output:        output/all-leads.csv`);
  console.log(`                 output/emails-only.txt`);

  if (args.emailsOnly) {
    for (const e of emailsOnly) console.log(e);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
