export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHours = { open: string; close: string; closed?: boolean };

export type BusinessHours = Partial<Record<DayKey, DayHours>>;

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function parseTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function isWithinBusinessHours(
  hours: BusinessHours | null | undefined,
  date = new Date(),
  timeZone = "America/Toronto"
): boolean {
  if (!hours || Object.keys(hours).length === 0) return true;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value?.toLowerCase().slice(0, 3);
  const hour = parts.find((p) => p.type === "hour")?.value || "00";
  const minute = parts.find((p) => p.type === "minute")?.value || "00";
  const nowMinutes = parseTime(`${hour}:${minute}`);
  if (!weekday || nowMinutes === null) return true;

  const dayKey = DAY_KEYS.find((d) => d.startsWith(weekday)) as DayKey | undefined;
  if (!dayKey) return true;

  const day = hours[dayKey];
  if (!day || day.closed) return false;

  const open = parseTime(day.open);
  const close = parseTime(day.close);
  if (open === null || close === null) return true;

  if (close <= open) {
    return nowMinutes >= open || nowMinutes < close;
  }
  return nowMinutes >= open && nowMinutes < close;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  mon: { open: "09:00", close: "17:00" },
  tue: { open: "09:00", close: "17:00" },
  wed: { open: "09:00", close: "17:00" },
  thu: { open: "09:00", close: "17:00" },
  fri: { open: "09:00", close: "17:00" },
  sat: { closed: true, open: "00:00", close: "00:00" },
  sun: { closed: true, open: "00:00", close: "00:00" },
};
