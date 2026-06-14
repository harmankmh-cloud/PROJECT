# Route Max

Route Max is a multi-stop driving route planner for solo drivers — **unlimited stops, no subscription, local privacy**.

Beat basic planners with fuel analytics, CSV import/export, time windows, map view, voice entry (web), proof-of-delivery notes/photos, and a multi-route library.

## Run locally

### Static web (production-like)

```bash
cd route-max
npm install
npm run start:static
```

Open `http://localhost:8000`.

### Expo Go / mobile

```bash
cd route-max
npm install
npm start
```

Scan the QR code with Expo Go. If LAN fails, use:

```bash
npm run start:tunnel
```

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run check` | Syntax check + unit tests |
| `npm test` | Route engine tests |
| `npm run start:static` | Local static server |
| `npm start` | Expo Metro (port 8081) |

## Features

- Unlimited stops (no 10-stop free cap)
- Trip summary: miles, drive time, fuel cost, cost/stop, efficiency score
- Route optimization (mile markers or geocoded nearest-neighbor + 2-opt)
- Per-stop time windows with ETA warnings
- CSV import/export and JSON backup/restore
- Leaflet map with geocoded pins (Nominatim / OpenStreetMap)
- Voice stop entry on supported browsers
- Proof-of-delivery notes + photo (web file input, Expo image picker)
- Multi-route library with local persistence
- Pre-trip checklist
- Google Maps directions handoff

## Deploy (Vercel)

Production: **https://route-max.vercel.app**

Set project **Root Directory** to `route-max`. No build command required — static files only.

Note: the web bundle is `planner.js` (Vercel reserves root `app.js` / `index.js` for serverless). Expo uses `expo-entry.js`.

## Data storage

All route data stays on your device (`localStorage` on web, AsyncStorage on Expo). No account required.
