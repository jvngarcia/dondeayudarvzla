"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Acopio } from "@/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

const TIPOS = ["punto_fijo", "punto_movil", "organizacion"] as const;
const CATEGORIAS = ["agua", "comida", "ropa", "medicinas", "higiene", "cobijas", "voluntarios", "otros"];

export default function MapPageClient() {
  const [acopios, setAcopios] = useState<Acopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");

  useEffect(() => {
    fetch("/api/acopios")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar datos");
        return res.json();
      })
      .then((data) => {
        setAcopios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtrados = acopios.filter((a) => {
    if (filtroTipo && a.tipo !== filtroTipo) return false;
    if (filtroCategoria && !a.que_reciben.includes(filtroCategoria)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Cargando mapa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error al cargar los datos</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-white shadow-md p-3 z-[1000]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="punto_fijo">Punto fijo</option>
            <option value="punto_movil">Punto móvil</option>
            <option value="organizacion">Organización</option>
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Todo lo que reciben</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 relative">
        <LeafletMap acopios={filtrados} />
        <a
          href="/reportar"
          className="absolute bottom-6 right-4 bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl z-[1000] hover:bg-red-700 active:bg-red-800"
        >
          +
        </a>
        {filtrados.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded shadow z-[1000] text-sm text-gray-600">
            No hay lugares con esos filtros
          </div>
        )}
      </div>
    </div>
  );
}
