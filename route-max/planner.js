/* global RouteMax, L */
const engine = RouteMax;
const storage = RouteMax;

let library = storage.loadLibrary();
let mapInstance = null;
let mapLayer = null;
let mapLoaded = false;
let csvImportMode = "merge";
let selectedStopId = null;

const elements = {
  toast: document.querySelector("#toast"),
  tripForm: document.querySelector("#tripForm"),
  stopForm: document.querySelector("#stopForm"),
  stopList: document.querySelector("#stopList"),
  emptyStops: document.querySelector("#emptyStops"),
  clearStops: document.querySelector("#clearStops"),
  optimizeStops: document.querySelector("#optimizeStops"),
  exportRoute: document.querySelector("#exportRoute"),
  importCsv: document.querySelector("#importCsv"),
  replaceCsv: document.querySelector("#replaceCsv"),
  importJson: document.querySelector("#importJson"),
  exportJson: document.querySelector("#exportJson"),
  newRoute: document.querySelector("#newRoute"),
  routeLibrary: document.querySelector("#routeLibrary"),
  routeWarnings: document.querySelector("#routeWarnings"),
  routeTimeline: document.querySelector("#routeTimeline"),
  routeSummaryPill: document.querySelector("#routeSummaryPill"),
  checklistItems: document.querySelector("#checklistItems"),
  checklistProgress: document.querySelector("#checklistProgress"),
  summaryMiles: document.querySelector("#summaryMiles"),
  summaryTime: document.querySelector("#summaryTime"),
  summaryFuel: document.querySelector("#summaryFuel"),
  summaryProgress: document.querySelector("#summaryProgress"),
  summaryCostPerStop: document.querySelector("#summaryCostPerStop"),
  summaryFinish: document.querySelector("#summaryFinish"),
  summaryEfficiency: document.querySelector("#summaryEfficiency"),
  displayTripName: document.querySelector("#displayTripName"),
  displayRoute: document.querySelector("#displayRoute"),
  fuelGallons: document.querySelector("#fuelGallons"),
  restWindows: document.querySelector("#restWindows"),
  costPerMile: document.querySelector("#costPerMile"),
  serviceMinutes: document.querySelector("#serviceMinutes"),
  routeHealth: document.querySelector("#routeHealth"),
  openMaps: document.querySelector("#openMaps"),
  voiceStop: document.querySelector("#voiceStop"),
  refreshMap: document.querySelector("#refreshMap"),
  routeMap: document.querySelector("#routeMap"),
  mapHint: document.querySelector("#mapHint"),
};

function getState() {
  return engine.getActiveRoute(library).state;
}

function setState(nextState) {
  library = storage.updateActiveRouteState(library, nextState);
  storage.schedulePersist(library);
}

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  elements.toast.classList.toggle("toast--error", isError);
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 3200);
}

function hydrateForm() {
  const state = getState();
  for (const field of [
    "tripName",
    "startCity",
    "endCity",
    "totalMiles",
    "avgSpeed",
    "mpg",
    "gasPrice",
    "startTime",
    "bufferMinutes",
  ]) {
    const input = elements.tripForm.elements[field];
    if (input) input.value = state[field];
  }
}

function renderLibrary() {
  elements.routeLibrary.innerHTML = library.routes
    .map(
      (route) => `
      <article class="library-card ${route.id === library.activeRouteId ? "library-card--active" : ""}">
        <button type="button" class="library-card__select" data-select-route="${escapeAttribute(route.id)}">
          <strong>${escapeHtml(route.name)}</strong>
          <span>${route.state.stops.length} stops</span>
        </button>
        ${
          library.routes.length > 1
            ? `<button type="button" class="library-card__delete" data-delete-route="${escapeAttribute(route.id)}" aria-label="Delete route">&times;</button>`
            : ""
        }
      </article>
    `,
    )
    .join("");
}

function render() {
  const state = getState();
  const route = engine.buildRoute(state, state.stops);
  const metrics = engine.getMetrics(state, state.stops, route);

  renderLibrary();
  renderSummary(state, route, metrics);
  renderStops(state, route);
  renderTimeline(state, route, metrics);
  renderChecklist(state);
  renderMap(state, route);
}

