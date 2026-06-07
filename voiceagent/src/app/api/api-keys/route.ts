import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";
import { canManageOrg, getOrgRole } from "@/lib/org-role";
import { generateApiKey } from "@/lib/api-key-auth";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const role = await getOrgRole(org.id, user.id);
  if (!canManageOrg(role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { data: keys, error } = await supabase
    .from("va_api_keys")
    .select("id, name, key_prefix, last_used_at, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ keys: keys || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const role = await getOrgRole(org.id, user.id);
  if (!canManageOrg(role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "API key").trim() || "API key";
  const { key, prefix, hash } = generateApiKey();

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("va_api_keys")
    .insert({ org_id: org.id, name, key_hash: hash, key_prefix: prefix })
    .select("id, name, key_prefix, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "api_key.created",
    resourceType: "api_key",
    resourceId: row.id,
    metadata: { name },
  });

  return NextResponse.json({ key: row, secret: key });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const role = await getOrgRole(org.id, user.id);
  if (!canManageOrg(role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Key id required" }, { status: 400 });

  const { error } = await supabase.from("va_api_keys").delete().eq("id", id).eq("org_id", org.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "api_key.deleted",
    resourceType: "api_key",
    resourceId: id,
  });

  return NextResponse.json({ ok: true });
}
