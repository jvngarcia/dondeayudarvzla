## ADDED Requirements

### Requirement: Formulario anónimo de reporte
El sistema SHALL proveer un formulario público accesible sin autenticación para reportar nuevos lugares de acopio.

#### Scenario: Usuario reporta un lugar exitosamente
- **WHEN** un usuario completa todos los campos obligatorios (nombre, dirección, contacto, tipo) y envía el formulario
- **THEN** el sistema SHALL crear un registro con status `pendiente` y mostrar un mensaje de confirmación

### Requirement: Campos del formulario
El formulario SHALL incluir los siguientes campos.

#### Scenario: Campos obligatorios
- **WHEN** un usuario ve el formulario de reporte
- **THEN** los campos SHALL incluir: nombre del lugar (text), tipo (select: punto_fijo/punto_movil/organizacion), dirección (text), contacto (text), y foto (file opcional)

#### Scenario: Validación de campos
- **WHEN** un usuario intenta enviar el formulario sin completar campos obligatorios
- **THEN** el sistema SHALL mostrar errores de validación en los campos faltantes y no enviar el formulario

### Requirement: Subida de foto
El sistema SHALL permitir subir una foto del lugar de acopio.

#### Scenario: Foto opcional
- **WHEN** un usuario llena el formulario y no adjunta foto
- **THEN** el sistema SHALL crear el reporte sin foto exitosamente

#### Scenario: Foto subida correctamente
- **WHEN** un usuario selecciona una imagen y envía el formulario
- **THEN** el sistema SHALL subir la imagen a Supabase Storage y asociarla al reporte

### Requirement: Rate limiting
El sistema SHALL proteger el formulario contra spam mediante rate limiting y verificación.

#### Scenario: Rate limit por IP
- **WHEN** una misma IP envía más de 5 reportes en 1 hora
- **THEN** el sistema SHALL rechazar el envío con un mensaje de "intenta de nuevo más tarde"

#### Scenario: Protección Turnstile
- **WHEN** un usuario envía el formulario
- **THEN** el sistema SHALL verificar el token de Cloudflare Turnstile antes de procesar el reporte
