# Search Enhancement - Combined Single Input

## Overview
Simplified the search functionality by combining two separate search fields (business name and tax code) into a **single unified search input** that searches both fields simultaneously.

## Changes Made

### 1. Frontend Simplification (StoresListPage.tsx)

#### State Cleanup
- **Removed**: `taxCodeValue` state (separate tax code input value)
- **Removed**: `debouncedTaxCodeValue` state (separate debounced tax code)
- **Kept**: `searchValue` and `debouncedSearchValue` (now searches both fields)

#### URL Sync Simplified
- **Removed**: `taxCode` URL parameter
- **Kept**: Single `q` parameter for business name AND tax code search
- URL now stores both searches in one parameter: `?q=searchterm`

#### Debounce Simplified
- **Removed**: Separate debounce effect for tax code
- **Kept**: Single 500ms debounce effect for unified search
- Much cleaner state management

#### UI Component
- **Changed**: Two separate SearchInput fields → One combined SearchInput
- **Placeholder**: "Tên cơ sở hoặc mã số thuế" (Store name or tax code)
- **Width**: Adjusted to 300px for better visibility

### 2. API Simplification (storesApi.ts)

#### Filter Interface Update
- **Removed**: `taxCode?: string` from filters interface
- **Kept**: `search?: string` parameter (now searches multiple fields)

#### Search Logic Simplified
```typescript
// Searches business_name, tax_code, AND address simultaneously
if (filters?.search) {
  const searchTerms = encodeURIComponent(`*${filters.search}*`);
  url += `&or=(business_name.ilike.${searchTerms},tax_code.ilike.${searchTerms},address.ilike.${searchTerms})`;
}
```

**Single unified query**: Searches all three fields with OR logic from one search parameter

## User Experience

### Simple, Unified Search
```
┌─────────────────────────────────────┐
│  Tên cơ sở hoặc mã số thuế          │
└─────────────────────────────────────┘
```

### Search Behavior
- User enters "Bếp Quân" or "0312345678" in the single field
- 500ms debounce delay while typing
- API searches: `business_name` OR `tax_code` OR `address`
- Results show matches from any of these three fields
- No distinction between searching by name or code - all transparent to user

### URL Parameter
- Single `q` parameter handles all searches
- Example: `?q=Bếp` searches both name and tax code fields
- Much cleaner and simpler URL structure

## Benefits of Consolidation

### For Users
✅ **Simpler Interface**: One search field instead of two
✅ **Less Cognitive Load**: No need to decide which field to search
✅ **Faster Search**: Single input, single focus point
✅ **More Inclusive**: Searches name, code, and address simultaneously

### For Developers
✅ **Simpler Code**: No parallel state management
✅ **Fewer Dependencies**: One debounce instead of two
✅ **Easier Maintenance**: Single URL parameter for search
✅ **Better Performance**: Single debounce effect

### For Database
✅ **Single Query**: One OR condition with three fields
✅ **Cleaner Logging**: Single search filter to track
✅ **Optimal Performance**: Same OR logic as before, just unified

## Implementation Details

### Debounce Flow
```
User types in unified search field
    ↓
searchValue updates (immediate)
    ↓
500ms setTimeout
    ↓
debouncedSearchValue updates
    ↓
useEffect triggers API call
    ↓
filters.search passed to API
    ↓
Supabase OR query on 3 fields
    ↓
Results displayed
```

### Supabase Query Structure
```sql
SELECT * FROM merchants
WHERE 
  business_name ILIKE '%searchterm%'
  OR tax_code ILIKE '%searchterm%'
  OR address ILIKE '%searchterm%'
ORDER BY created_at DESC
```

## Testing Checklist

- [ ] Type "Bếp" - shows stores with "Bếp" in name, code, or address
- [ ] Type "0312" - shows stores with "0312" in tax code
- [ ] Clear field and verify "No results" handling
- [ ] Tab/arrow navigation works smoothly
- [ ] URL parameters update correctly (`?q=...`)
- [ ] Browser back button restores previous search
- [ ] Combined with other filters (status, province, etc.)
- [ ] Vietnamese characters (é, ê, ă, etc.) work correctly
- [ ] Debounce delay (500ms) prevents excessive API calls
- [ ] Mobile view - single input takes full available width

## Code Comparison

### Before (Two Fields)
```tsx
<div style={{ width: '280px' }}>
  <SearchInput
    placeholder="Tên cơ sở"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
  />
</div>

<div style={{ width: '280px' }}>
  <SearchInput
    placeholder="Mã số thuế"
    value={taxCodeValue}
    onChange={(e) => setTaxCodeValue(e.target.value)}
  />
</div>
```

### After (Single Field)
```tsx
<div style={{ width: '300px' }}>
  <SearchInput
    placeholder="Tên cơ sở hoặc mã số thuế"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
  />
</div>
```

## Migration Notes

### For Existing Bookmarks/Links
- Old URL: `?q=Bếp&taxCode=0312`
- New URL: `?q=Bếp` (single parameter)
- Old URLs still work because single `q` parameter searches both fields
- No breaking changes to existing bookmarks

### For API Consumers
- Old API: `filters.search` and `filters.taxCode` parameters
- New API: Only `filters.search` parameter needed
- Single parameter searches all three fields automatically
- Much simpler API contract

## Files Modified
- `src/modules/registry/pages/StoresListPage.tsx` - UI simplified from two inputs to one
- `src/utils/api/storesApi.ts` - Filter interface simplified, query logic unified

## Related Documentation
- [SEARCH_ENHANCEMENT.md](SEARCH_ENHANCEMENT.md) - Previous two-field implementation
- [SEARCH_ENHANCEMENT_QUICK_REF.md](SEARCH_ENHANCEMENT_QUICK_REF.md) - Quick reference
- [CURRENT_STATUS.md](CURRENT_STATUS.md) - Overall project status
