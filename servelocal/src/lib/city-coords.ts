import { TRADE_CITIES } from "@/lib/constants";

/** Approximate city centers for map pins (lat, lng). */
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  surrey: { lat: 49.1913, lng: -122.849 },
  langley: { lat: 49.1044, lng: -122.6606 },
  abbotsford: { lat: 49.0504, lng: -122.3045 },
  chilliwack: { lat: 49.1579, lng: -121.9514 },
  mission: { lat: 49.142, lng: -122.312 },
  delta: { lat: 49.0847, lng: -123.0581 },
  burnaby: { lat: 49.2488, lng: -122.9805 },
  vancouver: { lat: 49.2827, lng: -123.1207 },
  richmond: { lat: 49.1666, lng: -123.1336 },
  coquitlam: { lat: 49.2838, lng: -122.7932 },
  "maple-ridge": { lat: 49.2193, lng: -122.6019 },
  kelowna: { lat: 49.888, lng: -119.496 },
};

export function getCityCoords(citySlug: string) {
  return CITY_COORDS[citySlug] ?? CITY_COORDS.surrey;
}

export function jitterCoords(lat: number, lng: number, seed: string) {
  const hash = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const offset = ((hash % 100) - 50) / 5000;
  return { lat: lat + offset, lng: lng + offset * 1.3 };
}

export function mapEmbedUrl(citySlug?: string) {
  const city = TRADE_CITIES.find((c) => c.slug === citySlug);
  const query = encodeURIComponent(city ? `${city.name}, BC, Canada` : "British Columbia, Canada");
  return `https://maps.google.com/maps?q=${query}&z=11&output=embed`;
}
