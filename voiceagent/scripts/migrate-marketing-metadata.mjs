#!/usr/bin/env node
/**
 * One-off: add marketingMetadata() to static marketing pages.
 * Run from voiceagent/: node scripts/migrate-marketing-metadata.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "src", "app");

const SKIP = new Set([
  "pricing/page.tsx",
  "security/page.tsx",
  "layout.tsx",
  "dashboard",
  "admin",
  "api",
  "sentry-example-page",
]);

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (fs.statSync(full).isDirectory()) {
      if (SKIP.has(name) || rel.startsWith("dashboard") || rel.startsWith("admin")) continue;
      walk(full, files);
    } else if (name === "page.tsx" && !SKIP.has(rel)) {
      files.push(full);
    }
  }
  return files;
}

function migrate(file) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("marketingMetadata")) return false;
  if (!src.includes("export const metadata")) return false;
  if (src.includes("generateMetadata")) return false;

  const pathMatch = file.match(/src\/app\/(.+)\/page\.tsx$/);
  if (!pathMatch) return false;
  const routePath =
    pathMatch[1] === "(marketing)"
      ? "/"
      : `/${pathMatch[1].replace(/\(marketing\)\//, "")}`;

  // Extract title and description from metadata block
  const titleMatch = src.match(/title:\s*(?:"([^"]+)"|'([^']+)'|page\.title)/);
  const descMatch = src.match(/description:\s*(?:"([^"]+)"|'([^']+)'|page\.description)/);
  if (!titleMatch || !descMatch) return false;

  const title = titleMatch[1] ?? titleMatch[2] ?? "page.title";
  const description = descMatch[1] ?? descMatch[2] ?? "page.description";
  const titleExpr = titleMatch[0].includes("page.title") ? "page.title" : JSON.stringify(title);
  const descExpr = descMatch[0].includes("page.description")
    ? "page.description"
    : JSON.stringify(description);

  src = src.replace(
    /import type \{ Metadata \} from "next";\n/,
    `import { marketingMetadata } from "@/lib/seo/marketing-metadata";\n`
  );
  if (src.includes('import type { Metadata }')) {
    src = src.replace(/import type \{ Metadata \} from "next";\n/g, "");
  }

  const metaBlock = /export const metadata: Metadata = \{[\s\S]*?\};\n\n/;
  const replacement = `export const metadata = marketingMetadata({
  title: ${titleExpr},
  description: ${descExpr},
  path: "${routePath}",
});

`;
  if (!metaBlock.test(src)) return false;
  src = src.replace(metaBlock, replacement);
  fs.writeFileSync(file, src);
  return true;
}

let n = 0;
for (const f of walk(ROOT)) {
  if (migrate(f)) {
    console.log("migrated", path.relative(ROOT, f));
    n++;
  }
}
console.log(`Done: ${n} files`);
