## MODIFIED Requirements

### Requirement: Diseño responsive mobile-first
El formulario SHALL usar espaciado y tipografía optimizados para lectura en móvil.

#### Scenario: Espaciado mejorado en móvil
- **WHEN** un usuario ve el formulario en un dispositivo móvil
- **THEN** los campos SHALL tener padding de al menos 16px, interlineado de 1.5, y fuente de 16px mínimo para evitar zoom al enfocar

#### Scenario: Validación visual
- **WHEN** un usuario envía el formulario con errores
- **THEN** los campos con error SHALL mostrar borde rojo, un ícono de error y un mensaje descriptivo debajo del campo

## ADDED Requirements

### Requirement: Estados visuales en botón de envío
El sistema SHALL mostrar estados visuales claros en el botón de envío.

#### Scenario: Estado loading
- **WHEN** el usuario envía el formulario y está en proceso
- **THEN** el botón SHALL mostrar un spinner animado y deshabilitarse para evitar doble envío

#### Scenario: Estado success
- **WHEN** el envío es exitoso
- **THEN** el botón SHALL mostrar brevemente un check verde antes de redirigir a la pantalla de éxito

### Requirement: Micro-interacciones en campos
Los campos del formulario SHALL tener micro-interacciones para mejorar la UX.

#### Scenario: Focus con animación
- **WHEN** un usuario selecciona un campo
- **THEN** el borde del campo SHALL cambiar de color suavemente y la etiqueta SHALL tener una transición
