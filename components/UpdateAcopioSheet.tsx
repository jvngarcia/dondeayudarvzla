"use client";

import { useEffect, useState } from "react";
import type { Acopio } from "@/types";
import RecursoSelector from "./RecursoSelector";
import TokenVerification from "./TokenVerification";
import { CloseIcon } from "./icons";

export default function UpdateAcopioSheet({
  acopio,
  onClose,
  onSaved,
}: {
  acopio: Acopio;
  onClose: () => void;
  onSaved: (updated: Acopio) => void;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenStep, setTokenStep] = useState(true);
  const [selectedRecursos, setSelectedRecursos] = useState<string[]>(
    acopio.recursos.map((r) => r.id)
  );
  const [contacto, setContacto] = useState(acopio.contacto);
  const [horario, setHorario] = useState(acopio.horario || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (tokenStep) {
    return (
      <Overlay onClose={onClose}>
        <Header title="Actualizar información" onClose={onClose} />
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 mb-4">
            Ingresa el token de edición para modificar la información de este lugar.
          </p>
          <TokenVerification
            onVerified={(t) => {
              setToken(t);
              setTokenStep(false);
            }}
          />
        </div>
      </Overlay>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/acopios/${acopio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edit_token: token,
          recursos: selectedRecursos,
          contacto,
          horario: horario || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar");
      }

      const updated = await res.json();
      setSuccess(true);
      setTimeout(() => {
        onSaved(updated);
        onClose();
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <Header title="Actualizar información" onClose={onClose} />

      <div className="px-4 pb-6 space-y-4 overflow-y-auto max-h-[60vh]">
        <RecursoSelector
          selected={selectedRecursos}
          onChange={setSelectedRecursos}
        />

        <div className="border-t border-gray-100 pt-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Teléfono de contacto
          </label>
          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Horario
          </label>
          <input
            type="text"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            placeholder="Ej: 9am - 6pm"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
            Información actualizada
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[1002] animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:max-w-[480px] md:w-full md:mx-4 z-[1003] animate-slide-up">
        <div className="bg-white/95 backdrop-blur-lg rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
      <h3 className="font-semibold text-base">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
        aria-label="Cerrar"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
