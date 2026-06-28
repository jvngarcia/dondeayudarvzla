## ADDED Requirements

### Requirement: Botón "Actualizar información" en detalle del acopio
El sistema SHALL mostrar un botón "Actualizar información" en el panel de detalle del acopio (tanto en mobile bottom sheet como en desktop sidebar).

#### Scenario: Botón visible en detalle
- **WHEN** un usuario selecciona un marcador en el mapa y se abre el detalle del acopio
- **THEN** se muestra un botón "Actualizar información" con icono de lápiz

### Requirement: Formulario de actualización pública
El sistema SHALL proveer un formulario público (sin autenticación de admin) para que encargados del acopio actualicen recursos necesitados, teléfono y horario.

#### Scenario: Abrir formulario de actualización
- **WHEN** el usuario hace clic en "Actualizar información"
- **THEN** se abre un modal/drawer con:
  - Selector de búsqueda y toggles para recursos del catálogo
  - Campo de texto para teléfono
  - Campo de texto para horario
  - Botón "Guardar cambios"

#### Scenario: Actualizar recursos
- **WHEN** el usuario selecciona recursos del catálogo y guarda
- **THEN** el sistema envía PATCH a `/api/acopios/[id]` con los IDs de recursos seleccionados, teléfono y horario

#### Scenario: Lista vacía
- **WHEN** ningún recurso está seleccionado
- **THEN** el sistema muestra el texto "No necesita nada" o mensaje similar

### Requirement: Actualización de contacto y horario
El formulario SHALL permitir modificar los campos `contacto` (teléfono) y `horario` del acopio.

#### Scenario: Actualizar teléfono
- **WHEN** el usuario ingresa un nuevo número de teléfono y guarda
- **THEN** el sistema actualiza el campo `contacto` del acopio

#### Scenario: Actualizar horario
- **WHEN** el usuario ingresa un nuevo horario y guarda
- **THEN** el sistema actualiza el campo `horario` del acopio

### Requirement: Token de verificación para edición
El sistema SHALL requerir un token de verificación para autorizar cambios en un acopio.

#### Scenario: Solicitar token
- **WHEN** el usuario abre el formulario de actualización por primera vez
- **THEN** el sistema solicita ingresar el token de edición del acopio

#### Scenario: Token incorrecto
- **WHEN** el usuario ingresa un token inválido
- **THEN** el sistema muestra un mensaje de error y no permite editar

#### Scenario: Token correcto
- **WHEN** el usuario ingresa el token correcto
- **THEN** el sistema permite acceder al formulario de edición

### Requirement: Diseño mobile-first estilo Google Maps
La interfaz de actualización SHALL adaptarse mobile-first con apariencia similar a Google Maps.

#### Scenario: Vista mobile
- **WHEN** el usuario está en un dispositivo con ancho menor a 768px
- **THEN** el formulario se muestra como bottom sheet expandible con esquinas redondeadas, drag handle, y fondo con backdrop blur

#### Scenario: Vista desktop
- **WHEN** el usuario está en un dispositivo con ancho mayor o igual a 768px
- **THEN** el formulario se muestra como modal centrado con backdrop oscuro, ancho máximo de 480px, esquinas redondeadas y sombra

### Requirement: Feedback visual al guardar
El sistema SHALL mostrar feedback visual mientras se guardan los cambios.

#### Scenario: Guardando...
- **WHEN** el usuario hace clic en "Guardar cambios"
- **THEN** el botón muestra un spinner y se deshabilita

#### Scenario: Guardado exitoso
- **WHEN** la actualización se completa exitosamente
- **THEN** el sistema muestra un mensaje de éxito "Información actualizada" y cierra el formulario

#### Scenario: Error al guardar
- **WHEN** la actualización falla
- **THEN** el sistema muestra un mensaje de error "No se pudo actualizar. Intenta de nuevo."
