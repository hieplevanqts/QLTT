# Store Search Enhancement - Tax Code Integration

## Overview
Enhanced the store search functionality to support searching by both **business name** (Tên cơ sở) and **tax code** (Mã số thuế) - two critical identifiers in Vietnamese business management.

## Changes Made

### 1. Frontend - StoresListPage.tsx

#### State Management Updates
```typescript
// Added tax code value state
const [taxCodeValue, setTaxCodeValue] = useState(getParam('taxCode', ''));
const [debouncedTaxCodeValue, setDebouncedTaxCodeValue] = useState(getParam('taxCode', ''));
```

#### Debounce Effect
Added debounce effect for tax code search (500ms delay, same as business name):
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTaxCodeValue(taxCodeValue);
  }, 500);
  return () => clearTimeout(timer);
}, [taxCodeValue]);
```

#### URL State Sync
- Added `taxCode` parameter to URL sync when debouncedTaxCodeValue changes
- Added `taxCode` retrieval from URL params for browser back/forward navigation
- Updated dependency arrays to include `debouncedTaxCodeValue`

#### API Filter Integration
```typescript
if (debouncedTaxCodeValue) {
  filters.taxCode = debouncedTaxCodeValue;
}
```

#### UI Component
Added new search input field for tax code alongside business name:
```tsx
{/* 4.1 Mã số thuế (medium width) */}
<div style={{ width: '280px', flexShrink: 0 }}>
  <SearchInput
    placeholder="Mã số thuế"
    value={taxCodeValue}
    onChange={(e) => setTaxCodeValue(e.target.value)}
  />
</div>
```

### 2. Backend API - storesApi.ts

#### Filter Interface Update
Added `taxCode` to the filters interface:
```typescript
filters?: {
  // ... existing filters
  search?: string;
  taxCode?: string;  // NEW
}
```

#### Search Logic Enhancement
Implemented intelligent search that handles:
- **Both fields provided**: Search in business_name, tax_code, AND address (OR condition)
- **Only business name**: Search in business_name and address (existing behavior)
- **Only tax code**: Search specifically in tax_code field
- **Neither**: No search filter applied

```typescript
if (filters?.search || filters?.taxCode) {
  const searchTerms = filters?.search ? encodeURIComponent(`*${filters.search}*`) : null;
  const taxCodeTerms = filters?.taxCode ? encodeURIComponent(`*${filters.taxCode}*`) : null;
  
  // Build OR condition with available search parameters
  if (searchTerms && taxCodeTerms) {
    // Both search and taxCode provided
    url += `&or=(business_name.ilike.${searchTerms},tax_code.ilike.${taxCodeTerms},address.ilike.${searchTerms})`;
  } else if (searchTerms) {
    // Only search term
    url += `&or=(business_name.ilike.${searchTerms},address.ilike.${searchTerms})`;
  } else if (taxCodeTerms) {
    // Only tax code
    url += `&tax_code=ilike.${taxCodeTerms}`;
  }
}
```

## User Experience

### Search Behavior

**Scenario 1: Search by Business Name Only**
- User enters "Bếp Quân" in "Tên cơ sở" field
- Results show all stores with "Bếp Quân" in business_name or address
- Tax code field remains empty

**Scenario 2: Search by Tax Code Only**
- User enters "0312345678" in "Mã số thuế" field
- Results show stores matching that exact tax code (with wildcards for partial match)
- Business name field remains empty

**Scenario 3: Search by Both**
- User enters "Bếp Quân" in "Tên cơ sở" AND "0312345678" in "Mã số thuế"
- Results show stores matching EITHER business name/address OR tax code (OR logic)
- More comprehensive search combining both criteria

### URL Parameters
- Business name: `?q=searchterm`
- Tax code: `?taxCode=123456`
- Combined: `?q=searchterm&taxCode=123456`

## Implementation Details

### Search Type: Case-Insensitive Wildcard (ilike)
- Uses PostgreSQL `ilike` operator (case-insensitive)
- Wildcard pattern: `*searchterm*` (matches anywhere in field)
- Suitable for partial matches and fuzzy searching

### Debouncing
- 500ms delay on both fields
- Prevents excessive API calls while user is typing
- Smooth user experience without server overload

### Backward Compatibility
- Existing single field search still works
- No breaking changes to API
- Graceful fallback if tax code field is empty

## Testing Recommendations

### Unit Test Cases
1. **Business Name Only**: Search "Bếp" returns all stores with "Bếp" in name/address
2. **Tax Code Only**: Search "0312" returns stores with matching tax code
3. **Both Fields**: Both criteria combined return results matching either condition
4. **Empty Searches**: No filters applied when both fields empty
5. **Special Characters**: Handles Vietnamese characters in both fields
6. **Partial Matches**: Both % and * wildcards work correctly

### Integration Test Cases
1. URL persistence: Refresh page maintains search parameters
2. Browser navigation: Back/forward buttons restore search state
3. Filter combination: Search works with other filters (status, province, etc.)
4. Pagination: Search results paginate correctly
5. Performance: Large result sets load in reasonable time

## Files Modified
- `src/modules/registry/pages/StoresListPage.tsx` - Frontend search UI and state management
- `src/utils/api/storesApi.ts` - Backend API query logic

## Related Documentation
- [CURRENT_STATUS.md](CURRENT_STATUS.md) - Overall project status
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Complete implementation history
