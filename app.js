const STORAGE_KEY = "route-max-state";
const LEGACY_STORAGE_KEY = "road-warrior-state";

const checklist = [
  "Confirm vehicle inspection",
  "Load packages in route order",
  "Charge phone and scanner",
  "Download offline maps",
  "Confirm customer notes",
  "Pack water and snacks",
  "Review weather and traffic",
  "Share route ETA",
];

const defaultState = {
  tripName: "Morning delivery route",
  startCity: "Warehouse",
  endCity: "Home base",
  totalMiles: 168,
  avgSpeed: 38,
  mpg: 24,
  gasPrice: 3.69,
  startTime: "08:00",
  bufferMinutes: 5,
  stops: [
    createStop("Northside pharmacy", 18, "Delivery", "High", 8),
    createStop("Riverside pickup", 42, "Pickup", "Normal", 10),
    createStop("Airport fuel stop", 73, "Fuel", "Low", 12),
    createStop("West end office park", 118, "Delivery", "High", 9),
  ],
  completedChecklist: ["Download offline maps", "Charge phone and scanner"],
};

const state = loadState();
const elements = {
  tripForm: document.querySelector("#tripForm"),
  stopForm: document.querySelector("#stopForm"),
  stopList: document.querySelector("#stopList"),
  emptyStops: document.querySelector("#emptyStops"),
  clearStops: document.querySelector("#clearStops"),
  optimizeStops: document.querySelector("#optimizeStops"),
  exportRoute: document.querySelector("#exportRoute"),
  routeWarnings: document.querySelector("#routeWarnings"),
  routeTimeline: document.querySelector("#routeTimeline"),
  routeSummaryPill: document.querySelector("#routeSummaryPill"),
  checklistItems: document.querySelector("#checklistItems"),
  checklistProgress: document.querySelector("#checklistProgress"),
  summaryMiles: document.querySelector("#summaryMiles"),
  summaryTime: document.querySelector("#summaryTime"),
  summaryFuel: document.querySelector("#summaryFuel"),
  summaryProgress: document.querySelector("#summaryProgress"),
  displayTripName: document.querySelector("#displayTripName"),
  displayRoute: document.querySelector("#displayRoute"),
  fuelGallons: document.querySelector("#fuelGallons"),
  restWindows: document.querySelector("#restWindows"),
  costPerMile: document.querySelector("#costPerMile"),
  serviceMinutes: document.querySelector("#serviceMinutes"),
  routeHealth: document.querySelector("#routeHealth"),
  openMaps: document.querySelector("#openMaps"),
};

hydrateForm();
render();

window.addEventListener("beforeunload", persistState);

elements.tripForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(elements.tripForm);
  state.tripName = readText(form, "tripName", "Route Max route");
  state.startCity = readText(form, "startCity", "Start");
  state.endCity = readText(form, "endCity", "Destination");
  state.totalMiles = readNumber(form, "totalMiles", 0);
  state.avgSpeed = Math.max(1, readNumber(form, "avgSpeed", 1));
  state.mpg = Math.max(1, readNumber(form, "mpg", 1));
  state.gasPrice = Math.max(0, readNumber(form, "gasPrice", 0));
  state.startTime = readText(form, "startTime", "08:00");
  state.bufferMinutes = Math.max(0, readNumber(form, "bufferMinutes", 0));

  normalizeStops();
  persistAndRender();
});

elements.stopForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(elements.stopForm);
  const stop = createStop(
    readText(form, "stopName", "New stop"),
    readNumber(form, "stopMile", 0),
    readText(form, "stopType", "Delivery"),
    readText(form, "stopPriority", "Normal"),
    readNumber(form, "serviceMinutes", 8),
  );

  state.stops.push(stop);
  optimizeRoute(false);
  elements.stopForm.reset();
  elements.stopForm.elements.serviceMinutes.value = 8;
  persistAndRender();
});

