const React = require("react");
const {
  Alert,
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
const AsyncStorage = require("@react-native-async-storage/async-storage");
const ImagePicker = require("expo-image-picker");
const engine = require("./lib/route-engine.js");

const h = React.createElement;
const STORAGE_KEY = "route-max-state";

function App() {
  const [library, setLibrary] = React.useState(engine.createDefaultLibrary());
  const [ready, setReady] = React.useState(false);
  const [draftStop, setDraftStop] = React.useState(emptyDraftStop());

  const activeRoute = engine.getActiveRoute(library);
  const trip = activeRoute.state;
  const stops = trip.stops;
  const route = engine.buildRoute(trip, stops);
  const metrics = engine.getMetrics(trip, stops, route);

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          setLibrary(engine.normalizeLibrary(parsed.routes ? parsed : engine.importJson(raw).library));
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(library)).catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [library, ready]);

  function updateLibrary(nextLibrary) {
    setLibrary(engine.normalizeLibrary(nextLibrary));
  }

  function updateTrip(patch) {
    const nextState = engine.normalizeTripState({ ...trip, ...patch });
    updateLibrary({
      ...library,
      routes: library.routes.map((entry) =>
        entry.id === activeRoute.id ? { ...entry, state: nextState } : entry,
      ),
    });
  }

  function updateStops(nextStops) {
    updateTrip({ stops: nextStops });
  }

  function updateDraft(field, value) {
    setDraftStop((current) => ({ ...current, [field]: value }));
  }

  function addStop() {
    const stop = engine.createStop({
      name: draftStop.name.trim(),
      address: draftStop.address.trim(),
      mile: Number(draftStop.mile),
      type: draftStop.type,
      priority: draftStop.priority,
      serviceMinutes: Number(draftStop.service) || 8,
      windowStart: draftStop.windowStart,
      windowEnd: draftStop.windowEnd,
      notes: draftStop.notes.trim(),
    });
    const errors = engine.validateStopInput(stop);
    if (errors.length) {
      Alert.alert("Stop error", errors[0]);
      return;
    }
    updateStops(engine.optimizeStops([...stops, stop], { trip, priorityWithinCluster: false }));
    setDraftStop(emptyDraftStop());
  }

  async function attachPhoto(stopId) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach proof of delivery.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]?.base64) return;
    const mime = result.assets[0].mimeType || "image/jpeg";
    const photoDataUrl = `data:${mime};base64,${result.assets[0].base64}`;
    updateStops(
      stops.map((stop) => (stop.id === stopId ? { ...stop, photoDataUrl, notes: stop.notes || "POD attached" } : stop)),
    );
  }

  function openMaps() {
    Linking.openURL(engine.buildMapsUrl(trip, stops)).catch(() => {});
  }

  function toggleChecklist(item) {
    const completed = new Set(trip.completedChecklist.filter((entry) => engine.CHECKLIST.includes(entry)));
    if (completed.has(item)) completed.delete(item);
    else completed.add(item);
    updateTrip({ completedChecklist: [...completed] });
  }

  if (!ready) {
    return h(SafeAreaView, { style: styles.safeArea }, h(Text, { style: styles.subtitle }, "Loading Route Max…"));
  }

  return h(
    SafeAreaView,
    { style: styles.safeArea },
    h(StatusBar, { barStyle: "light-content" }),
    h(
      ScrollView,
      { contentContainerStyle: styles.screen },
      h(Header),
      h(LibraryBar, {
        library,
        onSelect: (routeId) => updateLibrary(engine.normalizeLibrary({ ...library, activeRouteId: routeId })),
        onNew: () => updateLibrary(engine.addRoute(library, "New route")),
      }),
      h(MetricGrid, { metrics }),
      h(TripCard, { trip, metrics, route, onChange: updateTrip, onOpenMaps: openMaps }),
      h(StopForm, { draftStop, onChange: updateDraft, onAdd: addStop }),
      h(Checklist, { trip, onToggle: toggleChecklist }),
      h(StopList, {
        route,
        onOptimize: () => updateStops(engine.optimizeStops(stops, { trip, priorityWithinCluster: true })),
        onClear: () => updateStops([]),
        onCycleStatus: (id) =>
          updateStops(
            stops.map((stop) => {
              if (stop.id !== id) return stop;
              const status = engine.nextStatus(stop.status);
              return {
                ...stop,
                status,
                completedAt: status === "done" ? new Date().toISOString() : stop.completedAt,
              };
            }),
          ),
        onDelete: (id) => updateStops(stops.filter((stop) => stop.id !== id)),
        onAttachPhoto: attachPhoto,
      }),
      h(Timeline, { route, progress: metrics.progress }),
    ),
  );
}

