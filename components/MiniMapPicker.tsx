"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MiniMapPickerProps {
  lat: number | null;
  lng: number | null;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function MiniMapPicker({ lat, lng, onPositionChange }: MiniMapPickerProps) {
  const center: [number, number] = lat && lng ? [lat, lng] : [10.4806, -66.9036];

  return (
    <div className="space-y-2">
      <MapContainer
        center={center}
        zoom={lat && lng ? 14 : 12}
        className="h-48 w-full rounded-lg border"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={onPositionChange} />
        {lat && lng && <Marker position={[lat, lng]} />}
      </MapContainer>
      <p className="text-xs text-gray-500">
        Haz clic en el mapa para ajustar la ubicación exacta
      </p>
    </div>
  );
}
