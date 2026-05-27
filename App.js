const React = require("react");
const {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} = require("react-native");

const h = React.createElement;

const initialStops = [
  makeStop("Northside pharmacy", 18, "Delivery", "High", 8),
  makeStop("Riverside pickup", 42, "Pickup", "Normal", 10),
  makeStop("Airport fuel stop", 73, "Fuel", "Low", 12),
  makeStop("West end office park", 118, "Delivery", "High", 9),
];

function App() {
  const [trip, setTrip] = React.useState({
    name: "Morning delivery route",
    start: "Warehouse",
    end: "Home base",
    miles: "168",
    speed: "38",
    mpg: "24",
    gasPrice: "3.69",
    startTime: "08:00",
    buffer: "5",
  });
  const [stops, setStops] = React.useState(initialStops);
  const [draftStop, setDraftStop] = React.useState({
    name: "",
    mile: "",
    service: "8",
    type: "Delivery",
    priority: "Normal",
  });

  const route = buildRoute(trip, stops);
  const metrics = getMetrics(trip, stops, route);

  function updateTrip(field, value) {
    setTrip((current) => ({ ...current, [field]: value }));
  }

  function updateDraft(field, value) {
    setDraftStop((current) => ({ ...current, [field]: value }));
  }

  function addStop() {
    const name = draftStop.name.trim();
    const mile = toNumber(draftStop.mile, NaN);
    if (!name || !Number.isFinite(mile)) return;

    setStops((current) =>
      optimizeStops([
        ...current,
        makeStop(name, mile, draftStop.type, draftStop.priority, toNumber(draftStop.service, 8)),
      ]),
    );
    setDraftStop({ name: "", mile: "", service: "8", type: "Delivery", priority: "Normal" });
  }

  function openMaps() {
    Linking.openURL(buildMapsUrl(trip, stops)).catch(() => {});
  }

  return h(
    SafeAreaView,
    { style: styles.safeArea },
    h(StatusBar, { barStyle: "light-content" }),
    h(
      ScrollView,
      { contentContainerStyle: styles.screen },
      h(Header),
      h(MetricGrid, { metrics }),
      h(TripCard, { trip, route, metrics, onChange: updateTrip, onOpenMaps: openMaps }),
      h(StopForm, { draftStop, onChange: updateDraft, onAdd: addStop }),
      h(StopList, {
        route,
        onOptimize: () => setStops((current) => optimizeStops(current, true)),
        onClear: () => setStops([]),
        onCycleStatus: (id) =>
          setStops((current) =>
            current.map((stop) => (stop.id === id ? { ...stop, status: nextStatus(stop.status) } : stop)),
          ),
        onDelete: (id) => setStops((current) => current.filter((stop) => stop.id !== id)),
      }),
      h(Timeline, { route, progress: metrics.progress }),
    ),
  );
}

function Header() {
  return h(
    View,
    { style: styles.hero },
    h(Text, { style: styles.eyebrow }, "ROUTE MAX"),
    h(Text, { style: styles.title }, "Faster routes, cleaner ETAs, fewer missed stops."),
    h(
      Text,
      { style: styles.subtitle },
      "Built for Expo Go: plan stops, optimize order, track progress, and launch maps from your phone.",
    ),
  );
}

function MetricGrid({ metrics }) {
  const cards = [
    ["Miles", formatNumber(metrics.miles)],
    ["Route time", formatHours(metrics.totalHours)],
    ["Fuel", formatCurrency(metrics.fuelCost)],
    ["Progress", `${metrics.progress}%`],
  ];

  return h(
    View,
    { style: styles.metricGrid },
    cards.map(([label, value]) =>
      h(
        View,
        { key: label, style: styles.metricCard },
        h(Text, { style: styles.metricLabel }, label),
        h(Text, { style: styles.metricValue }, value),
      ),
    ),
  );
}