function emptyDraftStop() {
  return {
    name: "",
    address: "",
    mile: "",
    service: "8",
    type: "Delivery",
    priority: "Normal",
    windowStart: "",
    windowEnd: "",
    notes: "",
  };
}

function Header() {
  return h(
    View,
    { style: styles.hero },
    h(Text, { style: styles.eyebrow }, "ROUTE MAX"),
    h(Text, { style: styles.title }, "Unlimited stops. No paywall."),
    h(
      Text,
      { style: styles.subtitle },
      "Plan multi-stop routes with ETAs, time windows, fuel analytics, checklist, and Google Maps handoff.",
    ),
  );
}

function LibraryBar({ library, onSelect, onNew }) {
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "ROUTE LIBRARY"),
    h(
      View,
      { style: styles.choiceWrap },
      library.routes.map((route) =>
        h(
          Pressable,
          {
            key: route.id,
            onPress: () => onSelect(route.id),
            style: [styles.choice, route.id === library.activeRouteId && styles.choiceActive],
          },
          h(Text, { style: [styles.choiceText, route.id === library.activeRouteId && styles.choiceTextActive] }, route.name),
        ),
      ),
    ),
    h(Button, { label: "New route", onPress: onNew, variant: "ghost" }),
  );
}

function MetricGrid({ metrics }) {
  const cards = [
    ["Miles", engine.formatNumber(metrics.miles)],
    ["Route time", engine.formatHours(metrics.totalHours)],
    ["Fuel", engine.formatCurrency(metrics.fuelCost)],
    ["Progress", `${metrics.progress}%`],
    ["Cost/stop", engine.formatCurrency(metrics.costPerStop)],
    ["Efficiency", `${metrics.efficiencyScore}/100`],
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
    h(Text, { style: styles.sectionTitle }, trip.tripName || "Route Max route"),
    h(Field, { label: "Trip name", value: trip.tripName, onChangeText: (value) => onChange({ tripName: value }) }),
    h(Row, {
      children: [
        h(Field, { key: "start", label: "Start", value: trip.startCity, onChangeText: (value) => onChange({ startCity: value }) }),
        h(Field, { key: "end", label: "End", value: trip.endCity, onChangeText: (value) => onChange({ endCity: value }) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "miles", label: "Miles", keyboardType: "numeric", value: String(trip.totalMiles), onChangeText: (value) => onChange({ totalMiles: Number(value) || 0 }) }),
        h(Field, { key: "speed", label: "Avg speed", keyboardType: "numeric", value: String(trip.avgSpeed), onChangeText: (value) => onChange({ avgSpeed: Number(value) || 1 }) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "mpg", label: "MPG", keyboardType: "numeric", value: String(trip.mpg), onChangeText: (value) => onChange({ mpg: Number(value) || 1 }) }),
        h(Field, { key: "gas", label: "Gas price", keyboardType: "numeric", value: String(trip.gasPrice), onChangeText: (value) => onChange({ gasPrice: Number(value) || 0 }) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "time", label: "Start time", value: trip.startTime, onChangeText: (value) => onChange({ startTime: value }) }),
        h(Field, { key: "buffer", label: "Buffer min", keyboardType: "numeric", value: String(trip.bufferMinutes), onChangeText: (value) => onChange({ bufferMinutes: Number(value) || 0 }) }),
      ],
    }),
    h(
      View,
      { style: styles.summaryBox },
      h(Text, { style: styles.summaryText }, `${trip.startCity || "Start"} to ${trip.endCity || "Destination"}`),
      h(Text, { style: styles.summaryText }, `Finish ETA: ${metrics.finishTime}`),
      h(Text, { style: styles.summaryText }, `Route health: ${engine.getRouteHealth(route.warnings, trip.stops)}`),
    ),
    h(Button, { label: "Open route in Google Maps", onPress: onOpenMaps, variant: "ghost" }),
  );
}

