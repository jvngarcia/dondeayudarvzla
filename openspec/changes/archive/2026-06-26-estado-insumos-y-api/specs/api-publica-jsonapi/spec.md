## ADDED Requirements

### Requirement: API pública con formato JSON:API
El sistema SHALL exponer una API REST pública que cumpla con la especificación JSON:API (jsonapi.org) para consultar lugares de acopio aprobados.

#### Scenario: Endpoint GET /api/v1/acopios
- **WHEN** se hace una solicitud GET a `/api/v1/acopios`
- **THEN** el sistema SHALL retornar un documento JSON:API con `data` conteniendo todos los lugares aprobados, incluyendo `type: "acopios"`, `id`, y `attributes` con nombre, dirección, coordenadas, contacto, horario, qué reciben, estado de insumos y foto_url
- **THEN** la respuesta SHALL incluir `meta` con un `total` del número de resultados
- **THEN** la respuesta SHALL incluir `jsonapi` con `version: "1.0"`

#### Scenario: Filtrar por ciudad
- **WHEN** se hace GET a `/api/v1/acopios?filter[ciudad]=Caracas`
- **THEN** el sistema SHALL retornar solo los lugares aprobados en Caracas (búsqueda case-insensitive)

#### Scenario: Filtrar por tipo
- **WHEN** se hace GET a `/api/v1/acopios?filter[tipo]=organizacion`
- **THEN** el sistema SHALL retornar solo los lugares del tipo especificado

#### Scenario: Filtrar por estado de insumos
- **WHEN** se hace GET a `/api/v1/acopios?filter[estado_insumos]=necesita`
- **THEN** el sistema SHALL retornar solo los lugares con ese estado de insumos

#### Scenario: Filtrar por qué reciben
- **WHEN** se hace GET a `/api/v1/acopios?filter[que_reciben]=comida`
- **THEN** el sistema SHALL retornar solo los lugares que reciben esa categoría

#### Scenario: Combinar filtros
- **WHEN** se hace GET a `/api/v1/acopios?filter[ciudad]=Caracas&filter[estado_insumos]=necesita`
- **THEN** el sistema SHALL aplicar todos los filtros simultáneamente

### Requirement: Documentación interactiva de la API
El sistema SHALL proveer documentación interactiva accesible desde el navegador.

#### Scenario: GET /api/v1/docs retorna documentación HTML
- **WHEN** se hace GET a `/api/v1/docs`
- **THEN** el sistema SHALL retornar una página HTML con la documentación completa de la API JSON:API, incluyendo endpoints, parámetros de filtro, ejemplos de request y response, y schema de datos

#### Scenario: Documentación incluye ejemplos
- **WHEN** un desarrollador visita `/api/v1/docs`
- **THEN** la documentación SHALL incluir ejemplos de uso con `curl` y respuestas JSON de ejemplo

### Requirement: Enlace al repositorio
El sistema SHALL mostrar un enlace al repositorio de GitHub para fomentar contribuciones.

#### Scenario: Link en footer o header
- **WHEN** un usuario navega la aplicación
- **THEN** el sistema SHALL mostrar un enlace "Contribuir en GitHub" que apunte al repositorio del proyecto

### Requirement: README, CONTRIBUTING y LICENSE
El repositorio SHALL incluir archivos de documentación estándar para proyectos open source.

#### Scenario: README.md describe el proyecto
- **WHEN** un desarrollador visita el repositorio en GitHub
- **THEN** el README.md SHALL incluir: descripción del proyecto, tecnologías usadas, instrucciones de instalación y desarrollo local, enlace a la API docs, y captura de pantalla de la app

#### Scenario: CONTRIBUTING.md guía colaboradores
- **WHEN** un desarrollador quiere contribuir al proyecto
- **THEN** el CONTRIBUTING.md SHALL incluir: cómo reportar issues, cómo enviar PRs, guía de estilo de código, y proceso de revisión

#### Scenario: LICENSE es MIT
- **WHEN** un desarrollador revisa la licencia del proyecto
- **THEN** el archivo LICENSE SHALL contener el texto estándar de la licencia MIT con año y holder apropiados
