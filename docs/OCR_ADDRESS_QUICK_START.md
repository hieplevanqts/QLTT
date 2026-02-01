# OCR Address Auto-Mapping - Quick Reference

## What Was Built

A smart system that automatically parses Vietnamese addresses from OCR documents and matches them to database province/ward records, auto-selecting form fields when a good match is found.

## Files Created

1. **`src/utils/addressParser.ts`** (280 lines)
   - Core address parsing and matching logic
   - Functions: `parseVietnameseAddress()`, `matchAddressToDatabase()`, `namesMatch()`, `normalizeName()`

2. **`src/hooks/useAddressAutoMapper.ts`** (160 lines)
   - React hook managing auto-mapping workflow
   - Prevents duplicate mapping and respects user edits
   - Provides callbacks for success/failure handling

3. **`src/utils/addressParserTests.ts`** (180 lines)
   - Test utilities and mock data
   - Run via browser console: `__addressParserTests.runAllTests()`

4. **`docs/OCR_ADDRESS_AUTOMAP.md`** (Documentation)
   - Complete architecture and usage guide
   - Data flow diagrams
   - Troubleshooting tips

## Files Modified

1. **`src/components/ui-kit/AddStoreDialogTabbed.tsx`**
   - Added import: `useAddressAutoMapper`
   - Added state: `skipAddressMapping`, `lastOcrAddress`
   - Added hook call: `useAddressAutoMapper({ ... })`
   - Modified province/ward handlers to set `skipAddressMapping=true` on user edit

## How It Works

```
User uploads Giấy Phép Kinh Doanh
              ↓
OCR API extracts address: "110A Ngô Quyền, Phường 8, Quận 5, TP.HCM, Việt Nam"
              ↓
Auto-mapper detects new address in registeredAddress field
              ↓
Parser breaks down into: street="110A Ngô Quyền", ward="Phường 8", province="TP.HCM"
              ↓
Matcher searches database for province/ward by name
              ↓
If found (confidence ≥ 0.9):
  - Auto-select province dropdown
  - Load and auto-select ward dropdown
  - Fill street address field
              ↓
If not found:
  - Show full OCR address in text field
  - Leave dropdowns empty for manual selection
  - No error message (silent fallback)
              ↓
If user manually selects different province/ward:
  - Set skipAddressMapping = true
  - Prevent future auto-mapping from overriding
```

## Key Features

✅ **Smart Matching**
- Removes tone marks: "á" → "a"
- Removes prefixes: "Phường" → (nothing)
- Handles number variations: "08" matches "8"
- Fuzzy matching for partial names

