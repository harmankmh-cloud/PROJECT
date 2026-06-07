#!/usr/bin/env node
/**
 * Reliable Stitch health check. The upstream `stitch doctor` command can fail on
 * api.tools.list due to a known MCP JSON-schema bug ("can't resolve reference
 * #/$defs/ScreenInstance"). Auth + project list are sufficient to confirm setup.
 */
import { spawnSync } from "node:child_process";

function stitchArgs(args) {
  const global = spawnSync("stitch", ["--version"], { encoding: "utf8" });
  if (global.status === 0) {
    return { cmd: "stitch", args };
  }
  return { cmd: "npx", args: ["-y", "stitch-design-cli", ...args] };
}

function runStitch(args) {
  const { cmd, args: fullArgs } = stitchArgs(args);
  const result = spawnSync(cmd, fullArgs, { encoding: "utf8" });
  const stdout = (result.stdout || "").trim();
  const stderr = (result.stderr || "").trim();
  let json = null;
  if (stdout) {
    try {
      json = JSON.parse(stdout);
    } catch {
      // ignore parse errors
    }
  }
  return { status: result.status ?? 1, stdout, stderr, json };
}

const checks = [];
let coreOk = true;

const auth = runStitch(["auth", "status", "--json"]);
const authData = auth.json?.data ?? {};
const authPresent =
  authData.validation?.ok === true ||
  authData.hasApiKey === true ||
  (authData.hasAccessToken === true && authData.hasProjectId === true);
checks.push({
  name: "auth.present",
  ok: authPresent,
  detail: authPresent
    ? undefined
    : "No Stitch credentials. Run `npm run stitch:auth` or `npx -y stitch-design-cli auth set --api-key YOUR_KEY`.",
});

if (!authPresent) {
  coreOk = false;
} else {
  const projects = runStitch(["project", "list", "--json"]);
  const projectsOk = projects.json?.ok === true;
  const projectData = projects.json?.data ?? {};
  const projectList =
    projectData.items ??
    projectData.projects ??
    projects.json?.projects ??
    [];
  const projectCount =
    typeof projectData.count === "number" ? projectData.count : projectList.length;
  checks.push({
    name: "api.projects.list",
    ok: projectsOk,
    detail: projectsOk
      ? `${projectCount} projects`
      : projects.json?.error?.message ||
        projects.stderr ||
        projects.stdout ||
        "project list failed",
  });
  if (!projectsOk) coreOk = false;

  const tools = runStitch(["tool", "list", "--json"]);
  const toolsOk = tools.json?.ok === true;
  const toolList = tools.json?.data?.tools ?? tools.json?.tools ?? [];
  checks.push({
    name: "api.tools.list",
    ok: toolsOk,
    warning: !toolsOk,
    detail: toolsOk
      ? `${toolList.length} tools`
      : tools.json?.error?.message ||
        tools.stderr ||
        "Known MCP schema issue — safe to ignore if projects list works.",
  });
}

const payload = coreOk
  ? {
      ok: true,
      data: { checks },
      meta: {
        note: checks.some((c) => c.warning)
          ? "api.tools.list failed but auth and projects are healthy; Stitch is ready to use."
          : undefined,
      },
    }
  : {
      ok: false,
      error: {
        code: "CHECK_FAILED",
        message: "One or more core checks failed",
        retryable: false,
      },
      meta: { checks },
    };

console.log(JSON.stringify(payload, null, 2));
process.exit(coreOk ? 0 : 1);
