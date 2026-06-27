## 1. Database Migration

- [x] 1.1 Add `categoria` column to `acopios` table in `supabase-migration.sql` with CHECK constraint (`refugio` | `centro_acopio`) and default `'centro_acopio'`

## 2. TypeScript Types

- [x] 2.1 Add `CategoriaAcopio` type (`"refugio" | "centro_acopio"`) to `types/index.ts`
- [x] 2.2 Add `categoria: CategoriaAcopio` field to `Acopio` interface
- [x] 2.3 Add `categoria: CategoriaAcopio` field to `ReportFormData` interface

## 3. Report Form

- [x] 3.1 Add `categoria` state to `app/reportar/page.tsx` with default `"centro_acopio"`
- [x] 3.2 Add radio button group UI for "Refugio" / "Centro de Acopio" below the Tipo selector
- [x] 3.3 Add `categoria` validation (required) to the `validate` function
- [x] 3.4 Append `categoria` to the FormData payload in `handleSubmit`

## 4. API Endpoints

- [x] 4.1 Read `categoria` from form data in `app/api/acopios/reportar/route.ts` and include in the Supabase insert
- [x] 4.2 Add `filter[categoria]` support to `app/api/v1/acopios/route.ts` and include `categoria` in JSON:API attributes

## 5. Map Markers

- [x] 5.1 Add refugio marker color (`#8b5cf6` purple) and house icon SVG path to `components/LeafletMap.tsx`
- [x] 5.2 Create `createRichIconForCategory` or modify `createRichIcon` to accept a `categoria` param
- [x] 5.3 Determine marker icon at render time: refugios use purple/house icon, centros de acopio use existing tipo-based logic
- [x] 5.4 Add `CategoriaBadge` component to `components/MapPageClient.tsx` and display it in `MarkerInfoContent`

## 6. Map Filter

- [x] 6.1 Add `filtroCategoriaLugar` state to `MapPageClient.tsx`
- [x] 6.2 Add category filter toggle buttons ("Refugio", "Centro de Acopio") to the filter bar
- [x] 6.3 Apply category filter in the `filtrados` useMemo logic

## 7. Admin Interface

- [x] 7.1 Show `categoria` in pending report cards in `app/admin/dashboard/page.tsx`
- [x] 7.2 Add `categoria` display and editable field in `app/admin/acopios/page.tsx` edit form
- [x] 7.3 Include `categoria` in the Supabase update payload in `saveEdit`
