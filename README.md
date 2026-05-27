# Route Max

Route Max is a lightweight static web app for planning multi-stop driving
routes. It helps drivers estimate mileage, drive time, fuel costs, optimized
stop order, ETAs, route progress, and pre-trip checklist readiness.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static
file server:

```bash
python3 -m http.server 8000
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
