## Why

Currently all reported locations are classified as "acopios" (collection centers), but volunteers and residents also need to report "refugios" (shelters) — temporary housing for displaced people. Without distinguishing these, people can't tell whether a location distributes supplies or provides shelter.

## What Changes

- Add a `categoria` field to the report form with two options: `"refugio"` (shelter) and `"centro_acopio"` (collection center)
- Persist the category in the database and expose it via the API
- Add client-side filtering by category on the map
- Use distinct marker colors/icons for refugios vs centros de acopio
- Update the admin review interface to show the category

## Capabilities

### New Capabilities
- `location-category`: Categorize reported locations as refugio (shelter) or centro de acopio (collection center), filterable on the map with distinct visual markers

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- **Database**: New `categoria` column (enum: `refugio`, `centro_acopio`) on `acopios` table
- **Types**: New `CategoriaAcopio` type, added to `Acopio` and `ReportFormData` interfaces
- **Report form**: New radio/toggle input for category selection
- **API**: Accept and return `categoria` field
- **Map display**: New marker styling for refugios; filter sidebar updated with category toggle
- **Admin dashboard**: Show category in pending/approved lists
