import "server-only";

/** Returns a trimmed env secret or null — never falls back to hardcoded defaults. */
export function envSecret(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}
