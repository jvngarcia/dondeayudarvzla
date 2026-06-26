"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { TipoAcopio } from "@/types";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
const CATEGORIAS = ["agua", "comida", "ropa", "medicinas", "higiene", "cobijas", "voluntarios", "otros"];

export default function ReportarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "punto_fijo" as TipoAcopio,
    direccion: "",
    contacto: "",
    horario: "",
    que_reciben: [] as string[],
  });
  const [foto, setFoto] = useState<File | null>(null);

  const toggleCategoria = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      que_reciben: prev.que_reciben.includes(cat)
        ? prev.que_reciben.filter((c) => c !== cat)
        : [...prev.que_reciben, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.direccion || !form.contacto) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    if (!turnstileToken) {
      setError("Espera a que se verifique el formulario");
      return;
    }

    setLoading(true);
    setError(null);

    const body = new FormData();
    body.append("nombre", form.nombre);
    body.append("tipo", form.tipo);
    body.append("direccion", form.direccion);
    body.append("contacto", form.contacto);
    body.append("horario", form.horario);
    body.append("que_reciben", form.que_reciben.join(","));
    if (foto) body.append("foto", foto);

    try {
      const res = await fetch("/api/acopios/reportar", {
        method: "POST",
        headers: { "x-turnstile-token": turnstileToken },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar reporte");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">¡Reporte enviado!</h1>
          <p className="text-gray-600 mb-6">
            Tu reporte será revisado y aprobado pronto. Gracias por ayudar.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="max-w-lg mx-auto p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-6">Reportar lugar de acopio</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del lugar *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ej: Cruz Roja Caracas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoAcopio })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="punto_fijo">Punto fijo</option>
              <option value="punto_movil">Punto móvil</option>
              <option value="organizacion">Organización</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ej: Av. Principal, Los Palos Grandes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto *
            </label>
            <input
              type="text"
              value={form.contacto}
              onChange={(e) => setForm({ ...form, contacto: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Teléfono, Instagram, WhatsApp..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horario
            </label>
            <input
              type="text"
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ej: 9am - 6pm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué reciben?
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategoria(cat)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    form.que_reciben.includes(cat)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback={(token: string) => setTurnstileToken(token)}
          />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar reporte"}
          </button>
        </form>
      </div>
    </div>
  );
}
