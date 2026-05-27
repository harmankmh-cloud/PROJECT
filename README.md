# Route Max

Route Max is a lightweight static web app for planning multi-stop driving
routes. It helps drivers estimate mileage, drive time, fuel costs, optimized
stop order, ETAs, route progress, and pre-trip checklist readiness.

## Run locally

### Expo Go / mobile

Start the Metro server on port 8081:

```bash
npm start
```

Then scan the QR code with Expo Go. The app is served from an `exp://...:8081`
URL, which is the flow expected by Expo Go.

If your phone still cannot reach the LAN URL, use the tunnel fallback:

```bash
npm run start:tunnel
```

### Static browser preview

The repo also keeps the static HTML preview available:

```bash
npm run start:static
```

Then visit `http://localhost:8000`.

## Features

- Trip summary for miles, drive time, fuel cost, and route progress
- Editable trip settings with local browser persistence
- Route board for adding, optimizing, completing, skipping, and deleting stops
- ETA timeline with service-time and buffer calculations
- Route warnings for out-of-range or priority-risk stops
- CSV route export and Google Maps directions link
- Checklist for common driver-prep tasks
- Responsive UI for desktop and mobile screens
