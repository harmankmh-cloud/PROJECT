#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const root = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(root, "../src/app/globals.css");

try {
  const css = fs.readFileSync(cssPath, "utf8");
  postcss.parse(css, { from: cssPath });
  console.log(`${path.relative(process.cwd(), cssPath)}: syntax OK`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`CSS syntax error in ${cssPath}:\n${message}`);
  process.exit(1);
}
