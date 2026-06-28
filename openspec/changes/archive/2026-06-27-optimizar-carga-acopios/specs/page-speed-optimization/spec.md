## ADDED Requirements

### Requirement: Server-side data fetching with streaming
El sistema SHALL servir los datos de acopios desde Server Components con streaming progresivo usando Suspense boundaries.

#### Scenario: Página principal carga con streaming
- **WHEN** un usuario visita la página principal
- **THEN** el layout, búsqueda y toolbar se renderizan inmediatamente
- **WHEN** los datos de acopios están disponibles
- **THEN** el mapa y los marcadores se renderizan sin recarga de página

#### Scenario: Datos servidos desde el servidor
- **WHEN** un usuario solicita la página principal
- **THEN** el fetching de acopios ocurre del lado del servidor, no del cliente

### Requirement: Caché con stale-while-revalidate
La API GET `/api/acopios` SHALL incluir headers de caché `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.

#### Scenario: Caché activa en API
- **WHEN** un usuario hace GET a `/api/acopios`
- **THEN** la respuesta incluye header `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`

#### Scenario: Datos servidos desde caché
- **WHEN** un segundo usuario solicita `/api/acopios` dentro de los primeros 60 segundos
- **THEN** la respuesta se sirve desde la caché CDN/edge sin consultar la base de datos

### Requirement: Optimización de imágenes con next/image
El sistema SHALL usar el componente `next/image` de Next.js para todas las imágenes de acopios servidas desde Supabase Storage.

#### Scenario: Imagen servida en WebP
- **WHEN** un acopio tiene foto
- **THEN** el navegador recibe la imagen en formato WebP con el tamaño adecuado para el viewport

#### Scenario: Lazy loading de imágenes
- **WHEN** un usuario abre el detalle de un acopio con foto
- **THEN** la imagen se carga con lazy loading (solo cuando entra en el viewport)

### Requirement: Reducción de payload en API de acopios
El endpoint GET `/api/acopios` SHALL seleccionar explícitamente solo los campos necesarios para la vista de mapa, excluyendo campos administrativos internos.

#### Scenario: Payload mínimo en lista
- **WHEN** un usuario hace GET a `/api/acopios`
- **THEN** la respuesta incluye solo: `id`, `nombre`, `tipo`, `categoria`, `lat`, `lng`, `ciudad`, `estado`, `contacto`, `horario`, `foto_url`, `estado_insumos`, `recursos`

### Requirement: Debounce en búsqueda de acopios
El campo de búsqueda en el mapa SHALL usar debounce de 300ms antes de aplicar el filtro.

#### Scenario: Búsqueda con debounce
- **WHEN** un usuario escribe en el campo de búsqueda
- **THEN** el filtro se aplica 300ms después de que el usuario deja de escribir

### Requirement: Índices de base de datos para filtros comunes
La base de datos SHALL tener índices compuestos en `acopios` para los filtros más usados.

#### Scenario: Índice compuesto por status y categoria
- **WHEN** se filtra por `status = 'aprobado'` y `categoria = 'refugio'`
- **THEN** el query usa el índice compuesto `idx_acopios_status_categoria`

#### Scenario: Índice compuesto por status y tipo
- **WHEN** se filtra por `status = 'aprobado'` y `tipo = 'punto_fijo'`
- **THEN** el query usa el índice compuesto `idx_acopios_status_tipo`

#### Scenario: Índice compuesto por status y estado_insumos
- **WHEN** se filtra por `status = 'aprobado'` y `estado_insumos = 'necesita'`
- **THEN** el query usa el índice compuesto `idx_acopios_status_estado_insumos`
