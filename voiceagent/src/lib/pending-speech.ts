import "server-only";

type PendingEntry = {
  speech: string;
  to: string;
  expiresAt: number;
};

const pending = new Map<string, PendingEntry>();
const TTL_MS = 60_000;

export function storePendingSpeech(callSid: string, speech: string, to: string) {
  pending.set(callSid, {
    speech,
    to,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function takePendingSpeech(callSid: string) {
  const entry = pending.get(callSid);
  pending.delete(callSid);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return { speech: entry.speech, to: entry.to };
}
