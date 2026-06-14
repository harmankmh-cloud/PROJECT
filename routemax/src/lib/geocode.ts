import type { LatLng } from "../types";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "RouteMax/0.1 (local delivery route optimizer)";

let lastRequestAt = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const wait = Math.max(0, 1100 - (Date.now() - lastRequestAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
  return fetch(url, { headers: { "User-Agent": USER_AGENT } });
}

export async function geocodeAddress(address: string): Promise<LatLng | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    limit: "1",
    countrycodes: "ca",
  });

  const res = await rateLimitedFetch(`${NOMINATIM}?${params}`);
  if (!res.ok) return null;

  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data.length) return null;

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export function looksLikeAddress(text: string): boolean {
  const t = text.trim();
  if (t.length < 8) return false;
  const hasNumber = /\d/.test(t);
  const hasStreetWord =
    /\b(st|street|ave|avenue|rd|road|dr|drive|blvd|boulevard|way|lane|ln|crt|crescent|cres|hwy|highway)\b/i.test(
      t
    );
  const hasPostal = /\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i.test(t);
  return (hasNumber && hasStreetWord) || hasPostal || (hasNumber && t.includes(","));
}

export function parseAddressLines(text: string): string[] {
  return text
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter((line) => line.length > 3);
}
