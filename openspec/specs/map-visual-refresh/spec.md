## ADDED Requirements

### Requirement: Modern tile layer
The system SHALL use CartoDB Voyager raster tiles as the default map tile layer.

#### Scenario: Map loads with Voyager tiles
- **WHEN** the map component mounts
- **THEN** the visible tile layer SHALL be CartoDB Voyager tiles with correct attribution

#### Scenario: Tile fallback on error
- **WHEN** a tile fails to load from CartoDB
- **THEN** the system SHALL display the fallback OpenStreetMap tile for that region

### Requirement: Rich type-specific markers
The system SHALL render markers as styled SVG icons with distinct symbols per acopio type.

#### Scenario: Markers render with correct icon per type
- **WHEN** a punto_fijo marker is rendered
- **THEN** it SHALL display a building/pin icon in blue (#3b82f6)
- **WHEN** a punto_movil marker is rendered
- **THEN** it SHALL display a truck/vehicle icon in orange (#f97316)
- **WHEN** an organizacion marker is rendered
- **THEN** it SHALL display a heart/group icon in green (#22c55e)

#### Scenario: Marker hover animation
- **WHEN** a user hovers over a marker
- **THEN** the marker SHALL scale up smoothly (CSS transition) to indicate interactivity

### Requirement: Marker clustering
The system SHALL cluster nearby markers at zoom levels where they would overlap.

#### Scenario: Clusters appear at low zoom
- **WHEN** the map zoom level causes markers to overlap
- **THEN** overlapping markers SHALL be grouped into a cluster icon showing the count

#### Scenario: Cluster click zooms in
- **WHEN** a user clicks on a cluster
- **THEN** the map SHALL zoom in to expand the cluster into individual markers

### Requirement: Custom-styled zoom control
The zoom control SHALL be visually styled to match the modern design system.

#### Scenario: Zoom buttons display with new style
- **WHEN** the map is rendered
- **THEN** the zoom in/zoom out buttons SHALL have rounded corners, shadow, and match the app's color palette

### Requirement: My Location control
The map SHALL provide a "My Location" button that uses the browser Geolocation API.

#### Scenario: Location found
- **WHEN** a user clicks "My Location" and grants permission
- **THEN** the map SHALL fly to the user's coordinates with a smooth animation

#### Scenario: Location denied
- **WHEN** the user denies geolocation permission
- **THEN** the system SHALL silently fail (no error shown to user)

### Requirement: Modernized info panel
The selected-acopio info panel SHALL use glassmorphism styling and smooth transitions.

#### Scenario: Info panel opens with animation
- **WHEN** a user clicks a marker
- **THEN** the info panel SHALL slide in with a smooth spring-like transition

#### Scenario: Info panel has glassmorphism background
- **WHEN** the info panel is visible
- **THEN** it SHALL have a blurred backdrop and semi-transparent background

### Requirement: Unified map component styling
The MiniMapPicker SHALL use the same tile layer and modern visual styling.

#### Scenario: MiniMapPicker renders with Voyager tiles
- **WHEN** the MiniMapPicker component mounts
- **THEN** it SHALL display CartoDB Voyager tiles
