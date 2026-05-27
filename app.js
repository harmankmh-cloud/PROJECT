const STORAGE_KEY = "road-warrior-state";

const checklist = [
  "Check tire pressure",
  "Top off fluids",
  "Pack chargers and mounts",
  "Download offline maps",
  "Confirm lodging",
  "Restock snacks and water",
  "Review weather",
  "Share ETA with contact",
];

const defaultState = {
  tripName: "Cross-country run",
  startCity: "Chicago",
  endCity: "Denver",
  totalMiles: 1004,
  avgSpeed: 62,
  mpg: 27,
  gasPrice: 3.69,
  stops: [
    { id: createId(), name: "Iowa City fuel stop", mile: 225, type: "Fuel" },
    { id: createId(), name: "Omaha dinner break", mile: 465, type: "Food" },
    { id: createId(), name: "North Platte overnight", mile: 735, type: "Hotel" },
  ],
  completedChecklist: ["Download offline maps", "Pack chargers and mounts"],
};

const state = loadState();

const elements = {
  tripForm: document.querySelector("#tripForm"),
  stopForm: document.querySelector("#stopForm"),
  stopList: document.querySelector("#stopList"),
  emptyStops: document.querySelector("#emptyStops"),
  clearStops: document.querySelector("#clearStops"),
  checklistItems: document.querySelector("#checklistItems"),
  checklistProgress: document.querySelector("#checklistProgress"),
  summaryMiles: document.querySelector("#summaryMiles"),
  summaryTime: document.querySelector("#summaryTime"),
  summaryFuel: document.querySelector("#summaryFuel"),
  summaryStops: document.querySelector("#summaryStops"),
  displayTripName: document.querySelector("#displayTripName"),
  displayRoute: document.querySelector("#displayRoute"),
  fuelGallons: document.querySelector("#fuelGallons"),
  restWindows: document.querySelector("#restWindows"),
  costPerMile: document.querySelector("#costPerMile"),
};

hydrateForm();
render();

elements.tripForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(elements.tripForm);
  state.tripName = readText(form, "tripName", "Road trip");
  state.startCity = readText(form, "startCity", "Start");
  state.endCity = readText(form, "endCity", "Destination");
  state.totalMiles = readNumber(form, "totalMiles", 0);
  state.avgSpeed = readNumber(form, "avgSpeed", 1);
  state.mpg = readNumber(form, "mpg", 1);
  state.gasPrice = readNumber(form, "gasPrice", 0);

  persistAndRender();
});

elements.stopForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(elements.stopForm);
  state.stops.push({
    id: createId(),
    name: readText(form, "stopName", "New stop"),
    mile: readNumber(form, "stopMile", 0),
    type: readText(form, "stopType", "Stop"),
  });
  state.stops.sort((left, right) => left.mile - right.mile);

  elements.stopForm.reset();
  persistAndRender();
});

elements.clearStops.addEventListener("click", () => {
  state.stops = [];
  persistAndRender();
});

elements.stopList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-stop]");
  if (!button) return;

  state.stops = state.stops.filter((stop) => stop.id !== button.dataset.deleteStop);
  persistAndRender();
});

elements.checklistItems.addEventListener("change", (event) => {
  if (!event.target.matches("[data-checklist-item]")) return;

  const item = event.target.dataset.checklistItem;
  const completed = new Set(state.completedChecklist.filter((item) => checklist.includes(item)));

  if (event.target.checked) {
    completed.add(item);
  } else {
    completed.delete(item);
  }

  state.completedChecklist = [...completed];
  persistAndRender();
});

function hydrateForm() {
  for (const field of ["tripName", "startCity", "endCity", "totalMiles", "avgSpeed", "mpg", "gasPrice"]) {
    const input = elements.tripForm.elements[field];
    input.value = state[field];
  }
}

function render() {
  renderSummary();
  renderStops();
  renderChecklist();
}

function renderSummary() {
  const miles = Math.max(0, state.totalMiles);
  const hours = state.avgSpeed > 0 ? miles / state.avgSpeed : 0;
  const gallons = state.mpg > 0 ? miles / state.mpg : 0;
  const fuelCost = gallons * Math.max(0, state.gasPrice);
  const suggestedRestWindows = Math.max(0, Math.floor(hours / 3.5));
  const perMile = miles > 0 ? fuelCost / miles : 0;

  elements.summaryMiles.textContent = formatNumber(miles);
  elements.summaryTime.textContent = formatHours(hours);
  elements.summaryFuel.textContent = formatCurrency(fuelCost);
  elements.summaryStops.textContent = String(state.stops.length);
  elements.displayTripName.textContent = state.tripName;
  elements.displayRoute.textContent = `${state.startCity} to ${state.endCity}`;
  elements.fuelGallons.textContent = `${formatNumber(gallons, 1)} gal`;
  elements.restWindows.textContent = `${suggestedRestWindows} suggested`;
  elements.costPerMile.textContent = formatCurrency(perMile);
}

function renderStops() {
  elements.stopList.innerHTML = "";
  elements.emptyStops.hidden = state.stops.length > 0;

  for (const stop of state.stops) {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(stop.name)}</h3>
        <p>Mile ${formatNumber(stop.mile)} &bull; ${escapeHtml(stop.type)}</p>
      </div>
      <div class="stop-actions">
        <span class="tag">${distanceUntilStop(stop.mile)}</span>
        <button class="delete-stop" type="button" aria-label="Delete ${escapeAttribute(stop.name)}" data-delete-stop="${escapeAttribute(stop.id)}">
          &times;
        </button>
      </div>
    `;
    elements.stopList.append(item);
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

function persistAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  hydrateForm();
  render();
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") {
      return cloneDefaultState();
    }

    return {
      ...cloneDefaultState(),
      ...stored,
      stops: Array.isArray(stored.stops) ? stored.stops : cloneDefaultState().stops,
      completedChecklist: Array.isArray(stored.completedChecklist) ? stored.completedChecklist : [],
    };
  } catch {
    return cloneDefaultState();
  }
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

function distanceUntilStop(mile) {
  const remaining = Math.max(0, state.totalMiles - mile);
  return `${formatNumber(remaining)} mi left`;
}

function formatHours(hours) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
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
