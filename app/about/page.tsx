import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <span className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
          D
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dónde Ayudar Vzla</h1>
        <p className="text-gray-600 mb-4">
          Encuentra puntos de acopio y organizaciones para donar en Venezuela.
          Un mapa colaborativo para conectar a quienes necesitan ayuda con quienes pueden darla.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Proyecto de código abierto. Los datos se actualizan constantemente gracias a los reportes de la comunidad.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Volver al mapa
          </Link>
          <a
            href="https://github.com/jvngarcia/dondeayudarvzla"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
