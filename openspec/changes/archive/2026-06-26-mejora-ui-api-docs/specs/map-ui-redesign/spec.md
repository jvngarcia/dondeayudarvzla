## ADDED Requirements

### Requirement: Bottom navigation en móvil
El sistema DEBE mostrar una barra de navegación inferior en dispositivos móviles (< 768px) con 4 elementos: "Explorar" (icono mapa + texto), "API Docs" (icono documento), "Reportar" (icono más), "Acerca de" (icono info). La barra DEBE tener 48px de altura, fondo semitranslúcido con backdrop-blur, y el elemento activo DEBE resaltarse con color rojo.

#### Scenario: Navegación inferior visible en móvil
- **WHEN** el viewport es menor a 768px
- **THEN** se muestra la bottom nav con 4 elementos

#### Scenario: Tap en "Reportar" navega a /reportar
- **WHEN** el usuario toca "Reportar" en la bottom nav
- **THEN** el sistema navega a la ruta /reportar

#### Scenario: Tap en "API Docs" navega a /docs
- **WHEN** el usuario toca "API Docs" en la bottom nav
- **THEN** el sistema navega a la ruta /docs

### Requirement: Toolbar superior en desktop
El sistema DEBE mostrar un toolbar horizontal en la parte superior en dispositivos de escritorio (>= 768px) con logo/app name a la izquierda y enlaces a "API Docs", "Reportar", "Acerca de" a la derecha.

#### Scenario: Toolbar visible en desktop
- **WHEN** el viewport es mayor o igual a 768px
- **THEN** se muestra el toolbar superior
- **THEN** no se muestra la bottom nav

### Requirement: FAB "Reportar" rediseñado
El botón flotante de reportar DEBE usar un icono SVG de bandera/megáfono en vez de "+". En móvil DEBE ser un círculo con icono y texto "Reportar" debajo. En desktop DEBE ser un botón rectangular con icono y texto "Reportar" al lado. DEBE tener color rojo (#dc2626) con hover/active states. DEBE tener una animación sutil de entrada (fade-in + scale).

#### Scenario: FAB visible en el mapa
- **WHEN** el mapa se carga
- **THEN** el FAB "Reportar" se muestra en la esquina inferior derecha
- **THEN** el FAB tiene un icono SVG y el texto "Reportar"

#### Scenario: Click en FAB navega a reportar
- **WHEN** el usuario hace clic en el FAB
- **THEN** el sistema navega a /reportar

### Requirement: Bottom sheet rediseñada para info de marcador
Al hacer clic en un marcador, el sistema DEBE mostrar una bottom sheet que ocupe ~40% de la altura en móvil y ~50% en desktop (como sidebar). DEBE tener un handle visual "≡" en la parte superior indicando que es expandible. DEBE mostrar: nombre, tipo badge, estado insumos badge, foto (si existe), dirección, contacto, horario, categorías, y botón "Cómo llegar". La bottom sheet DEBE poder expandirse a ~80% al hacer clic en el handle.

#### Scenario: Click en marcador muestra bottom sheet
- **WHEN** el usuario hace clic en un marcador del mapa
- **THEN** aparece una bottom sheet desde abajo con la información del acopio

#### Scenario: Expansión de bottom sheet
- **WHEN** el usuario hace clic en el handle "≡"
- **THEN** la bottom sheet se expande a ~80% de la altura

#### Scenario: Cierre de bottom sheet
- **WHEN** el usuario hace clic fuera de la bottom sheet
- **THEN** la bottom sheet se cierra

### Requirement: Search bar mejorada
La barra de búsqueda DEBE tener icono de lupa SVG (no emoji), sombra sutil, bordes redondeados, y placeholder "Buscar lugar...". DEBE ocupar todo el ancho disponible.

#### Scenario: Search bar se renderiza
- **WHEN** el mapa se carga
- **THEN** la search bar se muestra en la parte superior con icono de lupa SVG
