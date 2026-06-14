# RouteMax

Simple delivery route optimizer — a lightweight alternative to Spoke, Circuit, and OptimoRoute.

Scan package labels (QR/barcode with address), paste a stop list, tap **Optimize route**, then open Google Maps or Apple Maps in the best order.

## Run locally

```bash
cd routemax
npm install
npm run dev
```

Open http://localhost:5174 on your phone (same Wi‑Fi) or desktop.

## Deploy (Vercel)

Root directory: `routemax`  
Build: `npm run build`  
Output: `dist`

No API keys required for the MVP. Geocoding uses OpenStreetMap (Nominatim). Route order uses nearest-neighbor + 2-opt on straight-line distance.

## How to use

1. Set **Start from** (depot, home, or tap **GPS**).
2. Add stops — type, **Paste list**, or **Scan QR / barcode** (label must encode the address text).
3. Tap **Optimize route**.
4. Tap **Google Maps** or **Apple Maps** to navigate.

## Paid apps vs RouteMax

| App | Best for | Cost |
|-----|----------|------|
| **RouteMax** (this) | Solo driver, few dozen stops, no subscription | Free |
| Spoke | Teams, proof of delivery, dispatch | ~$25+/driver/mo |
| Circuit | Couriers, simple UI | ~$20/mo |
| OptimoRoute | Large fleets, time windows | Enterprise |
| Google Maps (manual) | 1–10 stops, no optimization | Free |

RouteMax is **working** for scan → optimize → navigate. It is **not** a full fleet tool (no POD photos, time windows, or live dispatch).

## Optional upgrade

Set `VITE_ORS_API_KEY` and wire OpenRouteService for road-accurate optimization (future).
