## Context

The app currently renders a Leaflet map using default OpenStreetMap tiles and small colored circle markers (20px divIcons). The info panel uses a bottom sheet on mobile and a sidebar on desktop. There is no clustering, no locate control, no custom zoom control styling, and the overall aesthetic is functional but dated — the tiles are desaturated, markers are minimal circles, and the controls use Leaflet's default look.

All map components are in `components/LeafletMap.tsx`, `components/MapPageClient.tsx`, and `components/MiniMapPicker.tsx`. The styling uses Tailwind utility classes; no custom CSS module exists for map overrides.

## Goals / Non-Goals

**Goals:**
- Replace OSM tiles with a modern, visually crisp tile style (CartoDB Voyager or Positron — free, no API key)
- Redesign markers as rich SVG icons with per-type symbols, shadows, and hover/scale animations
- Add marker clustering for zoom levels where markers overlap
- Custom-styled zoom control that matches the new aesthetic
- Add a "My Location" button using the Geolocation API
- Apply glassmorphism and shadow polish to the info sheet, search bar, and filter bar
- Smooth transitions on marker hover, info panel open/close, and cluster interactions
- Apply equivalent visual polish to MiniMapPicker
- Keep the implementation lightweight — no paid services, no API keys

**Non-Goals:**
- No changes to the data model, API routes, or Supabase schema
- No GeoJSON layers or custom vector tiles
- No Mapbox GL JS or Google Maps migration — stay on Leaflet
- No new map features beyond visual polish (no routes, no heatmaps)

## Decisions

1. **Tile layer: CartoDB Voyager (free, no API key)**
   - Alternatives considered: Stadia (used to be free, now paid), Thunderforest (free tier with key), OpenTopoMap (theme mismatch)
   - Voyager has a clean, modern look with labeled streets and POIs — closest to Google Maps aesthetic
   - Positron (light/dark) is a secondary option if users prefer a minimalist look
   - URL: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`

2. **Markers: L.divIcon with inline SVG + CSS transitions**
   - Alternatives considered: L.icon with PNG sprites, Font Awesome markers, L.canvas
   - SVG keeps everything inline, no extra HTTP requests, easy to animate via CSS
   - Each type gets a distinct icon: building pin for punto_fijo, truck for punto_movil, heart/people for organizacion
   - Use CSS `transition: transform` for hover scale effect

3. **Clustering: react-leaflet-cluster (leaflet.markercluster wrapper)**
   - Alternatives considered: custom clustering via Supercluster, no clustering
   - react-leaflet-cluster provides a drop-in `<MarkerClusterGroup>` around existing markers
   - Keeps the marker rendering declarative and React-friendly
   - Customize cluster icons to match the new design (colored circles with count)

4. **Zoom control: custom CSS overrides on Leaflet's default zoom control**
   - Alternatives considered: react-leaflet-control for a fully custom component, hiding Leaflet's default
   - Overriding CSS is simplest and avoids extra dependencies
   - Style the zoom buttons to be rounded, shadowed, and colored to match the design system

5. **My Location: @react-leaflet/core's useMap() + navigator.geolocation**
   - No extra dependency needed — native Geolocation API + Leaflet map.flyTo()
   - Add a custom control button that triggers geolocation and flies to user position
   - Show a pulsing blue dot on the map while locating

6. **Info panel: keep bottom sheet / sidebar pattern, enhance visually**
   - Add glassmorphism (backdrop-blur, semi-transparent backgrounds) to the info panels
   - Smoother transitions (spring-like easing instead of linear duration-300)
   - Replace the emoji "🗺️" with an SVG icon for consistency

## Risks / Trade-offs

- **CartoDB free tier**: Voyager tiles are free but rate-limited. If traffic spikes, tiles may degrade. Mitigation: monitor tile requests, add a tile error fallback to OSM.
- **MarkerCluster performance**: With many markers, clustering adds CPU overhead on zoom/pan. Mitigation: test with worst-case data (hundreds of markers). react-leaflet-cluster is well-maintained.
- **Geolocation permission**: Some users will deny location access. Mitigation: handle the error gracefully — just hide the locate button or show a toast.
- **CSS override fragility**: Leaflet's internal CSS class names can change between versions. Mitigation: pin leaflet version in package.json and review after updates.
- **Backward compatibility**: The MiniMapPicker is currently unused in /reportar. If it gets wired later, it should automatically inherit the new look.

## Open Questions

- Should we offer a tile layer switcher (Voyager / Positron / Dark) or stick to one?
- Do we want to add a zoom-to-fit-bounds button (in addition to locate)?
- Should marker popups be reintroduced alongside the side panel, or keep the panel-only approach?
