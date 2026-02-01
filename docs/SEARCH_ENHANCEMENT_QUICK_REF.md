# Search Enhancement - Quick Reference

## Feature Added
✅ Dual search capability: Business Name (Tên cơ sở) + Tax Code (Mã số thuế)

## Files Changed
1. **src/modules/registry/pages/StoresListPage.tsx**
   - Added `taxCodeValue` and `debouncedTaxCodeValue` state
   - Added debounce effect for tax code (500ms)
   - Added tax code input field to UI
   - Updated API filters to include `taxCode`
   - Updated URL sync for state persistence

2. **src/utils/api/storesApi.ts**
   - Added `taxCode?: string` to filters interface
   - Enhanced search logic to support both fields
   - Implements smart OR logic when both fields provided

## How It Works

### Frontend Flow
```
User input (taxCodeValue) → 500ms debounce → debouncedTaxCodeValue
    ↓
Passed to API as filters.taxCode → fetchStores()
    ↓
Results displayed in table
```

### API Logic
```
if (search AND taxCode):
  Query: or=(business_name.ilike.*search*,tax_code.ilike.*taxCode*,address.ilike.*search*)
else if (search ONLY):
  Query: or=(business_name.ilike.*search*,address.ilike.*search*)
else if (taxCode ONLY):
  Query: tax_code=ilike.*taxCode*
else:
  No search filter
```

## URL State
- Business name search: `?q=Bếp%20Quân`
- Tax code search: `?taxCode=0312345678`
- Combined search: `?q=Bếp&taxCode=0312`

## User Interface
```
[Advanced Filter] [Địa bàn ▼] [Trạng thái ▼] [Loại hình ▼]
[Tên cơ sở input] [Mã số thuế input] [Bản đồ button]
```

Two independent search fields:
- Left: Business name (placeholder: "Tên cơ sở")
- Right: Tax code (placeholder: "Mã số thuế")

## Testing Checklist
- [ ] Type in business name field only
- [ ] Type in tax code field only
- [ ] Type in both fields simultaneously
- [ ] Verify debounce delays (wait 500ms before API call)
- [ ] Check URL parameters update correctly
- [ ] Test browser back/forward buttons
- [ ] Verify combined with other filters (status, province)
- [ ] Test with special characters (é, ê, etc.)
- [ ] Test partial matches ("031" matches "0312345678")

## Key Design Decisions

1. **Separate Input Fields**: Two distinct search inputs for clarity (business identifies by name, tax authority identifies by code)

2. **500ms Debounce**: Matches existing search behavior, prevents excessive API calls

3. **OR Logic When Both Provided**: Users can search by either field - more flexible than AND logic

4. **Wildcard Search**: Uses `*search*` pattern in ilike - matches anywhere in field

5. **Independent Filters**: Tax code search doesn't affect business name search and vice versa

## Performance Considerations
- Debounce prevents API overload during typing
- Supabase ilike with wildcards is fast for normal-sized datasets
- Consider indexing tax_code field in database if not already indexed
- Both fields should use case-insensitive search (ilike handles this)

## Future Enhancements
- Search field auto-focus based on cursor position
- Search history/recent searches dropdown
- Advanced search syntax (operators, boolean logic)
- Search result highlighting
- Export filtered results to CSV
