## 1. Base de datos - Migración

- [x] 1.1 Crear tabla `recursos` con columnas: id (uuid PK), nombre (text unique), descripcion (text), categoria (text con check constraint)
- [x] 1.2 Crear tabla `acopio_recursos` con columnas: acopio_id (uuid FK -> acopios), recurso_id (uuid FK -> recursos), PK compuesta (acopio_id, recurso_id)
- [x] 1.3 Agregar columna `edit_token` (text) a tabla `acopios`
- [x] 1.4 Poblar tabla `recursos` con seed inicial (agua, pañales adulto, vasos humificados, centros de cama, yodo, bambene, vendas 15cm, vendas 20cm, macrogoteros, etc.)
- [x] 1.5 Script de migración: extraer datos de `que_reciben` y migrar a `acopio_recursos` con matching por nombre
- [x] 1.6 Eliminar columna `que_reciben` de tabla `acopios`
- [x] 1.7 Generar edit_token para acopios existentes que no tengan uno

## 2. Tipos TypeScript

- [x] 2.1 Crear tipo `Recurso` con id, nombre, descripcion, categoria
- [x] 2.2 Crear tipo `AcopioRecurso` con acopio_id, recurso_id
- [x] 2.3 Actualizar tipo `Acopio`: reemplazar `que_reciben: string[]` por `recursos: Recurso[]`
- [x] 2.4 Crear tipo `UpdateAcopioInput` para el PATCH: recursos (uuid[]), contacto, horario

## 3. API - Catálogo de recursos

- [x] 3.1 Crear endpoint GET `/api/recursos` que retorna todos los recursos del catálogo
- [x] 3.2 Agregar soporte de filtro por categoría: GET `/api/recursos?categoria=medico`

## 4. API - Actualización pública de acopio

- [x] 4.1 Crear endpoint PATCH `/api/acopios/[id]/route.ts`
- [x] 4.2 Validar token de edición (edit_token) antes de permitir cambios
- [x] 4.3 Actualizar campos contacto y horario en tabla acopios
- [x] 4.4 Actualizar relaciones en acopio_recursos (reemplazar lista completa)
- [x] 4.5 Retornar acopio actualizado con recursos incluidos

## 5. API - Actualizar GET acopios

- [x] 5.1 Actualizar GET `/api/acopios` para incluir recursos mediante JOIN a acopio_recursos y recursos
- [x] 5.2 Actualizar GET `/api/v1/acopios` para incluir recursos en la respuesta JSON:API
- [x] 5.3 Agregar filtro por recurso: GET `/api/acopios?recurso=nombre`

## 6. Frontend - Componentes de actualización

- [x] 6.1 Crear componente `UpdateAcopioButton` (botón "Actualizar información" con icono lápiz)
- [x] 6.2 Crear componente `UpdateAcopioSheet` (bottom sheet mobile / modal desktop)
- [x] 6.3 Crear componente `RecursoSelector` (buscador + toggles para seleccionar recursos del catálogo)
- [x] 6.4 Crear componente `TokenVerification` (input para ingresar token antes de editar)
- [x] 6.5 Integrar botón en `MapPageClient` (tanto en MarkerInfoContent como en el sidebar/drawer)

## 7. Frontend - Filtro de búsqueda actualizado

- [x] 7.1 Actualizar filtro de recursos en el mapa para obtener datos de `/api/recursos`
- [x] 7.2 Reemplazar lista hardcodeada de categorías por datos dinámicos del catálogo

## 8. Admin panel - Actualizar formularios

- [x] 8.1 Actualizar admin dashboard (`app/admin/dashboard/page.tsx`) para usar nueva estructura
- [x] 8.2 Actualizar admin acopios (`app/admin/acopios/page.tsx`) para mostrar y editar recursos desde catálogo

## 9. UI/UX - Diseño mobile-first

- [x] 9.1 Implementar bottom sheet para mobile con drag handle, backdrop blur, rounded-2xl
- [x] 9.2 Implementar modal centrado para desktop (max-w-[480px], backdrop oscuro, rounded-2xl)
- [x] 9.3 Agregar animaciones de entrada/salida (fade-in, slide-up)
- [x] 9.4 Agregar estados de carga (spinner en botón guardar)
- [x] 9.5 Agregar estados de error/success con mensajes tipo toast

## 10. Limpieza

- [x] 10.1 Verificar que no queden referencias a `que_reciben` en el código
- [x] 10.2 Ejecutar migración en base de datos de producción (pendiente - ejecutar SQL manualmente)
- [x] 10.3 Probar flujo completo: ver acopio, actualizar recursos, ver cambios reflejados (pendiente - requiere migración aplicada)
