import { getAvailabilitySlots } from "@/lib/features-data";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  providerId: string;
};

export async function ProAvailability({ providerId }: Props) {
  const slots = await getAvailabilitySlots(providerId);
  const byDay = new Map<string, typeof slots>();

  for (const slot of slots) {
    const day = new Date(slot.starts_at).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(slot);
  }

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Availability</h2>
        <p className="mt-1 text-sm text-muted">Open slots — request a time to confirm</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...byDay.entries()].slice(0, 7).map(([day, daySlots]) => (
            <div key={day} className="rounded-[14px] border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-foreground">{day}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <span
                    key={slot.id}
                    className="rounded-lg bg-amber-400/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {new Date(slot.starts_at).toLocaleTimeString("en-CA", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeUp>
  );
}
