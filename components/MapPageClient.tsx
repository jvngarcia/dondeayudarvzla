"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Acopio, EstadoInsumos } from "@/types";
import { SearchIcon, ReportIcon, LocationIcon, PhoneIcon, ClockIcon, PackageIcon, ExpandIcon, NavigationIcon } from "./icons";

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

const CategoriaBadge = ({ categoria }: { categoria: string }) => {
  if (categoria === "refugio") {
    return (
      <span className="inline-block text-xs px-2 py-0.5 rounded-full border bg-purple-100 text-purple-700 border-purple-300">
        Refugio
      </span>
    );
  }
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full border bg-red-100 text-red-700 border-red-300">
      Centro de Acopio
    </span>
  );
};

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

const EstadoInsumosBadge = ({ estado }: { estado: EstadoInsumos | null }) => {
  if (!estado) return null;
  const isFull = estado === "full";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
      isFull
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-orange-100 text-orange-700 border-orange-300"
    }`}>
      {isFull ? "Full" : "Necesita"}
    </span>
  );
};

function MarkerInfoContent({ acopio }: { acopio: Acopio }) {
  return (
    <div className="pb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{acopio.nombre}</h3>
          <div className="flex gap-1.5 mt-1">
            <CategoriaBadge categoria={acopio.categoria} />
            <TipoBadge tipo={acopio.tipo} />
            <EstadoInsumosBadge estado={acopio.estado_insumos} />
          </div>
        </div>
      </div>

      {acopio.foto_url && (
        <img
          src={acopio.foto_url}
          alt={acopio.nombre}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}

      <div className="space-y-2.5 text-sm">
        <div className="flex items-start gap-2.5">
          <span className="text-gray-400 mt-0.5 shrink-0">
            <LocationIcon className="w-4 h-4" />
          </span>
          <span className="text-gray-700">{acopio.direccion}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="text-gray-400 mt-0.5 shrink-0">
            <PhoneIcon className="w-4 h-4" />
          </span>
          <span className="text-gray-700">{acopio.contacto}</span>
        </div>
        {acopio.horario && (
          <div className="flex items-start gap-2.5">
            <span className="text-gray-400 mt-0.5 shrink-0">
              <ClockIcon className="w-4 h-4" />
            </span>
            <span className="text-gray-700">{acopio.horario}</span>
          </div>
        )}
        {acopio.que_reciben.length > 0 && (
          <div className="flex items-start gap-2.5">
            <span className="text-gray-400 mt-0.5 shrink-0">
              <PackageIcon className="w-4 h-4" />
            </span>
            <div className="flex flex-wrap gap-1">
              {acopio.que_reciben.map((q) => (
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

      {acopio.lat && acopio.lng && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${acopio.lat},${acopio.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full bg-red-600 text-white py-3 rounded-lg text-center font-medium hover:bg-red-700 transition-colors"
        >
          <NavigationIcon className="w-5 h-5 inline-block mr-1.5 -mt-0.5" />
          Cómo llegar
        </a>
      )}
    </div>
  );
}

export default function MapPageClient() {
  const [acopios, setAcopios] = useState<Acopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [filtroCategoriaLugar, setFiltroCategoriaLugar] = useState<string>("");
  const [filtroEstadoInsumos, setFiltroEstadoInsumos] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState<Acopio | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

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
      if (filtroCategoriaLugar && a.categoria !== filtroCategoriaLugar) return false;
      if (filtroEstadoInsumos && a.estado_insumos !== filtroEstadoInsumos) return false;
      if (busqueda && !a.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
  }, [acopios, filtroTipo, filtroCategoria, filtroCategoriaLugar, filtroEstadoInsumos, busqueda]);

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

  if (loading) return <SkeletonMap />;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-white/80 backdrop-blur-md shadow-md p-2 z-[1000]">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar lugar..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <LeafletMap acopios={filtrados} onMarkerClick={setSelected} />

        <Link
          href="/reportar"
          className="absolute bottom-20 right-4 z-[1000] flex flex-col items-center gap-0.5 animate-fade-in"
        >
          <span className="bg-red-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 active:bg-red-800 transition-all active:scale-95">
            <ReportIcon className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-semibold text-red-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
            Reportar
          </span>
        </Link>

        {filtrados.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded shadow z-[1000] text-sm text-gray-600">
            No hay lugares con esos filtros
          </div>
        )}

        {selected && (
          <>
            <div
              className="absolute inset-0 z-[1000]"
              onClick={() => { setSelected(null); setSheetExpanded(false); }}
            />
            <div className="md:hidden">
              <div
                className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg rounded-t-2xl shadow-2xl z-[1001] overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  sheetExpanded ? "max-h-[80vh]" : "max-h-[45vh]"
                }`}
              >
                <div className="sticky top-0 bg-white rounded-t-2xl z-10">
                  <div className="flex justify-center pt-2 pb-1">
                    <button
                      onClick={() => setSheetExpanded(!sheetExpanded)}
                      className="w-10 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
                      aria-label={sheetExpanded ? "Contraer" : "Expandir"}
                    />
                  </div>
                </div>
                <MarkerInfoContent acopio={selected} />
              </div>
            </div>
            <div className="hidden md:block absolute top-4 left-4 w-96 max-w-[calc(100vw-2rem)] bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl z-[1001] overflow-y-auto max-h-[calc(100vh-8rem)]">
              <div className="flex justify-end pt-2 pr-2">
                <button
                  onClick={() => { setSelected(null); setSheetExpanded(false); }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              <div className="px-4 pb-4 -mt-1">
                <MarkerInfoContent acopio={selected} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 px-2 py-2 z-[1000]">
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
          {(["centro_acopio", "refugio"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoriaLugar(filtroCategoriaLugar === cat ? "" : cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtroCategoriaLugar === cat
                  ? cat === "refugio"
                    ? "bg-purple-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cat === "refugio" ? "bg-purple-500" : "bg-red-500"}`} />
              {cat === "refugio" ? "Refugio" : "Centro"}
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
          <span className="w-px bg-gray-300 mx-1" />
          {(["full", "necesita"] as const).map((est) => (
            <button
              key={est}
              onClick={() => setFiltroEstadoInsumos(filtroEstadoInsumos === est ? "" : est)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtroEstadoInsumos === est
                  ? est === "full"
                    ? "bg-green-600 text-white"
                    : "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {est === "full" ? "Full" : "Necesita"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
