## Context

El proyecto es una app Next.js 14 con Supabase que mapea lugares de acopio en Venezuela. Actualmente usa una tabla `acopios` con un campo `que_reciben text[]` para listar qué insumos acepta cada lugar, pero no hay forma de indicar si el lugar está abastecido o necesita insumos.

La API existente (`GET /api/acopios`) devuelve JSON plano sin formato estándar. No hay documentación de API ni archivos de comunidad (README, CONTRIBUTING, LICENSE).

## Goals / Non-Goals

**Goals:**
- Agregar columna `estado_insumos` a la tabla `acopios` con valores `'full' | 'necesita' | null`
- Mostrar el estado de insumos en la tarjeta inferior del mapa (con color distintivo)
- Incluir el estado en el formulario de reporte público y en el panel admin
- Crear API REST con formato JSON:API (`/api/v1/acopios`) con documentación interactiva
- Agregar enlace al repositorio en la UI
- Crear README.md, CONTRIBUTING.md y LICENSE (MIT)

**Non-Goals:**
- No se migrará a una base de datos separada para la API
- No se agregará autenticación para la API pública (sigue siendo pública como hoy)
- No se cambiará la API existente `/api/acopios` (solo se ampliará)

## Decisions

### 1. Columna `estado_insumos` como text con check constraint
- **Decisión**: Usar `text` con `CHECK (estado_insumos IN ('full', 'necesita'))` en vez de crear una tabla separada o un enum de Postgres.
- **Por qué**: Es un conjunto fijo y pequeño de valores. No amerita una tabla relacional. Los enum de Postgres son rígidos para migraciones futuras.
- **Alternativa**: Enum de Postgres → se descartó por la rigidez para alterar.

### 2. JSON:API con implementación manual (sin librería)
- **Decisión**: Implementar el formato JSON:API manualmente con tipos TypeScript, sin usar librerías externas como `jsonapi-serializer`.
- **Por qué**: El conjunto de datos es pequeño y predecible. Evitar dependencias extras mantiene el bundle ligero. La serialización es simple.
- **Alternativa**: `jsonapi-serializer` o `express-jsonapi` → sobreingeniería para este alcance.

### 3. Documentación de API con ruta `/api/v1/docs`
- **Decisión**: Crear una ruta `GET /api/v1/docs` que devuelva HTML con la documentación interactiva generada desde un schema JSON, en lugar de integrar Swagger UI o Redoc como dependencia.
- **Por qué**: Mantiene cero dependencias externas. La documentación se renderiza como HTML estático generado desde una especificación JSON embebida.
- **Alternativa**: Swagger UI → agrega bundle JS grande. Redoc → similar.

### 4. Estado de insumos en tarjeta como badge de color
- **Decisión**: Mostrar un badge verde con texto "Full" cuando `estado_insumos = 'full'` y un badge rojo/anaranjado con texto "Necesita" cuando `estado_insumos = 'necesita'`. Si es null, no mostrar nada.
- **Por qué**: Comunicación visual rápida y clara. Sigue el patrón existente de `TipoBadge`.

### 5. README, CONTRIBUTING, LICENSE como archivos Markdown estándar
- **Decisión**: Archivos en la raíz del proyecto con formato estándar de GitHub. LICENSE MIT con año y holder genérico.
- **Por qué**: Siguen las convenciones de la comunidad open source. Fáciles de mantener.

## Risks / Trade-offs

- **JSON:API manual**: Si la API crece mucho (más de 5-6 recursos), la serialización manual se vuelve tediosa. Mitigación: mantenerla simple con un solo recurso por ahora.
- **Sin paginación nativa de JSON:API**: JSON:API especifica paginación con `page[number]` y `page[size]`. Para MVP se omite paginación (datos < 100 registros). Se agregará cuando sea necesario. Mitigación: documentar en la API que es una limitación conocida.
- **Documentación inline**: Si el schema JSON crece, mantener la doc actualizada manualmente puede ser propenso a errores. Mitigación: generar la doc desde el mismo tipo TypeScript que usa la ruta.
