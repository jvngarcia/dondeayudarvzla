import { NextResponse } from "next/server";

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Dónde Ayudar Vzla</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; color: #111; line-height: 1.6; }
    header { background: #dc2626; color: white; padding: 2rem; text-align: center; }
    header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    header p { opacity: 0.9; }
    main { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    section { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h2 { font-size: 1.3rem; margin-bottom: 1rem; color: #dc2626; }
    h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #374151; }
    .endpoint { background: #f3f4f6; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    .method { display: inline-block; background: #22c55e; color: white; font-weight: bold; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; letter-spacing: 0.5px; }
    .url { font-family: monospace; font-size: 0.9rem; margin-left: 0.5rem; color: #1f2937; }
    .desc { margin-top: 0.5rem; color: #4b5563; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 0.5rem; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; color: #374151; }
    code { background: #f3f4f6; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.85rem; font-family: monospace; }
    pre { background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; margin-top: 0.5rem; }
    .attr-table { margin-top: 1rem; }
    footer { text-align: center; padding: 2rem; color: #9ca3af; font-size: 0.85rem; }
    a { color: #dc2626; }
  </style>
</head>
<body>
  <header>
    <h1>API Dónde Ayudar Vzla</h1>
    <p>API REST con formato JSON:API para consultar lugares de acopio en Venezuela</p>
  </header>

  <main>
    <section>
      <h2>Base URL</h2>
      <code>https://dondeayudarvzla.com/api/v1</code>
    </section>

    <section>
      <h2>Endpoints</h2>

      <div class="endpoint">
        <span class="method">GET</span><span class="url">/acopios</span>
        <p class="desc">Obtiene todos los lugares de acopio aprobados.</p>

        <h3 style="margin-top: 1rem;">Parámetros de filtro (opcionales)</h3>
        <table>
          <thead>
            <tr><th>Parámetro</th><th>Tipo</th><th>Descripción</th><th>Ejemplo</th></tr>
          </thead>
          <tbody>
            <tr><td><code>filter[ciudad]</code></td><td>string</td><td>Filtrar por ciudad (búsqueda case-insensitive)</td><td><code>?filter[ciudad]=Caracas</code></td></tr>
            <tr><td><code>filter[tipo]</code></td><td>string</td><td>Filtrar por tipo: <code>punto_fijo</code>, <code>punto_movil</code>, <code>organizacion</code></td><td><code>?filter[tipo]=organizacion</code></td></tr>
            <tr><td><code>filter[estado_insumos]</code></td><td>string</td><td>Filtrar por estado de insumos: <code>full</code>, <code>necesita</code></td><td><code>?filter[estado_insumos]=necesita</code></td></tr>
            <tr><td><code>filter[recurso]</code></td><td>string</td><td>Filtrar por nombre de recurso que necesitan</td><td><code>?filter[recurso]=agua</code></td></tr>
          </tbody>
        </table>

        <h3 style="margin-top: 1rem;">Ejemplo con curl</h3>
        <pre>curl https://dondeayudarvzla.com/api/v1/acopios?filter[ciudad]=Caracas&filter[estado_insumos]=necesita</pre>

        <h3 style="margin-top: 1rem;">Respuesta (JSON:API)</h3>
        <pre>{
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
}</pre>
      </div>
    </section>

    <section>
      <h2>Schema de datos</h2>
      <table class="attr-table">
        <thead>
          <tr><th>Campo</th><th>Tipo</th><th>Descripción</th></tr>
        </thead>
        <tbody>
          <tr><td><code>nombre</code></td><td>string</td><td>Nombre del lugar de acopio</td></tr>
          <tr><td><code>tipo</code></td><td>string</td><td><code>punto_fijo</code>, <code>punto_movil</code> o <code>organizacion</code></td></tr>
          <tr><td><code>direccion</code></td><td>string</td><td>Dirección del lugar</td></tr>
          <tr><td><code>ciudad</code></td><td>string</td><td>Ciudad donde se ubica</td></tr>
          <tr><td><code>estado</code></td><td>string</td><td>Estado/región de Venezuela</td></tr>
          <tr><td><code>lat</code></td><td>float or null</td><td>Latitud para el mapa</td></tr>
          <tr><td><code>lng</code></td><td>float or null</td><td>Longitud para el mapa</td></tr>
          <tr><td><code>contacto</code></td><td>string</td><td>Información de contacto</td></tr>
          <tr><td><code>horario</code></td><td>string or null</td><td>Horario de atención</td></tr>
          <tr><td><code>recursos</code></td><td>object[]</td><td>Lista de recursos que necesitan (con id, nombre, descripcion, categoria)</td></tr>
          <tr><td><code>estado_insumos</code></td><td>string or null</td><td><code>full</code> (abastecido) o <code>necesita</code> (necesita insumos)</td></tr>
          <tr><td><code>foto_url</code></td><td>string or null</td><td>URL de la foto del lugar</td></tr>
          <tr><td><code>created_at</code></td><td>string (ISO)</td><td>Fecha de creación</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Formato JSON:API</h2>
      <p>Esta API sigue la especificación <a href="https://jsonapi.org" target="_blank">JSON:API 1.0</a>.</p>
      <p style="margin-top: 0.5rem;">Paginación no implementada aún (volumen de datos actual &lt; 100 registros).</p>
    </section>
  </main>

  <footer>
    <p><a href="https://github.com/tu-usuario/dondeayudarvzla" target="_blank">Contribuir en GitHub</a></p>
    <p style="margin-top: 0.25rem;">Hecho con ❤️ para Venezuela</p>
  </footer>
</body>
</html>`;

export async function GET() {
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
