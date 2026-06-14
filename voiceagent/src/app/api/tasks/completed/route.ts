import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const TASKS_KEY = "_completed_tasks";

function readCompleted(whiteLabel: unknown): string[] {
  if (!whiteLabel || typeof whiteLabel !== "object") return [];
  const ids = (whiteLabel as Record<string, unknown>)[TASKS_KEY];
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  return NextResponse.json({ completed: readCompleted(org.white_label) });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = (await request.json()) as { completed?: unknown };
  const completed = Array.isArray(body.completed)
    ? body.completed.filter((id): id is string => typeof id === "string")
    : [];

  const whiteLabel =
    org.white_label && typeof org.white_label === "object"
      ? { ...(org.white_label as Record<string, unknown>) }
      : {};

  whiteLabel[TASKS_KEY] = completed;

  const admin = createAdminClient();
  const { error } = await admin
    .from("va_organizations")
    .update({ white_label: whiteLabel, updated_at: new Date().toISOString() })
    .eq("id", org.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ completed });
}
