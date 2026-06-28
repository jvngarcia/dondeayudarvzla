## Context

Actualmente la tabla `acopios` tiene una columna `que_reciben text[]` que almacena recursos como un array de strings. Esto impide tener un catálogo controlado, hacer búsquedas normalizadas, o asociar metadatos a cada recurso. Tampoco existe un mecanismo público para que encargados de acopios actualicen su información.

## Goals / Non-Goals

**Goals:**
- Normalizar los recursos en una tabla `recursos` con ID, nombre, categoría
- Relacionar acopios con recursos mediante tabla pivote `acopio_recursos`
- Migrar datos existentes de `que_reciben` a las nuevas tablas sin pérdida
- Proveer endpoint GET `/api/recursos` para obtener el catálogo
- Proveer endpoint PATCH `/api/acopios/[id]` para actualización pública (recursos, contacto, horario)
- Agregar UI en el detalle del acopio (mapa) para actualizar información
- Diseño mobile-first inspirado en Google Maps

**Non-Goals:**
- Autenticación de usuarios para la actualización (se usará un token simple o código de verificación)
- Carga masiva de recursos desde archivos
- Soporte para recursos con cantidad (solo indicar si hacen falta o no)
- Eliminación de acopios desde el formulario público

## Decisions

### 1. Tabla `recursos` con seed inicial
Crear tabla `recursos` con id, nombre, descripcion, categoria_id. Los recursos iniciales se incluirán en la migración: agua, pañales adulto, vasos humificados, centros de cama, yodo, bambene, vendas 15cm, vendas 20cm, macrogoteros, etc.

### 2. Tabla pivote `acopio_recursos` en lugar de JSONB
Usar una tabla relacional `acopio_recursos(acopio_id, recurso_id)` con foreign keys. Esto permite consultas eficientes (JOINs), integridad referencial, y evita problemas de consistencia propios de arrays/JSONB.

### 3. Migración de datos
Script SQL que extrae cada elemento del array `que_reciben`, lo busca en `recursos` por nombre (case-insensitive), e inserta en `acopio_recursos`. Si un recurso no existe en el catálogo, se inserta automáticamente.

### 4. Token simple para actualización
En lugar de auth compleja, se usará un token corto (6 caracteres) almacenado en una columna `edit_token` en `acopios`. El token se genera automáticamente al crear el acopio y se muestra al encargado. Para editar, se solicita el token.

### 5. UI de actualización como modal/drawer
En mobile: bottom sheet expandible (como Google Maps). En desktop: modal centrado con backdrop. Diseño con inputs de búsqueda para recursos, toggles para seleccionar, y campos de texto para contacto/horario.

### 6. Filtro de búsqueda actualizado
El filtro de recursos en el mapa usará los datos del catálogo (`/api/recursos`) en lugar de la lista hardcodeada actual.

## Risks / Trade-offs

- [Token simple] → Riesgo de que el token sea interceptado. Mitigación: se puede regenerar, y no da acceso a datos sensibles (solo editar recursos, contacto, horario).
- [Migración de datos] → Recursos con nombres similares (ej. "vendas 15cm" vs "venda 15 cm") pueden crear duplicados en el catálogo. Mitigación: migración con normalización de texto (trim, lower, sin acentos).
- [Breaking change] → Eliminar `que_reciben` rompe APIs existentes. Mitigación: actualizar todos los endpoints y componentes en el mismo PR.
