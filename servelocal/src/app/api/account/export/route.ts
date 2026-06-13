import { NextResponse } from "next/server";
import { getUserBookings } from "@/lib/data/bookings";
import { getUserServiceRequests } from "@/lib/data/requests";
import { getUserMessageThreads } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profiles";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, requests, bookings, threads] = await Promise.all([
    getUserProfile(user.id),
    getUserServiceRequests(user.id, user.email ?? undefined),
    getUserBookings(user.id, user.email ?? undefined),
    getUserMessageThreads(user.id),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      email: user.email,
      profile,
    },
    serviceRequests: requests,
    bookings,
    messageThreads: threads.map((t) => ({
      id: t.id,
      provider_id: t.provider_id,
      subject: t.subject,
      last_message_at: t.last_message_at,
    })),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="servelocal-data-export.json"',
    },
  });
}
