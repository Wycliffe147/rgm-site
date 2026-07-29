# Quick Reference: Crusade Date Logic Feature

## 📋 What to Deploy

Run these commands in order:

```bash
# 1. Navigate to project
cd C:\Users\TCO\Documents\Projects\RGM

# 2. Apply database changes
wrangler d1 execute rgm_db --file ./migrations/001_add_date_fields.sql

# 3. Deploy updated code
wrangler deploy
```

## 🎯 Admin Panel - How to Use

### Create New Crusade with Dates

1. **Go to:** Admin Dashboard → Crusades → Add New Crusade
2. **Select Date Type:**
   - **Legacy** = "Oct 9-11, 2026" (text format)
   - **Single Day** = Pick one date
   - **Continuous** = Pick start + end dates  
   - **Separate** = List dates (one per line)
3. **Fill in date fields** based on type
4. **Save**

### Examples by Type

| Type | Input | Display |
|------|-------|---------|
| Single | 2026-10-09 | Oct 9, 2026 |
| Continuous | 10/9 to 10/11 | Oct 9 - Oct 11, 2026 |
| Separate | 10/9, 10/15, 11/2 | Oct 9, Oct 15, Nov 2, 2026 |
| Legacy | "Oct 9-11, 2026" | Oct 9-11, 2026 |

## 📊 Data Safety

✅ **Your existing crusades (Vongo, Edingeni):**
- Data completely preserved
- Will show as "Legacy" type in admin
- Can be edited to use new date types anytime
- No risk of data loss

## 🧪 Test After Deployment

```bash
# Check crusades are sorted by date
curl https://your-domain.pages.dev/api/crusades | jq .

# Test admin panel
# Visit: https://your-domain.pages.dev/admin
# - Edit existing crusade → should show "Legacy"
# - Create new crusade → select "Single Day"
# - Verify dates format correctly
```

## 📁 Files Changed

| File | Change |
|------|--------|
| `functions/api/crusades/index.js` | Date formatting + sorting |
| `functions/api/crusades/[slug].js` | Date formatting |
| `functions/api/admin/crusades.js` | New date field support |
| `public/admin/index.html` | Date type selector UI |
| `migrations/001_add_date_fields.sql` | Database schema |

## 🆘 If Something Goes Wrong

**Database migration failed?**
```bash
# Check database status
wrangler d1 info rgm_db

# Re-run migration
wrangler d1 execute rgm_db --file ./migrations/001_add_date_fields.sql
```

**Admin UI not showing date picker?**
- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser
- Check browser console for errors (F12)

**Crusades not sorting correctly?**
- Verify migration ran successfully
- Check API response: `https://your-domain.pages.dev/api/crusades`
- Crusades should have `start_date` values

## 📞 Support

See detailed docs in:
- `DATE_LOGIC_FEATURE.md` - Full feature guide
- `DEPLOYMENT_GUIDE.md` - Deployment steps
- `IMPLEMENTATION_SUMMARY.md` - What was built

---
**Ready to deploy!** 🚀
