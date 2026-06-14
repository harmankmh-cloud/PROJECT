/** North American Numbering Plan — Canadian/US 10-digit numbers. */
export const NANP_PHONE_RE = /^\+?1?[-.\s]?\(?([2-9]\d{2})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

export function isValidNanpPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return NANP_PHONE_RE.test(value.trim());
  if (digits.length === 11 && digits.startsWith("1")) return NANP_PHONE_RE.test(value.trim());
  return false;
}

/** Normalize to E.164 (+1XXXXXXXXXX) for storage. */
export function normalizeNanpPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return value.trim();
  return `+1${ten}`;
}

/** Display mask while typing: +1 (604) 555-0100 */
export function formatNanpPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits.slice(0, 10);
  if (ten.length === 0) return "";
  if (ten.length <= 3) return `+1 (${ten}`;
  if (ten.length <= 6) return `+1 (${ten.slice(0, 3)}) ${ten.slice(3)}`;
  return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}
