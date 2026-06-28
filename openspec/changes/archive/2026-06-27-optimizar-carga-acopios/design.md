## Context

Actualmente la página principal carga toda la data de acopios y recursos desde el cliente (`MapPageClient.tsx`) via `useEffect` + `fetch("/api/acopios")` y `fetch("/api/recursos")`. Esto significa:

- El usuario ve un spinner hasta que ambos requests completan (varios segundos en conexiones lentas)
- No hay caché reutilizable entre visitas
- Las imágenes se cargan con `<img>` sin optimización (sin WebP, sin lazy loading nativo)
- El payload incluye campos que el cliente podría no necesitar en el primer paint
- No hay streaming: el navegador espera el JSON completo antes de renderizar cualquier marcador

## Goals / Non-Goals

**Goals:**

- Primera renderización significativa del mapa en <3s en conexiones 3G simuladas
- Caché efectiva de datos de acopios (ISR o stale-while-revalidate) para evitar refetch por visita
- Imágenes de acopios servidas en WebP con lazy loading
- Payload de API reducido al mínimo necesario para el primer paint
- Debounce funcional en el buscador
- Índices de base de datos para filtros comunes

**Non-Goals:**

- No se cambiará la UI ni la funcionalidad existente
- No se migrará el stack (sigue siendo Next.js App Router + Supabase + Leaflet)
- No se reescribirá la lógica de negocio

## Decisions

| Decisión | Opción elegida | Alternativas consideradas | Razón |
|----------|----------------|---------------------------|-------|
| Fetching de acopios | Server Component con data reactiva + SWR en cliente para actualizaciones | Solo Server Component / Solo cliente | Server Component sirve HTML inicial rápido; SWR mantiene frescura y permite refetch sin recargar página |
| Caché de API | `stale-while-revalidate` con CDN cache (headers `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`) | ISR completo / Sin caché | Los acopios cambian con poca frecuencia; SWR permite servir datos viejos al instante y actualizar en segundo plano |
| Imágenes | `next/image` con `remotePatterns` para Supabase Storage y placeholder blur | `<img>` con lazy loading nativo | next/image da WebP, srcset responsive, y lazy loading nativo; solo requiere configurar remotePatterns |
| Payload de API | Select explícito de columnas en Supabase query | Devolver todo (`select(*)`) | Reduce tamaño de respuesta ~40% eliminando campos administrativos internos |
| Streaming | `loading.js` con Suspense boundaries para secciones del mapa | No streaming | Muestra el layout y búsqueda inmediatamente mientras los datos del mapa cargan |
| Índices BD | Índices compuestos para `(status, categoria)` y `(status, tipo)` | Índices individuales | Las queries siempre filtran por `status = 'aprobado'` más otro filtro; índice compuesto cubre ambos |
| Debounce | Custom hook `useDebounce` con 300ms en el input de búsqueda | Lodash debounce / Sin debounce | Evita dependencia extra; 300ms balancea responsividad con reducción de re-renders |

## Risks / Trade-offs

- **[Rendimiento cliente vs servidor]** Mover lógica a Server Components puede aumentar TTFB ligeramente en el server → Mitigación: usar streaming para enviar HTML progresivamente
- **[Caché obsoleta]** SWR puede mostrar datos desactualizados si un admin aprueba un acopio → Mitigación: `s-maxage=60` asegura frescura máxima de 1 minuto, aceptable para este caso de uso
- **[next/image en Supabase Storage]** Las URLs públicas de Supabase Storage pueden expirar o cambiar → Mitigación: configurar `remotePatterns` con el patrón exacto del bucket; las URLs almacenadas son permanentes
- **[Complejidad marginal]** Separar el fetching en múltiples componentes aumenta la complejidad → Mitigación: encapsular lógica de datos en un Server Component contenedor
