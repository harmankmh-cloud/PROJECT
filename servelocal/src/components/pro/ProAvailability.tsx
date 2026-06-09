"use client";

import { FadeUp } from "@/components/motion/FadeUp";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

export function ProAvailability() {
  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Availability</h2>
        <p className="mt-1 text-sm text-muted">Open slots this week — request a time to confirm</p>
        <div className="mt-4 overflow-x-auto rounded-[14px] border border-border">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 border-b border-border bg-surface text-xs font-semibold text-muted">
              <div className="p-3" />
              {DAYS.map((d) => (
                <div key={d} className="p-3 text-center">
                  {d}
                </div>
              ))}
            </div>
            {SLOTS.map((slot) => (
              <div key={slot} className="grid grid-cols-8 border-b border-border last:border-0">
                <div className="p-3 text-xs text-muted">{slot}</div>
                {DAYS.map((d, i) => {
                  const available = (i + slot.length) % 3 !== 0;
                  return (
                    <div key={`${d}-${slot}`} className="border-l border-border p-2">
                      {available ? (
                        <button
                          type="button"
                          className="w-full rounded-lg bg-amber-400/10 py-2 text-xs font-medium text-primary transition hover:bg-amber-400/20"
                        >
                          Open
                        </button>
                      ) : (
                        <div className="py-2 text-center text-xs text-muted/40">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
