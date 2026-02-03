# OCR Address Auto-Mapping Implementation

## Overview

This implementation automatically parses Vietnamese addresses from OCR documents and maps them to the database's province/ward dropdowns in the Add Store form.

**Key Goals:**
- ✅ Parse Vietnamese addresses into components (street, ward, province)
- ✅ Intelligently match to database records (ignoring tone marks, prefixes, etc.)
- ✅ Auto-select dropdown values when match found
- ✅ Fallback gracefully when no match found
- ✅ Respect user edits (don't override manual selections)
- ✅ Run once after successful OCR

## Architecture

### 1. Address Parser (`src/utils/addressParser.ts`)

Handles parsing and matching of Vietnamese addresses.

**Main Functions:**

#### `parseVietnameseAddress(address: string): ParsedAddress`
Parses an address string into components.

**Format:**
```
"110A Ngô Quyền, Phường 08, Phường 5, Thành phố Hồ Chí Minh, Việt Nam"
                  ↓
{
  streetAddress: "110A Ngô Quyền",
  wardName: "Phường 08",
  districtName: "Phường 5",
  provinceName: "Thành phố Hồ Chí Minh",
  country: "Việt Nam"
}
```

#### `normalizeName(name: string): string`
Normalizes location names for matching.

**Transformations:**
- Removes prefixes: "Phường", "Xã", "Phường", "Xã", "Thành phố", "Tỉnh"
- Converts to lowercase
- Removes tone marks: "à"→"a", "é"→"e", etc.
- Normalizes whitespace

**Examples:**
```
"Phường 08" → "phuong 08"
"Thành phố Hồ Chí Minh" → "ho chi minh"
"Phường 5" → "5"
```

#### `namesMatch(name1: string, name2: string): boolean`
Intelligently compares two location names.

**Matching Logic:**
1. ✅ Exact match after normalization
2. ✅ Numeric suffix normalization: "08" matches "8"
3. ✅ Fuzzy matching: >70% similar + common words match
4. ❌ Reject if fundamentally different

**Examples:**
```
namesMatch("Phường 08", "Phường 8") → true
namesMatch("Hoàn Kiếm", "Phường Hoàn Kiếm") → true
namesMatch("Hà Nội", "Thành phố Hà Nội") → true
namesMatch("Ba Đình", "Phường Ba Đình") → false (different level)
```

#### `matchAddressToDatabase(parsed, provinces, wards): AddressMatchResult`
Matches parsed address to database records.

**Process:**
1. Match province by name → get province ID
2. Filter wards by matched province ID
3. Match ward by name → get ward ID
4. Set confidence based on matches

**Confidence Levels:**
- `0.95`: Both province and ward matched (HIGH)
- `0.7`: Only province matched (MEDIUM)
- `0.3`: Neither matched but parseable (LOW)
- Auto-select only happens with confidence ≥ 0.9

### 2. Auto-Mapper Hook (`src/hooks/useAddressAutoMapper.ts`)

Manages the auto-mapping workflow.

**Features:**
- Prevents re-mapping the same address (caches via ref)
- Tracks user edits to prevent override
- Runs only once per OCR extraction
- Silent fallback on failure (no error toasts)

**Callbacks:**
- `onAddressMatch`: Auto-selects when high confidence match found
- `onAddressMatchFail`: Shows full OCR address as fallback

**Usage:**
```tsx
useAddressAutoMapper({
  ocrData: { address: "110A Ngô Quyền..." },
  provinces: apiProvinces,
  wards: apiWards,
  formData: currentFormData,
  skipMapping: userManuallyEdited,
  onAddressMatch: (result) => {
    // Auto-select province/ward
  },
  onAddressMatchFail: (error, fullAddress) => {
    // Show full address as fallback
  },
});
```

### 3. Integration in Form (`src/components/ui-kit/AddStoreDialogTabbed.tsx`)

The hook is integrated into the Add Store dialog.

**Flow:**
1. User uploads OCR document (Giấy phép kinh doanh)
2. OCR API returns address in `registeredAddress` field
3. Auto-mapper triggers when new address detected
4. Parser extracts components
5. Matcher looks up database records
6. If match found (confidence ≥ 0.9):
   - Auto-select province in dropdown
   - Load wards for province
   - Auto-select ward in dropdown
   - Set street address in text field
7. If match fails:
   - Show full OCR address in text field
   - Leave dropdowns empty for manual selection
8. If user manually selects province/ward:
   - Set `skipMapping=true` to prevent future overrides

## Data Flow

```
┌─────────────────────────────────────────┐
│  User uploads OCR Document              │
│  (Giấy phép kinh doanh)                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  OCR API returns:                       │
│  {                                      │
│    businessName: "...",                 │
│    address: "110A Ngô Quyền, P.08...",  │
│    ...                                  │
│  }                                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Auto-mapper hook triggered             │
│  (useAddressAutoMapper)                 │
└────────────┬────────────────────────────┘
             │
             ▼
         ┌───────────────────────────┐
         │ Parse address string      │
         │ → ParsedAddress           │
         └────────────┬──────────────┘
                      │
                      ▼
         ┌───────────────────────────┐
         │ Match to database         │
         │ (provinces + wards)       │
         └────────────┬──────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   ✅ HIGH CONF          ⚠️ LOW/NO CONF
   (≥0.9)                (< 0.9)
   │                     │
   ├─ Auto-select        ├─ Fill text field
   │  province           │  with full address
   ├─ Load wards         ├─ Leave dropdowns
   ├─ Auto-select        │  empty for manual
   │  ward               │  selection
   └─ Fill street addr.  └─ Silent fallback
```

## Testing

### Run Tests in Browser Console

```javascript
// Access test utilities
__addressParserTests.runAllTests()

// Or run individual tests
__addressParserTests.testAddressParsing()
__addressParserTests.testNameMatching()
__addressParserTests.testNormalization()
__addressParserTests.testFullIntegration()
```

### Test Cases Covered

**Parsing:**
- Standard format with all components
- Short format (missing country)
- Different Vietnamese naming styles

**Matching:**
- Exact matches
- Ward number variations ("08" vs "8")
- Prefix removal ("Phường" vs "Xã")
- Tone mark variations ("ả" vs "a")
- Fuzzy matching with partial names

**Fallback:**
- Non-existent province
- Non-existent ward
- Malformed address
- Empty fields

## UX Behavior

### Success Case
```
User uploads: "110A Ngô Quyền, Phường 08, Phường 5, Thành phố Hồ Chí Minh, Việt Nam"
              ↓
Auto-mapper finds matches
              ↓
Tỉnh/Thành phố: ✓ "Thành phố Hồ Chí Minh" selected
Phường/Xã:      ✓ "Phường 8" selected
Địa chỉ:        ✓ "110A Ngô Quyền" filled
              ↓
User sees correctly pre-filled form → Saves time & reduces errors
```

### Fallback Case
```
User uploads: "999 Unknown Street, Unknown Ward, Unknown City, Việt Nam"
              ↓
Auto-mapper cannot find "Unknown City" in database
              ↓
Tỉnh/Thành phố: □ Empty (manual selection needed)
Phường/Xã:      □ Empty (disabled)
Địa chỉ:        ✓ "999 Unknown Street, Unknown Ward, Unknown City, Việt Nam"
              ↓
No error message shown
User can manually select province/ward or edit address
```

### User Edit Case
```
Auto-mapper suggests: Province = "Hồ Chí Minh", Ward = "Phường 8"
              ↓
User manually selects different: Province = "Hà Nội"
              ↓
skipAddressMapping flag = true
              ↓
Future OCR uploads won't override user's choice
```

## Configuration & Customization

### Confidence Threshold

Change in `matchAddressToDatabase()`:
```typescript
// Current: requires 0.9+ confidence
if (matchResult.confidence >= 0.9 && matchResult.matchedProvinceId && matchResult.matchedWardId) {
  // Auto-select
}

// To be more aggressive: use 0.7
if (matchResult.confidence >= 0.7 && ...) {
  // Auto-select with medium confidence too
}
```

### Address Format Variations

If addresses use different component order, modify `parseVietnameseAddress()`:
```typescript
// Current: [street, ward, district, city, country]
// If addresses are: [street, city, country], adjust:
if (parts.length > 1) result.provinceName = parts[1];
if (parts.length > 2) result.country = parts[2];
// Skip ward/district parsing
```

### Silent vs. Error Toasts

Currently: Silent fallback (no toasts)

To show messages:
```typescript
// In AddStoreDialogTabbed.tsx, onAddressMatchFail callback:
onAddressMatchFail: (error, fullAddress) => {
  toast.warning(`Không thể tự động xác định địa chỉ. ${error}`);
  setFormData(prev => ({
    ...prev,
    registeredAddress: fullAddress,
  }));
},
```

## Troubleshooting

### Address Not Auto-Matching

1. **Check parsing:**
   ```javascript
   __addressParserTests.parseVietnameseAddress("your address")
   ```

2. **Check matching:**
   ```javascript
   __addressParserTests.matchAddressToDatabase(parsed, provinces, wards)
   ```

3. **Check name normalization:**
   ```javascript
   __addressParserTests.normalizeName("Phường 08")  // → "phuong 08"
   __addressParserTests.namesMatch("Phường 08", "Phường 8")  // Should be true
   ```

### User Selection Being Overridden

This shouldn't happen, but if it does:
1. Check that `skipAddressMapping` is set to `true` after user edit
2. Verify province/ward change handlers call `setSkipAddressMapping(true)`

### Wrong Province/Ward Selected

1. Check database has correct names
2. Verify OCR address format matches expected pattern
3. Increase logging in `addressParser.ts` for debugging

## Performance Notes

- **Parsing:** O(1) - simple string split
- **Matching:** O(n) where n = number of provinces/wards (negligible)
- **Runs once per OCR:** No performance impact on multiple uploads
- **Memory:** Uses refs to prevent duplicate processing

## Future Enhancements

1. **Machine Learning:** Use similarity scoring instead of simple matching
2. **Fuzzy Logic:** Levenshtein distance for typo tolerance
3. **Address Standardization:** Normalize to official government format
4. **Reverse Geocoding:** Enhance with GPS coordinates
5. **Multi-language:** Support English address aliases
6. **Caching:** Remember successful matches for faster future lookups

## Browser Console Debugging

Enable detailed logging by setting a flag:

```javascript
// In browser console
window.__debugAddressMapper = true;

// Then check console.log outputs with [Address Mapper] prefix
```

## Files Modified

1. **Created:**
   - `src/utils/addressParser.ts` - Core parsing and matching logic
   - `src/hooks/useAddressAutoMapper.ts` - React hook for auto-mapping
   - `src/utils/addressParserTests.ts` - Test utilities
   - `docs/OCR_ADDRESS_AUTOMAP.md` - This documentation

2. **Modified:**
   - `src/components/ui-kit/AddStoreDialogTabbed.tsx` - Integrated auto-mapper hook

## Support

For issues or improvements, refer to the test cases and debugging tools provided in `addressParserTests.ts`.
