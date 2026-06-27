## Context

La aplicación actual es una SPA de mapa con un layout simple: search bar arriba, mapa a pantalla completa, filtros tipo chip abajo, y un FAB "+" rojo en la esquina inferior derecha. No hay navegación inferior ni superior. La documentación de la API es una página HTML estática servida desde `/api/v1/docs` que reporta errores. Los usuarios reportan que el botón "+" no se entiende como "reportar" y que la experiencia general se siente básica comparada con Google Maps.

El stack es Next.js 14 App Router + Tailwind CSS + Leaflet/React-Leaflet. Sin dependencias de UI libraries.

## Goals / Non-Goals

**Goals:**
- Rediseñar el FAB "+" por un botón "Reportar" con icono y texto visible, que comunique claramente su propósito.
- Agregar navegación bottom nav en móvil y toolbar superior en desktop (estilo Google Maps).
- Rediseñar la bottom card (info del marcador) con bottom sheet expandible, handle visual, diseño limpio.
- Mejorar la search bar con estilo más pulido (sombra, icono, placeholder).
- Diagnosticar y arreglar `/api/v1/docs` para que sirva correctamente.
- Agregar página `/docs` accesible desde la navegación principal con documentación de la API pública.
- Diseño 100% responsive: mobile-first, desktop adaptado.

**Non-Goals:**
- No cambiar la lógica del backend o base de datos.
- No agregar dependencias externas (UI libs, icon libs, etc.).
- No rediseñar el formulario de reportar (`/reportar`).
- No agregar autenticación de usuarios públicos.
- No cambiar la lógica de filtros existente.

## Decisions

1. **Bottom Navigation (mobile) + Top Toolbar (desktop) con CSS media queries en vez de dos layouts separados**: La app detecta el viewport y muestra bottom nav (< 768px) o top toolbar (>= 768px). Alternativa considerada: usar `useMediaQuery` hook. Decisión: Tailwind `hidden md:flex` / `md:hidden` para mantener simplicidad y SSR compatibilidad.

2. **Bottom sheet rediseñado con drag handle y expansión**: En móvil, la card del marcador ocupará ~40% de la pantalla inicialmente con un handle "≡" en la parte superior indicando que se puede expandir. Al hacer clic en el handle, se expande a ~80%. En desktop, se muestra como sidebar flotante a la izquierda del mapa (similar a Google Maps).

3. **FAB "Reportar" con icono SVG inline + texto**: En vez de "+" genérico, usar un icono de "megáfono" o "bandera" (SVG inline, sin dependencias) con la palabra "Reportar" al lado. En móvil será un botón circular con icono y texto pequeño abajo; en desktop será un botón rectangular con icono y texto.

4. **API docs como página estática externa en `/docs`**: Crear `app/docs/page.tsx` renderizando la documentación como componente React con Tailwind (no inline CSS). La ruta `/api/v1/docs` se mantiene pero se arregla el bug. La nueva página `/docs` es más completa, con diseño responsivo, ejemplos interactivos (curl, JavaScript fetch, Python requests), y accesible desde la navegación.

5. **Íconos inline SVG sin librerías externas**: Para mantener el bundle pequeño, todos los iconos (búsqueda, reportar, docs, info, flechas) serán SVG inline definidos como componentes React.

6. **Animaciones CSS nativas**: La bottom sheet usa `transform: translateY()` con `transition` para animación suave. El FAB tendrá un leve bounce/pulse al cargar. Todo con CSS y Tailwind, sin librerías de animación.

7. **Diagnóstico de `/api/v1/docs`**: El bug más probable es que la ruta no maneje correctamente el encoding o que haya un error de sintaxis en el HTML. Se inspeccionará con curl para ver el error exacto y se corregirá.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Bottom sheet en móvil puede ser lenta en dispositivos de gama baja | Usar `will-change: transform` y animaciones CSS-only |
| El bottom nav ocupa espacio vertical valioso en móvil | Hacerlo compacto (48px height) y con fondo semitranslúcido con backdrop-blur |
| Los SVG inline pueden hacer el bundle más grande si no se optimizan | Cada icono es un componente pequeño (~20 líneas). Si crece, se mueven a un archivo `components/icons.tsx` |
| La página `/docs` puede quedar desactualizada respecto a la API real | Se crea como documentación explícita con schema de datos actual; se documenta en tareas la necesidad de mantenerla sincronizada |
