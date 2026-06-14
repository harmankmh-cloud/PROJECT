(function attachRouteEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.RouteMax = root.RouteMax || {};
  Object.assign(root.RouteMax, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function routeEngineFactory() {
  const SCHEMA_VERSION = 2;

  const CHECKLIST = [
    "Confirm vehicle inspection",
    "Load packages in route order",
    "Charge phone and scanner",
    "Download offline maps",
    "Confirm customer notes",
    "Pack water and snacks",
    "Review weather and traffic",
    "Share route ETA",
  ];

  const CSV_HEADERS = [
    "name",
    "address",
    "mile",
    "type",
    "priority",
    "serviceMinutes",
    "windowStart",
    "windowEnd",
    "notes",
    "status",
    "completedAt",
  ];

  const defaultTrip = {
    tripName: "Morning delivery route",
    startCity: "Warehouse",
    endCity: "Home base",
    totalMiles: 168,
    avgSpeed: 38,
    mpg: 24,
    gasPrice: 3.69,
    startTime: "08:00",
    bufferMinutes: 5,
    startLat: null,
    startLng: null,
  };

  const defaultStops = [
    createStop({ name: "Northside pharmacy", mile: 18, type: "Delivery", priority: "High", serviceMinutes: 8 }),
    createStop({ name: "Riverside pickup", mile: 42, type: "Pickup", priority: "Normal", serviceMinutes: 10 }),
    createStop({ name: "Airport fuel stop", mile: 73, type: "Fuel", priority: "Low", serviceMinutes: 12 }),
    createStop({ name: "West end office park", mile: 118, type: "Delivery", priority: "High", serviceMinutes: 9 }),
  ];

  function createId() {
    if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function createStop(input) {
    return normalizeStop({ id: createId(), status: "pending", ...input });
  }

  function createDefaultRouteState() {
    return normalizeTripState({
      ...defaultTrip,
      stops: defaultStops.map((stop) => ({ ...stop, id: createId() })),
      completedChecklist: ["Download offline maps", "Charge phone and scanner"],
    });
  }

  function normalizeTripState(nextState) {
    const state = { ...nextState };
    state.tripName = clampString(state.tripName || "Route Max route", 120);
    state.startCity = clampString(state.startCity || "Start", 120);
    state.endCity = clampString(state.endCity || "Destination", 120);
    state.totalMiles = Math.max(0, Number(state.totalMiles) || 0);
    state.avgSpeed = Math.max(1, Number(state.avgSpeed) || 1);
    state.mpg = Math.max(1, Number(state.mpg) || 1);
    state.gasPrice = Math.max(0, Number(state.gasPrice) || 0);
    state.bufferMinutes = Math.max(0, Number(state.bufferMinutes) || 0);
    state.startTime = isValidTime(state.startTime) ? state.startTime : "08:00";
    state.startLat = toCoord(state.startLat);
    state.startLng = toCoord(state.startLng);
    state.stops = Array.isArray(state.stops) ? state.stops.map(normalizeStop) : [];
    state.completedChecklist = Array.isArray(state.completedChecklist)
      ? state.completedChecklist.filter((item) => CHECKLIST.includes(item))
      : [];
    return state;
  }

  function toCoord(value) {
    if (value == null || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function normalizeStop(stop) {
    const normalized = {
      id: stop.id || createId(),
      name: clampString(stop.name || "Unnamed stop", 120),
      address: clampString(stop.address || "", 240),
      mile: Math.max(0, Number(stop.mile) || 0),
      lat: toCoord(stop.lat),
      lng: toCoord(stop.lng),
      type: clampString(stop.type || "Delivery", 40),
      priority: ["High", "Normal", "Low"].includes(stop.priority) ? stop.priority : "Normal",
      serviceMinutes: Math.max(0, Number(stop.serviceMinutes) || 0),
      windowStart: isValidTime(stop.windowStart) ? stop.windowStart : "",
      windowEnd: isValidTime(stop.windowEnd) ? stop.windowEnd : "",
      notes: clampString(stop.notes || "", 500),
      photoDataUrl: typeof stop.photoDataUrl === "string" ? stop.photoDataUrl.slice(0, 500000) : "",
      completedAt: clampString(stop.completedAt || "", 40),
      status: ["pending", "done", "skipped"].includes(stop.status) ? stop.status : "pending",
    };
    return normalized;
  }

  function clampString(value, max) {
    return String(value || "").trim().slice(0, max);
  }

  function isValidTime(value) {
    return /^\d{2}:\d{2}$/.test(String(value || ""));
  }

  function validateTripInput(trip) {
    const errors = [];
    if (!trip.tripName) errors.push("Trip name is required.");
    if (trip.totalMiles < 0) errors.push("Miles cannot be negative.");
    if (trip.avgSpeed < 1) errors.push("Average speed must be at least 1 mph.");
    return errors;
  }

  function validateStopInput(stop) {
    const errors = [];
    if (!stop.name) errors.push("Stop name is required.");
    if (stop.mile < 0) errors.push("Mile marker cannot be negative.");
    if (stop.windowStart && stop.windowEnd && parseTime(stop.windowStart) > parseTime(stop.windowEnd)) {
      errors.push("Time window start must be before end.");
    }
    return errors;
  }

  function buildRoute(trip, stops) {
    const speed = Math.max(1, Number(trip.avgSpeed) || 1);
    const totalMiles = Math.max(0, Number(trip.totalMiles) || 0);
    const buffer = Math.max(0, Number(trip.bufferMinutes) || 0);
    let currentMinute = parseTime(trip.startTime);
    let previousMile = 0;
    const warnings = [];

    const items = stops.map((stop, index) => {
      const legMiles = Math.max(0, stop.mile - previousMile);
      const travelMinutes = (legMiles / speed) * 60;
      const arrival = currentMinute + travelMinutes;
      const departure = arrival + stop.serviceMinutes + buffer;
      previousMile = stop.mile;
      currentMinute = departure;

      if (index > 0 && stop.mile < stops[index - 1].mile) {
        warnings.push(`${stop.name} is out of mile order. Use Optimize to clean it up.`);
      }
      if (stop.mile > totalMiles) {
        warnings.push(`${stop.name} is beyond the route total miles.`);
      }
      if (stop.windowStart && arrival < parseTime(stop.windowStart)) {
        warnings.push(`${stop.name} ETA ${formatClock(arrival)} is before window (${stop.windowStart}).`);
      }
      if (stop.windowEnd && arrival > parseTime(stop.windowEnd)) {
        warnings.push(`${stop.name} ETA ${formatClock(arrival)} misses window (by ${stop.windowEnd}).`);
      }

      return { stop, arrival, departure };
    });

    const latePriority = items.find(
      (item) => item.stop.priority === "High" && item.arrival - parseTime(trip.startTime) > 240,
    );
    if (latePriority) {
      warnings.push(`${latePriority.stop.name} is high priority but lands more than 4 hours into the route.`);
    }

    return { items, warnings };
  }

  function getMetrics(trip, stops, route) {
    const miles = Math.max(0, Number(trip.totalMiles) || 0);
    const speed = Math.max(1, Number(trip.avgSpeed) || 1);
    const mpg = Math.max(1, Number(trip.mpg) || 1);
    const gasPrice = Math.max(0, Number(trip.gasPrice) || 0);
    const serviceMinutes = stops.reduce((sum, stop) => sum + stop.serviceMinutes, 0);
    const driveHours = miles / speed;
    const totalHours = driveHours + serviceMinutes / 60;
    const gallons = miles / mpg;
    const fuelCost = gallons * gasPrice;
    const progress = getRouteProgress(stops);
    const suggestedRestWindows = Math.max(0, Math.floor(totalHours / 3.5));
    const perMile = miles > 0 ? fuelCost / miles : 0;
    const costPerStop = stops.length > 0 ? fuelCost / stops.length : 0;
    const finishMinute = route?.items?.length
      ? route.items[route.items.length - 1].departure
      : parseTime(trip.startTime);
    const efficiencyScore = Math.max(
      0,
      Math.min(100, Math.round(100 - (route?.warnings?.length || 0) * 12 - (100 - progress) * 0.2)),
    );

    return {
      miles,
      driveHours,
      totalHours,
      gallons,
      fuelCost,
      serviceMinutes,
      progress,
      suggestedRestWindows,
      perMile,
      costPerStop,
      finishTime: formatClock(finishMinute),
      efficiencyScore,
    };
  }

  function getRouteProgress(stops) {
    if (!stops.length) return 0;
    const completed = stops.filter((stop) => stop.status === "done" || stop.status === "skipped").length;
    return Math.round((completed / stops.length) * 100);
  }

  function getRouteHealth(warnings, stops) {
    if (warnings.length > 0) return `${warnings.length} warning${warnings.length === 1 ? "" : "s"}`;
    if (!stops.length) return "Add stops";
    return "Clean";
  }

  function optimizeStops(stops, options = {}) {
    const priorityWithinCluster = Boolean(options.priorityWithinCluster);
    const trip = options.trip || {};
    const normalized = stops.map(normalizeStop);

    if (!normalized.some((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))) {
      return [...normalized].sort((left, right) => {
        const mileDiff = left.mile - right.mile;
        if (priorityWithinCluster && Math.abs(mileDiff) <= 15) {
          return priorityScore(right.priority) - priorityScore(left.priority) || mileDiff;
        }
        return mileDiff;
      });
    }

    return optimizeWithCoordinates(normalized, trip.startLat, trip.startLng, priorityWithinCluster);
  }

  function compareStops(left, right, priorityWithinCluster) {
    const mileDiff = left.mile - right.mile;
    if (priorityWithinCluster && Math.abs(mileDiff) <= 15) {
      return priorityScore(right.priority) - priorityScore(left.priority) || mileDiff;
    }
    const leftPenalty = windowPenalty(left);
    const rightPenalty = windowPenalty(right);
    if (leftPenalty !== rightPenalty) return leftPenalty - rightPenalty;
    return mileDiff;
  }

  function windowPenalty(stop) {
    if (stop.priority === "High") return 0;
    if (stop.windowStart || stop.windowEnd) return 1;
    return 2;
  }

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function optimizeWithCoordinates(stops, startLat, startLng, priorityWithinCluster) {
    const geocoded = stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
    const nonGeocoded = stops.filter((stop) => !Number.isFinite(stop.lat) || !Number.isFinite(stop.lng));

    if (geocoded.length === 0) {
      return [...stops].sort((left, right) => compareStops(left, right, priorityWithinCluster));
    }

    let currentLat = Number.isFinite(startLat) ? startLat : geocoded[0].lat;
    let currentLng = Number.isFinite(startLng) ? startLng : geocoded[0].lng;
    const remaining = [...geocoded];
    const ordered = [];

    while (remaining.length) {
      let bestIndex = 0;
      let bestScore = Number.POSITIVE_INFINITY;
      for (let index = 0; index < remaining.length; index += 1) {
        const stop = remaining[index];
        const distance = haversineDistance(currentLat, currentLng, stop.lat, stop.lng);
        const score = distance - priorityScore(stop.priority) * 0.05 + windowPenalty(stop) * 0.2;
        if (score < bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      }
      const [next] = remaining.splice(bestIndex, 1);
      ordered.push(next);
      currentLat = next.lat;
      currentLng = next.lng;
    }

    let optimized = twoOptImprove(ordered, startLat, startLng);
    optimized = optimized.map((stop, index) => ({
      ...stop,
      mile: stop.mile || index * 10 + 10,
    }));

    if (nonGeocoded.length) {
      optimized = [...optimized, ...nonGeocoded.sort((left, right) => compareStops(left, right, priorityWithinCluster))];
    }

    if (priorityWithinCluster) {
      optimized = bubblePriorityClusters(optimized);
    }

    return optimized;
  }

  function routeLength(stops, startLat, startLng) {
    if (!stops.length) return 0;
    let total = 0;
    let lat = Number.isFinite(startLat) ? startLat : stops[0].lat;
    let lng = Number.isFinite(startLng) ? startLng : stops[0].lng;
    for (const stop of stops) {
      total += haversineDistance(lat, lng, stop.lat, stop.lng);
      lat = stop.lat;
      lng = stop.lng;
    }
    return total;
  }

  function twoOptImprove(stops, startLat, startLng) {
    if (stops.length < 4) return stops;
    let best = [...stops];
    let bestLength = routeLength(best, startLat, startLng);
    let improved = true;

    while (improved) {
      improved = false;
      for (let i = 0; i < best.length - 1; i += 1) {
        for (let k = i + 1; k < best.length; k += 1) {
          const candidate = [...best.slice(0, i), ...best.slice(i, k + 1).reverse(), ...best.slice(k + 1)];
          const candidateLength = routeLength(candidate, startLat, startLng);
          if (candidateLength + 0.001 < bestLength) {
            best = candidate;
            bestLength = candidateLength;
            improved = true;
          }
        }
      }
    }

    return best;
  }

  function bubblePriorityClusters(stops) {
    const copy = [...stops];
    for (let i = 1; i < copy.length; i += 1) {
      const prev = copy[i - 1];
      const current = copy[i];
      if (Math.abs(current.mile - prev.mile) <= 15 && priorityScore(current.priority) > priorityScore(prev.priority)) {
        copy[i - 1] = current;
        copy[i] = prev;
      }
    }
    return copy;
  }

  function buildMapsUrl(trip, stops) {
    const waypoints = stops.slice(0, 8).map((stop) => stop.address || stop.name).join("|");
    const params = new URLSearchParams({
      api: "1",
      origin: trip.startCity || "Start",
      destination: trip.endCity || "Destination",
      travelmode: "driving",
    });
    if (waypoints) params.set("waypoints", waypoints);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  function exportCsv(trip, route) {
    const rows = [
      CSV_HEADERS,
      ...route.items.map((item) => [
        item.stop.name,
        item.stop.address,
        item.stop.mile,
        item.stop.type,
        item.stop.priority,
        item.stop.serviceMinutes,
        item.stop.windowStart,
        item.stop.windowEnd,
        item.stop.notes,
        statusLabel(item.stop.status),
        item.stop.completedAt,
      ]),
    ];
    return rows.map((row) => row.map(csvCell).join(",")).join("\n");
  }

  function importCsv(text) {
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return { stops: [], errors: ["CSV is empty."] };

    const header = parseCsvLine(lines[0]).map((cell) => cell.toLowerCase());
    const hasHeader = header.includes("name") || header.includes("stop");
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const stops = [];
    const errors = [];

    for (const line of dataLines) {
      const cells = parseCsvLine(line);
      const stop = createStop({
        name: pickCell(cells, header, ["name", "stop"], cells[0] || "Imported stop"),
        address: pickCell(cells, header, ["address"], cells[1] || ""),
        mile: Number(pickCell(cells, header, ["mile", "milemarker"], cells[2] || 0)) || 0,
        type: pickCell(cells, header, ["type"], cells[3] || "Delivery"),
        priority: pickCell(cells, header, ["priority"], cells[4] || "Normal"),
        serviceMinutes: Number(pickCell(cells, header, ["serviceminutes", "service"], cells[5] || 8)) || 8,
        windowStart: pickCell(cells, header, ["windowstart", "earliest"], cells[6] || ""),
        windowEnd: pickCell(cells, header, ["windowend", "latest"], cells[7] || ""),
        notes: pickCell(cells, header, ["notes"], cells[8] || ""),
      });
      const validationErrors = validateStopInput(stop);
      if (validationErrors.length) {
        errors.push(`${stop.name}: ${validationErrors.join(" ")}`);
        continue;
      }
      stops.push(stop);
    }

    return { stops, errors };
  }

  function pickCell(cells, header, keys, fallback) {
    for (const key of keys) {
      const index = header.indexOf(key);
      if (index >= 0 && cells[index] !== undefined && cells[index] !== "") {
        return cells[index];
      }
    }
    return fallback;
  }

  function parseCsvLine(line) {
    const cells = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    return cells;
  }

  function exportJson(library) {
    return JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...library }, null, 2);
  }

  function importJson(text) {
    try {
      const parsed = JSON.parse(String(text || ""));
      if (parsed.routes && parsed.activeRouteId) {
        return { library: normalizeLibrary(parsed), errors: [] };
      }
      if (parsed.stops || parsed.tripName) {
        return {
          library: normalizeLibrary({
            activeRouteId: createId(),
            routes: [{ id: createId(), name: parsed.tripName || "Imported route", state: normalizeTripState(parsed) }],
          }),
          errors: [],
        };
      }
      return { library: normalizeLibrary(createDefaultLibrary()), errors: [] };
    } catch {
      return { library: createDefaultLibrary(), errors: ["Invalid JSON backup."] };
    }
  }

  function createDefaultLibrary() {
    const routeId = createId();
    return {
      schemaVersion: SCHEMA_VERSION,
      activeRouteId: routeId,
      routes: [{ id: routeId, name: "Morning delivery route", state: createDefaultRouteState() }],
    };
  }

  function normalizeLibrary(raw) {
    const library = {
      schemaVersion: SCHEMA_VERSION,
      activeRouteId: raw.activeRouteId || createId(),
      routes: Array.isArray(raw.routes)
        ? raw.routes.map((route) => ({
            id: route.id || createId(),
            name: clampString(route.name || "Route", 120),
            state: normalizeTripState(route.state || route),
          }))
        : [],
    };
    if (!library.routes.length) {
      const routeId = createId();
      library.routes = [{ id: routeId, name: "Route Max route", state: createDefaultRouteState() }];
      library.activeRouteId = routeId;
    }
    if (!library.routes.some((route) => route.id === library.activeRouteId)) {
      library.activeRouteId = library.routes[0].id;
    }
    return library;
  }

  function getActiveRoute(library) {
    return library.routes.find((route) => route.id === library.activeRouteId) || library.routes[0];
  }

  function setActiveRoute(library, routeId) {
    if (!library.routes.some((route) => route.id === routeId)) return library;
    return { ...library, activeRouteId: routeId };
  }

  function addRoute(library, name) {
    const id = createId();
    return normalizeLibrary({
      ...library,
      routes: [
        ...library.routes,
        { id, name: clampString(name, 120) || "New route", state: createDefaultRouteState() },
      ],
      activeRouteId: id,
    });
  }

  function deleteRoute(library, routeId) {
    if (library.routes.length <= 1) return library;
    const routes = library.routes.filter((route) => route.id !== routeId);
    return normalizeLibrary({
      ...library,
      routes,
      activeRouteId: library.activeRouteId === routeId ? routes[0].id : library.activeRouteId,
    });
  }

  function parseVoiceStop(text) {
    const raw = String(text || "").trim();
    if (!raw) return null;
    const mileMatch = raw.match(/(?:mile|mi)\s*(\d+(?:\.\d+)?)/i);
    const mile = mileMatch ? Number(mileMatch[1]) : 0;
    const name = raw.replace(/(?:mile|mi)\s*\d+(?:\.\d+)?/i, "").trim() || raw;
    return createStop({ name, mile });
  }

  function nextStatus(status) {
    if (status === "pending") return "done";
    if (status === "done") return "skipped";
    return "pending";
  }

  function statusLabel(status) {
    return { pending: "Pending", done: "Done", skipped: "Skipped" }[status] || "Pending";
  }

  function priorityScore(priority) {
    return { High: 3, Normal: 2, Low: 1 }[priority] || 2;
  }

  function parseTime(value) {
    const [hours, minutes] = String(value || "08:00").split(":").map(Number);
    return (Number.isFinite(hours) ? hours : 8) * 60 + (Number.isFinite(minutes) ? minutes : 0);
  }

  function formatClock(totalMinutes) {
    const minutesInDay = 24 * 60;
    const normalized = ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  function formatHours(hours) {
    const safeHours = Math.max(0, hours);
    const wholeHours = Math.floor(safeHours);
    const minutes = Math.round((safeHours - wholeHours) * 60);
    if (wholeHours === 0) return `${minutes}m`;
    if (minutes === 0) return `${wholeHours}h`;
    return `${wholeHours}h ${minutes}m`;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: value < 10 ? 2 : 0,
    }).format(value);
  }

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
  }

  function csvCell(value) {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "route-max";
  }

  function distanceUntilStop(totalMiles, mile) {
    const remaining = Math.max(0, totalMiles - mile);
    return `${formatNumber(remaining)} mi left`;
  }

  return {
    SCHEMA_VERSION,
    CHECKLIST,
    CSV_HEADERS,
    createId,
    createStop,
    createDefaultRouteState,
    createDefaultLibrary,
    normalizeTripState,
    normalizeStop,
    normalizeLibrary,
    validateTripInput,
    validateStopInput,
    buildRoute,
    getMetrics,
    getRouteProgress,
    getRouteHealth,
    optimizeStops,
    buildMapsUrl,
    exportCsv,
    importCsv,
    exportJson,
    importJson,
    getActiveRoute,
    setActiveRoute,
    addRoute,
    deleteRoute,
    parseVoiceStop,
    nextStatus,
    statusLabel,
    priorityScore,
    parseTime,
    formatClock,
    formatHours,
    formatCurrency,
    formatNumber,
    slugify,
    distanceUntilStop,
    haversineDistance,
  };
});
