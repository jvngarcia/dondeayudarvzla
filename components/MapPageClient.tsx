"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import type { Acopio } from "@/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <SkeletonMap />,
});

const TIPOS = [
  { value: "", label: "Todos", color: "" },
  { value: "punto_fijo", label: "Fijo", color: "bg-blue-500" },
  { value: "punto_movil", label: "Móvil", color: "bg-orange-500" },
  { value: "organizacion", label: "Org", color: "bg-green-500" },
] as const;

const CATEGORIAS = ["agua", "comida", "ropa", "medicinas", "higiene", "cobijas", "voluntarios", "otros"];

function SkeletonMap() {
  return (
    <div className="h-full w-full flex flex-col bg-gray-100 animate-pulse">
      <div className="bg-white p-3">
        <div className="h-9 bg-gray-200 rounded-lg" />
      </div>
      <div className="flex-1 bg-gray-200 m-0" />
      <div className="bg-white p-3 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );
}

const TipoBadge = ({ tipo }: { tipo: string }) => {
  const colors: Record<string, string> = {
    punto_fijo: "bg-blue-100 text-blue-700 border-blue-300",
    punto_movil: "bg-orange-100 text-orange-700 border-orange-300",
    organizacion: "bg-green-100 text-green-700 border-green-300",
  };
  const labels: Record<string, string> = {
    punto_fijo: "Punto fijo",
    punto_movil: "Punto móvil",
    organizacion: "Organización",
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${colors[tipo] || "bg-gray-100 text-gray-600"}`}>
      {labels[tipo] || tipo}
    </span>
  );
};

export default function MapPageClient() {
  const [acopios, setAcopios] = useState<Acopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState<Acopio | null>(null);

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

  const filtrados = useMemo(() => {
    return acopios.filter((a) => {
      if (filtroTipo && a.tipo !== filtroTipo) return false;
      if (filtroCategoria && !a.que_reciben.includes(filtroCategoria)) return false;
      if (busqueda && !a.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
  }, [acopios, filtroTipo, filtroCategoria, busqueda]);

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
      <div className="bg-white shadow-sm p-2 z-[1000]">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar lugar..."
              className="w-full border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-shadow"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <SkeletonMap />
        ) : (
          <>
            <LeafletMap acopios={filtrados} onMarkerClick={setSelected} />

            <a
              href="/reportar"
              className="absolute bottom-20 right-4 bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl z-[1000] hover:bg-red-700 active:bg-red-800 transition-transform active:scale-95"
            >
              +
            </a>

            {filtrados.length === 0 && !loading && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded shadow z-[1000] text-sm text-gray-600">
                No hay lugares con esos filtros
              </div>
            )}

            {selected && (
              <>
                <div
                  className="absolute inset-0 z-[1000]"
                  onClick={() => setSelected(null)}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1001] animate-slide-up max-h-[50vh] overflow-y-auto"
                  style={{ animation: "slideUp 0.2s ease-out" }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight">{selected.nombre}</h3>
                        <TipoBadge tipo={selected.tipo} />
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {selected.foto_url && (
                      <img
                        src={selected.foto_url}
                        alt={selected.nombre}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">📍</span>
                        <span className="text-gray-700">{selected.direccion}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">📞</span>
                        <span className="text-gray-700">{selected.contacto}</span>
                      </div>
                      {selected.horario && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">🕐</span>
                          <span className="text-gray-700">{selected.horario}</span>
                        </div>
                      )}
                      {selected.que_reciben.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">📦</span>
                          <div className="flex flex-wrap gap-1">
                            {selected.que_reciben.map((q) => (
                              <span
                                key={q}
                                className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {q}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {selected.lat && selected.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block w-full bg-red-600 text-white py-3 rounded-lg text-center font-medium hover:bg-red-700 transition-colors"
                      >
                        🗺️ Cómo llegar
                      </a>
                    )}
                  </div>
                </div>

                <style jsx>{`
                  @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                  }
                `}</style>
              </>
            )}
          </>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 px-2 py-2 z-[1000]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() => setFiltroTipo(t.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtroTipo === t.value
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.color && <span className={`w-2 h-2 rounded-full ${t.color}`} />}
              {t.label}
            </button>
          ))}
          <span className="w-px bg-gray-300 mx-1" />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(filtroCategoria === cat ? "" : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtroCategoria === cat
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
