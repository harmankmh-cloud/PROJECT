import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getUserBookings } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";

export default async function QuotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const bookings = user ? await getUserBookings(user.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Quotes &amp; Bookings</h1>
      <p className="mt-1 text-sm text-muted">Pending quotes and confirmed bookings</p>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-muted">No pending quotes or bookings</p>
          <Link href="/request" className="mt-4 inline-block text-primary hover:underline">
            Post a job to get quotes →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((b: Record<string, unknown>) => {
            const pro = b.service_providers as { display_name?: string; slug?: string } | null;
            const total = ((b.total_cents as number) ?? 0) / 100;
            return (
              <li key={b.id as string} className="rounded-[14px] border border-border bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{pro?.display_name ?? "Pro"}</p>
                    <p className="text-sm text-muted line-clamp-1">{b.service_description as string}</p>
                  </div>
                  <Badge variant="orange">${total.toFixed(2)}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted capitalize">{b.status as string}</span>
                  {pro?.slug && (
                    <Link href={`/booking/${pro.slug}`} className="text-sm font-semibold text-primary hover:underline">
                      View booking →
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
