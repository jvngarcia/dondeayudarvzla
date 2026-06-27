"use client";

import Link from "next/link";
import { ChevronLeftIcon, DocsIcon } from "@/components/icons";

const BASE_URL = "https://dondeayudarvzla.com/api/v1";

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
      {children}
    </pre>
  );
}

function CopyButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded transition-colors"
    >
      Copiar
    </button>
  );
}

function EndpointSection() {
  return (
    <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-500 text-white font-bold text-xs px-2 py-0.5 rounded">GET</span>
        <code className="text-sm font-mono text-gray-800">/acopios</code>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Obtiene todos los lugares de acopio aprobados.
      </p>

      <h4 className="font-medium text-sm text-gray-700 mb-2">Parámetros de filtro (opcionales)</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-3 py-2 font-medium text-gray-600">Parámetro</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Tipo</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Descripción</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Ejemplo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              ["filter[ciudad]", "string", "Filtrar por ciudad (case-insensitive)", "?filter[ciudad]=Caracas"],
              ["filter[tipo]", "string", "punto_fijo, punto_movil, organizacion", "?filter[tipo]=organizacion"],
              ["filter[estado_insumos]", "string", "full, necesita", "?filter[estado_insumos]=necesita"],
              ["filter[recurso]", "string", "Filtrar por nombre de recurso que necesitan", "?filter[recurso]=agua"],
            ].map(([param, type, desc, example]) => (
              <tr key={param}>
                <td className="px-3 py-2"><code className="text-red-600 text-xs">{param}</code></td>
                <td className="px-3 py-2 text-gray-600">{type}</td>
                <td className="px-3 py-2 text-gray-600">{desc}</td>
                <td className="px-3 py-2"><code className="text-xs bg-gray-100 px-1 rounded">{example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="font-medium text-sm text-gray-700 mb-2">Ejemplos de uso</h4>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">curl</p>
          <div className="relative">
            <CodeBlock>{`curl "${BASE_URL}/acopios?filter[ciudad]=Caracas&filter[estado_insumos]=necesita"`}</CodeBlock>
            <CopyButton code={`curl "${BASE_URL}/acopios?filter[ciudad]=Caracas&filter[estado_insumos]=necesita"`} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">JavaScript (fetch)</p>
          <div className="relative">
            <CodeBlock>{`const response = await fetch(
  "${BASE_URL}/acopios?filter[ciudad]=Caracas"
);
const data = await response.json();
console.log(data);`}</CodeBlock>
            <CopyButton code={`const response = await fetch("${BASE_URL}/acopios?filter[ciudad]=Caracas");\nconst data = await response.json();\nconsole.log(data);`} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Python (requests)</p>
          <div className="relative">
            <CodeBlock>{`import requests

response = requests.get(
    "${BASE_URL}/acopios",
    params={"filter[ciudad]": "Caracas"}
)
data = response.json()
print(data)`}</CodeBlock>
            <CopyButton code={`import requests\n\nresponse = requests.get(\n    "${BASE_URL}/acopios",\n    params={"filter[ciudad]": "Caracas"}\n)\ndata = response.json()\nprint(data)`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SchemaTable() {
  const fields = [
    ["nombre", "string", "Nombre del lugar de acopio"],
    ["tipo", "string", "punto_fijo, punto_movil, organizacion"],
    ["direccion", "string", "Dirección del lugar"],
    ["ciudad", "string", "Ciudad donde se ubica"],
    ["estado", "string", "Estado/región de Venezuela"],
    ["lat", "float | null", "Latitud para el mapa"],
    ["lng", "float | null", "Longitud para el mapa"],
    ["contacto", "string", "Información de contacto"],
    ["horario", "string | null", "Horario de atención"],
    ["recursos", "object[]", "Lista de recursos que necesitan (id, nombre, descripcion, categoria)"],
    ["estado_insumos", "string | null", "full (abastecido) o necesita"],
    ["foto_url", "string | null", "URL de la foto del lugar"],
    ["created_at", "string (ISO)", "Fecha de creación"],
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-3 py-2 font-medium text-gray-600">Campo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">Tipo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">Descripción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {fields.map(([field, type, desc]) => (
            <tr key={field}>
              <td className="px-3 py-2"><code className="text-red-600 text-xs">{field}</code></td>
              <td className="px-3 py-2 text-gray-600 text-xs">{type}</td>
              <td className="px-3 py-2 text-gray-600 text-xs">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Volver al mapa
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <DocsIcon className="w-5 h-5 text-red-600" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Dónde Ayudar Vzla</h1>
            <p className="text-sm text-gray-500">
              API REST con formato JSON:API para consultar lugares de acopio en Venezuela
            </p>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h2>
          <code className="text-sm bg-gray-100 px-3 py-1.5 rounded text-gray-800 block">
            {BASE_URL}
          </code>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h2>
          <EndpointSection />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schema de datos</h2>
          <SchemaTable />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Formato de respuesta</h2>
          <p className="text-sm text-gray-600 mb-3">
            La API sigue la especificación <a href="https://jsonapi.org" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">JSON:API 1.0</a>.
          </p>
          <div className="relative">
            <CodeBlock>{`{
  "data": [
    {
      "type": "acopios",
      "id": "uuid-del-lugar",
      "attributes": {
        "nombre": "Cruz Roja Venezolana",
        "tipo": "organizacion",
        "direccion": "Av. Andrés Bello, Caracas",
        "ciudad": "Caracas",
        "estado": "Distrito Capital",
        "lat": 10.4961,
        "lng": -66.85,
        "contacto": "(0212) 555-1234",
        "horario": "8am - 6pm",
        "recursos": [
          { "id": "uuid-recurso-1", "nombre": "Medicinas", "descripcion": null, "categoria": "medico" },
          { "id": "uuid-recurso-2", "nombre": "Voluntarios", "descripcion": null, "categoria": "otro" }
        ],
        "estado_insumos": "necesita",
        "foto_url": null,
        "created_at": "2026-06-26T00:00:00Z"
      }
    }
  ],
  "meta": {
    "total": 1
  },
  "jsonapi": {
    "version": "1.0"
  }
}`}</CodeBlock>
            <CopyButton code={`{\n  "data": [\n    {\n      "type": "acopios",\n      "id": "uuid-del-lugar",\n      "attributes": {\n        "nombre": "Cruz Roja Venezolana",\n        "tipo": "organizacion",\n        "direccion": "Av. Andrés Bello, Caracas",\n        "ciudad": "Caracas",\n        "estado": "Distrito Capital",\n        "lat": 10.4961,\n        "lng": -66.85,\n        "contacto": "(0212) 555-1234",\n        "horario": "8am - 6pm",\n        "recursos": [\n          { "id": "uuid-recurso-1", "nombre": "Medicinas", "descripcion": null, "categoria": "medico" },\n          { "id": "uuid-recurso-2", "nombre": "Voluntarios", "descripcion": null, "categoria": "otro" }\n        ],\n        "estado_insumos": "necesita",\n        "foto_url": null,\n        "created_at": "2026-06-26T00:00:00Z"\n      }\n    }\n  ],\n  "meta": {\n    "total": 1\n  },\n  "jsonapi": {\n    "version": "1.0"\n  }\n}`} />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notas</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Paginación no implementada aún (volumen de datos actual &lt; 100 registros).</li>
            <li>Todos los endpoints son públicos y no requieren autenticación.</li>
            <li>Los datos se actualizan en tiempo real a medida que los administradores aprueban reportes.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
