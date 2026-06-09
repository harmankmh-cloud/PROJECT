#!/usr/bin/env node
/**
 * Print SQL INSERT statements for va_outreach_leads (use when API not deployed).
 *   node import-via-sql.mjs --input leads-batch.csv > import.sql
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return (s || "").replace(/'/g, "''");
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.match(/("([^"]|"")*"|[^,]*)/g)?.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (cols[i] || "").trim();
    });
    return row;
  });
}

function parseArgs() {
  const args = { input: "leads-batch.csv", sent: "sent-yesterday.txt" };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--input") args.input = process.argv[++i];
    else if (process.argv[i] === "--sent") args.sent = process.argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const path = resolve(__dirname, args.input);
  const sentPath = resolve(__dirname, args.sent);
  const sent = new Set(
    existsSync(sentPath)
      ? readFileSync(sentPath, "utf8")
          .split("\n")
          .map((l) => l.trim().toLowerCase())
          .filter((l) => l.includes("@"))
      : []
  );

  const rows = parseCsv(readFileSync(path, "utf8"));
  const values = [];

  for (const r of rows) {
    const email = (r.email || "").toLowerCase();
    if (!email) continue;
    const status = sent.has(email) ? "sent" : "pending";
    const sentAt = status === "sent" ? ", sent_at = now()" : "";
    values.push(
      `('${esc(r.business_name)}', '${esc(email)}', '${esc(r.city || "Abbotsford")}', '${esc(r.vertical || "other")}', '${esc(r.website || "")}', '${status}', '${esc(r.notes || "")}')`
    );
  }

  if (!values.length) {
    console.error("No rows with email");
    process.exit(1);
  }

  console.log(`-- ${values.length} leads with email`);
  for (let i = 0; i < values.length; i += 100) {
    const chunk = values.slice(i, i + 100);
    console.log(`
INSERT INTO va_outreach_leads (business_name, email, city, vertical, website, status, notes)
VALUES ${chunk.join(",\n")}
ON CONFLICT (lower(email)) WHERE email IS NOT NULL AND email <> ''
DO UPDATE SET
  business_name = EXCLUDED.business_name,
  city = EXCLUDED.city,
  vertical = EXCLUDED.vertical,
  website = EXCLUDED.website,
  status = CASE WHEN va_outreach_leads.status = 'sent' THEN 'sent' ELSE EXCLUDED.status END,
  notes = COALESCE(EXCLUDED.notes, va_outreach_leads.notes),
  updated_at = now();
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
