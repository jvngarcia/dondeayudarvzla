## Why

La interfaz actual es funcional pero no está optimizada para móviles. Los filtros están arriba (incómodo con una mano), las cards son simples, y la UX general no es intuitiva para usuarios en crisis que necesitan encontrar información rápido.

## What Changes

- Filtros movidos a la parte inferior (bottom sheet / barra inferior) para acceso cómodo con el pulgar
- Cards de lugares rediseñadas con jerarquía visual clara: foto, nombre, distancia, qué reciben
- Popup del mapa rediseñado como bottom card al seleccionar un marker
- Barra de búsqueda por nombre/lugar
- Indicador visual de categorías (colores por tipo: punto_fijo, punto_movil, organización)
- Micro-interacciones: loading skeleton, animaciones suaves en transiciones
- Tipografía y espaciado mejorados para legibilidad en pantallas pequeñas
- No breaking — mejora sobre la UI existente

## Capabilities

### Modified Capabilities
- `mapa-interactivo`: Filtros en bottom sheet, popups como bottom cards, búsqueda, indicador visual por tipo
- `reporte-publico`: Mejora de espaciado, tipografía, micro-interacciones y validación visual

## Impact

- Modificación de componentes: MapPageClient.tsx, LeafletMap.tsx, MiniMapPicker.tsx, ReportForm
- No se agregan dependencias nuevas
- Sin cambios en API, base de datos o lógica de negocio
