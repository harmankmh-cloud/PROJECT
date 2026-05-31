import { NextResponse } from "next/server";
import { getPlatformFeedback } from "@/lib/admin-data";
import { platformFeedbackToCsv } from "@/lib/export-csv";
import { requirePlatformAdminApi } from "@/lib/require-platform-admin";

export async function GET() {
  const auth = await requirePlatformAdminApi();
  if (!auth.ok) return auth.response;

  const reviews = await getPlatformFeedback(5000);
  const csv = platformFeedbackToCsv(reviews);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ratelocal-reviews-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
