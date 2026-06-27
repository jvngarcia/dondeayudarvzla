## 1. Dependencies & Setup

- [x] 1.1 Install `react-leaflet-cluster` and `@react-leaflet/core` npm packages
- [x] 1.2 Create a custom CSS module `styles/map.css` for Leaflet overrides (zoom control, cluster styles, glassmorphism)
- [x] 1.3 Import the new CSS module in layout or components that use the map

## 2. Tile Layer Upgrade

- [x] 2.1 Replace `TileLayer` URL in `LeafletMap.tsx` from OSM to CartoDB Voyager (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`)
- [x] 2.2 Add tile error fallback: on `tileerror` event, switch tile URL to OSM fallback URL
- [x] 2.3 Apply the same tile change to `MiniMapPicker.tsx`

## 3. Rich SVG Markers

- [x] 3.1 Design per-type SVG icons: building pin (`punto_fijo`), truck (`punto_movil`), heart/group (`organizacion`) with color coding
- [x] 3.2 Replace `createDivIcon` with an inline SVG `L.divIcon` that includes the icon symbol, shadow, and type color
- [x] 3.3 Add CSS hover transition (`transform: scale(1.2)` with smooth `transition`) to the marker class
- [x] 3.4 Add a subtle bounce-in animation when markers first appear on the map

## 4. Marker Clustering

- [x] 4.1 Wrap the markers list in `MarkerClusterGroup` from `react-leaflet-cluster`
- [x] 4.2 Customize cluster icon styling (colored circles with white count text, matching the design system)
- [x] 4.3 Configure cluster animation (smooth spiderfication on click)
- [ ] 4.4 Test cluster behavior at various zoom levels

## 5. Custom Zoom Control

- [x] 5.1 Add CSS overrides in `map.css` for Leaflet's `.leaflet-control-zoom` (rounded corners, shadow, modern color)
- [x] 5.2 Ensure zoom control matches the app's button design language

## 6. My Location Control

- [x] 6.1 Create a custom `LocateControl` component using `useMap()` and the browser Geolocation API
- [x] 6.2 Add a locate button styled as a floating icon button (positioned below zoom controls)
- [x] 6.3 Implement `map.flyTo()` on successful geolocation
- [x] 6.4 Handle geolocation errors gracefully (silent fail, no error UI)
- [x] 6.5 Add the LocateControl component to `LeafletMap.tsx`

## 7. Info Panel Modernization

- [x] 7.1 Apply glassmorphism style (`bg-white/80 backdrop-blur-md`) to the bottom sheet and sidebar backgrounds
- [x] 7.2 Replace emoji in "Cómo llegar" button with an SVG direction icon
- [x] 7.3 Refine transition timing/easing on sheet open/close (spring-like cubic-bezier)
- [x] 7.4 Add a subtle shadow and border radius polish to the filter bar and search bar

## 8. MiniMapPicker Polish

- [x] 8.1 Apply the same Voyager tile layer to `MiniMapPicker.tsx`
- [x] 8.2 Update the marker style in MiniMapPicker to match the new marker design
- [x] 8.3 Add the custom CSS module import to MiniMapPicker

## 9. Verification

- [x] 9.1 Run `npm run build` and confirm no TypeScript errors
- [x] 9.2 Visually verify map on desktop (search, filters, marker click, info panel, locate, zoom)
- [x] 9.3 Visually verify map on mobile (bottom sheet, responsive layout, touch interactions)
- [x] 9.4 Test with empty state (no markers matching filters clears gracefully)
- [x] 9.5 Test with error state (API failure shows error message)
