"use client";

import { useEffect, useState } from "react";
import type { Recurso } from "@/types";
import { SearchIcon } from "./icons";

const CATEGORY_LABELS: Record<string, string> = {
  medico: "Médico",
  higiene: "Higiene",
  alimento: "Alimento",
  vestimenta: "Vestimenta",
  refugio: "Refugio",
  otro: "Otro",
};

export default function RecursoSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("/api/recursos")
      .then((res) => res.json())
      .then(setRecursos)
      .catch(() => {});
  }, []);

  const filtrados = recursos.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const grouped = filtrados.reduce<Record<string, Recurso[]>>((acc, r) => {
    if (!acc[r.categoria]) acc[r.categoria] = [];
    acc[r.categoria].push(r);
    return acc;
  }, {});

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar recurso..."
          className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
        />
      </div>

      {selected.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-2 mb-2">No necesita nada</p>
      )}

      {Object.entries(grouped).map(([categoria, items]) => (
        <div key={categoria} className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-1">
            {CATEGORY_LABELS[categoria] || categoria}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {items.map((r) => {
              const isSelected = selected.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    isSelected
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {r.nombre}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {filtrados.length === 0 && busqueda && (
        <p className="text-gray-400 text-sm text-center py-4">
          No se encontraron recursos
        </p>
      )}
    </div>
  );
}
