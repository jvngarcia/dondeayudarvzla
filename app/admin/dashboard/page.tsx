"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Acopio } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pending, setPending] = useState<Acopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) {
        router.push("/admin/login");
        return;
      }
      setUser(u);
      loadPending();
    });
  }, []);

  const loadPending = async () => {
    const { data } = await supabase
      .from("acopios")
      .select("*")
      .eq("status", "pendiente")
      .order("created_at", { ascending: false });

    if (data) setPending(data);
    setLoading(false);
  };

  const handleStatus = async (id: string, status: "aprobado" | "rechazado") => {
    setProcessing(id);
    await supabase
      .from("acopios")
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
      .eq("id", id);

    setPending((prev) => prev.filter((a) => a.id !== id));
    setProcessing(null);
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Cargando...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
        <div className="flex gap-2 items-center">
          <a href="/admin/acopios" className="text-blue-600 text-sm hover:underline">
            Gestionar lugares
          </a>
          <button
            onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }}
            className="text-gray-500 text-sm hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">
          Reportes pendientes ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <p className="text-gray-500">No hay reportes pendientes.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((acopio) => (
              <div key={acopio.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{acopio.nombre}</h3>
                    <p className="text-gray-600 text-sm">
                      {acopio.tipo === "punto_fijo" ? "Punto fijo" : acopio.tipo === "punto_movil" ? "Punto móvil" : "Organización"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium">Dirección:</span> {acopio.direccion}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Contacto:</span> {acopio.contacto}
                    </p>
                    {acopio.horario && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Horario:</span> {acopio.horario}
                      </p>
                    )}
                    {acopio.que_reciben.length > 0 && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Reciben:</span> {acopio.que_reciben.join(", ")}
                      </p>
                    )}
                    {acopio.lat && acopio.lng && (
                      <p className="text-gray-400 text-xs mt-1">
                        Coordenadas: {acopio.lat.toFixed(4)}, {acopio.lng.toFixed(4)}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      Reportado: {new Date(acopio.created_at).toLocaleString("es-VE")}
                    </p>
                  </div>
                  {acopio.foto_url && (
                    <img src={acopio.foto_url} alt="" className="w-24 h-24 object-cover rounded ml-4" />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleStatus(acopio.id, "aprobado")}
                    disabled={processing === acopio.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {processing === acopio.id ? "Procesando..." : "Aprobar"}
                  </button>
                  <button
                    onClick={() => handleStatus(acopio.id, "rechazado")}
                    disabled={processing === acopio.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
