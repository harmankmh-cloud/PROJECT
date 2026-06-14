(function attachStorage(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.RouteMax = root.RouteMax || {};
  Object.assign(root.RouteMax, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function storageFactory() {
  const engine = typeof require === "function" ? require("./route-engine.js") : globalThis.RouteMax;

  const STORAGE_KEY = "route-max-state";
  const LEGACY_STORAGE_KEY = "road-warrior-state";
  let persistTimer = null;

  function readRaw(key, storage) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function migrateLegacyState(raw) {
    if (!raw) return engine.createDefaultLibrary();
    if (raw.routes && raw.activeRouteId) return engine.normalizeLibrary(raw);
    return engine.normalizeLibrary({
      activeRouteId: engine.createId(),
      routes: [{ id: engine.createId(), name: raw.tripName || "Route Max route", state: engine.normalizeTripState(raw) }],
    });
  }

  function loadLibrary(storage = getWebStorage()) {
    const stored = readRaw(STORAGE_KEY, storage) || readRaw(LEGACY_STORAGE_KEY, storage);
    return migrateLegacyState(stored);
  }

  function saveLibrary(library, storage = getWebStorage()) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(engine.normalizeLibrary(library)));
      return true;
    } catch (error) {
      console.warn("Route Max could not save locally", error);
      return false;
    }
  }

  function schedulePersist(library, storage, delayMs = 250) {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      saveLibrary(library, storage);
    }, delayMs);
  }

  function getWebStorage() {
    if (typeof localStorage !== "undefined") return localStorage;
    const memory = new Map();
    return {
      getItem: (key) => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, value),
    };
  }

  function addRoute(library, name) {
    const id = engine.createId();
    const next = engine.normalizeLibrary({
      ...library,
      routes: [
        ...library.routes,
        { id, name: String(name || "New route").trim() || "New route", state: engine.createDefaultRouteState() },
      ],
      activeRouteId: id,
    });
    return next;
  }

  function deleteRoute(library, routeId) {
    if (library.routes.length <= 1) return library;
    const routes = library.routes.filter((route) => route.id !== routeId);
    return engine.normalizeLibrary({
      ...library,
      routes,
      activeRouteId: library.activeRouteId === routeId ? routes[0].id : library.activeRouteId,
    });
  }

  function setActiveRoute(library, routeId) {
    if (!library.routes.some((route) => route.id === routeId)) return library;
    return { ...library, activeRouteId: routeId };
  }

  function updateActiveRouteState(library, state) {
    const active = engine.getActiveRoute(library);
    return engine.normalizeLibrary({
      ...library,
      routes: library.routes.map((route) =>
        route.id === active.id ? { ...route, state: engine.normalizeTripState(state) } : route,
      ),
    });
  }

  function renameActiveRoute(library, name) {
    const active = engine.getActiveRoute(library);
    return engine.normalizeLibrary({
      ...library,
      routes: library.routes.map((route) => (route.id === active.id ? { ...route, name } : route)),
    });
  }

  return {
    STORAGE_KEY,
    LEGACY_STORAGE_KEY,
    loadLibrary,
    saveLibrary,
    schedulePersist,
    addRoute,
    deleteRoute,
    setActiveRoute,
    updateActiveRouteState,
    renameActiveRoute,
    migrateLegacyState,
  };
});
