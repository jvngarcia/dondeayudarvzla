## ADDED Requirements

### Requirement: Página de documentación de API pública
El sistema DEBE tener una página `/docs` accesible desde la navegación principal que documente la API pública REST. La página DEBE usar Tailwind CSS para estilos (no inline CSS). DEBE incluir: URL base, listado de endpoints, parámetros de filtro, ejemplos de uso (curl, JavaScript fetch, Python requests), schema de datos, y formato de respuesta JSON:API. DEBE ser responsiva (móvil y desktop).

#### Scenario: Acceso a /docs desde navegación
- **WHEN** el usuario toca "API Docs" en la bottom nav o toolbar
- **THEN** el sistema navega a /docs
- **THEN** se muestra la documentación completa de la API

#### Scenario: Página responsiva
- **WHEN** la página /docs se renderiza en móvil
- **THEN** el contenido se adapta al ancho de la pantalla sin scroll horizontal
- **WHEN** la página /docs se renderiza en desktop
- **THEN** el contenido tiene un ancho máximo de 800px centrado

### Requirement: Ruta /api/v1/docs funcional
La ruta `/api/v1/docs` DEBE servir correctamente una página HTML con la documentación de la API. No DEBE retornar errores 500. DEBE tener Content-Type text/html; charset=utf-8.

#### Scenario: GET /api/v1/docs retorna HTML
- **WHEN** se hace una solicitud GET a /api/v1/docs
- **THEN** el servidor responde con status 200
- **THEN** el Content-Type es text/html; charset=utf-8
- **THEN** el cuerpo contiene HTML válido con documentación de la API

### Requirement: Ejemplos de código multilenguaje
La documentación DEBE incluir ejemplos de uso en al menos 3 formatos: curl, JavaScript (fetch), y Python (requests).

#### Scenario: Ejemplos visibles en /docs
- **WHEN** el usuario visita /docs
- **THEN** ve ejemplos de código en curl, JavaScript fetch, y Python requests
