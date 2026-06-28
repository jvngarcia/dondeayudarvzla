## ADDED Requirements

### Requirement: Relación N:N entre acopios y recursos
El sistema SHALL relacionar acopios con recursos mediante una tabla pivote `acopio_recursos` con foreign keys a `acopios` y `recursos`.

#### Scenario: Acopio tiene recursos asociados
- **WHEN** se consulta un acopio vía GET `/api/acopios`
- **THEN** la respuesta incluye un array `recursos` con los objetos `{id, nombre, descripcion, categoria}` de los recursos que necesita

#### Scenario: Agregar recurso a acopio
- **WHEN** se hace PATCH a `/api/acopios/[id]` con `recursos: [1, 2, 3]`
- **THEN** el sistema actualiza la relación para que el acopio tenga exactamente esos recursos (reemplaza la lista anterior)

#### Scenario: Acopio sin recursos
- **WHEN** se hace PATCH a `/api/acopios/[id]` con `recursos: []`
- **THEN** el sistema elimina todas las relaciones de recursos para ese acopio

### Requirement: Migración de datos existentes
El sistema SHALL migrar los datos del campo `que_reciben` a la nueva estructura `acopio_recursos`.

#### Scenario: Migración de array a tabla pivote
- **WHEN** se ejecuta el script de migración
- **THEN** cada elemento del array `que_reciben` en cada acopio se inserta como un registro en `acopio_recursos`, enlazando al recurso correspondiente en `recursos` por nombre

#### Scenario: Recurso nuevo durante migración
- **WHEN** un elemento de `que_reciben` no existe en `recursos`
- **THEN** el script lo inserta automáticamente en `recursos` antes de crear la relación

### Requirement: Consulta de acopios con recursos
El GET `/api/acopios` SHALL incluir los recursos asociados a cada acopio mediante JOIN.

#### Scenario: Acopio con recursos en respuesta
- **WHEN** un usuario consulta la lista de acopios aprobados
- **THEN** cada acopio incluye un campo `recursos` con el listado de recursos que necesita

#### Scenario: Filtro por recurso
- **WHEN** un usuario hace GET `/api/acopios?recurso=agua`
- **THEN** el sistema retorna solo los acopios que tienen "agua" en su lista de recursos