function TripCard({ trip, metrics, route, onChange, onOpenMaps }) {
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "TRIP SETTINGS"),
    h(Text, { style: styles.sectionTitle }, trip.name || "Route Max route"),
    h(Row, {
      children: [
        h(Field, { key: "name", label: "Trip name", value: trip.name, onChangeText: (value) => onChange("name", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "start", label: "Start", value: trip.start, onChangeText: (value) => onChange("start", value) }),
        h(Field, { key: "end", label: "End", value: trip.end, onChangeText: (value) => onChange("end", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "miles", label: "Miles", keyboardType: "numeric", value: trip.miles, onChangeText: (value) => onChange("miles", value) }),
        h(Field, { key: "speed", label: "Avg speed", keyboardType: "numeric", value: trip.speed, onChangeText: (value) => onChange("speed", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "mpg", label: "MPG", keyboardType: "numeric", value: trip.mpg, onChangeText: (value) => onChange("mpg", value) }),
        h(Field, { key: "gas", label: "Gas price", keyboardType: "numeric", value: trip.gasPrice, onChangeText: (value) => onChange("gasPrice", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "time", label: "Start time", value: trip.startTime, onChangeText: (value) => onChange("startTime", value) }),
        h(Field, { key: "buffer", label: "Buffer min", keyboardType: "numeric", value: trip.buffer, onChangeText: (value) => onChange("buffer", value) }),
      ],
    }),
    h(
      View,
      { style: styles.summaryBox },
      h(Text, { style: styles.summaryText }, `${trip.start || "Start"} to ${trip.end || "Destination"}`),
      h(Text, { style: styles.summaryText }, `Fuel needed: ${formatNumber(metrics.gallons, 1)} gal`),
      h(Text, { style: styles.summaryText }, `Route health: ${route.warnings.length ? `${route.warnings.length} warning(s)` : "Clean"}`),
    ),
    h(Button, { label: "Open route in Google Maps", onPress: onOpenMaps, variant: "ghost" }),
  );
}

function StopForm({ draftStop, onChange, onAdd }) {
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "ADD STOP"),
    h(Text, { style: styles.sectionTitle }, "Build the route"),
    h(Field, { label: "Stop name", value: draftStop.name, onChangeText: (value) => onChange("name", value), placeholder: "Customer, pickup, fuel..." }),
    h(Row, {
      children: [
        h(Field, { key: "mile", label: "Mile marker", keyboardType: "numeric", value: draftStop.mile, onChangeText: (value) => onChange("mile", value) }),
        h(Field, { key: "service", label: "Service min", keyboardType: "numeric", value: draftStop.service, onChangeText: (value) => onChange("service", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(ChoiceGroup, { key: "type", label: "Type", value: draftStop.type, options: ["Delivery", "Pickup", "Fuel"], onChange: (value) => onChange("type", value) }),
        h(ChoiceGroup, { key: "priority", label: "Priority", value: draftStop.priority, options: ["High", "Normal", "Low"], onChange: (value) => onChange("priority", value) }),
      ],
    }),
    h(Button, { label: "Add stop", onPress: onAdd }),
  );
}

function StopList({ route, onOptimize, onClear, onCycleStatus, onDelete }) {
  return h(
    View,
    { style: styles.panel },
    h(
      View,
      { style: styles.panelHeader },
      h(View, null, h(Text, { style: styles.eyebrow }, "ROUTE BOARD"), h(Text, { style: styles.sectionTitle }, "Planned stops")),
      h(View, { style: styles.headerActions }, h(Button, { label: "Optimize", onPress: onOptimize, compact: true }), h(Button, { label: "Clear", onPress: onClear, compact: true, variant: "ghost" })),
    ),
    route.warnings.map((warning) => h(Text, { key: warning, style: styles.warning }, warning)),
    route.items.length === 0
      ? h(Text, { style: styles.empty }, "No stops yet. Add one to build the route.")
      : route.items.map((item) =>
          h(
            View,
            { key: item.stop.id, style: [styles.stopCard, item.stop.status === "done" && styles.stopDone] },
            h(View, { style: styles.stopTop }, h(Text, { style: styles.stopTitle }, item.stop.name), h(Text, { style: priorityStyle(item.stop.priority) }, item.stop.priority)),
            h(Text, { style: styles.stopMeta }, `Mile ${formatNumber(item.stop.mile)} | ${item.stop.type} | ${item.stop.serviceMinutes}m service`),
            h(Text, { style: styles.stopMeta }, `ETA ${formatClock(item.arrival)} | done ${formatClock(item.departure)}`),
            h(
              View,
              { style: styles.stopActions },
              h(Button, { label: statusLabel(item.stop.status), onPress: () => onCycleStatus(item.stop.id), compact: true, variant: item.stop.status === "pending" ? "ghost" : "success" }),
              h(Button, { label: "Delete", onPress: () => onDelete(item.stop.id), compact: true, variant: "danger" }),
            ),
          ),
        ),
  );
}

function Timeline({ route, progress }) {
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "DISPATCH VIEW"),
    h(Text, { style: styles.sectionTitle }, `Route timeline | ${progress}% complete`),
    route.items.length === 0
      ? h(Text, { style: styles.empty }, "Add stops to see ETA order.")
      : route.items.map((item) =>
          h(
            View,
            { key: `timeline-${item.stop.id}`, style: styles.timelineRow },
            h(Text, { style: styles.timelineTime }, formatClock(item.arrival)),
            h(View, { style: styles.timelineBody }, h(Text, { style: styles.timelineTitle }, item.stop.name), h(Text, { style: styles.timelineMeta }, `${item.stop.type} | ${statusLabel(item.stop.status)}`)),
          ),
        ),
  );
}

function Field({ label, value, onChangeText, keyboardType, placeholder }) {
  return h(
    View,
    { style: styles.field },
    h(Text, { style: styles.label }, label),
    h(TextInput, {
      style: styles.input,
      value,
      onChangeText,
      keyboardType,
      placeholder,
      placeholderTextColor: "#64748b",
    }),
  );
}

function Row({ children }) {
  return h(View, { style: styles.row }, children);
}

function ChoiceGroup({ label, value, options, onChange }) {
  return h(
    View,
    { style: styles.field },
    h(Text, { style: styles.label }, label),
    h(
      View,
      { style: styles.choiceWrap },
      options.map((option) =>
        h(
          Pressable,
          { key: option, onPress: () => onChange(option), style: [styles.choice, value === option && styles.choiceActive] },
          h(Text, { style: [styles.choiceText, value === option && styles.choiceTextActive] }, option),
        ),
      ),
    ),
  );
}

function Button({ label, onPress, compact, variant }) {
  return h(
    Pressable,
    { onPress, style: [styles.button, compact && styles.buttonCompact, variant === "ghost" && styles.buttonGhost, variant === "danger" && styles.buttonDanger, variant === "success" && styles.buttonSuccess] },
    h(Text, { style: [styles.buttonText, variant === "ghost" && styles.buttonGhostText, variant === "danger" && styles.buttonDangerText, variant === "success" && styles.buttonSuccessText] }, label),
  );
}

function buildRoute(trip, stops) {
  const speed = Math.max(1, toNumber(trip.speed, 1));
  const totalMiles = Math.max(0, toNumber(trip.miles, 0));
  const buffer = Math.max(0, toNumber(trip.buffer, 0));
  let currentMinute = parseTime(trip.startTime);
  let previousMile = 0;
  const warnings = [];

  const items = stops.map((stop, index) => {
    const legMiles = Math.max(0, stop.mile - previousMile);
    const arrival = currentMinute + (legMiles / speed) * 60;
    const departure = arrival + stop.serviceMinutes + buffer;
    if (index > 0 && stop.mile < stops[index - 1].mile) warnings.push(`${stop.name} is out of order. Tap Optimize.`);
    if (stop.mile > totalMiles) warnings.push(`${stop.name} is beyond total route miles.`);
    previousMile = stop.mile;
    currentMinute = departure;
    return { stop, arrival, departure };
  });

  const latePriority = items.find((item) => item.stop.priority === "High" && item.arrival - parseTime(trip.startTime) > 240);
  if (latePriority) warnings.push(`${latePriority.stop.name} is high priority but lands late in the route.`);

  return { items, warnings };
}

function getMetrics(trip, stops) {
  const miles = Math.max(0, toNumber(trip.miles, 0));
  const speed = Math.max(1, toNumber(trip.speed, 1));
  const mpg = Math.max(1, toNumber(trip.mpg, 1));
  const gasPrice = Math.max(0, toNumber(trip.gasPrice, 0));
  const serviceMinutes = stops.reduce((sum, stop) => sum + stop.serviceMinutes, 0);
  const done = stops.filter((stop) => stop.status === "done" || stop.status === "skipped").length;

  return {
    miles,
    totalHours: miles / speed + serviceMinutes / 60,
    gallons: miles / mpg,
    fuelCost: (miles / mpg) * gasPrice,
    progress: stops.length ? Math.round((done / stops.length) * 100) : 0,
  };
}

function optimizeStops(stops, priorityWithinCluster) {
  return [...stops].sort((left, right) => {
    const mileDiff = left.mile - right.mile;
    if (priorityWithinCluster && Math.abs(mileDiff) <= 15) {
      return priorityScore(right.priority) - priorityScore(left.priority) || mileDiff;
    }
    return mileDiff;
  });
}

function makeStop(name, mile, type, priority, serviceMinutes) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    mile: Math.max(0, Number(mile) || 0),
    type,
    priority,
    serviceMinutes: Math.max(0, Number(serviceMinutes) || 0),
    status: "pending",
  };
}

