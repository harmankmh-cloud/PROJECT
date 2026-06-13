export type LatLng = { lat: number; lng: number };

export type Stop = {
  id: string;
  address: string;
  coords?: LatLng;
  geocodeError?: string;
};

export type OptimizedRoute = {
  orderedStops: Stop[];
  totalDistanceKm: number;
};
