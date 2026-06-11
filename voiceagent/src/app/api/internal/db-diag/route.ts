import { NextResponse } from "next/server";

/** Temporary diagnostics — remove after migration. */
export async function GET() {
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "POSTGRES_URL",
    "SUPABASE_ACCESS_TOKEN",
  ];

  const env: Record<string, number | boolean> = {};
  for (const k of keys) {
    const v = process.env[k] || "";
    env[k] = v.length;
  }

  let columnCheck = "unknown";
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { error } = await admin.from("va_organizations").select("subscription_status").limit(1);
    columnCheck = error ? error.message : "ok";
  } catch (e) {
    columnCheck = e instanceof Error ? e.message : "admin client failed";
  }

  return NextResponse.json({ env, columnCheck });
}
