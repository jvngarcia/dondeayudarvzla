"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Acopio } from "@/types";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  acopios: Acopio[];
  centro?: [number, number];
}

export default function LeafletMap({ acopios, centro = [10.4806, -66.9036] }: LeafletMapProps) {
  return (
    <MapContainer
      center={centro}
      zoom={12}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {acopios.map((acopio) => (
        <Marker
          key={acopio.id}
          position={[acopio.lat ?? centro[0], acopio.lng ?? centro[1]]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="text-sm max-w-[250px]">
              <h3 className="font-bold text-base mb-1">{acopio.nombre}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Tipo:</span>{" "}
                {acopio.tipo === "punto_fijo" ? "Punto fijo" : acopio.tipo === "punto_movil" ? "Punto móvil" : "Organización"}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Dirección:</span> {acopio.direccion}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Contacto:</span> {acopio.contacto}
              </p>
              {acopio.horario && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Horario:</span> {acopio.horario}
                </p>
              )}
              {acopio.que_reciben.length > 0 && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Reciben:</span>{" "}
                  {acopio.que_reciben.join(", ")}
                </p>
              )}
              {acopio.foto_url && (
                <img
                  src={acopio.foto_url}
                  alt={acopio.nombre}
                  className="w-full h-32 object-cover rounded mt-1"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