function buildMapsUrl(trip, stops) {
  const params = [
    ["api", "1"],
    ["origin", trip.start || "Start"],
    ["destination", trip.end || "Destination"],
    ["travelmode", "driving"],
  ];
  const waypoints = stops.slice(0, 8).map((stop) => stop.name).join("|");
  if (waypoints) params.push(["waypoints", waypoints]);

  const query = params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  return `https://www.google.com/maps/dir/?${query}`;
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

function priorityStyle(priority) {
  if (priority === "High") return [styles.priority, styles.priorityHigh];
  if (priority === "Low") return [styles.priority, styles.priorityLow];
  return [styles.priority, styles.priorityNormal];
}

function parseTime(value) {
  const [hours, minutes] = String(value || "08:00").split(":").map(Number);
  return (Number.isFinite(hours) ? hours : 8) * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  screen: {
    gap: 18,
    padding: 18,
    paddingBottom: 34,
  },
  hero: {
    paddingVertical: 22,
  },
  eyebrow: {
    color: "#ffb84d",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: "#f7fbff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
    lineHeight: 37,
    marginBottom: 12,
  },
  subtitle: {
    color: "#9eadbd",
    fontSize: 16,
    lineHeight: 24,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    backgroundColor: "#18202b",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47%",
    flexGrow: 1,
    padding: 16,
  },
  metricLabel: {
    color: "#9eadbd",
    fontSize: 12,
    marginBottom: 8,
  },
  metricValue: {
    color: "#f7fbff",
    fontSize: 27,
    fontWeight: "900",
  },
  panel: {
    backgroundColor: "#18202b",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 18,
  },
  panelHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  sectionTitle: {
    color: "#f7fbff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  field: {
    flex: 1,
    gap: 7,
  },
  label: {
    color: "#9eadbd",
    fontSize: 12,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#0d1117",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#f7fbff",
    minHeight: 46,
    paddingHorizontal: 12,
  },
  summaryBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    gap: 6,
    padding: 14,
  },
  summaryText: {
    color: "#cbd5e1",
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  choice: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  choiceActive: {
    backgroundColor: "#ffb84d",
  },
  choiceText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
  },
  choiceTextActive: {
    color: "#1d1205",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ffb84d",
    borderRadius: 999,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonCompact: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  buttonGhost: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonDanger: {
    backgroundColor: "rgba(255,122,144,0.14)",
  },
  buttonSuccess: {
    backgroundColor: "rgba(117,224,167,0.14)",
  },
  buttonText: {
    color: "#1d1205",
    fontWeight: "900",
  },
  buttonGhostText: {
    color: "#f7fbff",
  },
  buttonDangerText: {
    color: "#ff9bad",
  },
  buttonSuccessText: {
    color: "#75e0a7",
  },
  warning: {
    backgroundColor: "rgba(255,184,77,0.1)",
    borderRadius: 12,
    color: "#ffd59a",
    padding: 12,
  },
  empty: {
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    borderStyle: "dashed",
    borderWidth: StyleSheet.hairlineWidth,
    color: "#9eadbd",
    padding: 16,
    textAlign: "center",
  },
  stopCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    padding: 14,
  },
  stopDone: {
    borderColor: "rgba(117,224,167,0.45)",
  },
  stopTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  stopTitle: {
    color: "#f7fbff",
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
  },
  stopMeta: {
    color: "#9eadbd",
  },
  stopActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  priority: {
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  priorityHigh: {
    backgroundColor: "rgba(255,122,144,0.14)",
    color: "#ff9bad",
  },
  priorityNormal: {
    backgroundColor: "rgba(95,214,255,0.12)",
    color: "#5fd6ff",
  },
  priorityLow: {
    backgroundColor: "rgba(117,224,167,0.12)",
    color: "#75e0a7",
  },
  timelineRow: {
    flexDirection: "row",
    gap: 14,
  },
  timelineTime: {
    color: "#ffb84d",
    fontWeight: "900",
    width: 82,
  },
  timelineBody: {
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    paddingBottom: 12,
  },
  timelineTitle: {
    color: "#f7fbff",
    fontWeight: "900",
  },
  timelineMeta: {
    color: "#9eadbd",
    marginTop: 3,
  },
});

module.exports = App;
