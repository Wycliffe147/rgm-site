# Crusade Date Logic Feature

## Overview
This feature implements structured date handling for crusades, allowing dates to be categorized by type (single day, continuous range, or separate dates) and displayed consistently across the site.

## Database Changes

### New Columns Added to `crusades` Table
- `date_type` (TEXT): Type of date range - 'legacy', 'single', 'continuous', or 'separate'
- `start_date` (TEXT): Start date in YYYY-MM-DD format
- `end_date` (TEXT): End date in YYYY-MM-DD format  
- `custom_dates` (TEXT): JSON array of dates for 'separate' type

### Migration File
**Location:** `migrations/001_add_date_fields.sql`

**How to Apply:**
```bash
# Using Wrangler with D1
wrangler d1 execute rgm_db --file ./migrations/001_add_date_fields.sql
```

**Data Preservation:**
- All existing crusades are marked as `date_type='legacy'`
- Existing `date_range` text is preserved
- No data is deleted or modified

## Admin Panel Usage

### Creating a New Crusade
1. Go to Admin Dashboard > Crusades > Add New Crusade
2. Select **Date Type**:
   - **Legacy (text format)**: Manual text entry (default for existing crusades)
   - **Single Day**: Enter one date
   - **Continuous Range**: Enter start and end dates
   - **Separate Dates**: Enter multiple dates (one per line, format: YYYY-MM-DD)

3. Based on selection, fill in the appropriate date fields
4. Save the crusade

### Date Type Examples

#### Single Day
- Input: 2026-10-09
- Display: "Oct 9, 2026"

#### Continuous Range
- Input: Start 2026-10-09, End 2026-10-11
- Display: "Oct 9 - Oct 11, 2026"

#### Separate Dates
- Input: 
  ```
  2026-10-09
  2026-10-15
  2026-11-02
  ```
- Display: "Oct 9, Oct 15, Nov 2, 2026"

#### Legacy
- Input: "Oct 9-11, 2026" (as text)
- Display: "Oct 9-11, 2026"

## API Changes

### GET /api/crusades
Returns crusades with formatted dates. Crusades are sorted by:
1. Status (upcoming first)
2. Start date (earliest first)
3. ID (newest first)

**Response Includes:**
- `date_range`: Formatted date string for display
- `date_type`: The type of date range
- `start_date`, `end_date`, `custom_dates`: Raw date data

### GET /api/crusades/:slug
Individual crusade endpoint includes formatted dates.

### POST /api/admin/crusades
Create new crusade with structured dates.

**Required Fields:**
- `slug` (string)
- `title` (string)
- `status` (string: 'upcoming' or 'past')
- `date_type` (string: 'legacy', 'single', 'continuous', 'separate')

**Conditional Fields Based on date_type:**
- If 'legacy': `date_range` (text string)
- If 'single': `start_date` (YYYY-MM-DD)
- If 'continuous': `start_date` and `end_date`
- If 'separate': `custom_dates` (JSON array as string)

### PATCH /api/admin/crusades
Update existing crusade. Same fields as POST.

## Frontend Display

The frontend automatically formats dates based on date_type:
- Frontend receives `date_range` (formatted string) for display
- No frontend changes needed for basic display
- Crusades page shows dates in consistent format
- Crusades are sorted by date (upcoming first, then by date)

## Backward Compatibility

✅ **Fully backward compatible**
- Existing crusades continue to work as 'legacy' type
- Existing date_range text is preserved
- No breaking changes to existing data
- Admin UI supports both old and new date types

## Testing Checklist

- [ ] Run migration: `wrangler d1 execute rgm_db --file ./migrations/001_add_date_fields.sql`
- [ ] Verify existing crusades still display correctly
- [ ] Test adding new crusade with 'single' date type
- [ ] Test adding new crusade with 'continuous' date type
- [ ] Test adding new crusade with 'separate' dates
- [ ] Verify crusades page sorts by date correctly
- [ ] Test editing existing crusade (should remain 'legacy')
- [ ] Test converting legacy crusade to structured dates (edit and change type)

## File Changes

### Backend
- `functions/api/crusades/index.js` - Updated with date formatting and sorting
- `functions/api/crusades/[slug].js` - Updated with date formatting
- `functions/api/admin/crusades.js` - Updated to handle new date fields

### Frontend
- `public/admin/index.html` - Added date type selector and conditional date fields

### Database
- `migrations/001_add_date_fields.sql` - Schema migration file

## Future Enhancements

- Date picker UI improvements
- Calendar view for crusades
- Export/import crusade dates
- Date range filtering on crusades page
- Advanced sorting options
