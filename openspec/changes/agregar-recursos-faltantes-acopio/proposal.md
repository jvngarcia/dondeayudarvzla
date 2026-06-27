## Why

Los centros de acopio necesitan comunicar qué recursos específicos les hacen falta (agua, pañales, vendas, etc.). Actualmente solo existe un campo `que_reciben` como array de texto, sin normalización ni catálogo de recursos. Esto impide hacer búsquedas precisas y mantener una lista consistente. Además, no hay forma para que los encargados del acopio actualicen su información (recursos faltantes, teléfono, horario) desde la interfaz pública.

## What Changes

- Agregar dos nuevas tablas en PostgreSQL: `recursos` (catálogo de recursos disponibles) y `acopio_recursos` (relación N:N entre acopios y recursos que necesitan)
- Migrar datos del campo `que_reciben` a las nuevas tablas
- Eliminar la columna `que_reciben` de la tabla `acopios` (BREAKING)
- Agregar un botón "Actualizar información" en el panel de detalle del acopio (mapa)
- Crear un formulario/modal para que encargados del acopio puedan actualizar:
  - Lista de recursos necesitados (desde el catálogo)
  - Teléfono de contacto
  - Horario
- Diseño mobile-first con apariencia similar a Google Maps

## Capabilities

### New Capabilities
- `catalogo-recursos`: Catálogo centralizado de recursos con nombre, descripción y categoría
- `recursos-acopio`: Gestión de la relación N:N entre acopios y recursos que necesitan
- `actualizar-acopio-publico`: Formulario público para que encargados actualicen información del acopio (recursos, teléfono, horario)

### Modified Capabilities
- *(ninguna)*

## Impact

- **Base de datos**: Nueva migración SQL con tablas `recursos` y `acopio_recursos`. Eliminación de columna `que_reciben`. Seed de recursos iniciales.
- **API**: Nuevos endpoints GET `/api/recursos` (catálogo). Nuevo endpoint PATCH `/api/acopios/[id]` (actualización pública). Actualización del endpoint GET `/api/acopios` para incluir recursos relacionados.
- **Frontend**: Nuevo modal/drawer de actualización en el componente de detalle del acopio. Actualización del filtro de búsqueda para usar recursos del catálogo.
- **Tipos TypeScript**: Nuevos tipos `Recurso`, `AcopioRecurso`. Actualización del tipo `Acopio`.
- **Admin panel**: Actualizar formularios de edición para usar las nuevas tablas.
