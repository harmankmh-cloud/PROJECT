(function attachGeocode(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.RouteMax = root.RouteMax || {};
  Object.assign(root.RouteMax, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function geocodeFactory() {
  const cache = new Map();
  let lastRequestAt = 0;

  async function geocodeAddress(address, options = {}) {
    const query = String(address || "").trim();
    if (!query) return null;

    const cacheKey = query.toLowerCase();
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const now = Date.now();
    const waitMs = Math.max(0, 1100 - (now - lastRequestAt));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastRequestAt = Date.now();

    const params = new URLSearchParams({
      format: "json",
      limit: "1",
      q: query,
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Geocoding service unavailable.");
    }

    const results = await response.json();
    if (!Array.isArray(results) || !results.length) {
      return null;
    }

    const result = {
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
      displayName: results[0].display_name,
    };
    cache.set(cacheKey, result);
    return result;
  }

  return {
    geocodeAddress,
  };
});
