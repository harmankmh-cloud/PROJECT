import { NextResponse } from "next/server";
import { getApprovedProviders, notifySavedSearchesForProvider } from "@/lib/data";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = await getApprovedProviders({ sort: "recommended" });
  const recent = providers.filter((p) => {
    const created = new Date(p.created_at).getTime();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return created >= weekAgo;
  });

  let totalNotified = 0;
  for (const provider of recent) {
    const { notified } = await notifySavedSearchesForProvider(provider);
    totalNotified += notified;
  }

  return NextResponse.json({ ok: true, providersChecked: recent.length, alertsSent: totalNotified });
}
