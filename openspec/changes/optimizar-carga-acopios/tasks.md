## 1. Caché y headers de API

- [x] 1.1 Agregar header `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` al GET `/api/acopios`
- [x] 1.2 Agregar header `Cache-Control` al GET `/api/recursos`
- [x] 1.3 Reducir payload de GET `/api/acopios` seleccionando solo columnas necesarias para el mapa

## 2. Optimización de API y fetching en cliente

- [x] 2.1 Optimizar GET `/api/acopios` para usar una sola consulta nested de Supabase en vez de 3 consultas separadas
- [x] 2.2 Eliminar data fetching server-side (era más lento que el fetching directo del cliente)
- [x] 2.3 Refactorizar `MapPageClient` para cargar datos via SWR sin depender de props iniciales
- [x] 2.4 Integrar SWR en el cliente para caché y refetch silencioso de datos frescos

## 3. Optimización de imágenes

- [x] 3.1 Configurar `remotePatterns` en `next.config` para Supabase Storage
- [x] 3.2 Reemplazar `<img>` por `next/image` en componentes que muestran fotos de acopios
- [x] 3.3 Agregar placeholder blur y lazy loading por defecto (next/image incluye lazy loading nativo)

## 4. Debounce en búsqueda

- [x] 4.1 Crear hook `useDebounce` en `lib/useDebounce.ts`
- [x] 4.2 Aplicar debounce de 300ms al input de búsqueda en `MapPageClient`
- [x] 4.3 Eliminar estado `busqueda` huérfano y sincronizar correctamente con `busquedaInput`

## 5. Índices de base de datos

- [x] 5.1 Agregar índice compuesto `idx_acopios_status_categoria` en `acopios(status, categoria)`
- [x] 5.2 Agregar índice compuesto `idx_acopios_status_tipo` en `acopios(status, tipo)`
- [x] 5.3 Agregar índice compuesto `idx_acopios_status_estado_insumos` en `acopios(status, estado_insumos)`
