import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";
import { canManageOrg, getOrgRole } from "@/lib/org-role";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const admin = createAdminClient();
  const { data: members } = await admin
    .from("va_org_members")
    .select("id, user_id, role, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: true });

  const enriched = [];
  for (const member of members || []) {
    const { data: authUser } = await admin.auth.admin.getUserById(member.user_id);
    enriched.push({
      ...member,
      email: authUser?.user?.email || "unknown",
    });
  }

  const role = await getOrgRole(org.id, user.id);

  return NextResponse.json({
    owner: { id: org.owner_id, role: "owner" },
    members: enriched,
    currentRole: role,
  });
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
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const memberRole =
    body.role === "admin" || body.role === "operator" || body.role === "viewer"
      ? body.role
      : "viewer";

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const target = listed?.users?.find((u) => u.email?.toLowerCase() === email);

  if (!target) {
    return NextResponse.json(
      { error: "No account with that email. They must sign up first." },
      { status: 404 }
    );
  }

  if (target.id === org.owner_id) {
    return NextResponse.json({ error: "Owner is already on the team" }, { status: 400 });
  }

  const { data: member, error } = await admin
    .from("va_org_members")
    .upsert(
      { org_id: org.id, user_id: target.id, role: memberRole },
      { onConflict: "org_id,user_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "team.member_added",
    resourceType: "org_member",
    resourceId: member.id,
    metadata: { email, role: memberRole },
  });

  return NextResponse.json({ member: { ...member, email } });
}

export async function PATCH(request: NextRequest) {
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
  const memberId = body.id as string;
  const memberRole =
    body.role === "admin" || body.role === "operator" || body.role === "viewer"
      ? body.role
      : null;

  if (!memberId || !memberRole) {
    return NextResponse.json({ error: "Member id and role required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: member, error } = await admin
    .from("va_org_members")
    .update({ role: memberRole })
    .eq("id", memberId)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "team.member_updated",
    resourceType: "org_member",
    resourceId: memberId,
    metadata: { role: memberRole },
  });

  return NextResponse.json({ member });
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

  const memberId = request.nextUrl.searchParams.get("id");
  if (!memberId) return NextResponse.json({ error: "Member id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("va_org_members")
    .delete()
    .eq("id", memberId)
    .eq("org_id", org.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "team.member_removed",
    resourceType: "org_member",
    resourceId: memberId,
  });

  return NextResponse.json({ ok: true });
}
