## ADDED Requirements

### Requirement: Mapa muestra lugares de acopio aprobados
El sistema SHALL mostrar un mapa interactivo (Leaflet + OSM) con markers por cada lugar de acopio con status `aprobado`.

#### Scenario: Mapa carga con markers
- **WHEN** un usuario visita la página principal
- **THEN** el mapa SHALL cargarse centrado en Caracas con todos los lugares aprobados como markers

#### Scenario: Marker muestra información al hacer click
- **WHEN** un usuario hace click en un marker
- **THEN** se SHALL mostrar un popup con: nombre del lugar, tipo (punto_fijo/punto_movil/organizacion), dirección, contacto, horario, qué reciben y foto (si existe)

### Requirement: Filtros en el mapa
El sistema SHALL permitir filtrar los markers visibles en el mapa.

#### Scenario: Filtrar por tipo de lugar
- **WHEN** un usuario selecciona un filtro de tipo (punto_fijo, punto_movil, organizacion)
- **THEN** el mapa SHALL mostrar solo los markers que coinciden con el filtro seleccionado

#### Scenario: Filtrar por qué reciben
- **WHEN** un usuario selecciona una categoría (agua, comida, ropa, medicinas, etc.)
- **THEN** el mapa SHALL mostrar solo los lugares que aceptan esa categoría

### Requirement: Diseño mobile-first
El mapa SHALL ser completamente funcional en pantallas de celular (320px+).

#### Scenario: Mapa responsive
- **WHEN** un usuario accede desde un dispositivo móvil
- **THEN** el mapa SHALL ocupar el ancho completo de la pantalla y los popups SHALL ser legibles sin zoom adicional
