"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { TipoAcopio, EstadoInsumos } from "@/types";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
const CATEGORIAS = ["agua", "comida", "ropa", "medicinas", "higiene", "cobijas", "voluntarios", "otros"];

export default function ReportarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!turnstileReady || !turnstileRef.current || renderedRef.current) return;
    renderedRef.current = true;
    (window as any).turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
    });
  }, [turnstileReady]);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "punto_fijo" as TipoAcopio,
    direccion: "",
    contacto: "",
    horario: "",
    que_reciben: [] as string[],
    estado_insumos: null as EstadoInsumos | null,
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleCategoria = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      que_reciben: prev.que_reciben.includes(cat)
        ? prev.que_reciben.filter((c) => c !== cat)
        : [...prev.que_reciben, cat],
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.direccion.trim()) errs.direccion = "La dirección es obligatoria";
    if (!form.contacto.trim()) errs.contacto = "El contacto es obligatorio";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
    if (form.estado_insumos) body.append("estado_insumos", form.estado_insumos);
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
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">¡Reporte enviado!</h1>
          <p className="text-gray-600 mb-6">
            Tu reporte será revisado y aprobado pronto. Gracias por ayudar.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors w-full"
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
        onLoad={() => setTurnstileReady(true)}
      />

      <div className="max-w-lg mx-auto p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 mb-4 flex items-center gap-1 text-sm"
        >
          ← Volver
        </button>

        <h1 className="text-xl font-bold mb-6">Reportar lugar de acopio</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del lugar *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setErrors({ ...errors, nombre: "" }); }}
              className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-300 transition-all ${
                errors.nombre ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400"
              }`}
              placeholder="Ej: Cruz Roja Caracas"
            />
            {errors.nombre && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tipo *
            </label>
            <div className="flex gap-2">
              {(["punto_fijo", "punto_movil", "organizacion"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: t })}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.tipo === t
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {t === "punto_fijo" ? "📍 Fijo" : t === "punto_movil" ? "🚐 Móvil" : "🏢 Org"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Dirección *
            </label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => { setForm({ ...form, direccion: e.target.value }); setErrors({ ...errors, direccion: "" }); }}
              className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-300 transition-all ${
                errors.direccion ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400"
              }`}
              placeholder="Ej: Av. Principal, Los Palos Grandes"
            />
            {errors.direccion && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.direccion}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contacto *
            </label>
            <input
              type="text"
              value={form.contacto}
              onChange={(e) => { setForm({ ...form, contacto: e.target.value }); setErrors({ ...errors, contacto: "" }); }}
              className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-300 transition-all ${
                errors.contacto ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400"
              }`}
              placeholder="Teléfono, Instagram, WhatsApp..."
            />
            {errors.contacto && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.contacto}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Horario
            </label>
            <input
              type="text"
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                    form.que_reciben.includes(cat)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de insumos
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, estado_insumos: null })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  form.estado_insumos === null
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                No especificar
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, estado_insumos: "full" })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  form.estado_insumos === "full"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                Full - No necesitan
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, estado_insumos: "necesita" })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  form.estado_insumos === "necesita"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                Necesita insumos
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Foto (opcional)
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-red-400 transition-colors">
              <span className="text-2xl">📸</span>
              <div className="flex-1 text-sm text-gray-500">
                {foto ? foto.name : "Toca para agregar una foto del lugar"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div ref={turnstileRef} />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar reporte"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
