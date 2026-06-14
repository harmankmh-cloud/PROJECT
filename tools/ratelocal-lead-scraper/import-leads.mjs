#!/usr/bin/env node
/**
 * Import leads into RateLocal outreach pool.
 *
 *   RATELOCAL_URL=https://ratelocal.ca node import-leads.mjs --input leads-batch.csv
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECRET = process.env.RATELOCAL_OUTREACH_SECRET || "ratelocal-marketing-webhook-2026";
const BASE = (process.env.RATELOCAL_URL || "https://ratelocal.ca").replace(/\/$/, "");

function parseCsvField(line, start) {
  if (line[start] === '"') {
    let i = start + 1;
    let out = "";
    while (i < line.length) {
      if (line[i] === '"') {
        if (line[i + 1] === '"') {
          out += '"';
          i += 2;
        } else {
          return { value: out, next: i + 1 };
        }
      } else {
        out += line[i++];
      }
    }
    return { value: out, next: line.length };
  }
  const end = line.indexOf(",", start);
  if (end === -1) return { value: line.slice(start), next: line.length };
  return { value: line.slice(start, end), next: end + 1 };
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const row = {};
    let pos = 0;
    for (let i = 0; i < headers.length; i++) {
      const { value, next } = parseCsvField(line, pos);
      row[headers[i]] = value.trim();
      pos = next;
    }
    return row;
  });
}

function parseArgs() {
  const args = { input: "leads-batch.csv", markSent: null, batch: 100 };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--input") args.input = process.argv[++i];
    else if (process.argv[i] === "--mark-sent") args.markSent = process.argv[++i];
    else if (process.argv[i] === "--batch") args.batch = Number(process.argv[++i]);
  }
  return args;
}

async function postImport(leads, markSentEmails) {
  const res = await fetch(`${BASE}/api/make/outreach/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RateLocal-Secret": SECRET,
    },
    body: JSON.stringify({ leads, mark_sent_emails: markSentEmails }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function main() {
  const args = parseArgs();
  const path = resolve(__dirname, args.input);
  if (!existsSync(path)) {
    console.error(`Not found: ${path}`);
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(path, "utf8"));
  const leads = rows.map((r) => ({
    business_name: r.business_name,
    email: r.email || "",
    city: r.city || "Abbotsford",
    vertical: r.vertical || "other",
    website: r.website || undefined,
    status: r.status === "no_email" ? "no_email" : r.email ? "pending" : "no_email",
    notes: r.notes || undefined,
  }));

  let markSent = [];
  if (args.markSent) {
    const sentPath = resolve(__dirname, args.markSent);
    markSent = readFileSync(sentPath, "utf8")
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l.includes("@"));
  }

  let total = { inserted: 0, updated: 0, skipped: 0 };
  for (let i = 0; i < leads.length; i += args.batch) {
    const chunk = leads.slice(i, i + args.batch);
    const result = await postImport(chunk, i === 0 ? markSent : []);
    total.inserted += result.inserted;
    total.updated += result.updated;
    total.skipped += result.skipped;
    console.log(`Batch ${i / args.batch + 1}: +${result.inserted} inserted, ${result.updated} updated`);
  }

  console.log(JSON.stringify(total, null, 2));
  console.log(`Pending with email: ${total.inserted + total.updated} (check API response)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