elements.optimizeStops.addEventListener("click", () => {
  optimizeRoute(true);
  persistAndRender();
});

elements.exportRoute.addEventListener("click", () => {
  exportRouteSheet();
});

elements.clearStops.addEventListener("click", () => {
  state.stops = [];
  persistAndRender();
});

elements.stopList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-stop]");
  const statusButton = event.target.closest("[data-cycle-status]");

  if (deleteButton) {
    state.stops = state.stops.filter((stop) => stop.id !== deleteButton.dataset.deleteStop);
    persistAndRender();
    return;
  }

  if (statusButton) {
    const stop = state.stops.find((item) => item.id === statusButton.dataset.cycleStatus);
    if (!stop) return;

    stop.status = nextStatus(stop.status);
    persistAndRender();
  }
});

elements.checklistItems.addEventListener("change", (event) => {
  if (!event.target.matches("[data-checklist-item]")) return;

  const item = event.target.dataset.checklistItem;
  const completed = new Set(state.completedChecklist.filter((entry) => checklist.includes(entry)));

  if (event.target.checked) {
    completed.add(item);
  } else {
    completed.delete(item);
  }

  state.completedChecklist = [...completed];
  persistAndRender();
});

function hydrateForm() {
  for (const field of ["tripName", "startCity", "endCity", "totalMiles", "avgSpeed", "mpg", "gasPrice", "startTime", "bufferMinutes"]) {
    const input = elements.tripForm.elements[field];
    if (input) input.value = state[field];
  }
}

function render() {
  normalizeStops();
  const route = buildRouteTimeline();
  renderSummary(route);
  renderStops(route);
  renderTimeline(route);
  renderChecklist();
}

function renderSummary(route) {
  const miles = Math.max(0, state.totalMiles);
  const driveHours = state.avgSpeed > 0 ? miles / state.avgSpeed : 0;
  const gallons = state.mpg > 0 ? miles / state.mpg : 0;
  const fuelCost = gallons * Math.max(0, state.gasPrice);
  const serviceTotal = state.stops.reduce((total, stop) => total + stop.serviceMinutes, 0);
  const progress = getRouteProgress();
  const suggestedRestWindows = Math.max(0, Math.floor((driveHours + serviceTotal / 60) / 3.5));
  const perMile = miles > 0 ? fuelCost / miles : 0;

  elements.summaryMiles.textContent = formatNumber(miles);
  elements.summaryTime.textContent = formatHours(driveHours + serviceTotal / 60);
  elements.summaryFuel.textContent = formatCurrency(fuelCost);
  elements.summaryProgress.textContent = `${progress}%`;
  elements.displayTripName.textContent = state.tripName;
  elements.displayRoute.textContent = `${state.startCity} to ${state.endCity}`;
  elements.fuelGallons.textContent = `${formatNumber(gallons, 1)} gal`;
  elements.restWindows.textContent = `${suggestedRestWindows} suggested`;
  elements.costPerMile.textContent = formatCurrency(perMile);
  elements.serviceMinutes.textContent = formatHours(serviceTotal / 60);
  elements.routeHealth.textContent = getRouteHealth(route.warnings);
  elements.openMaps.href = buildMapsUrl();
}