function renderSummary(state, route, metrics) {
  elements.summaryMiles.textContent = engine.formatNumber(metrics.miles);
  elements.summaryTime.textContent = engine.formatHours(metrics.totalHours);
  elements.summaryFuel.textContent = engine.formatCurrency(metrics.fuelCost);
  elements.summaryProgress.textContent = `${metrics.progress}%`;
  elements.summaryCostPerStop.textContent = engine.formatCurrency(metrics.costPerStop);
  elements.summaryFinish.textContent = metrics.finishTime;
  elements.summaryEfficiency.textContent = `${metrics.efficiencyScore}/100`;
  elements.displayTripName.textContent = state.tripName;
  elements.displayRoute.textContent = `${state.startCity} to ${state.endCity}`;
  elements.fuelGallons.textContent = `${engine.formatNumber(metrics.gallons, 1)} gal`;
  elements.restWindows.textContent = `${metrics.suggestedRestWindows} suggested`;
  elements.costPerMile.textContent = engine.formatCurrency(metrics.perMile);
  elements.serviceMinutes.textContent = engine.formatHours(metrics.serviceMinutes / 60);
  elements.routeHealth.textContent = engine.getRouteHealth(route.warnings, state.stops);
  elements.openMaps.href = engine.buildMapsUrl(state, state.stops);
}

function renderStops(state, route) {
  elements.stopList.innerHTML = "";
  elements.emptyStops.hidden = state.stops.length > 0;
  elements.routeWarnings.hidden = route.warnings.length === 0;
  elements.routeWarnings.innerHTML = route.warnings.map((warning) => `<p>${escapeHtml(warning)}</p>`).join("");

  for (const item of route.items) {
    const stop = item.stop;
    const entry = document.createElement("li");
    entry.className = `stop-card stop-card--${stop.status} ${selectedStopId === stop.id ? "stop-card--selected" : ""}`;
    entry.innerHTML = `
      <div class="stop-card__main">
        <div class="stop-card__title-row">
          <h3>${escapeHtml(stop.name)}</h3>
          <span class="tag tag--${stop.priority.toLowerCase()}">${escapeHtml(stop.priority)}</span>
        </div>
        ${stop.address ? `<p>${escapeHtml(stop.address)}</p>` : ""}
        <p>Mile ${engine.formatNumber(stop.mile)} &bull; ${escapeHtml(stop.type)} &bull; ${stop.serviceMinutes}m service</p>
        <p>ETA ${engine.formatClock(item.arrival)} &bull; done ${engine.formatClock(item.departure)} &bull; ${engine.distanceUntilStop(state.totalMiles, stop.mile)}</p>
        ${stop.windowStart || stop.windowEnd ? `<p>Window ${escapeHtml(stop.windowStart || "--")} to ${escapeHtml(stop.windowEnd || "--")}</p>` : ""}
        ${stop.notes ? `<p class="stop-notes">${escapeHtml(stop.notes)}</p>` : ""}
        ${stop.photoDataUrl ? `<img class="stop-photo" src="${escapeAttribute(stop.photoDataUrl)}" alt="Proof of delivery for ${escapeAttribute(stop.name)}" />` : ""}
      </div>
      <div class="stop-actions">
        <button class="status-button status-button--${stop.status}" type="button" data-cycle-status="${escapeAttribute(stop.id)}">
          ${engine.statusLabel(stop.status)}
        </button>
        <button class="ghost-button" type="button" data-select-stop="${escapeAttribute(stop.id)}">Map</button>
        <button class="delete-stop" type="button" aria-label="Delete ${escapeAttribute(stop.name)}" data-delete-stop="${escapeAttribute(stop.id)}">
          &times;
        </button>
      </div>
    `;
    elements.stopList.append(entry);
  }
}

function renderTimeline(state, route, metrics) {
  elements.routeSummaryPill.textContent = `${state.stops.length} stops &bull; ${metrics.progress}% complete`;
  elements.routeTimeline.innerHTML = "";

  if (route.items.length === 0) {
    elements.routeTimeline.innerHTML = '<p class="empty-state">Add stops to see the dispatch timeline.</p>';
    return;
  }

  for (const item of route.items) {
    const row = document.createElement("article");
    row.className = "timeline-item";
    row.innerHTML = `
      <span class="timeline-item__time">${engine.formatClock(item.arrival)}</span>
      <div>
        <strong>${escapeHtml(item.stop.name)}</strong>
        <p>${escapeHtml(item.stop.type)} at mile ${engine.formatNumber(item.stop.mile)} &bull; ${engine.statusLabel(item.stop.status)}</p>
      </div>
    `;
    elements.routeTimeline.append(row);
  }
}

