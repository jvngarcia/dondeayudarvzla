## Context

Aplicación web desde cero para listar lugares de acopio en Venezuela post-terremoto. Stack: Next.js 14+ (App Router) + Supabase + Vercel. Mobile-first, sin registro de usuarios. Datos moderados por un administrador.

## Goals / Non-Goals

**Goals:**
- MVP funcional en <48h con mapa, reportes y admin panel
- Mapa interactivo con Leaflet + OSM mostrando lugares aprobados
- Formulario público anónimo con rate limiting
- Panel admin con Supabase Auth (magic link) para moderar contenido
- Mobile-first responsive

**Non-Goals:**
- No se reciben donaciones en la plataforma (solo informativo)
- No hay registro de usuarios ni perfiles
- No hay notificaciones push ni emails automáticos
- No hay i18n multi-idioma en MVP
- No hay PWA offline support en MVP

## Decisions

### 1. Next.js App Router sobre Pages Router
- **Opción**: App Router con Server Components y API Routes
- **Por qué**: Mejor rendimiento, layout anidado, server components reducen JS bundle. Ideal para mobile-first.
- **Alternativa**: Pages Router — más maduro pero App Router es el futuro y para proyecto nuevo es la decisión correcta.

### 2. Leaflet + react-leaflet sobre Mapbox/Google Maps
- **Opción**: Leaflet con tiles de OpenStreetMap
- **Por qué**: 100% gratuito, sin límites de uso, sin API key. Bundle pequeño (~40KB gzipped). Ideal para crisis donde el tráfico puede dispararse.
- **Alternativa**: Google Maps — costoso a escala, requiere API key, más peso. Mapbox — mismo problema de costos.
- **Riesgo**: OSM tiles pueden ser lentos en Venezuela. Mitigación: considerar tiles alternativos (CartoDB) que son más rápidos.

### 3. Supabase sobre Firebase/BaaS propio
- **Opción**: Supabase (PostgreSQL + Storage + Auth)
- **Por qué**: PostgreSQL nativo, RLS policies para seguridad, Storage para fotos, Auth con magic link. Plan gratis generoso. Un solo proveedor.
- **Alternativa**: Firebase — NoSQL, más caro a escala, vendor lock-in. Vercel Postgres — solo DB, faltan Storage y Auth.

### 4. Sin autenticación de usuarios (solo admin)
- **Opción**: Solo el admin tiene cuenta (Supabase Auth + magic link)
- **Por qué**: Reduce fricción para reportar. La gente en crisis no va a crear cuentas.
- **Mitigación anti-spam**: Rate limiting por IP (Vercel Edge Middleware) + Cloudflare Turnstile en formulario.

### 5. Mobile-first con Tailwind CSS
- **Opción**: Diseño mobile-first con Tailwind utility classes
- **Por qué**: Rápido de prototipar, responsive por defecto. La audiencia principal usa celulares.

## Data Model

```sql
create table acopios (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  tipo          text not null check (tipo in ('punto_fijo', 'punto_movil', 'organizacion')),
  direccion     text not null,
  ciudad        text not null default 'Caracas',
  estado        text not null default 'Distrito Capital',
  lat           float8,
  lng           float8,
  contacto      text not null,
  horario       text,
  que_reciben   text[] default '{}',
  foto_url      text,
  fuente        text,
  fuente_contacto text,
  status        text not null default 'pendiente' check (status in ('pendiente', 'aprobado', 'rechazado')),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references auth.users(id)
);

-- Index for map queries
create index idx_acopios_status on acopios (status);
create index idx_acopios_ciudad on acopios (ciudad);
```

## Route Design

```
/                        → Mapa full-screen con markers + sidebar
/reportar                → Formulario público (foto, dirección, contacto, etc.)
/admin                   → Login redirect (magic link)
/admin/dashboard         → Tabla de reportes pendientes (aceptar/rechazar)
/admin/acopios           → CRUD de lugares aprobados
/api/acopios             → GET (público, solo aprobados)
/api/acopios/reportar    → POST (público, con rate limit)
```

## Component Tree

```
Layout
├── MapaPage (/)
│   ├── Mapa (LeafletMap)
│   │   └── Marker[] (por cada acopio aprobado)
│   │       └── Popup (nombre, dirección, contacto, qué reciben, foto)
│   ├── SidebarFiltros (buscar, filtrar por qué reciben)
│   └── BotonFlotante → /reportar
│
├── ReportarPage (/reportar)
│   └── ReportForm
│       ├── Inputs: nombre, dirección, contacto, qué reciben, horario
│       ├── FileUpload (foto → Supabase Storage)
│       └── TurnstileWidget
│
└── AdminLayout (/admin)
    ├── LoginPage
    └── Dashboard
        ├── TablaPendientes (aceptar/rechazar)
        └── GestionAcopios (CRUD completo)
```

## Risks / Trade-offs

- **[Spam] Formulario público sin auth** → Rate limiting por IP en Vercel Edge Middleware + Turnstile
- **[Costo] Tráfico inesperado en Vercel** → Vercel tiene free tier (100h serverless/mes). Si explota, considerar upgrade a Pro ($20/mes)
- **[Latencia] OSM tiles lentos en Venezuela** → Usar CartoDB tiles como fallback, cachear tiles con service worker si hay tiempo
- **[Precisión] Coordenadas incorrectas** → El admin debe verificar dirección antes de aprobar. Usar Nominatim para geocoding automático
- **[Datos semilla] Poca data al inicio** → Cargar 5-10 lugares conocidos manualmente antes del lanzamiento
- **[Mobile] Leaflet en móviles** → Touch events funcionan bien, pero probar en dispositivos reales
