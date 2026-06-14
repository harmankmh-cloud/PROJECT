import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import {
  Camera,
  ClipboardPaste,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Route,
  Trash2,
  Zap,
} from "lucide-react";
import { geocodeAddress, looksLikeAddress, parseAddressLines } from "./lib/geocode";
import {
  buildAppleMapsUrl,
  buildGoogleMapsUrl,
  optimizeStopOrder,
  totalRouteKm,
} from "./lib/optimize";
import type { LatLng, Stop } from "./types";
import { ScannerModal } from "./components/ScannerModal";

const RouteMap = lazy(() =>
  import("./components/RouteMap").then((m) => ({ default: m.RouteMap }))
);

function newId() {
  return crypto.randomUUID();
}

export default function App() {
  const [startAddress, setStartAddress] = useState("Abbotsford, BC");
  const [startCoords, setStartCoords] = useState<LatLng | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [draft, setDraft] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [optimizedIds, setOptimizedIds] = useState<string[] | null>(null);

  const orderedStops = useMemo(() => {
    if (!optimizedIds) return stops;
    const map = new Map(stops.map((s) => [s.id, s]));
    return optimizedIds.map((id) => map.get(id)).filter(Boolean) as Stop[];
  }, [stops, optimizedIds]);

  const routePoints = useMemo(() => {
    return orderedStops
      .map((s) => s.coords)
      .filter((c): c is LatLng => Boolean(c));
  }, [orderedStops]);

  const totalKm = useMemo(() => {
    if (!startCoords || routePoints.length === 0) return null;
    return totalRouteKm(startCoords, routePoints);
  }, [startCoords, routePoints]);

  const addStop = useCallback((address: string) => {
    const trimmed = address.trim();
    if (!trimmed) return false;
    setStops((prev) => [...prev, { id: newId(), address: trimmed }]);
    setOptimizedIds(null);
    return true;
  }, []);

  const removeStop = (id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    setOptimizedIds(null);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported on this device.");
      return;
    }
    setStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStartCoords(coords);
        setStartAddress("Current location");
        setStatus("Start set to your current location.");
      },
      () => setStatus("Could not get location. Type a start address instead.")
    );
  };

  const geocodeAll = async () => {
    setBusy(true);
    setStatus("Geocoding addresses…");
    setOptimizedIds(null);

    let start = startCoords;
    if (!start) {
      start = await geocodeAddress(startAddress);
      if (start) setStartCoords(start);
    }

    if (!start) {
      setStatus("Could not find start location. Check the address.");
      setBusy(false);
      return;
    }

    const updated: Stop[] = [];
    for (const stop of stops) {
      if (stop.coords) {
        updated.push(stop);
        continue;
      }
      const coords = await geocodeAddress(stop.address);
      updated.push(
        coords
          ? { ...stop, coords, geocodeError: undefined }
          : { ...stop, geocodeError: "Address not found" }
      );
    }

    setStops(updated);
    const missing = updated.filter((s) => !s.coords).length;
    setStatus(
      missing
        ? `${missing} stop(s) could not be geocoded. Fix those and try again.`
        : "All addresses mapped. Tap Optimize route."
    );
    setBusy(false);
  };

  const optimize = async () => {
    if (stops.length < 2) {
      setStatus("Add at least 2 stops to optimize.");
      return;
    }

    setBusy(true);
    setStatus("Optimizing…");

    let start = startCoords;
    if (!start) {
      start = await geocodeAddress(startAddress);
      if (start) setStartCoords(start);
    }
    if (!start) {
      setStatus("Set a valid start point first.");
      setBusy(false);
      return;
    }

    const withCoords: Stop[] = [];
    for (const stop of stops) {
      if (stop.coords) {
        withCoords.push(stop);
        continue;
      }
      const coords = await geocodeAddress(stop.address);
      withCoords.push(
        coords ? { ...stop, coords } : { ...stop, geocodeError: "Not found" }
      );
    }
    setStops(withCoords);

    const geocoded = withCoords.filter((s) => s.coords);
    if (geocoded.length < 2) {
      setStatus("Need at least 2 valid addresses.");
      setBusy(false);
      return;
    }

    const points = geocoded.map((s) => s.coords!);
    const order = optimizeStopOrder(start, points);
    const ordered = order.map((i) => geocoded[i].id);
    setOptimizedIds(ordered);
    setStatus(`Route optimized — ${geocoded.length} stops in best order.`);
    setBusy(false);
  };

  const openGoogleMaps = () => {
    if (!startCoords || routePoints.length === 0) {
      setStatus("Optimize the route first.");
      return;
    }
    window.open(buildGoogleMapsUrl(startCoords, routePoints), "_blank");
  };

  const openAppleMaps = () => {
    if (!startCoords || routePoints.length === 0) {
      setStatus("Optimize the route first.");
      return;
    }
    window.open(buildAppleMapsUrl(startCoords, routePoints), "_blank");
  };

  const handleScan = (text: string) => {
    if (looksLikeAddress(text)) {
      addStop(text);
      setStatus("Scanned address added.");
    } else {
      setStatus("Scan did not look like an address. Paste it manually.");
    }
    setShowScanner(false);
  };

  const handleBulkPaste = () => {
    const lines = parseAddressLines(bulkText);
    if (!lines.length) {
      setStatus("No addresses found in pasted text.");
      return;
    }
    lines.forEach((line) => addStop(line));
    setBulkText("");
    setShowBulk(false);
    setStatus(`Added ${lines.length} stop(s).`);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 px-4 pb-8 pt-safe">
      <header className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Route className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RouteMax</h1>
            <p className="text-sm text-slate-400">
              Scan packages → best delivery order
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <MapPin className="h-4 w-4 text-emerald-400" />
          Start from
        </label>
        <div className="flex gap-2">
          <input
            value={startAddress}
            onChange={(e) => {
              setStartAddress(e.target.value);
              setStartCoords(null);
              setOptimizedIds(null);
            }}
            placeholder="Your depot or home"
            className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950 px-3 py-3 text-base outline-none ring-emerald-500/40 focus:ring-2"
          />
          <button
            type="button"
            onClick={useMyLocation}
            className="shrink-0 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium"
          >
            GPS
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
        <p className="mb-3 text-sm font-medium text-slate-300">Add stops</p>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                addStop(draft);
                setDraft("");
              }
            }}
            placeholder="123 Main St, Abbotsford BC"
            className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950 px-3 py-3 text-base outline-none ring-emerald-500/40 focus:ring-2"
          />
          <button
            type="button"
            onClick={() => {
              if (addStop(draft)) setDraft("");
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white"
            aria-label="Add stop"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 py-3 text-sm font-medium"
          >
            <Camera className="h-4 w-4" />
            Scan QR / barcode
          </button>
          <button
            type="button"
            onClick={() => setShowBulk(!showBulk)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 py-3 text-sm font-medium"
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste list
          </button>
        </div>

        {showBulk && (
          <div className="mt-3 space-y-2">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={4}
              placeholder={"One address per line\n456 Oak Ave, Surrey BC\n789 Pine Rd, Langley BC"}
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm outline-none ring-emerald-500/40 focus:ring-2"
            />
            <button
              type="button"
              onClick={handleBulkPaste}
              className="w-full rounded-xl bg-slate-700 py-2 text-sm font-medium"
            >
              Add all addresses
            </button>
          </div>
        )}
      </section>

      {stops.length > 0 && (
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">
              Stops ({orderedStops.length})
              {optimizedIds && (
                <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                  optimized
                </span>
              )}
            </p>
            {totalKm != null && (
              <span className="text-xs text-slate-400">~{totalKm.toFixed(1)} km</span>
            )}
          </div>
          <ol className="space-y-2">
            {orderedStops.map((stop, i) => (
              <li
                key={stop.id}
                className="flex items-start gap-3 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/30 text-sm font-bold text-emerald-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{stop.address}</p>
                  {stop.geocodeError && (
                    <p className="mt-1 text-xs text-amber-400">{stop.geocodeError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-red-400"
                  aria-label="Remove stop"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {startCoords && routePoints.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-700/80">
          <Suspense
            fallback={
              <div className="flex h-48 items-center justify-center bg-slate-900 text-sm text-slate-400">
                Loading map…
              </div>
            }
          >
            <RouteMap start={startCoords} stops={routePoints} />
          </Suspense>
        </section>
      )}

      <div className="sticky bottom-4 mt-auto flex flex-col gap-2">
        {status && (
          <p className="rounded-xl bg-slate-800/90 px-3 py-2 text-center text-sm text-slate-300">
            {status}
          </p>
        )}

        <button
          type="button"
          disabled={busy || stops.length === 0}
          onClick={geocodeAll}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-800 py-4 text-base font-semibold disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
          Map addresses
        </button>

        <button
          type="button"
          disabled={busy || stops.length < 2}
          onClick={optimize}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-semibold text-white disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
          Optimize route
        </button>

        {optimizedIds && routePoints.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openGoogleMaps}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-semibold text-white"
            >
              <Navigation className="h-4 w-4" />
              Google Maps
            </button>
            <button
              type="button"
              onClick={openAppleMaps}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-700 py-4 text-sm font-semibold text-white"
            >
              <Navigation className="h-4 w-4" />
              Apple Maps
            </button>
          </div>
        )}
      </div>

      {showScanner && (
        <ScannerModal onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}

      <footer className="text-center text-xs text-slate-500">
        Free & offline-friendly · Geocoding via OpenStreetMap
      </footer>
    </div>
  );
}
