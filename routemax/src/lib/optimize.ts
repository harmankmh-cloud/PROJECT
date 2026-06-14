import type { LatLng } from "../types";

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function routeDistance(start: LatLng, order: number[], points: LatLng[]): number {
  let total = 0;
  let prev = start;
  for (const idx of order) {
    total += haversineKm(prev, points[idx]);
    prev = points[idx];
  }
  return total;
}

/** Nearest-neighbor + 2-opt improvement — no API key needed. */
export function optimizeStopOrder(start: LatLng, stops: LatLng[]): number[] {
  if (stops.length === 0) return [];
  if (stops.length === 1) return [0];

  const unvisited = new Set(stops.map((_, i) => i));
  const order: number[] = [];
  let current = start;

  while (unvisited.size > 0) {
    let nearest = -1;
    let nearestDist = Infinity;
    for (const idx of unvisited) {
      const d = haversineKm(current, stops[idx]);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = idx;
      }
    }
    order.push(nearest);
    unvisited.delete(nearest);
    current = stops[nearest];
  }

  // 2-opt local search
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const reversed = [
          ...order.slice(0, i),
          ...order.slice(i, j + 1).reverse(),
          ...order.slice(j + 1),
        ];
        if (routeDistance(start, reversed, stops) < routeDistance(start, order, stops)) {
          order.splice(0, order.length, ...reversed);
          improved = true;
        }
      }
    }
  }

  return order;
}

export function totalRouteKm(start: LatLng, ordered: LatLng[]): number {
  let total = 0;
  let prev = start;
  for (const point of ordered) {
    total += haversineKm(prev, point);
    prev = point;
  }
  return total;
}

export function buildGoogleMapsUrl(start: LatLng, stops: LatLng[]): string {
  if (stops.length === 0) {
    return `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}`;
  }
  const destination = stops[stops.length - 1];
  const waypoints = stops.slice(0, -1).map((s) => `${s.lat},${s.lng}`).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin: `${start.lat},${start.lng}`,
    destination: `${destination.lat},${destination.lng}`,
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params}`;
}

export function buildAppleMapsUrl(start: LatLng, stops: LatLng[]): string {
  const all = [start, ...stops];
  const daddr = all
    .slice(1)
    .map((p) => `${p.lat},${p.lng}`)
    .join("+to:");
  return `https://maps.apple.com/?saddr=${start.lat},${start.lng}&daddr=${daddr}`;
}
