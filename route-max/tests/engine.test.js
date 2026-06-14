const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../lib/route-engine.js");

test("optimizeStops sorts by mile marker", () => {
  const stops = [
    engine.createStop({ name: "C", mile: 90 }),
    engine.createStop({ name: "A", mile: 10 }),
    engine.createStop({ name: "B", mile: 45 }),
  ];
  const optimized = engine.optimizeStops(stops);
  assert.deepEqual(optimized.map((stop) => stop.name), ["A", "B", "C"]);
});

test("optimizeStops clusters high priority within 15 miles", () => {
  const stops = [
    engine.createStop({ name: "Low", mile: 20, priority: "Low" }),
    engine.createStop({ name: "High", mile: 24, priority: "High" }),
  ];
  const optimized = engine.optimizeStops(stops, { priorityWithinCluster: true });
  assert.equal(optimized[0].name, "High");
});

test("buildRoute warns on out-of-order and beyond-route stops", () => {
  const trip = engine.createDefaultRouteState();
  trip.totalMiles = 100;
  trip.stops = [
    engine.createStop({ name: "Late", mile: 80 }),
    engine.createStop({ name: "Early", mile: 20 }),
    engine.createStop({ name: "Too far", mile: 140 }),
  ];
  const route = engine.buildRoute(trip, trip.stops);
  assert.ok(route.warnings.some((warning) => warning.includes("out of mile order")));
  assert.ok(route.warnings.some((warning) => warning.includes("beyond the route total miles")));
});

test("buildRoute warns when ETA misses time window", () => {
  const trip = engine.createDefaultRouteState();
  trip.startTime = "08:00";
  trip.avgSpeed = 30;
  trip.stops = [engine.createStop({ name: "Window stop", mile: 60, windowEnd: "08:30" })];
  const route = engine.buildRoute(trip, trip.stops);
  assert.ok(route.warnings.some((warning) => warning.includes("misses window")));
});

test("ETA math includes service minutes and buffer", () => {
  const trip = engine.createDefaultRouteState();
  trip.startTime = "08:00";
  trip.avgSpeed = 60;
  trip.bufferMinutes = 5;
  trip.stops = [engine.createStop({ name: "Stop", mile: 60, serviceMinutes: 10 })];
  const route = engine.buildRoute(trip, trip.stops);
  assert.equal(route.items[0].arrival, 8 * 60 + 60);
  assert.equal(route.items[0].departure, 8 * 60 + 60 + 10 + 5);
});

test("CSV round-trip preserves stop count", () => {
  const trip = engine.createDefaultRouteState();
  const route = engine.buildRoute(trip, trip.stops);
  const csv = engine.exportCsv(trip, route);
  const imported = engine.importCsv(csv);
  assert.equal(imported.stops.length, trip.stops.length);
});

test("normalizeLibrary handles corrupt legacy state", () => {
  const library = engine.normalizeLibrary({
    activeRouteId: "bad",
    routes: [{ id: "ok", name: "Recovered", state: { stops: [{ name: "One", mile: 5 }] } }],
  });
  assert.equal(library.activeRouteId, "ok");
  assert.equal(library.routes[0].state.stops[0].name, "One");
});

test("parseVoiceStop extracts mile marker", () => {
  const stop = engine.parseVoiceStop("Riverside pharmacy mile 42");
  assert.equal(stop.name, "Riverside pharmacy");
  assert.equal(stop.mile, 42);
});

test("coordinate optimization prefers nearest neighbor ordering", () => {
  const stops = [
    engine.createStop({ name: "Far", mile: 0, lat: 49.25, lng: -122.95 }),
    engine.createStop({ name: "Near", mile: 0, lat: 49.05, lng: -122.3 }),
    engine.createStop({ name: "Mid", mile: 0, lat: 49.15, lng: -122.6 }),
  ];
  const optimized = engine.optimizeStops(stops, { trip: { startLat: 49.0, startLng: -122.2 } });
  assert.equal(optimized[0].name, "Near");
});
