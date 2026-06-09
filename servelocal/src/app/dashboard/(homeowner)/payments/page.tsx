import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getUserBookings } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const bookings = user ? await getUserBookings(user.id) : [];
  const paidBookings = bookings.filter(
    (b: Record<string, unknown>) => b.payment_status === "paid" || b.payment_status === "held"
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Payments</h1>
      <p className="mt-1 text-sm text-muted">Invoice history and receipts</p>

      {paidBookings.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-muted">No payments yet</p>
          <Link href="/request" className="mt-4 inline-block text-primary hover:underline">
            Book a pro to get started →
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-muted">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Pro</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paidBookings.map((b: Record<string, unknown>) => {
                const pro = b.service_providers as { display_name?: string } | null;
                const total = ((b.total_cents as number) ?? 0) / 100;
                const date = b.created_at
                  ? new Date(b.created_at as string).toLocaleDateString("en-CA")
                  : "—";
                const status = (b.payment_status as string) ?? "pending";
                return (
                  <tr key={b.id as string} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">{date}</td>
                    <td className="px-4 py-3 text-foreground">{pro?.display_name ?? "Pro"}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">${total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status === "paid" ? "success" : "orange"} className="capitalize">
                        {status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
