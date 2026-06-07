#!/usr/bin/env node
/**
 * GreetQ DNS audit wrapper — runs the monorepo script from voiceagent/.
 *
 *   VERCEL_TOKEN=... node scripts/dns-audit.mjs
 *   VERCEL_TOKEN=... node scripts/dns-audit.mjs --fix
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(root, "scripts/dns-audit.mjs");
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [script, ...args], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
