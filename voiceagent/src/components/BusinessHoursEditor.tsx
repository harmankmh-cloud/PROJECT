"use client";

import type { BusinessHours, DayKey } from "@/lib/business-hours";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export function BusinessHoursEditor({
  value,
  onChange,
}: {
  value: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}) {
  function updateDay(key: DayKey, patch: Partial<BusinessHours[DayKey]>) {
    onChange({
      ...value,
      [key]: { open: "09:00", close: "17:00", ...value[key], ...patch },
    });
  }

  return (
    <div className="space-y-3">
      {DAYS.map(({ key, label }) => {
        const day = value[key] || { open: "09:00", close: "17:00" };
        const closed = day.closed === true;
        return (
          <div key={key} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3">
            <span className="w-24 text-sm font-medium">{label}</span>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={closed}
                onChange={(e) => updateDay(key, { closed: e.target.checked })}
              />
              Closed
            </label>
            {!closed && (
              <>
                <input
                  type="time"
                  className="input-field w-32 py-2"
                  value={day.open}
                  onChange={(e) => updateDay(key, { open: e.target.value })}
                />
                <span className="text-slate-400">to</span>
                <input
                  type="time"
                  className="input-field w-32 py-2"
                  value={day.close}
                  onChange={(e) => updateDay(key, { close: e.target.value })}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
