"use client";

import { useState } from "react";

export default function TokenVerification({
  onVerified,
}: {
  onVerified: (token: string) => void;
}) {
  const [inputToken, setInputToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputToken.trim();
    if (trimmed.length < 3) {
      setError("El token debe tener al menos 3 caracteres");
      return;
    }
    setError(null);
    onVerified(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={inputToken}
        onChange={(e) => {
          setInputToken(e.target.value);
          setError(null);
        }}
        placeholder="Ingresa tu token de edición"
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
        autoComplete="off"
        maxLength={10}
      />
      {error && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={!inputToken.trim()}
        className="w-full bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        Verificar token
      </button>
    </form>
  );
}
