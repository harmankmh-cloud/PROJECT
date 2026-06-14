import Link from "next/link";
import { CreditCard, MapPin } from "lucide-react";
import type { PublicBusiness } from "@/lib/types";
import { FadeInSection } from "@/components/ui/FadeInSection";

const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const TODAY = DAY_KEYS[new Date().getDay()];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${period}` : `${hour}${period}`;
}

export function BusinessInfoPanel({ business }: { business: PublicBusiness }) {
  const hours = business.hours;

  return (
    <FadeInSection className="card-glow p-6">
      <h2 className="font-display mb-4 text-lg font-bold text-text">Business Info</h2>

      {hours && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-text">Hours</h3>
          <ul className="space-y-1 text-sm">
            {DAYS.map((day) => {
              const slot = hours[day];
              const isToday = day === TODAY;
              return (
                <li
                  key={day}
                  className={`flex justify-between ${isToday ? "font-semibold text-primary" : "text-muted"}`}
                >
                  <span>{DAY_LABELS[day]}</span>
                  <span>
                    {slot?.closed
                      ? "Closed"
                      : slot
                        ? `${formatTime(slot.open)} – ${formatTime(slot.close)}`
                        : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {business.amenities && business.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-text">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {business.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-muted"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text">
          <CreditCard className="h-4 w-4" />
          Payment
        </h3>
        <p className="text-sm text-muted">Cash, Debit, Visa, Mastercard</p>
      </div>

      {business.address && (
        <p className="mb-6 flex items-start gap-1.5 text-sm text-muted">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          {[business.address, business.city, business.province, business.postal_code]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}

      {!business.is_claimed && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-medium text-text">Is this your business?</p>
          <Link href="/signup" className="btn-primary-pill mt-3 inline-block px-6 py-2 text-sm">
            Claim this business
          </Link>
        </div>
      )}
    </FadeInSection>
  );
}
