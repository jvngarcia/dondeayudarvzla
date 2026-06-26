"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Acopio } from "@/types";

const MiniMapPicker = dynamic(() => import("@/components/MiniMapPicker"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">Cargando mapa...</div>,
});

export default function AdminAcopiosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [acopios, setAcopios] = useState<Acopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Acopio>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) { router.push("/admin/login"); return; }
      setUser(u);
      loadAcopios();
    });
  }, []);

  const loadAcopios = async () => {
    const { data } = await supabase
      .from("acopios")
      .select("*")
      .in("status", ["aprobado", "rechazado"])
      .order("created_at", { ascending: false });

    if (data) setAcopios(data);
    setLoading(false);
  };

  const startEdit = (acopio: Acopio) => {
    setEditingId(acopio.id);
    setEditForm({ ...acopio });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    const { error } = await supabase
      .from("acopios")
      .update({
        nombre: editForm.nombre,
        tipo: editForm.tipo,
        direccion: editForm.direccion,
        contacto: editForm.contacto,
        horario: editForm.horario,
        que_reciben: editForm.que_reciben,
        lat: editForm.lat,
        lng: editForm.lng,
      })
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      loadAcopios();
    }
  };

  const deleteAcopio = async (id: string) => {
    if (!confirm("¿Eliminar este lugar?")) return;
    await supabase.from("acopios").update({ status: "rechazado" }).eq("id", id);
    loadAcopios();
  };

  if (loading) return <div className="p-8 text-gray-500">Cargando...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestionar lugares</h1>
        <div className="flex gap-2 items-center">
          <a href="/admin/dashboard" className="text-blue-600 text-sm hover:underline">
            Reportes pendientes
          </a>
          <button
            onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }}
            className="text-gray-500 text-sm hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {acopios.length === 0 ? (
          <p className="text-gray-500">No hay lugares gestionados aún.</p>
        ) : (
          <div className="space-y-4">
            {acopios.map((acopio) => (
              <div key={acopio.id} className="bg-white rounded-lg shadow overflow-hidden">
                {editingId === acopio.id ? (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          value={editForm.nombre || ""}
                          onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Contacto</label>
                        <input
                          value={editForm.contacto || ""}
                          onChange={(e) => setEditForm({ ...editForm, contacto: e.target.value })}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                          value={editForm.direccion || ""}
                          onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Horario</label>
                        <input
                          value={editForm.horario || ""}
                          onChange={(e) => setEditForm({ ...editForm, horario: e.target.value })}
                          className="border rounded px-2 py-1 w-full text-sm"
                          placeholder="Ej: 9am - 6pm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          acopio.status === "aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {acopio.status === "aprobado" ? "Aprobado" : "Rechazado"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ubicación en el mapa
                        {editForm.lat && editForm.lng && (
                          <span className="text-gray-400 font-normal ml-2">
                            ({editForm.lat.toFixed(4)}, {editForm.lng.toFixed(4)})
                          </span>
                        )}
                      </label>
                      <MiniMapPicker
                        lat={editForm.lat ?? null}
                        lng={editForm.lng ?? null}
                        onPositionChange={(lat, lng) => setEditForm({ ...editForm, lat, lng })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                        Guardar cambios
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start p-4">
                    <div className="flex-1">
                      <h3 className="font-bold">{acopio.nombre}</h3>
                      <p className="text-sm text-gray-600">{acopio.direccion}</p>
                      <p className="text-sm text-gray-500">{acopio.contacto}</p>
                      {acopio.lat && acopio.lng && (
                        <p className="text-xs text-gray-400 mt-1">
                          Coord: {acopio.lat.toFixed(4)}, {acopio.lng.toFixed(4)}
                        </p>
                      )}
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                        acopio.status === "aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {acopio.status === "aprobado" ? "Aprobado" : "Rechazado"}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => startEdit(acopio)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Editar
                      </button>
                      <button onClick={() => deleteAcopio(acopio.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
