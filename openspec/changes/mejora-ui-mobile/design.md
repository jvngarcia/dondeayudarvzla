## Context

App de mapa de acopios con UI funcional pero básica. Los filtros están en la parte superior (incómodo en móvil), los popups del mapa son pequeños, y las cards no tienen jerarquía visual clara. Solo se modifican componentes de frontend, sin cambios en API/DB.

## Goals / Non-Goals

**Goals:**
- Filtros movidos a bottom bar para acceso con el pulgar
- Al hacer click en un marker, mostrar bottom card en lugar de popup flotante
- Cards tipo "acordeón" o lista con foto, nombre y badges de categoría
- Barra de búsqueda textual
- Indicador visual de tipo (color por tipo: punto_fijo, punto_movil, organizacion)
- Loading skeletons en lugar de texto plano
- Mejora de espaciado, tipografía y colores

**Non-Goals:**
- No cambiar lógica de negocio ni API
- No agregar nuevas dependencias
- No cambiar el panel admin

## Layout propuesto (mobile)

```
┌──────────────────────────────┐
│  🔍 Buscar lugar...    [filtro]│
│                              │
│         ┌─────┐             │
│      ┌──┤📍   ├──┐          │
│      │  └─────┘  │          │
│      │    ┌────┐ │          │
│      │    │📍  │ │          │
│      │    └────┘ │          │
│      │ ┌──────┐  │          │
│      └─┤📍    ├──┘          │
│        └──────┘             │
│                              │
│  ┌──── Bottom Sheet ──────┐ │
│  │ 📍 Cruz Roja Caracas   │ │
│  │ 🏢 Organización        │ │
│  │ 📍 Av. Andrés Bello    │ │
│  │ 📞 (0212) 555-1234     │ │
│  │ 🏷️ Medicinas Voluntarios│ │
│  └────────────────────────┘ │
│                              │
│  ┌── Bottom Filters Bar ──┐ │
│  │ [Todos] [Fijo] [Móvil]  │ │
│  │ [Agua] [Comida] [Ropa] │ │
│  └────────────────────────┘ │
│                        [+]  │
└──────────────────────────────┘
```

## Decisions

### 1. Bottom filters bar sobre dropdowns
- **Opción**: Barra de chips/pills horizontal en la parte inferior
- **Por qué**: Accesible con el pulgar, más rápido de usar, ocupa espacio muerto
- **Alternativa**: Dropdowns arriba (actual) — incómodo en mobile

### 2. Bottom card al seleccionar marker sobre Popup de Leaflet
- **Opción**: Detectar click en marker y mostrar un panel fijo en la parte inferior
- **Por qué**: Los popups de Leaflet son pequeños, se cierran solos, y en mobile son difíciles de leer. Una bottom card es nativa, más legible y persistente.
- **Alternativa**: Popup mejorado con estilos — no soluciona el problema de tamaño

### 3. Custom markers por tipo sobre marker único
- **Opción**: Círculos de colores según tipo (punto_fijo=azul, punto_movil=naranja, organizacion=verde)
- **Por qué**: Identificación visual inmediata del tipo de lugar
- **Alternativa**: Iconos iguales con etiqueta — requiere leer para entender

### 4. Búsqueda textual sobre solo filtros
- **Opción**: Input de búsqueda en la parte superior
- **Por qué**: Si hay 50+ lugares, buscar por nombre es más rápido que navegar el mapa
- **Alternativa**: Solo filtros por categoría — insuficiente para muchos datos

## Risks / Trade-offs

- **[Rendimiento] Custom markers en Leaflet** → Usar DivIcon en lugar de L.icon para evitar carga de imágenes
- **[Complejidad] Bottom sheet nativa** → Implementar con CSS simple (sin librerías), transición con translateY
- **[Espacio] Bottom filters + bottom card** → Solo uno visible a la vez. Filtros siempre visibles, bottom card aparece al seleccionar marker
- **[Contenido] Sin fotos en markers** → La bottom card cargará la foto si existe
