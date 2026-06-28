## ADDED Requirements

### Requirement: Catálogo de recursos
El sistema SHALL mantener un catálogo centralizado de recursos con nombre, descripción y categoría.

#### Scenario: Obtener listado de recursos
- **WHEN** un usuario hace GET a `/api/recursos`
- **THEN** el sistema retorna un array JSON con todos los recursos del catálogo, cada uno con `id`, `nombre`, `descripcion`, `categoria`

#### Scenario: Recurso existe en catálogo
- **WHEN** se consulta `/api/recursos`
- **THEN** los recursos devueltos incluyen al menos: agua, pañales adulto, vasos humificados, centros de cama, yodo, bambene, vendas 15cm, vendas 20cm, macrogoteros

#### Scenario: Filtrar recursos por categoría
- **WHEN** un usuario hace GET a `/api/recursos?categoria=medico`
- **THEN** el sistema retorna solo los recursos cuya categoría sea "medico"

### Requirement: Recurso tiene nombre único
Cada recurso en el catálogo SHALL tener un nombre único (case-insensitive).

#### Scenario: Prevenir duplicados
- **WHEN** se intenta insertar un recurso con nombre "Agua" y ya existe "agua"
- **THEN** el sistema rechaza la operación con un error de unique constraint violation

### Requirement: Categorías de recursos
Cada recurso SHALL pertenecer a una categoría del conjunto: `medico`, `higiene`, `alimento`, `vestimenta`, `refugio`, `otro`.

#### Scenario: Recurso con categoría válida
- **WHEN** se crea un recurso con categoría "medico"
- **THEN** el sistema acepta la operación

#### Scenario: Recurso con categoría inválida
- **WHEN** se crea un recurso con categoría "equipos"
- **THEN** el sistema rechaza la operación
