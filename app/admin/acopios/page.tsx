"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Acopio, Recurso } from "@/types";

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
  const [recursosCatalogo, setRecursosCatalogo] = useState<Recurso[]>([]);

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
      .select(`
        *,
        recursos:acopio_recursos(
          recurso:recurso_id(*)
        )
      `)
      .in("status", ["aprobado", "rechazado"])
      .order("created_at", { ascending: false });

    if (data) {
      const formatted = data.map((item: any) => ({
        ...item,
        recursos: (item.recursos || []).map((r: any) => r.recurso),
      }));
      setAcopios(formatted);
    }

    const { data: recursos } = await supabase.from("recursos").select("*").order("nombre");
    if (recursos) setRecursosCatalogo(recursos);

    setLoading(false);
  };

  const startEdit = (acopio: Acopio) => {
    setEditingId(acopio.id);
    setEditForm({
      ...acopio,
      recursos: acopio.recursos || [],
    });
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
        estado_insumos: editForm.estado_insumos,
        categoria: editForm.categoria,
        lat: editForm.lat,
        lng: editForm.lng,
      })
      .eq("id", editingId);

    if (!error) {
      await supabase.from("acopio_recursos").delete().eq("acopio_id", editingId);

      const selectedIds = (editForm.recursos as Recurso[])?.map((r: Recurso) => r.id) || [];
      if (selectedIds.length > 0) {
        await supabase.from("acopio_recursos").insert(
          selectedIds.map((recursoId: string) => ({
            acopio_id: editingId,
            recurso_id: recursoId,
          }))
        );
      }

      setEditingId(null);
      loadAcopios();
    }
  };

  const toggleRecursoEdit = (recursoId: string) => {
    const current = (editForm.recursos as Recurso[]) || [];
    const exists = current.find((r: Recurso) => r.id === recursoId);
    if (exists) {
      setEditForm({ ...editForm, recursos: current.filter((r: Recurso) => r.id !== recursoId) });
    } else {
      const recurso = recursosCatalogo.find((r) => r.id === recursoId);
      if (recurso) {
        setEditForm({ ...editForm, recursos: [...current, recurso] });
      }
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
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Recursos que necesitan</label>
                        <div className="flex flex-wrap gap-1.5">
                          {recursosCatalogo.map((r) => {
                            const isSelected = (editForm.recursos as Recurso[])?.some((er: Recurso) => er.id === r.id);
                            return (
                              <button
                                key={r.id}
                                onClick={() => toggleRecursoEdit(r.id)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border-2 transition-all ${
                                  isSelected
                                    ? "bg-red-600 text-white border-red-600"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                                }`}
                              >
                                {r.nombre}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Estado de insumos</label>
                        <select
                          value={editForm.estado_insumos || ""}
                          onChange={(e) => setEditForm({ ...editForm, estado_insumos: (e.target.value || null) as any })}
                          className="border rounded px-2 py-1 w-full text-sm"
                        >
                          <option value="">No especificado</option>
                          <option value="full">Full - No necesitan</option>
                          <option value="necesita">Necesita insumos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                          value={editForm.categoria || "centro_acopio"}
                          onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value as any })}
                          className="border rounded px-2 py-1 w-full text-sm"
                        >
                          <option value="centro_acopio">Centro de Acopio</option>
                          <option value="refugio">Refugio</option>
                        </select>
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
                        acopio.categoria === "refugio" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"
                      }`}>
                        {acopio.categoria === "refugio" ? "Refugio" : "Centro de Acopio"}
                      </span>
                      <span className={`inline-block mt-2 ml-1 px-2 py-1 rounded text-xs font-medium ${
                        acopio.status === "aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {acopio.status === "aprobado" ? "Aprobado" : "Rechazado"}
                      </span>
                      {acopio.estado_insumos && (
                        <span className={`inline-block mt-2 ml-1 px-2 py-1 rounded text-xs font-medium ${
                          acopio.estado_insumos === "full" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {acopio.estado_insumos === "full" ? "Full" : "Necesita"}
                        </span>
                      )}
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
