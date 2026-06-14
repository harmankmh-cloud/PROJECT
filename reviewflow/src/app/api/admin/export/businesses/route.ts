import { NextResponse } from "next/server";
import { getPlatformBusinesses } from "@/lib/admin-data";
import { businessesToCsv } from "@/lib/export-csv";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";

export async function GET() {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const businesses = await getPlatformBusinesses();
  const csv = businessesToCsv(businesses);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ratelocal-businesses-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
