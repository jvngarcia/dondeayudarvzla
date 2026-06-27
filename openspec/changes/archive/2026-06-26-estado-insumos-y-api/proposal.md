## Why

Actualmente las tarjetas de los lugares de acopio solo muestran qué reciben, pero no indican si el lugar está abastecido o necesita insumos urgentemente. Tampoco existe una API pública formal para que otros proyectos consuman los datos. Además, el repositorio carece de README, guía de contribución y licencia, lo que dificulta la colaboración externa.

## What Changes

- Agregar estado de insumos a los lugares de acopio: indicar si están **full** (abastecidos, no necesitan) o si **necesitan** insumos. Mostrar este estado en las tarjetas del mapa y en la API.
- Crear una nueva API REST pública con formato **JSON:API** (`/api/v1/`) con documentación incluida, permitiendo a proyectos externos consultar todos los datos de acopios aprobados, filtrar por ciudad, tipo, insumos y estado de insumos.
- Agregar enlace al repositorio de GitHub en la interfaz.
- Crear `README.md`, `CONTRIBUTING.md` y `LICENSE` (MIT) en la raíz del proyecto.

## Capabilities

### New Capabilities
- `estado-insumos`: Capacidad para que los lugares de acopio indiquen si están abastecidos (full) o necesitan insumos, visible en tarjetas del mapa y en la API.
- `api-publica-jsonapi`: API REST pública con formato JSON:API para consultar acopios aprobados, con filtros y documentación interactiva.

### Modified Capabilities
<!-- No existing specs are modified - these are new additions -->

## Impact

- **Base de datos**: Nueva columna `estado_insumos` en tabla `acopios` (enum: `'full' | 'necesita' | null`)
- **API existente**: Se ampliará `GET /api/acopios` y se creará nueva ruta `/api/v1/` con formato JSON:API
- **Componentes UI**: Modificar `MapPageClient.tsx` para mostrar estado de insumos en la tarjeta inferior
- **Formulario de reporte**: Agregar campo de estado de insumos al formulario público y al panel admin
- **Panel admin**: Permitir editar estado de insumos
- **Documentación**: Crear README.md, CONTRIBUTING.md, LICENSE (MIT)
- **Dependencias**: Ninguna nueva dependencia externa
