"use client";

import { useMap } from "react-leaflet";
import { useState, useCallback } from "react";

export default function LocateControl() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 15, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [map]);

  return (
    <div className="leaflet-control-zoom leaflet-bar" style={{ border: "none" }}>
      <a
        className={`locate-control ${locating ? "locating" : ""}`}
        onClick={handleLocate}
        href="#"
        role="button"
        title="Mi ubicación"
        aria-label="Mi ubicación"
        style={{ textDecoration: "none" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
        </svg>
      </a>
    </div>
  );
}
