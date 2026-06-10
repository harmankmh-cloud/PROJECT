#!/usr/bin/env node
/**
 * Scrape many sites with delay + resume. Outputs leads.csv for import.
 *
 *   node scrape-batch.mjs --input seeds/fraser-valley-discovered.txt --output leads-batch.csv
 *   node scrape-batch.mjs --input seeds/fraser-valley-discovered.txt --offset 0 --limit 200
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = {
    input: "seeds/fraser-valley-discovered.txt",
    output: "leads-batch.csv",
    offset: 0,
    limit: 0,
    delay: 800,
    city: "",
  };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === "--input") args.input = process.argv[++i];
    else if (a === "--output") args.output = process.argv[++i];
    else if (a === "--offset") args.offset = Number(process.argv[++i]);
    else if (a === "--limit") args.limit = Number(process.argv[++i]);
    else if (a === "--delay") args.delay = Number(process.argv[++i]);
    else if (a === "--city") args.city = process.argv[++i];
  }
  return args;
}

function runScrape(targetFile, outputFile) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("node", ["scrape.mjs", "--input", targetFile, "--output", outputFile], {
      cwd: __dirname,
      stdio: "inherit",
    });
    child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`scrape exit ${code}`))));
  });
}

function parseInputLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const parts = trimmed.split("|").map((p) => p.trim());
  if (parts.length >= 4) {
    return { business_name: parts[0], website: parts[1], vertical: parts[2], city: parts[3] };
  }
  if (parts.length >= 2) {
    return { business_name: parts[0], website: parts[1], vertical: parts[2] || "other", city: parts[3] || "Abbotsford" };
  }
  return null;
}

async function main() {
  const args = parseArgs();
  const inputPath = resolve(__dirname, args.input);
  let lines = readFileSync(inputPath, "utf8").split("\n").map(parseInputLine).filter(Boolean);
  if (args.city) lines = lines.filter((l) => l.city.toLowerCase() === args.city.toLowerCase());

  const slice = args.limit > 0 ? lines.slice(args.offset, args.offset + args.limit) : lines.slice(args.offset);
  console.log(`Batch scrape: ${slice.length} sites (offset ${args.offset})\n`);

  const tmpDir = resolve(__dirname, ".batch-tmp");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(tmpDir, { recursive: true });

  const outPath = resolve(__dirname, args.output);
  const header = "business_name,email,city,vertical,website,status,notes\n";
  if (!existsSync(outPath) || args.offset === 0) writeFileSync(outPath, header, "utf8");

  for (let i = 0; i < slice.length; i++) {
    const t = slice[i];
    const chunkFile = resolve(tmpDir, `chunk-${args.offset + i}.txt`);
    writeFileSync(chunkFile, `${t.business_name}|${t.website}|${t.vertical}|${t.city}\n`, "utf8");
    const chunkOut = resolve(tmpDir, `out-${args.offset + i}.csv`);
    console.log(`[${i + 1}/${slice.length}] ${t.business_name}`);
    await runScrape(chunkFile, chunkOut);
    if (existsSync(chunkOut)) {
      const rows = readFileSync(chunkOut, "utf8").split("\n").slice(1).filter(Boolean);
      for (const row of rows) appendFileSync(outPath, row + "\n", "utf8");
    }
    if (i < slice.length - 1 && args.delay > 0) {
      await new Promise((r) => setTimeout(r, args.delay));
    }
  }

  console.log(`\nAppended results → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
