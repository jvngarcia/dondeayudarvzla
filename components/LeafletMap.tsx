"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Acopio } from "@/types";
import LocateControl from "./LocateControl";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const FALLBACK_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const TYPE_COLORS: Record<string, string> = {
  punto_fijo: "#3b82f6",
  punto_movil: "#f97316",
  organizacion: "#22c55e",
};

function MarkerIcon({ color, tipo }: { color: string; tipo: string }) {
  const icons: Record<string, string> = {
    punto_fijo: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    punto_movil: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    organizacion: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d={icons[tipo] || icons.punto_fijo} />
    </svg>
  );
}

function createRichIcon(color: string, tipo: string): L.DivIcon {
  const iconSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="${
      {
        punto_fijo: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        punto_movil: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
        organizacion: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
      }[tipo] || ""
    }"/></svg>`
  );

  return L.divIcon({
    className: "marker-bounce-in",
    html: `<div class="marker-pin" style="
      width: 36px; height: 36px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    "><img src="data:image/svg+xml,${iconSvg}" alt="" width="14" height="14" /></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const icons: Record<string, L.DivIcon> = {
  punto_fijo: createRichIcon("#3b82f6", "punto_fijo"),
  punto_movil: createRichIcon("#f97316", "punto_movil"),
  organizacion: createRichIcon("#22c55e", "organizacion"),
};

function TileErrorHandler() {
  const map = useMap();
  map.on("tileerror", () => {
    const container = map.getContainer();
    if (container.dataset.fallback !== "true") {
      container.dataset.fallback = "true";
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(FALLBACK_URL);
        }
      });
    }
  });
  return null;
}

interface LeafletMapProps {
  acopios: Acopio[];
  centro?: [number, number];
  onMarkerClick?: (acopio: Acopio) => void;
}

export default function LeafletMap({ acopios, centro = [10.4806, -66.9036], onMarkerClick }: LeafletMapProps) {
  return (
    <MapContainer center={centro} zoom={12} className="h-full w-full" zoomControl={true}>
      <TileLayer attribution={ATTRIBUTION} url={TILE_URL} />
      <TileErrorHandler />
      <LocateControl />
      <MarkerClusterGroup
        chunkedLoading
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        disableClusteringAtZoom={16}
      >
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
      </MarkerClusterGroup>
    </MapContainer>
  );
}
