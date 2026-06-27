## Context

The reporting form, API, database, map display, and admin interface all assume every location is a "centro de acopio" (collection center). There is no concept of "refugio" (shelter). Users need to distinguish between these two categories when reporting, and visitors need to filter by category on the map.

The current `tipo` field (`punto_fijo`, `punto_movil`, `organizacion`) describes the operational mode (fixed, mobile, organization), not the category. A new independent `categoria` dimension is needed alongside `tipo`.

## Goals / Non-Goals

**Goals:**
- Add a `categoria` field (`refugio` | `centro_acopio`) to the report form
- Persist `categoria` in the database, API, and type system
- Display refugios with distinct marker styling (color/icon) on the map
- Add client-side filter toggle for category on the map
- Show category in the admin review and management views

**Non-Goals:**
- Changing the existing `tipo` field behavior
- Migration of existing records (all current records default to `centro_acopio`)
- Internationalization beyond existing Spanish labels

## Decisions

1. **New column vs separate table**: A `categoria` column on the `acopios` table with a CHECK constraint (`refugio` | `centro_acopio`). A separate table adds join complexity for no benefit — the two categories share the same schema and presentation logic.

2. **Marker color for refugios**: Purple (`#8b5cf6`) — distinct from the existing blue/orange/green used by `tipo`. The marker shape will use a house/building icon to contrast with collection centers (pin for `punto_fijo`, truck for `punto_movil`, heart for `organizacion`).

3. **Form UI**: A required radio button group below the `tipo` selector with two options: "Refugio" and "Centro de Acopio". Users must pick both a category and a type when reporting.

4. **Default for existing records**: All current rows get `categoria = 'centro_acopio'` via a default column value. No backfill script is needed for new deployments.

5. **Filter on map**: Category filter added alongside existing `tipo` filter. Default: show both. Uses toggle buttons similar to existing filter chips.

6. **API backward compatibility**: `GET /api/acopios` returns `categoria` in the response. No breaking changes since this is additive.

## Risks / Trade-offs

- **User confusion**: Adding another required field may increase form abandonment. Mitigation: clear labels and icons, keep the field prominent but simple (two radio buttons).
- **Existing data**: All existing records will show as `centro_acopio`. Mitigation: this is semantically accurate — all current entries are collection centers. Admins can manually update if needed.
- **Migration complexity**: Adding a NOT NULL column to a live table requires a default. Mitigation: use `default 'centro_acopio'` and add the column in a single ALTER TABLE statement.
