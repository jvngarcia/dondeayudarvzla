"use client";

import { EditIcon } from "./icons";

export default function UpdateAcopioButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 block w-full bg-white text-gray-700 border-2 border-gray-200 py-2.5 rounded-lg text-center font-medium hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] text-sm"
    >
      <EditIcon className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
      Actualizar información
    </button>
  );
}