function StopForm({ draftStop, onChange, onAdd }) {
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "ADD STOP"),
    h(Field, { label: "Stop name", value: draftStop.name, onChangeText: (value) => onChange("name", value), placeholder: "Customer, pickup, fuel..." }),
    h(Field, { label: "Address (optional)", value: draftStop.address, onChangeText: (value) => onChange("address", value), placeholder: "123 Main St" }),
    h(Row, {
      children: [
        h(Field, { key: "mile", label: "Mile marker", keyboardType: "numeric", value: draftStop.mile, onChangeText: (value) => onChange("mile", value) }),
        h(Field, { key: "service", label: "Service min", keyboardType: "numeric", value: draftStop.service, onChangeText: (value) => onChange("service", value) }),
      ],
    }),
    h(Row, {
      children: [
        h(Field, { key: "ws", label: "Window start", value: draftStop.windowStart, onChangeText: (value) => onChange("windowStart", value), placeholder: "08:00" }),
        h(Field, { key: "we", label: "Window end", value: draftStop.windowEnd, onChangeText: (value) => onChange("windowEnd", value), placeholder: "10:00" }),
      ],
    }),
    h(Row, {
      children: [
        h(ChoiceGroup, { key: "type", label: "Type", value: draftStop.type, options: ["Delivery", "Pickup", "Fuel"], onChange: (value) => onChange("type", value) }),
        h(ChoiceGroup, { key: "priority", label: "Priority", value: draftStop.priority, options: ["High", "Normal", "Low"], onChange: (value) => onChange("priority", value) }),
      ],
    }),
    h(Field, { label: "Notes / POD", value: draftStop.notes, onChangeText: (value) => onChange("notes", value), placeholder: "Gate code, apartment, instructions" }),
    h(Button, { label: "Add stop", onPress: onAdd }),
  );
}

function Checklist({ trip, onToggle }) {
  const completed = new Set(trip.completedChecklist.filter((item) => engine.CHECKLIST.includes(item)));
  return h(
    View,
    { style: styles.panel },
    h(Text, { style: styles.eyebrow }, "CHECKLIST"),
    h(Text, { style: styles.sectionTitle }, `${completed.size} / ${engine.CHECKLIST.length} ready`),
    engine.CHECKLIST.map((item) =>
      h(
        Pressable,
        { key: item, style: styles.checkRow, onPress: () => onToggle(item) },
        h(Text, { style: styles.checkMark }, completed.has(item) ? "✓" : "○"),
        h(Text, { style: [styles.checkText, completed.has(item) && styles.checkTextDone] }, item),
      ),
    ),
  );
}