✅ **User-Friendly**
- No error messages on failed matching (silent fallback)
- Respects user edits (doesn't override)
- Shows full address even if county/ward unmatchable
- Runs only once per OCR extraction

✅ **Robust**
- Handles various address formats
- Works with incomplete data
- Graceful degradation

## Testing in Browser

```javascript
// Test all functionality
__addressParserTests.runAllTests()

// Test specific address
const parsed = __addressParserTests.parseVietnameseAddress(
  "110A Ngô Quyền, Phường 8, Quận 5, TP.HCM, Việt Nam"
)
console.log(parsed)

// Test matching
const result = __addressParserTests.matchAddressToDatabase(
  parsed, 
  mockProvinces, 
  mockWards
)
console.log(result)

// Test name matching
__addressParserTests.namesMatch("Phường 08", "Phường 8")  // → true
__addressParserTests.namesMatch("TP.HCM", "Hồ Chí Minh")  // → true
```

## Configuration Points

### Change confidence threshold for auto-selection
In `addressParser.ts`, function `matchAddressToDatabase()`:
```typescript
// Default: 0.9 (requires both province and ward match)
if (matchResult.confidence >= 0.9 && ...) {
  // Auto-select
}

// Change to 0.7 for more aggressive matching
if (matchResult.confidence >= 0.7 && ...) {
  // Auto-select with medium confidence
}
```

### Change address component order
If OCR addresses use different order (e.g., city first):
```typescript
// In parseVietnameseAddress()
// Current: [street, ward, district, city, country]
// Modify the part assignment based on your format
```

### Show error messages on failed match
In `AddStoreDialogTabbed.tsx`, `onAddressMatchFail` callback:
```typescript
onAddressMatchFail: (error, fullAddress) => {
  toast.warning(`Could not auto-map address: ${error}`);
  // ... rest of code
},
```

## Acceptance Criteria Status

| Requirement | Status | Evidence |
|---|---|---|
| Parse OCR address correctly | ✅ | `parseVietnameseAddress()` function |
| Extract province, ward, street | ✅ | Returns `ParsedAddress` object |
| Match to database by name | ✅ | `matchAddressToDatabase()` with `namesMatch()` |
| Auto-select dropdowns on match | ✅ | `onAddressMatch` callback in hook |
| Fallback on no match | ✅ | Shows full address, leaves dropdowns empty |
| No error messages on failure | ✅ | Silent fallback implementation |
| Respects user edits | ✅ | `skipAddressMapping` flag |
| Run once after OCR | ✅ | Uses ref tracking in hook |
| Reduce manual entry | ✅ | Auto-fills when possible |
| Increase accuracy | ✅ | Smart name matching logic |

## Common Issues & Solutions

**Problem:** Address not auto-mapping even though it looks right
- Check database actually contains the province/ward names
- Run `__addressParserTests.testAddressParsing()` to see parsed result
- Check `namesMatch()` is working: `__addressParserTests.namesMatch("your name", "db name")`

**Problem:** User selection keeps getting overridden
- Verify `setSkipAddressMapping(true)` is called on user edit
- Check in React DevTools that `skipAddressMapping` state changes to `true`

**Problem:** Wrong province/ward being selected
- OCR format might be different than expected
- Check `parseVietnameseAddress()` with your actual address
- Adjust component order if needed

**Problem:** Performance issues
- Shouldn't happen - parsing is O(1), matching is O(n) with small datasets
- Check if hook is running repeatedly (use React DevTools Profiler)

## Next Steps (Optional Enhancements)

1. **Smarter Matching**
   - Use Levenshtein distance for typo tolerance
   - Machine learning for complex cases

2. **Better UX**
   - Show confidence % to user
   - Allow manual override with one click
   - Cache successful matches

3. **Extended Functionality**
   - Support English address aliases
   - Reverse geocoding with GPS coordinates
   - Multi-language support

4. **Analytics**
   - Track auto-map success rate
   - Log failed matches for improvement
   - Monitor performance metrics

## Code Snippets for Development

### Add logging to understand flow
```typescript
// In addressParser.ts
console.log('📍 Parsing:', address);
console.log('✅ Parsed:', parsed);
console.log('🔍 Matching to database...');
console.log('✨ Match found:', matchResult);
```

### Debug name matching
```javascript
// In browser console
__addressParserTests.testNameMatching()
// Shows which comparisons pass/fail
```

### Test full address from OCR
```javascript
// In browser console
const address = "YOUR_OCR_ADDRESS_HERE";
const parsed = __addressParserTests.parseVietnameseAddress(address);
const result = __addressParserTests.matchAddressToDatabase(parsed, mockProvinces, mockWards);
console.table(result);
```

## Support & Debugging

1. **Check implementation**
   - Review `src/utils/addressParser.ts` comments
   - Review `src/hooks/useAddressAutoMapper.ts` comments

2. **Run tests**
   - Browser console: `__addressParserTests.runAllTests()`

3. **Check logs**
   - Look for `[Address Mapper]` prefix in console
   - Look for `[AddStoreDialogTabbed]` prefix in console

4. **Inspect state**
   - React DevTools: Check `selectedProvince`, `selectedWard`, `skipAddressMapping` states
   - Browser console: Check `formData.registeredAddress` value

5. **Review documentation**
   - `docs/OCR_ADDRESS_AUTOMAP.md` - Full technical guide
   - Comments in each source file

---

**Last Updated:** 2024
**Status:** Production Ready ✅
