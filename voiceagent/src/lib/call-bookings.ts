type BookingCall = {
  id: string;
  intent?: string | null;
  summary?: string | null;
  from_number?: string | null;
  started_at?: string | null;
  created_at: string;
};

const BOOKING_HINTS = [
  "book",
  "appointment",
  "schedule",
  "reservation",
  "cleaning",
  "consult",
];

export type CallBooking = {
  id: string;
  callId: string;
  name: string;
  summary: string;
  when: string;
};

function looksLikeBooking(call: BookingCall): boolean {
  const intent = (call.intent || "").toLowerCase();
  const summary = (call.summary || "").toLowerCase();
  if (intent.includes("book") || intent.includes("appointment") || intent.includes("schedule")) {
    return true;
  }
  return BOOKING_HINTS.some((hint) => summary.includes(hint));
}

export function extractBookingsFromCalls(calls: BookingCall[]): CallBooking[] {
  return calls
    .filter(looksLikeBooking)
    .map((call) => ({
      id: call.id,
      callId: call.id,
      name: call.from_number || "Caller",
      summary: call.summary || call.intent || "Booking request",
      when: call.started_at || call.created_at,
    }))
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
}
