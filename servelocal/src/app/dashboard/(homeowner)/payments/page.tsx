import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getUserBookings, isPaidBooking } from "@/lib/data/bookings";
import type { PaymentStatus } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

function paymentLabel(status: PaymentStatus) {
  if (status === "released") return "Paid";
  if (status === "held") return "In escrow";
  if (status === "refunded") return "Refunded";
  return status;
}

function paymentVariant(status: PaymentStatus): "success" | "orange" | "default" {
  if (status === "released") return "success";
  if (status === "held") return "orange";
  return "default";
}

export default async function PaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const bookings = user ? await getUserBookings(user.id, user.email ?? undefined) : [];
  const paidBookings = bookings.filter(isPaidBooking);

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
              {paidBookings.map((b) => {
                const total = b.total_cents / 100;
                const date = new Date(b.created_at).toLocaleDateString("en-CA");
                return (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">{date}</td>
                    <td className="px-4 py-3 text-foreground">{b.service_providers?.display_name ?? "Pro"}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">${total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={paymentVariant(b.payment_status)} className="capitalize">
                        {paymentLabel(b.payment_status)}
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