function renderStops(route) {
  elements.stopList.innerHTML = "";
  elements.emptyStops.hidden = state.stops.length > 0;
  elements.routeWarnings.hidden = route.warnings.length === 0;
  elements.routeWarnings.innerHTML = route.warnings.map((warning) => `<p>${escapeHtml(warning)}</p>`).join("");

  for (const item of route.items) {
    const stop = item.stop;
    const entry = document.createElement("li");
    entry.className = `stop-card stop-card--${stop.status}`;
    entry.innerHTML = `
      <div class="stop-card__main">
        <div class="stop-card__title-row">
          <h3>${escapeHtml(stop.name)}</h3>
          <span class="tag tag--${stop.priority.toLowerCase()}">${escapeHtml(stop.priority)}</span>
        </div>
        <p>Mile ${formatNumber(stop.mile)} &bull; ${escapeHtml(stop.type)} &bull; ${stop.serviceMinutes}m service</p>
        <p>ETA ${formatClock(item.arrival)} &bull; done ${formatClock(item.departure)} &bull; ${distanceUntilStop(stop.mile)}</p>
      </div>
      <div class="stop-actions">
        <button class="status-button status-button--${stop.status}" type="button" data-cycle-status="${escapeAttribute(stop.id)}">
          ${statusLabel(stop.status)}
        </button>
        <button class="delete-stop" type="button" aria-label="Delete ${escapeAttribute(stop.name)}" data-delete-stop="${escapeAttribute(stop.id)}">
          &times;
        </button>
      </div>
    `;
    elements.stopList.append(entry);
  }
}

function renderTimeline(route) {
  elements.routeSummaryPill.textContent = `${state.stops.length} stops &bull; ${getRouteProgress()}% complete`;
  elements.routeTimeline.innerHTML = "";

  if (route.items.length === 0) {
    elements.routeTimeline.innerHTML = '<p class="empty-state">Add stops to see the dispatch timeline.</p>';
    return;
  }

  for (const item of route.items) {
    const row = document.createElement("article");
    row.className = "timeline-item";
    row.innerHTML = `
      <span class="timeline-item__time">${formatClock(item.arrival)}</span>
      <div>
        <strong>${escapeHtml(item.stop.name)}</strong>
        <p>${escapeHtml(item.stop.type)} at mile ${formatNumber(item.stop.mile)} &bull; ${statusLabel(item.stop.status)}</p>
      </div>
    `;
    elements.routeTimeline.append(row);
  }
}

