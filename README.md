# Dónde Ayudar Vzla

Encuentra puntos de acopio y organizaciones para donar en Venezuela. Un mapa interactivo que muestra lugares verificados donde puedes llevar ayuda humanitaria.

## Tecnologías

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Base de datos:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Mapa:** [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Anti-spam:** Cloudflare Turnstile + Rate limiting por IP

## Instalación y desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/jvngarcia/dondeayudarvzla.git
cd dondeayudarvzla

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase y Turnstile

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role de Supabase |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key de Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Secret key de Cloudflare Turnstile |

## API pública

El proyecto expone una API REST con formato [JSON:API](https://jsonapi.org/).

- **Endpoints:** `GET /api/v1/acopios`
- **Documentación interactiva:** `GET /api/v1/docs`
- **API existente:** `GET /api/acopios`

Consulta la [documentación completa](https://dondeayudarvzla.vercel.app/api/v1/docs) para más detalles.

## Contribuir

Las contribuciones son bienvenidas. Revisa [CONTRIBUTING.md](CONTRIBUTING.md) para comenzar.

## Licencia

[MIT](LICENSE)
