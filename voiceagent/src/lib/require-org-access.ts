import "server-only";
import { NextResponse } from "next/server";
import { canManageOrg, canOperate, getOrgRole } from "@/lib/org-role";

export async function denyUnlessCanOperate(orgId: string, userId: string) {
  const role = await getOrgRole(orgId, userId);
  if (!canOperate(role)) {
    return NextResponse.json(
      { error: "Operator access or higher required for this action" },
      { status: 403 }
    );
  }
  return null;
}

export async function denyUnlessCanManage(orgId: string, userId: string) {
  const role = await getOrgRole(orgId, userId);
  if (!canManageOrg(role)) {
    return NextResponse.json({ error: "Admin access required for this action" }, { status: 403 });
  }
  return null;
}
