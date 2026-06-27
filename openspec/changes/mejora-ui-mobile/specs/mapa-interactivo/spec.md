## MODIFIED Requirements

### Requirement: Marker muestra información al hacer click
El sistema SHALL mostrar una bottom card al hacer click en un marker, reemplazando el popup de Leaflet.

#### Scenario: Bottom card al hacer click en marker
- **WHEN** un usuario hace click en un marker
- **THEN** se SHALL mostrar una card fija en la parte inferior de la pantalla (bottom card) con: nombre del lugar, tipo, dirección, contacto, horario, qué reciben, foto (si existe) y un botón "Cómo llegar"

#### Scenario: Cerrar bottom card
- **WHEN** un usuario hace click fuera de la bottom card o en el botón de cerrar
- **THEN** la bottom card SHALL ocultarse con una animación suave

### Requirement: Filtros en el mapa
El sistema SHALL mostrar los filtros en una barra inferior (bottom filters bar) en lugar de la parte superior.

#### Scenario: Filtros en barra inferior
- **WHEN** un usuario ve el mapa en móvil
- **THEN** los filtros SHALL mostrarse como chips/pills horizontalmente desplazables en la parte inferior de la pantalla, sobre el botón flotante de reportar

#### Scenario: Filtrar por tipo - bottom chips
- **WHEN** un usuario toca un chip de tipo (Punto fijo, Punto móvil, Organización)
- **THEN** el mapa SHALL mostrar solo los markers que coinciden con ese tipo, y el chip SHALL resaltarse visualmente

#### Scenario: Filtrar por categoría - bottom chips
- **WHEN** un usuario toca un chip de categoría (Agua, Comida, Ropa, etc.)
- **THEN** el mapa SHALL mostrar solo los lugares que aceptan esa categoría

## ADDED Requirements

### Requirement: Barra de búsqueda
El sistema SHALL proveer una barra de búsqueda textual en la parte superior del mapa.

#### Scenario: Buscar por nombre
- **WHEN** un usuario escribe en la barra de búsqueda
- **THEN** el mapa SHALL filtrar los markers cuyo nombre contenga el texto ingresado

### Requirement: Markers con color por tipo
El sistema SHALL usar markers de color distinto según el tipo de lugar.

#### Scenario: Marker azul para punto fijo
- **WHEN** un lugar es de tipo `punto_fijo`
- **THEN** su marker SHALL ser de color azul

#### Scenario: Marker naranja para punto móvil
- **WHEN** un lugar es de tipo `punto_movil`
- **THEN** su marker SHALL ser de color naranja

#### Scenario: Marker verde para organización
- **WHEN** un lugar es de tipo `organizacion`
- **THEN** su marker SHALL ser de color verde

### Requirement: Loading skeletons
El sistema SHALL mostrar skeletons animados mientras carga el mapa y los datos.

#### Scenario: Skeleton al cargar
- **WHEN** el usuario abre la app y los datos aún no se han cargado
- **THEN** el sistema SHALL mostrar un skeleton animado que simule la forma del mapa y la barra de filtros
