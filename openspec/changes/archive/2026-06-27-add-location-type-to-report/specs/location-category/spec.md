## ADDED Requirements

### Requirement: Report form includes category selection
The system SHALL require users to select a `categoria` when reporting a location, choosing between `refugio` (shelter) and `centro_acopio` (collection center).

#### Scenario: User selects refugio
- **WHEN** the user opens the report form
- **THEN** a required radio button group labeled "Categoría" with options "Refugio" and "Centro de Acopio" SHALL be displayed
- **WHEN** the user selects "Refugio" and submits
- **THEN** the submission SHALL include `categoria: "refugio"` in the payload

#### Scenario: User selects centro de acopio
- **WHEN** the user opens the report form
- **THEN** the category field SHALL allow selecting "Centro de Acopio"
- **WHEN** the user selects "Centro de Acopio" and submits
- **THEN** the submission SHALL include `categoria: "centro_acopio"` in the payload

#### Scenario: Category is required
- **WHEN** the user attempts to submit the form without selecting a category
- **THEN** the system SHALL show a validation error and prevent submission

### Requirement: API stores and returns categoria
The system SHALL persist `categoria` in the database and return it in all public and admin API responses.

#### Scenario: POST /api/acopios/reportar accepts categoria
- **WHEN** a POST request includes `categoria` in the multipart form data
- **THEN** the value SHALL be stored in the `acopios.categoria` column

#### Scenario: GET /api/acopios returns categoria
- **WHEN** the client requests `GET /api/acopios`
- **THEN** each location in the response SHALL include a `categoria` field

#### Scenario: GET /api/v1/acopios returns categoria
- **WHEN** the client requests the JSON:API endpoint
- **THEN** each resource SHALL include `categoria` in its attributes

### Requirement: Map displays refugios with distinct styling
The system SHALL visually distinguish refugios from centros de acopio using different marker colors and icons on the map.

#### Scenario: Refugio marker is purple with house icon
- **WHEN** a location has `categoria: "refugio"`
- **THEN** its map marker SHALL display a purple (`#8b5cf6`) circle with a house/building icon

#### Scenario: Centro de acopio marker uses existing styling
- **WHEN** a location has `categoria: "centro_acopio"`
- **THEN** its map marker SHALL use the existing color logic based on `tipo` (blue for `punto_fijo`, orange for `punto_movil`, green for `organizacion`)

### Requirement: Map includes category filter
The system SHALL allow users on the main map page to filter visible locations by category (refugio, centro de acopio, or both).

#### Scenario: Filter by refugio
- **WHEN** the user selects the "Refugio" filter toggle
- **THEN** only locations with `categoria: "refugio"` SHALL be visible on the map

#### Scenario: Filter by centro de acopio
- **WHEN** the user selects the "Centro de Acopio" filter toggle
- **THEN** only locations with `categoria: "centro_acopio"` SHALL be visible on the map

#### Scenario: Show both categories (default)
- **WHEN** the user has not selected any specific category filter
- **THEN** all locations SHALL be visible regardless of `categoria`

### Requirement: Admin interface shows category
The system SHALL display the `categoria` field in the admin dashboard and management pages.

#### Scenario: Pending reports show category
- **WHEN** an admin views the pending reports dashboard
- **THEN** each pending report SHALL display its `categoria`

#### Scenario: Edit form shows category
- **WHEN** an admin edits a location in the management page
- **THEN** the category SHALL be displayed and editable
