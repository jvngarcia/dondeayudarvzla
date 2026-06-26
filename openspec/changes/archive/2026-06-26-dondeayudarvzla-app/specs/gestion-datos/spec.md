## ADDED Requirements

### Requirement: API pública de acopios
El sistema SHALL exponer una API REST para consultar lugares de acopio aprobados.

#### Scenario: Obtener lugares aprobados
- **WHEN** se hace una solicitud GET a `/api/acopios`
- **THEN** el sistema SHALL retornar un array JSON con todos los lugares de status `aprobado`, incluyendo nombre, dirección, coordenadas, contacto, horario, qué reciben, foto_url

#### Scenario: Filtrar por ciudad
- **WHEN** se hace una solicitud GET a `/api/acopios?ciudad=caracas`
- **THEN** el sistema SHALL retornar solo los lugares aprobados en Caracas

### Requirement: API de reporte
El sistema SHALL exponer un endpoint para crear nuevos reportes desde el formulario público.

#### Scenario: Crear reporte
- **WHEN** se hace una solicitud POST a `/api/acopios/reportar` con datos válidos
- **THEN** el sistema SHALL crear un registro con status `pendiente` y retornar un mensaje de éxito

#### Scenario: Rechazar reporte sin Turnstile
- **WHEN** se hace una solicitud POST a `/api/acopios/reportar` sin token Turnstile válido
- **THEN** el sistema SHALL retornar error 429 y no crear el reporte

### Requirement: Supabase RLS Policies
El sistema SHALL configurar Row Level Security en Supabase para proteger los datos.

#### Scenario: Lectura pública de aprobados
- **WHEN** cualquier usuario (sin auth) consulta la tabla acopios
- **THEN** solo SHALL poder leer registros con status `aprobado`

#### Scenario: Escritura pública limitada
- **WHEN** cualquier usuario (sin auth) intenta insertar en la tabla acopios
- **THEN** solo SHALL poder insertar registros con status `pendiente` y sin poder especificar status, reviewed_by, reviewed_at

#### Scenario: Admin full access
- **WHEN** un usuario autenticado (admin) consulta la tabla acopios
- **THEN** SHALL poder leer, insertar, actualizar y eliminar cualquier registro

### Requirement: Geocoding de direcciones
El sistema SHALL convertir direcciones de texto a coordenadas (lat/lng) usando Nominatim.

#### Scenario: Geocoding automático al crear
- **WHEN** se crea un nuevo lugar con dirección pero sin coordenadas
- **THEN** el sistema SHALL intentar geocodificar la dirección usando Nominatim OSM API

#### Scenario: Geocoding manual en admin
- **WHEN** el admin edita un lugar en el panel
- **THEN** el sistema SHALL permitir al admin ajustar manualmente las coordenadas en el mapa
