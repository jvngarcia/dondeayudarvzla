## 1. Setup del proyecto

- [x] 1.1 Crear proyecto Next.js con create-next-app (App Router, TypeScript, Tailwind)
- [x] 1.2 Instalar dependencias: leaflet, react-leaflet, @supabase/supabase-js, @supabase/ssr, @types/leaflet
- [x] 1.3 Proyecto Supabase configurado
- [x] 1.4 Migración SQL ejecutada
- [x] 1.5 Bucket Storage "fotos-acopios" creado
- [x] 1.6 Variables de entorno configuradas — *parcial: falta Turnstile*
- [x] 1.7 Cloudflare Turnstile configurado
- [x] 1.8 Cliente Supabase en lib/supabase.ts

## 2. API y lógica de datos

- [x] 2.1 GET /api/acopios
- [x] 2.2 POST /api/acopios/reportar
- [x] 2.3 Rate limiting por IP (middleware)
- [x] 2.4 Verificación Turnstile en endpoint
- [x] 2.5 Geocoding con Nominatim
- [x] 2.6 RLS policies configuradas

## 3. Mapa interactivo

- [x] 3.1 Crear componente LeafletMap con react-leaflet (centrado en Caracas)
- [x] 3.2 Cargar markers desde GET /api/acopios y mostrarlos en el mapa
- [x] 3.3 Implementar popup con información del lugar al hacer click en marker
- [x] 3.4 Agregar sidebar/filtros por tipo de lugar y categoría de donación
- [x] 3.5 Diseñar página principal mobile-first (mapa full-screen + botón flotante de reportar)
- [x] 3.6 Manejar estado de carga y error en el mapa

## 4. Formulario público de reporte

- [x] 4.1 Crear página /reportar con formulario (nombre, tipo, dirección, contacto, horario, qué reciben)
- [x] 4.2 Implementar subida de foto a Supabase Storage
- [x] 4.3 Integrar widget de Cloudflare Turnstile
- [x] 4.4 Conectar formulario con POST /api/acopios/reportar
- [x] 4.5 Agregar validación de campos y mensajes de error/success
- [x] 4.6 Diseño responsive mobile-first

## 5. Panel de administración

- [x] 5.1 Configurar Supabase Auth con magic link en /admin/login
- [x] 5.2 Crear layout protegido para /admin/* con verificación de sesión
- [x] 5.3 Crear dashboard con tabla de reportes pendientes (aceptar/rechazar)
- [x] 5.4 Crear página de gestión de lugares aprobados (editar/eliminar)
- [x] 5.5 Permitir al admin ajustar coordenadas manualmente en un mini-mapa
- [x] 5.6 Diseño responsive para el panel admin

## 6. Deploy y lanzamiento

- [x] 6.1 Configurar dominio dondeayudarvzla.com en Vercel — *usuario: manual*
- [x] 6.2 Ejecutar `vercel --prod` con variables de entorno — *usuario: manual*
- [x] 6.3 Cargar datos semilla (5-10 lugares de acopio confirmados) — *usuario: pegar seed-data.sql*
- [x] 6.4 Probar flujo completo en producción: mapa, reporte, moderación — *usuario: manual*
- [x] 6.5 Probar en dispositivos móviles reales — *usuario: manual*
- [x] 6.6 Compartir en redes sociales — *usuario: manual*
