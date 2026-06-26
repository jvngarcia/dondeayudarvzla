## Why

Tras el terremoto reciente en Venezuela, las personas necesitan un lugar centralizado y fiable donde encontrar puntos de acopio y organizaciones que están recibiendo donaciones. Actualmente la información está dispersa en redes sociales con poca verificación. Esta app resuelve eso con un mapa interactivo de datos moderados.

## What Changes

- Aplicación web completa desde cero (Next.js + Supabase + Vercel)
- Mapa interactivo (Leaflet + OSM) mostrando lugares de acopio aprobados
- Formulario público para reportar nuevos lugares de acopio (con rate limiting)
- Panel de administración para aprobar/rechazar reportes y gestionar datos
- Datos semilla cargados manualmente por el administrador
- Mobile-first, responsive
- Sin registro de usuarios — cualquiera puede ver el mapa y reportar

## Capabilities

### New Capabilities
- `mapa-interactivo`: Mapa con Leaflet + OSM que muestra markers de lugares de acopio aprobados, con popup de información al hacer click
- `reporte-publico`: Formulario anónimo con foto, dirección y contacto; protegido con rate limiting (Turnstile o IP-based)
- `admin-panel`: Dashboard protegido con autenticación (Supabase Auth + magic link) para aprobar/rechazar reportes y gestionar lugares
- `gestion-datos`: API y lógica de negocio para CRUD de lugares de acopio con estados (pendiente/aprobado/rechazado)

### Modified Capabilities

- None (no existing specs to modify)

## Impact

- Nuevo repositorio Next.js 14+ con App Router, TypeScript, Tailwind CSS
- Nuevo proyecto Supabase con tabla `acopios`, Storage para fotos, RLS policies
- Dependencias nuevas: leaflet, react-leaflet, @supabase/supabase-js, @supabase/ssr
- Deploy en Vercel con dominio dondeayudarvzla.com
- Sin impacto en sistemas existentes (proyecto nuevo)
