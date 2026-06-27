## 1. Base de datos y tipos

- [x] 1.1 Agregar tipo `EstadoInsumos = "full" | "necesita"` en `types/index.ts`
- [x] 1.2 Agregar campo `estado_insumos: EstadoInsumos | null` a la interface `Acopio` y a `ReportFormData`
- [x] 1.3 Ejecutar migración SQL para agregar columna `estado_insumos text` con `CHECK (estado_insumos IN ('full', 'necesita'))` y default `null` en tabla `acopios`

## 2. Estado de insumos en formulario de reporte público

- [x] 2.1 Agregar selector de estado de insumos (radio buttons: "No especificar", "Full - No necesitan", "Necesita insumos") en `app/reportar/page.tsx`
- [x] 2.2 Incluir `estado_insumos` en el FormData enviado a `POST /api/acopios/reportar`
- [x] 2.3 Modificar `POST /api/acopios/reportar/route.ts` para guardar `estado_insumos` en la base de datos

## 3. Estado de insumos en tarjeta del mapa

- [x] 3.1 Crear componente `EstadoInsumosBadge` en `MapPageClient.tsx` que muestre badge verde "Full" o badge rojo "Necesita" según `estado_insumos`
- [x] 3.2 Renderizar `EstadoInsumosBadge` en la tarjeta inferior del mapa (junto al `TipoBadge`)
- [x] 3.3 Agregar filtro por estado de insumos en la barra de filtros inferior del mapa

## 4. Estado de insumos en panel admin

- [x] 4.1 Agregar selector de estado de insumos en el formulario de edición de `app/admin/acopios/page.tsx`
- [x] 4.2 Incluir `estado_insumos` en el `saveEdit` para que se actualice en Supabase
- [x] 4.3 Mostrar el estado de insumos en la vista de lista de lugares en admin

## 5. API JSON:API v1

- [x] 5.1 Crear ruta `app/api/v1/acopios/route.ts` con `GET` que devuelva formato JSON:API (`data`, `meta`, `jsonapi`)
- [x] 5.2 Implementar filtros: `filter[ciudad]`, `filter[tipo]`, `filter[estado_insumos]`, `filter[que_reciben]` con soporte para combinarlos
- [x] 5.3 Crear tipos TypeScript para el formato JSON:API (`JsonApiDocument`, `ResourceObject`, `Meta`, etc.)
- [x] 5.4 Ampliar `GET /api/acopios` (ruta existente) para incluir `estado_insumos` en la respuesta

## 6. Documentación interactiva de API

- [x] 6.1 Crear ruta `app/api/v1/docs/route.ts` que retorne una página HTML con documentación completa de la API JSON:API
- [x] 6.2 Incluir en la documentación: endpoints, parámetros de filtro, ejemplos con `curl`, schemas de datos, y respuestas de ejemplo

## 7. Enlace al repositorio en la UI

- [x] 7.1 Agregar enlace "Contribuir en GitHub" en el `RootLayout` (footer o header) de `app/layout.tsx`
- [x] 7.2 Configurar la URL del repositorio como variable de entorno o constante

## 8. Documentación del repositorio

- [x] 8.1 Crear `README.md` en la raíz con: descripción del proyecto, tecnologías, instrucciones de instalación y desarrollo local, enlace a API docs, screenshot
- [x] 8.2 Crear `CONTRIBUTING.md` en la raíz con: cómo reportar issues, cómo enviar PRs, guía de estilo, proceso de revisión
- [x] 8.3 Crear `LICENSE` en la raíz con el texto estándar MIT
