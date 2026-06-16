#!/usr/bin/env node
/**
 * Production auth smoke matrix (no credentials required for public flows).
 * Run: node servelocal/scripts/auth-e2e-smoke.mjs
 */
const BASE = "https://www.servelocal.ca";

async function check(name, url, expect) {
  const res = await fetch(url, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  const pass =
    expect.status === res.status &&
    (expect.locationIncludes == null || location.includes(expect.locationIncludes));
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
  console.log(`  ${res.status} ${location || "(no redirect)"}`);
  if (!pass) process.exitCode = 1;
  return { status: res.status, location };
}

async function main() {
  console.log(`Auth E2E smoke — ${BASE}\n`);

  // G — logged-out guards
  await check("G1 /onboarding → login", `${BASE}/onboarding`, {
    status: 307,
    locationIncludes: "/login",
  });
  await check("G2 /dashboard/pro → login", `${BASE}/dashboard/pro`, {
    status: 307,
    locationIncludes: "/login",
  });

  // E — homepage token catch
  await check("E homepage ?code= → confirm", `${BASE}/?code=smoke-test`, {
    status: 307,
    locationIncludes: "/auth/confirm",
  });

  // Invalid confirm
  await check("confirm missing params → auth-code-error", `${BASE}/auth/confirm`, {
    status: 307,
    locationIncludes: "auth-code-error",
  });

  // D partial — error page loads
  const errRes = await fetch(`${BASE}/auth/auth-code-error?reason=link_used`);
  console.log(`${errRes.status === 200 ? "PASS" : "FAIL"} D auth-code-error page`);
  if (errRes.status !== 200) process.exitCode = 1;

  // Public pages
  const home = await fetch(`${BASE}/`);
  console.log(`${home.status === 200 ? "PASS" : "FAIL"} homepage loads`);

  const login = await fetch(`${BASE}/login?as=pro`);
  console.log(`${login.status === 200 ? "PASS" : "FAIL"} /login?as=pro loads`);

  const signupPro = await fetch(`${BASE}/signup/pro`);
  console.log(`${signupPro.status === 200 ? "PASS" : "FAIL"} /signup/pro loads`);

  console.log("\nFlows A/B/C require real email confirm or password — skipped.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
