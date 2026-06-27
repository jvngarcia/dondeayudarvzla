"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Acopio } from "@/types";
import LocateControl from "./LocateControl";
import { useMemo } from "react";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const FALLBACK_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const TYPE_COLORS: Record<string, string> = {
  punto_fijo: "#3b82f6",
  punto_movil: "#f97316",
  organizacion: "#22c55e",
};

const CATEGORIA_COLOR = "#8b5cf6";

// SVG Paths individuales
const PATHS: Record<string, string> = {
  refugio: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  punto_fijo: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  punto_movil: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
  organizacion: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
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
  
  // 🟢 FILTRADO ULTRA ESTRICTO: Sanitiza las coordenadas antes de pasárselas a Leaflet
  const acopiosValidos = useMemo(() => {
    return acopios.filter((a) => {
      if (!a) return false;
      
      // Forzar conversión a número por si vienen como strings desde la API
      const lat = Number(a.lat);
      const lng = Number(a.lng);
      
      // Validar que sean números reales, finitos y estén en rangos geográficos reales
      const esLatValida = !isNaN(lat) && isFinite(lat) && lat >= -90 && lat <= 90;
      const esLngValida = !isNaN(lng) && isFinite(lng) && lng >= -180 && lng <= 180;
      
      // Evitar coordenadas exactamente en 0,0 si denotan errores de inserción
      if (lat === 0 && lng === 0) return false;

      return esLatValida && esLngValida;
    });
  }, [acopios]);

  // 🟢 FUNCIÓN OPTIMIZADA INTERNA: Crea el DivIcon de forma segura
  const createIcon = (categoria: string, tipo: string) => {
    const isRefugio = categoria === "refugio";
    const color = isRefugio ? CATEGORIA_COLOR : (TYPE_COLORS[tipo] || TYPE_COLORS.punto_fijo);
    const activePath = isRefugio ? PATHS.refugio : (PATHS[tipo] || PATHS.punto_fijo);
    
    const iconSvg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="${activePath}"/></svg>`
    );

    return L.divIcon({
      className: "marker-wrapper",
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
  };

  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    
    // Puedes elegir un color fijo (ej. un gris oscuro o azul) para los círculos de agrupación
    const clusterColor = TYPE_COLORS.punto_fijo; 

    return L.divIcon({
      html: `<div style="
        width: 40px; height: 40px;
        background: ${clusterColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        font-family: sans-serif;
      "><span>${count}</span></div>`,
      className: "custom-cluster-marker", // Clase limpia para evitar estilos heredados
      iconSize: L.point(40, 40, true),
    });
  };

  

  return (
    <MapContainer center={centro} zoom={12} className="h-full w-full" zoomControl={true}>
      <TileLayer attribution={ATTRIBUTION} url={TILE_URL} />
      <TileErrorHandler />
      <LocateControl />
      <MarkerClusterGroup
        chunkedLoading={true}
        chunkInterval={40}
        chunkDelay={15}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        disableClusteringAtZoom={16}
        iconCreateFunction={createClusterCustomIcon}
      >
        {acopiosValidos.map((acopio) => (
          <Marker
            key={acopio.id}
            // Aseguramos pasar los valores ya transformados a tipo Number puro
            position={[Number(acopio.lat), Number(acopio.lng)]}
            icon={createIcon(acopio.categoria, acopio.tipo)}
            eventHandlers={{
              click: () => onMarkerClick?.(acopio),
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}