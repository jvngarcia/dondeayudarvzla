"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Acopio } from "@/types";

function createDivIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const icons: Record<string, L.DivIcon> = {
  punto_fijo: createDivIcon("#3b82f6"),
  punto_movil: createDivIcon("#f97316"),
  organizacion: createDivIcon("#22c55e"),
};

interface LeafletMapProps {
  acopios: Acopio[];
  centro?: [number, number];
  onMarkerClick?: (acopio: Acopio) => void;
}

export default function LeafletMap({ acopios, centro = [10.4806, -66.9036], onMarkerClick }: LeafletMapProps) {
  return (
    <MapContainer center={centro} zoom={12} className="h-full w-full" zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {acopios.map((acopio) => (
        <Marker
          key={acopio.id}
          position={[acopio.lat ?? centro[0], acopio.lng ?? centro[1]]}
          icon={icons[acopio.tipo] || icons.punto_fijo}
          eventHandlers={{
            click: () => onMarkerClick?.(acopio),
          }}
        />
      ))}
    </MapContainer>
  );
}
