## 1. Diagnosticar y arreglar /api/v1/docs

- [x] 1.1 Probar la ruta /api/v1/docs con curl para identificar el error exacto
- [x] 1.2 Corregir el error en app/api/v1/docs/route.ts (encoding, sintaxis HTML, o problema de ruta)
- [x] 1.3 Verificar que la ruta responde con HTML válido y status 200

## 2. Crear componentes de iconos SVG

- [x] 2.1 Crear components/icons.tsx con SVG inline: SearchIcon, ReportIcon, DocsIcon, InfoIcon, MapIcon, ExpandIcon
- [x] 2.2 Verificar que los iconos se rendericen correctamente con Tailwind clases de color/tamaño

## 3. Rediseñar la search bar

- [x] 3.1 Reemplazar emoji "🔍" por SearchIcon SVG en MapPageClient.tsx
- [x] 3.2 Mejorar estilos de la search bar: sombra sutil (shadow-sm), borde redondeado (rounded-lg), padding

## 4. Rediseñar FAB "Reportar"

- [x] 4.1 Crear componente ReportButton con icono SVG ReportIcon + texto "Reportar"
- [x] 4.2 Posicionar en móvil como botón circular con icono + texto abajo
- [x] 4.3 Posicionar en desktop como botón rectangular con icono + texto al lado
- [x] 4.4 Agregar animación CSS de entrada (fade-in + scale) usando Tailwind animate

## 5. Rediseñar bottom sheet del marcador

- [x] 5.1 Rediseñar la card inferior en MapPageClient.tsx con handle visual "≡"
- [x] 5.2 Implementar expansión de bottom sheet al hacer clic en el handle (40% → 80%)
- [x] 5.3 Mejorar estilos: border radius, sombra, padding, transiciones suaves
- [x] 5.4 En desktop (>768px) mostrar como sidebar flotante a la izquierda

## 6. Crear navegación inferior (móvil) y toolbar superior (desktop)

- [x] 6.1 Crear componente BottomNav con 4 elementos: Explorar, API Docs, Reportar, Acerca de
- [x] 6.2 Crear componente TopToolbar con logo + enlaces
- [x] 6.3 Integrar BottomNav y TopToolbar en app/layout.tsx usando Tailwind responsive (hidden md:flex / md:hidden)
- [x] 6.4 Marcar elemento activo según la ruta actual

## 7. Crear página /docs de documentación API

- [x] 7.1 Crear app/docs/page.tsx con documentación completa de la API usando Tailwind CSS
- [x] 7.2 Incluir: Base URL, endpoints, parámetros de filtro, schema de datos, formato JSON:API
- [x] 7.3 Agregar ejemplos de código en curl, JavaScript fetch, y Python requests
- [x] 7.4 Hacer la página responsiva (max-w-4xl centrado en desktop, padding en móvil)

## 8. Reemplazar emojis por SVG en la UI

- [x] 8.1 Reemplazar emojis (📍📞🕐📦🔍) por iconos SVG inline en MapPageClient.tsx
- [x] 8.2 Reemplazar emojis en la bottom sheet y otros lugares de la UI

## 9. Verificación final

- [x] 9.1 Verificar que npm run dev funciona sin errores
- [x] 9.2 Verificar que la ruta /api/v1/docs responde correctamente
- [x] 9.3 Verificar navegación completa: mapa → reportar → docs → volver al mapa
- [x] 9.4 Verificar responsive design en móvil y desktop
