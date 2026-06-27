## Why

The current Leaflet map looks dated — it uses standard OpenStreetMap tiles and simple colored circle markers that feel like an early 2010s prototype. For a humanitarian aid map serving Venezuelan users, a modern, polished map builds trust and makes the information easier to digest at a glance. Users expect a visual experience closer to Google Maps or Mapbox.

## What Changes

- Swap the default OSM tile layer for a modern, visually clean tile style (CartoDB Voyager / Positron)
- Redesign markers as premium SVG-based markers with type-specific icons, subtle shadows, and hover/active states
- Add smooth marker animations (bounce on add, scale on hover)
- Implement marker clustering to handle overlapping markers at lower zoom levels
- Replace Leaflet's default zoom control with a custom styled control
- Add a "My Location" button using the Geolocation API
- Modernize the info sheet/sidebar with glassmorphism effects and smoother transitions
- Refine the overall map UI: filter bar styling, search bar, FAB button to match a cohesive modern aesthetic
- Apply the same visual upgrades to MiniMapPicker

## Capabilities

### New Capabilities
- `map-visual-refresh`: Complete visual overhaul of the Leaflet map — tile layer, markers, controls, info panels, and styling

### Modified Capabilities
- (none — no spec-level behavior changes; this is a purely visual/UX improvement)

## Impact

- **Components changed:** `LeafletMap.tsx`, `MapPageClient.tsx`, `MiniMapPicker.tsx`
- **New dependencies:** `leaflet.markercluster` + types, likely `react-leaflet-cluster`
- **CSS changes:** Custom Leaflet overrides in `globals.css` or a dedicated `map.css` module
- **No API or data model changes**
