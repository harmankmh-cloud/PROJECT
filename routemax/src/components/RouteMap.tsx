import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { LatLng } from "../types";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="background:#10b981;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const startIcon = L.divIcon({
  className: "",
  html: `<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

type Props = {
  start: LatLng;
  stops: LatLng[];
};

export function RouteMap({ start, stops }: Props) {
  const all = [start, ...stops];
  const center: [number, number] = [
    all.reduce((s, p) => s + p.lat, 0) / all.length,
    all.reduce((s, p) => s + p.lng, 0) / all.length,
  ];

  const line: [number, number][] = all.map((p) => [p.lat, p.lng]);

  return (
    <MapContainer center={center} zoom={11} className="h-52 w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[start.lat, start.lng]} icon={startIcon}>
        <Tooltip permanent direction="top" offset={[0, -8]}>
          Start
        </Tooltip>
      </Marker>
      {stops.map((stop, i) => (
        <Marker key={`${stop.lat}-${stop.lng}-${i}`} position={[stop.lat, stop.lng]} icon={pinIcon}>
          <Tooltip permanent direction="top" offset={[0, -8]}>
            {i + 1}
          </Tooltip>
        </Marker>
      ))}
      <Polyline positions={line} pathOptions={{ color: "#10b981", weight: 4, opacity: 0.85 }} />
    </MapContainer>
  );
}