function renderChecklist(state) {
  const completed = new Set(state.completedChecklist.filter((item) => engine.CHECKLIST.includes(item)));
  elements.checklistItems.innerHTML = "";

  for (const item of engine.CHECKLIST) {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" data-checklist-item="${escapeAttribute(item)}" ${completed.has(item) ? "checked" : ""} />
      <span>${escapeHtml(item)}</span>
    `;
    elements.checklistItems.append(label);
  }

  elements.checklistProgress.textContent = `${completed.size} / ${engine.CHECKLIST.length} ready`;
}

async function ensureMapLoaded() {
  if (mapLoaded) return true;
  await new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.onload = resolve;
    css.onerror = reject;
    document.head.append(css);
  });
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  mapLoaded = true;
  return true;
}

async function renderMap(state, route) {
  const geocoded = state.stops.filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
  if (!geocoded.length) {
    elements.mapHint.textContent = "Add addresses and geocode stops to see pins. Mile-only stops stay on the timeline.";
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      mapLayer = null;
    }
    elements.routeMap.innerHTML = '<p class="empty-state">No geocoded stops yet.</p>';
    return;
  }

  try {
    await ensureMapLoaded();
  } catch {
    elements.mapHint.textContent = "Map could not load. Check your connection and try Refresh map.";
    return;
  }

  if (!mapInstance) {
    elements.routeMap.innerHTML = "";
    mapInstance = L.map(elements.routeMap).setView([geocoded[0].lat, geocoded[0].lng], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);
    mapLayer = L.layerGroup().addTo(mapInstance);
  }

  mapLayer.clearLayers();
  const latLngs = [];

  route.items.forEach((item, index) => {
    const stop = item.stop;
    if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
    const latLng = [stop.lat, stop.lng];
    latLngs.push(latLng);
    const marker = L.marker(latLng).bindPopup(`<strong>${index + 1}. ${escapeHtml(stop.name)}</strong>`);
    if (selectedStopId === stop.id) marker.openPopup();
    marker.on("click", () => {
      selectedStopId = stop.id;
      render();
    });
    marker.addTo(mapLayer);
  });

  if (latLngs.length > 1) {
    L.polyline(latLngs, { color: "#ffb84d", weight: 4 }).addTo(mapLayer);
  }

  mapInstance.fitBounds(latLngs, { padding: [24, 24] });
  elements.mapHint.textContent = `${geocoded.length} geocoded stop(s) on map. Click a pin to focus a stop.`;
}

function persistAndRender() {
  storage.saveLibrary(library);
  hydrateForm();
  render();
}

function readText(form, field, fallback = "") {
  const value = String(form.get(field) ?? "").trim();
  return value || fallback;
}

function readNumber(form, field, fallback) {
  const number = Number(form.get(field));
  return Number.isFinite(number) ? number : fallback;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function geocodeStopAddress(stop) {
  if (!stop.address) return stop;
  try {
    const result = await RouteMax.geocodeAddress(stop.address);
    if (!result) {
      showToast(`Could not geocode ${stop.name}. Using mile marker only.`, true);
      return stop;
    }
    return { ...stop, lat: result.lat, lng: result.lng, address: result.displayName || stop.address };
  } catch {
    showToast("Geocoding unavailable right now.", true);
    return stop;
  }
}

function applyCsvImport(text, replace) {
  const result = engine.importCsv(text);
  const state = getState();
  if (result.errors.length) showToast(result.errors[0], true);
  if (!result.stops.length) return;

  state.stops = replace ? result.stops : [...state.stops, ...result.stops];
  state.stops = engine.optimizeStops(state.stops, { trip: state });
  setState(state);
  showToast(`${result.stops.length} stop(s) imported.`);
  persistAndRender();
}

hydrateForm();
render();
restoreHashRoute();

window.addEventListener("beforeunload", () => storage.saveLibrary(library));

elements.tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(elements.tripForm);
  const state = getState();
  state.tripName = readText(form, "tripName", "Route Max route");
  state.startCity = readText(form, "startCity", "Start");
  state.endCity = readText(form, "endCity", "Destination");
  state.totalMiles = Math.max(0, readNumber(form, "totalMiles", 0));
  state.avgSpeed = Math.max(1, readNumber(form, "avgSpeed", 1));
  state.mpg = Math.max(1, readNumber(form, "mpg", 1));
  state.gasPrice = Math.max(0, readNumber(form, "gasPrice", 0));
  state.startTime = readText(form, "startTime", "08:00");
  state.bufferMinutes = Math.max(0, readNumber(form, "bufferMinutes", 0));

  const errors = engine.validateTripInput(state);
  if (errors.length) {
    showToast(errors[0], true);
    return;
  }

  library = storage.renameActiveRoute(library, state.tripName);
  setState(state);
  persistAndRender();
});

elements.stopForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(elements.stopForm);
  let stop = engine.createStop({
    name: readText(form, "stopName", "New stop"),
    address: readText(form, "stopAddress", ""),
    mile: readNumber(form, "stopMile", 0),
    type: readText(form, "stopType", "Delivery"),
    priority: readText(form, "stopPriority", "Normal"),
    serviceMinutes: readNumber(form, "serviceMinutes", 8),
    windowStart: readText(form, "windowStart", ""),
    windowEnd: readText(form, "windowEnd", ""),
    notes: readText(form, "stopNotes", ""),
  });

  const errors = engine.validateStopInput(stop);
  if (errors.length) {
    showToast(errors[0], true);
    return;
  }

  const photoInput = elements.stopForm.querySelector("#stopPhoto");
  if (photoInput?.files?.[0]) {
    stop.photoDataUrl = await readFileAsDataUrl(photoInput.files[0]);
  }

  stop = await geocodeStopAddress(stop);
  const state = getState();
  state.stops.push(stop);
  state.stops = engine.optimizeStops(state.stops, { trip: state });
  setState(state);
  elements.stopForm.reset();
  elements.stopForm.elements.serviceMinutes.value = 8;
  persistAndRender();
});

elements.optimizeStops.addEventListener("click", () => {
  const state = getState();
  state.stops = engine.optimizeStops(state.stops, { trip: state, priorityWithinCluster: true });
  setState(state);
  persistAndRender();
});

elements.exportRoute.addEventListener("click", () => {
  const state = getState();
  const route = engine.buildRoute(state, state.stops);
  const csv = engine.exportCsv(state, route);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${engine.slugify(state.tripName)}-route.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

elements.clearStops.addEventListener("click", () => {
  const state = getState();
  state.stops = [];
  setState(state);
  persistAndRender();
});

elements.stopList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-stop]");
  const statusButton = event.target.closest("[data-cycle-status]");
  const selectButton = event.target.closest("[data-select-stop]");
  const state = getState();

  if (deleteButton) {
    state.stops = state.stops.filter((stop) => stop.id !== deleteButton.dataset.deleteStop);
    setState(state);
    persistAndRender();
    return;
  }

  if (statusButton) {
    const stop = state.stops.find((item) => item.id === statusButton.dataset.cycleStatus);
    if (!stop) return;
    stop.status = engine.nextStatus(stop.status);
    if (stop.status === "done" && !stop.completedAt) {
      stop.completedAt = new Date().toISOString();
    }
    setState(state);
    persistAndRender();
    return;
  }

  if (selectButton) {
    selectedStopId = selectButton.dataset.selectStop;
    document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" });
    render();
  }
});

elements.checklistItems.addEventListener("change", (event) => {
  if (!event.target.matches("[data-checklist-item]")) return;
  const state = getState();
  const item = event.target.dataset.checklistItem;
  const completed = new Set(state.completedChecklist.filter((entry) => engine.CHECKLIST.includes(entry)));
  if (event.target.checked) completed.add(item);
  else completed.delete(item);
  state.completedChecklist = [...completed];
  setState(state);
  persistAndRender();
});

elements.routeLibrary.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-route]");
  const deleteButton = event.target.closest("[data-delete-route]");
  if (selectButton) {
    library = storage.setActiveRoute(library, selectButton.dataset.selectRoute);
    selectedStopId = null;
    persistAndRender();
    return;
  }
  if (deleteButton) {
    library = storage.deleteRoute(library, deleteButton.dataset.deleteRoute);
    persistAndRender();
  }
});

elements.newRoute.addEventListener("click", () => {
  const name = window.prompt("Route name", "New route");
  if (!name) return;
  library = storage.addRoute(library, name);
  persistAndRender();
});

elements.exportJson.addEventListener("click", () => {
  const blob = new Blob([engine.exportJson(library)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "route-max-backup.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

elements.importJson.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const parsed = engine.importJson(text);
  if (parsed.errors.length) showToast(parsed.errors[0], true);
  library = parsed.library;
  persistAndRender();
  event.target.value = "";
});

elements.importCsv.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  applyCsvImport(await file.text(), csvImportMode === "replace");
  event.target.value = "";
});

elements.replaceCsv.addEventListener("click", () => {
  csvImportMode = "replace";
  elements.importCsv.click();
  csvImportMode = "merge";
});

elements.refreshMap.addEventListener("click", () => render());

elements.voiceStop.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Voice input is not supported in this browser.", true);
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const stop = engine.parseVoiceStop(transcript);
    if (!stop) return;
    elements.stopForm.elements.stopName.value = stop.name;
    elements.stopForm.elements.stopMile.value = String(stop.mile);
    showToast(`Voice captured: ${stop.name}`);
  };
  recognition.onerror = () => showToast("Voice capture failed.", true);
  recognition.start();
  showToast("Listening… say stop name and mile marker.");
});

function restoreHashRoute() {
  if (!location.hash.startsWith("#route=")) return;
  try {
    const encoded = location.hash.slice("#route=".length);
    const parsed = engine.importJson(decodeURIComponent(encoded));
    library = parsed.library;
    persistAndRender();
  } catch {
    showToast("Shared route link is invalid.", true);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
