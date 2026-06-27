## Why

El botón flotante "reportar" actual (un círculo rojo con "+") no comunica claramente su propósito: los usuarios no saben que ahí pueden solicitar agregar un punto de acopio. Además, la documentación de la API pública es difícil de descubrir y la ruta `/api/v1/docs` no funciona correctamente. La interfaz del mapa carece de la familiaridad y usabilidad que los usuarios esperan de una experiencia tipo Google Maps.

## What Changes

- **Rediseñar el FAB "reportar"**: Reemplazar el "+" genérico por un botón con icono y texto "Reportar" que comunique claramente su función. Debe ser visible tanto en móvil como en escritorio, con un diseño que invite a la acción.
- **Agregar menú de navegación inferior (mobile) y toolbar superior (desktop)**: Crear un menú estilo Google Maps con acceso a "Explorar" (mapa), "API Docs" (documentación de la API pública), "Reportar" y "Acerca de".
- **Arreglar ruta `/api/v1/docs`**: Diagnosticar y corregir el error que impide que la documentación HTML de la API se muestre correctamente, o reemplazarla con una solución robusta.
- **Rediseñar la card inferior del marcador**: Adoptar un diseño tipo Google Maps con bottom sheet que muestre información del acopio de forma clara y accesible, con foto, datos de contacto, categorías y botón "Cómo llegar".
- **Agregar indicador de "tirar hacia arriba" en la card**: Un handle visual para indicar que la card se puede expandir.
- **Mejorar la search bar**: Estilo más pulido, con icono de búsqueda y sombra sutil, similar a Google Maps.
- **Adaptación responsive completa**: La interfaz debe verse igual de bien en móvil (bottom nav + FAB) y en escritorio (top toolbar + sidebar opcional).

## Capabilities

### New Capabilities
- `map-ui-redesign`: Interfaz de mapa rediseñada con navegación inferior/toolbar, search bar pulida, bottom sheet tipo Google Maps, y FAB de reportar mejorado.
- `api-docs-page`: Página de documentación de API pública accesible desde la navegación principal con documentación completa y ejemplos.

### Modified Capabilities
- *(none)*

## Impact

- `components/MapPageClient.tsx`: Refactor mayor para incorporar bottom nav, nuevo FAB, bottom sheet rediseñado.
- `components/LeafletMap.tsx`: Posibles ajustes menores de integración.
- `app/layout.tsx`: Agregar toolbar de escritorio y/o bottom nav.
- `app/api/v1/docs/route.ts`: Diagnosticar y corregir error de visualización.
- `app/page.tsx`: Posibles ajustes de layout.
- Nuevos archivos: componente de bottom nav, toolbar de escritorio, página de docs API externa.
- Sin nuevos dependencies.
