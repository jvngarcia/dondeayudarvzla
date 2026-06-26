## ADDED Requirements

### Requirement: Autenticación del administrador
El sistema SHALL proveer autenticación para el panel de administración usando Supabase Auth con magic link.

#### Scenario: Admin inicia sesión
- **WHEN** el administrador ingresa su correo electrónico en la página de login
- **THEN** el sistema SHALL enviar un magic link al correo y mostrar un mensaje de "revisa tu correo"

#### Scenario: Admin accede al dashboard
- **WHEN** el administrador hace click en el magic link del correo
- **THEN** el sistema SHALL autenticar al admin y redirigir al dashboard

### Requirement: Panel de moderación
El sistema SHALL proveer un dashboard donde el admin pueda ver y gestionar reportes pendientes.

#### Scenario: Ver reportes pendientes
- **WHEN** el administrador accede al dashboard
- **THEN** el sistema SHALL mostrar una lista/tabla de todos los reportes con status `pendiente`, ordenados por fecha (más reciente primero)

#### Scenario: Aprobar un reporte
- **WHEN** el administrador hace click en "Aprobar" en un reporte pendiente
- **THEN** el sistema SHALL cambiar el status del reporte a `aprobado` y el lugar SHALL aparecer en el mapa público

#### Scenario: Rechazar un reporte
- **WHEN** el administrador hace click en "Rechazar" en un reporte pendiente
- **THEN** el sistema SHALL cambiar el status del reporte a `rechazado` y el lugar NO SHALL aparecer en el mapa público

### Requirement: Gestión de lugares aprobados
El sistema SHALL permitir al admin editar y eliminar lugares ya aprobados.

#### Scenario: Editar un lugar
- **WHEN** el administrador modifica los datos de un lugar aprobado y guarda
- **THEN** el sistema SHALL actualizar los datos y el mapa SHALL reflejar los cambios

#### Scenario: Eliminar un lugar
- **WHEN** el administrador elimina un lugar aprobado
- **THEN** el sistema SHALL cambiar el status a `rechazado` y el lugar SHALL desaparecer del mapa público