function renderChecklist() {
  const completed = new Set(state.completedChecklist.filter((item) => checklist.includes(item)));
  elements.checklistItems.innerHTML = "";

  for (const item of checklist) {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" data-checklist-item="${escapeAttribute(item)}" ${completed.has(item) ? "checked" : ""} />
      <span>${escapeHtml(item)}</span>
    `;
    elements.checklistItems.append(label);
  }

  elements.checklistProgress.textContent = `${completed.size} / ${checklist.length} ready`;
}

function buildRouteTimeline() {
  let currentMinute = parseTime(state.startTime);
  let previousMile = 0;
  const warnings = [];
  const items = state.stops.map((stop, index) => {
    const legMiles = Math.max(0, stop.mile - previousMile);
    const travelMinutes = state.avgSpeed > 0 ? (legMiles / state.avgSpeed) * 60 : 0;
    const arrival = currentMinute + travelMinutes;
    const departure = arrival + stop.serviceMinutes + state.bufferMinutes;
    previousMile = stop.mile;
    currentMinute = departure;

    if (index > 0 && stop.mile < state.stops[index - 1].mile) {
      warnings.push(`${stop.name} is out of mile order. Use Optimize to clean it up.`);
    }
    if (stop.mile > state.totalMiles) {
      warnings.push(`${stop.name} is beyond the route total miles.`);
    }

    return { stop, arrival, departure };
  });

  const highPriorityLate = items.find((item) => item.stop.priority === "High" && item.arrival - parseTime(state.startTime) > 240);
  if (highPriorityLate) {
    warnings.push(`${highPriorityLate.stop.name} is high priority but lands more than 4 hours into the route.`);
  }

  return { items, warnings };
}

function optimizeRoute(moveHighPriorityWithinCluster) {
  normalizeStops();
  state.stops.sort((left, right) => {
    const mileDiff = left.mile - right.mile;
    if (moveHighPriorityWithinCluster && Math.abs(mileDiff) <= 15) {
      return priorityScore(right.priority) - priorityScore(left.priority) || mileDiff;
    }
    return mileDiff;
  });
}

function exportRouteSheet() {
  const route = buildRouteTimeline();
  const rows = [
    ["Order", "Stop", "Type", "Priority", "Mile", "ETA", "Service Minutes", "Status"],
    ...route.items.map((item, index) => [
      index + 1,
      item.stop.name,
      item.stop.type,
      item.stop.priority,
      item.stop.mile,
      formatClock(item.arrival),
      item.stop.serviceMinutes,
      statusLabel(item.stop.status),
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(state.tripName)}-route.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function persistAndRender() {
  persistState();
  hydrateForm();
  render();
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Route Max could not save locally", error);
  }
}

function loadState() {
  const stored = readStoredState(STORAGE_KEY) || readStoredState(LEGACY_STORAGE_KEY);
  if (!stored) return cloneDefaultState();

  return normalizeState({ ...cloneDefaultState(), ...stored });
}

function readStoredState(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeState(nextState) {
  nextState.totalMiles = Math.max(0, Number(nextState.totalMiles) || 0);
  nextState.avgSpeed = Math.max(1, Number(nextState.avgSpeed) || 1);
  nextState.mpg = Math.max(1, Number(nextState.mpg) || 1);
  nextState.gasPrice = Math.max(0, Number(nextState.gasPrice) || 0);
  nextState.bufferMinutes = Math.max(0, Number(nextState.bufferMinutes) || 0);
  nextState.startTime = /^\d{2}:\d{2}$/.test(nextState.startTime || "") ? nextState.startTime : "08:00";
  nextState.stops = Array.isArray(nextState.stops) ? nextState.stops.map(normalizeStop) : [];
  nextState.completedChecklist = Array.isArray(nextState.completedChecklist) ? nextState.completedChecklist : [];
  return nextState;
}

function normalizeStops() {
  state.stops = state.stops.map(normalizeStop);
}

function normalizeStop(stop) {
  return {
    id: stop.id || createId(),
    name: String(stop.name || "Unnamed stop").trim(),
    mile: Math.max(0, Number(stop.mile) || 0),
    type: String(stop.type || "Delivery"),
    priority: ["High", "Normal", "Low"].includes(stop.priority) ? stop.priority : "Normal",
    serviceMinutes: Math.max(0, Number(stop.serviceMinutes) || 0),
    status: ["pending", "done", "skipped"].includes(stop.status) ? stop.status : "pending",
  };
}

function createStop(name, mile, type, priority, serviceMinutes) {
  return normalizeStop({ id: createId(), name, mile, type, priority, serviceMinutes, status: "pending" });
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function readText(form, field, fallback) {
  const value = String(form.get(field) ?? "").trim();
  return value || fallback;
}

function readNumber(form, field, fallback) {
  const number = Number(form.get(field));
  return Number.isFinite(number) ? number : fallback;
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getRouteProgress() {
  if (state.stops.length === 0) return 0;
  const completed = state.stops.filter((stop) => stop.status === "done" || stop.status === "skipped").length;
  return Math.round((completed / state.stops.length) * 100);
}

function getRouteHealth(warnings) {
  if (warnings.length > 0) return `${warnings.length} warning${warnings.length === 1 ? "" : "s"}`;
  if (state.stops.length === 0) return "Add stops";
  return "Clean";
}

function priorityScore(priority) {
  return { High: 3, Normal: 2, Low: 1 }[priority] || 2;
}

function nextStatus(status) {
  if (status === "pending") return "done";
  if (status === "done") return "skipped";
  return "pending";
}

function statusLabel(status) {
  return { pending: "Pending", done: "Done", skipped: "Skipped" }[status] || "Pending";
}

function distanceUntilStop(mile) {
  const remaining = Math.max(0, state.totalMiles - mile);
  return `${formatNumber(remaining)} mi left`;
}

function buildMapsUrl() {
  const waypoints = state.stops.slice(0, 8).map((stop) => stop.name).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin: state.startCity,
    destination: state.endCity,
    travelmode: "driving",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
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
  return `"${String(value).replaceAll('"', '""')}"`;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "route-max";
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
