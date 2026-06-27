## ADDED Requirements

### Requirement: Estado de insumos en lugares de acopio
El sistema SHALL permitir que cada lugar de acopio tenga un estado de insumos que indique si está abastecido o necesita insumos.

#### Scenario: Columna estado_insumos en base de datos
- **WHEN** se ejecuta la migración
- **THEN** la tabla `acopios` SHALL tener una columna `estado_insumos text` con `CHECK (estado_insumos IN ('full', 'necesita'))` y valor por defecto `null`

#### Scenario: Estado visible en tarjeta del mapa
- **WHEN** un usuario hace click en un marker del mapa
- **THEN** la tarjeta inferior SHALL mostrar un badge "Full" en verde si `estado_insumos = 'full'`, o un badge "Necesita" en rojo/anaranjado si `estado_insumos = 'necesita'`, o no mostrar nada si es `null`

### Requirement: Campo estado_insumos en formulario de reporte
El sistema SHALL permitir que al reportar un nuevo lugar se pueda indicar el estado de insumos.

#### Scenario: Selector de estado en formulario público
- **WHEN** un usuario llena el formulario de reporte en `/reportar`
- **THEN** el formulario SHALL incluir un selector (radio/select) con opciones: "No especificar", "Full (abastecido)", "Necesita insumos"

#### Scenario: Estado guardado al crear
- **WHEN** un usuario envía el formulario con estado de insumos seleccionado
- **THEN** el sistema SHALL guardar el valor en la columna `estado_insumos`

### Requirement: Editar estado de insumos desde admin
El sistema SHALL permitir al administrador cambiar el estado de insumos de cualquier lugar.

#### Scenario: Selector de estado en edición admin
- **WHEN** el administrador edita un lugar en `/admin/acopios`
- **THEN** el formulario de edición SHALL incluir un selector para cambiar `estado_insumos`

#### Scenario: Estado actualizado en API y mapa
- **WHEN** el administrador guarda un cambio de estado de insumos
- **THEN** la API y el mapa SHALL reflejar el nuevo estado inmediatamente

### Requirement: Filtrar por estado de insumos en el mapa
El sistema SHALL permitir filtrar markers por estado de insumos.

#### Scenario: Filtro de estado
- **WHEN** un usuario selecciona "Full" o "Necesita" como filtro en el mapa
- **THEN** el mapa SHALL mostrar solo los markers cuyo `estado_insumos` coincida con el filtro
