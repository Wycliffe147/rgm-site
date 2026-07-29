# Deployment Guide: Crusade Date Logic Feature

## Prerequisites
- Wrangler CLI installed and configured
- Access to Cloudflare D1 database (rgm_db)

## Step-by-Step Deployment

### 1. Apply Database Migration
```bash
cd C:\Users\TCO\Documents\Projects\RGM
wrangler d1 execute rgm_db --file ./migrations/001_add_date_fields.sql
```

**Expected Output:**
```
✓ Executed migration against rgm_db successfully.
```

### 2. Deploy Updated Code
```bash
wrangler deploy
```

This will deploy:
- Updated API endpoints (crusades, admin crusades)
- Updated admin UI with date selector
- All other unchanged files

### 3. Verify Deployment

**Test 1: Check existing crusades**
```bash
curl https://your-domain.pages.dev/api/crusades
```
Should return crusades with `date_range` formatted strings.

**Test 2: Admin panel**
Visit: `https://your-domain.pages.dev/admin`
- Log in
- Go to Crusades tab
- Click "Edit" on existing crusade
- Verify date_type shows as "Legacy"
- Create new crusade with "Single Day" date type

## Rollback (if needed)

The migration is backward compatible, but if you need to remove the new columns:

```sql
-- Remove new columns (not recommended - data loss risk)
ALTER TABLE crusades DROP COLUMN date_type;
ALTER TABLE crusades DROP COLUMN start_date;
ALTER TABLE crusades DROP COLUMN end_date;
ALTER TABLE crusades DROP COLUMN custom_dates;
```

However, this is not recommended since the code expects these columns.

## Data Verification After Deployment

```bash
# Check that migration applied successfully
wrangler d1 execute rgm_db --command "SELECT COUNT(*) as total, COUNT(date_type) as with_type FROM crusades;"
```

Should show:
- total: [number of crusades]
- with_type: [same number of crusades] (all should have date_type set)

## Support

If you encounter issues:
1. Check that all file changes were deployed
2. Verify database migration executed successfully
3. Clear browser cache (admin panel may be cached)
4. Check browser console for JavaScript errors