function StopList({ route, onOptimize, onClear, onCycleStatus, onDelete, onAttachPhoto }) {
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
            item.stop.address ? h(Text, { style: styles.stopMeta }, item.stop.address) : null,
            h(Text, { style: styles.stopMeta }, `Mile ${engine.formatNumber(item.stop.mile)} | ${item.stop.type} | ${item.stop.serviceMinutes}m`),
            h(Text, { style: styles.stopMeta }, `ETA ${engine.formatClock(item.arrival)} | done ${engine.formatClock(item.departure)}`),
            item.stop.notes ? h(Text, { style: styles.stopMeta }, item.stop.notes) : null,
            h(
              View,
              { style: styles.stopActions },
              h(Button, { label: engine.statusLabel(item.stop.status), onPress: () => onCycleStatus(item.stop.id), compact: true, variant: item.stop.status === "pending" ? "ghost" : "success" }),
              h(Button, { label: "POD photo", onPress: () => onAttachPhoto(item.stop.id), compact: true, variant: "ghost" }),
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
            h(Text, { style: styles.timelineTime }, engine.formatClock(item.arrival)),
            h(View, { style: styles.timelineBody }, h(Text, { style: styles.timelineTitle }, item.stop.name), h(Text, { style: styles.timelineMeta }, `${item.stop.type} | ${engine.statusLabel(item.stop.status)}`)),
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

function priorityStyle(priority) {
  if (priority === "High") return [styles.priority, styles.priorityHigh];
  if (priority === "Low") return [styles.priority, styles.priorityLow];
  return [styles.priority, styles.priorityNormal];
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0d1117" },
  screen: { gap: 18, padding: 18, paddingBottom: 34 },
  hero: { paddingVertical: 22 },
  eyebrow: { color: "#ffb84d", fontSize: 12, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  title: { color: "#f7fbff", fontSize: 34, fontWeight: "900", letterSpacing: -1.2, lineHeight: 37, marginBottom: 12 },
  subtitle: { color: "#9eadbd", fontSize: 16, lineHeight: 24 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { backgroundColor: "#18202b", borderColor: "rgba(255,255,255,0.12)", borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, flexBasis: "47%", flexGrow: 1, padding: 16 },
  metricLabel: { color: "#9eadbd", fontSize: 12, marginBottom: 8 },
  metricValue: { color: "#f7fbff", fontSize: 24, fontWeight: "900" },
  panel: { backgroundColor: "#18202b", borderColor: "rgba(255,255,255,0.12)", borderRadius: 26, borderWidth: StyleSheet.hairlineWidth, gap: 12, padding: 18 },
  panelHeader: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 12 },
  headerActions: { flexDirection: "row", gap: 8 },
  sectionTitle: { color: "#f7fbff", fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  row: { flexDirection: "row", gap: 10 },
  field: { flex: 1, gap: 7 },
  label: { color: "#9eadbd", fontSize: 12, fontWeight: "800" },
  input: { backgroundColor: "#0d1117", borderColor: "rgba(255,255,255,0.12)", borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, color: "#f7fbff", minHeight: 46, paddingHorizontal: 12 },
  summaryBox: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, gap: 6, padding: 14 },
  summaryText: { color: "#cbd5e1" },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 10, paddingVertical: 9 },
  choiceActive: { backgroundColor: "#ffb84d" },
  choiceText: { color: "#cbd5e1", fontSize: 12, fontWeight: "800" },
  choiceTextActive: { color: "#1d1205" },
  button: { alignItems: "center", backgroundColor: "#ffb84d", borderRadius: 999, minHeight: 46, justifyContent: "center", paddingHorizontal: 18 },
  buttonCompact: { minHeight: 36, paddingHorizontal: 12 },
  buttonGhost: { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.14)", borderWidth: StyleSheet.hairlineWidth },
  buttonDanger: { backgroundColor: "rgba(255,122,144,0.14)" },
  buttonSuccess: { backgroundColor: "rgba(117,224,167,0.14)" },
  buttonText: { color: "#1d1205", fontWeight: "900" },
  buttonGhostText: { color: "#f7fbff" },
  buttonDangerText: { color: "#ff9bad" },
  buttonSuccessText: { color: "#75e0a7" },
  warning: { backgroundColor: "rgba(255,184,77,0.1)", borderRadius: 12, color: "#ffd59a", padding: 12 },
  empty: { borderColor: "rgba(255,255,255,0.12)", borderRadius: 14, borderStyle: "dashed", borderWidth: StyleSheet.hairlineWidth, color: "#9eadbd", padding: 16, textAlign: "center" },
  stopCard: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, gap: 8, padding: 14 },
  stopDone: { borderColor: "rgba(117,224,167,0.45)" },
  stopTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 10 },
  stopTitle: { color: "#f7fbff", flex: 1, fontSize: 16, fontWeight: "900" },
  stopMeta: { color: "#9eadbd" },
  stopActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  priority: { borderRadius: 999, fontSize: 12, fontWeight: "900", overflow: "hidden", paddingHorizontal: 10, paddingVertical: 5 },
  priorityHigh: { backgroundColor: "rgba(255,122,144,0.14)", color: "#ff9bad" },
  priorityNormal: { backgroundColor: "rgba(95,214,255,0.12)", color: "#5fd6ff" },
  priorityLow: { backgroundColor: "rgba(117,224,167,0.12)", color: "#75e0a7" },
  timelineRow: { flexDirection: "row", gap: 14 },
  timelineTime: { color: "#ffb84d", fontWeight: "900", width: 82 },
  timelineBody: { borderBottomColor: "rgba(255,255,255,0.1)", borderBottomWidth: StyleSheet.hairlineWidth, flex: 1, paddingBottom: 12 },
  timelineTitle: { color: "#f7fbff", fontWeight: "900" },
  timelineMeta: { color: "#9eadbd", marginTop: 3 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  checkMark: { color: "#75e0a7", width: 18, fontWeight: "900" },
  checkText: { color: "#f7fbff", flex: 1 },
  checkTextDone: { color: "#9eadbd", textDecorationLine: "line-through" },
});

module.exports = App;
