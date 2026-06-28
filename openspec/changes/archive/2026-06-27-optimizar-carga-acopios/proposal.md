## Why

Las páginas de acopios tardan en cargar porque toda la data se obtiene desde el cliente via `useEffect`, sin caché, sin streaming, y sin optimización de recursos. Los usuarios en Venezuela tienen conexiones lentas e inestables, por lo que cada KB y cada round-trip cuenta. La página principal (mapa + lista de acopios) muestra un spinner hasta que se completan todas las requests, lo que empeora la experiencia.

## What Changes

- Migrar fetching de acopios a Server Components con streaming y Suspense boundaries
- Implementar caché agresiva (ISR, headers `Cache-Control`, o datos estáticos) para datos de solo lectura
- Optimizar imágenes con `next/image` (WebP, lazy loading, prioridades)
- Agregar compresión y prefetching de recursos críticos (fuentes, tiles del mapa)
- Agregar debouncing real al buscador de acopios
- Agregar índices faltantes en la base de datos para filtros comunes (`categoria`, `estado_insumos`, `tipo`)
- Reducir el payload de las APIs devolviendo solo campos necesarios cuando sea posible

## Capabilities

### New Capabilities
- `page-speed-optimization`: Optimización integral de velocidad de carga de todas las páginas de acopios, incluyendo fetching eficiente, caché, optimización de imágenes, y reducción de payload

### Modified Capabilities

*(No hay cambios en requerimientos funcionales — solo arquitectura e implementación.)*

## Impact

- `app/api/acopios/route.ts` — posible reducción de payload y headers de caché
- `components/MapPageClient.tsx` — refactor para usar Server Components con streaming
- `app/page.tsx` — nuevo layout con Suspense boundaries
- `components/LeafletMap.tsx` — lazy loading optimizado
- Imágenes: `next.config` para configurar `remotePatterns` de Supabase Storage
- `supabase-migration.sql` — nuevos índices
- `package.json` — sin nuevas dependencias mayores
