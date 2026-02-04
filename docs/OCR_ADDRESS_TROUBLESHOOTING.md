# 🔧 OCR Address Auto-Mapping - Troubleshooting Guide

## Quick Diagnosis

### Symptom: Address not auto-mapping at all

**Check 1: Is the hook receiving OCR data?**
```javascript
// In browser console
// Look for these logs when uploading:
// ✅ [Address Mapper] Starting auto-mapping for OCR address: ...
```

If you don't see this:
- OCR extraction might be failing
- Check OCR API response in Network tab
- Verify `registeredAddress` field is populated

**Check 2: Is the parser working?**
```javascript
// In browser console
__addressParserTests.parseVietnameseAddress("110A Ngô Quyền, Phường 8...")

// Should return parsed object with:
// {
//   streetAddress: "110A Ngô Quyền",
//   wardName: "Phường 8",
//   provinceName: "Thành phố Hồ Chí Minh",
//   ...
// }
```

If parser fails:
- Check address format matches expected pattern
- Try different address format
- See "Address Format Issues" section below

**Check 3: Is the database matching working?**
```javascript
// In browser console
const parsed = __addressParserTests.parseVietnameseAddress("your address");
const result = __addressParserTests.matchAddressToDatabase(
  parsed,
  mockProvinces,  // Mock for testing
  mockWards
);
console.table(result);

// Should show:
// confidence: 0.95 (or similar)
// matchedProvinceId: "..."
// matchedWardId: "..."
```

If matching fails:
- Province/ward names not in database
- Name matching logic too strict
- See "Name Matching Issues" section below

---

## Common Issues & Solutions

### ❌ "Address not auto-mapping even though format looks right"

**Diagnosis:**
```javascript
// Check what parser returns
__addressParserTests.parseVietnameseAddress("your address")

// Check what's in database
// (Use React DevTools to inspect apiProvinces and apiWards)

// Check if names match
__addressParserTests.namesMatch("parsed name", "db name")
```

**Solutions:**

1. **Database doesn't have the province/ward**
   - Verify province/ward exists in database
   - Check exact spelling (case-insensitive but spacing matters)

2. **Name format different than expected**
   ```javascript
   // Example: Database has "Phường 5" not "District 5"
   __addressParserTests.namesMatch("Phường 5", "Phường 5")  // Should be true
   ```
   - Review `parseVietnameseAddress()` for expected format
   - Check OCR output against database names

3. **Tone marks or special characters**
   ```javascript
   // Test normalization
   __addressParserTests.normalizeName("Hà Nội")  // → "ha noi"
   __addressParserTests.normalizeName("Thành phố Hồ Chí Minh")  // → "thanh pho ho chi minh"
   ```
   - Normalization should handle tone marks
   - If still failing, check character encoding

4. **Confidence too low**
   ```javascript
   // Check the confidence score
   const result = __addressParserTests.matchAddressToDatabase(...);
   console.log('Confidence:', result.confidence);
   
   // If < 0.9, increase threshold temporarily
   // (Edit src/utils/addressParser.ts, line: if (matchResult.confidence >= 0.9))
   ```

---

### ❌ "Fallback showing full OCR address but should have matched"

**This is expected behavior.** Verify it's actually a "no match" situation:

```javascript
// Check if matching really failed
const parsed = __addressParserTests.parseVietnameseAddress("address");
const result = __addressParserTests.matchAddressToDatabase(parsed, provinces, wards);

if (result.error) {
  console.log("Expected fallback, error:", result.error);
} else if (result.confidence < 0.9) {
  console.log("Fallback due to low confidence:", result.confidence);
}
```

**If it should have matched but didn't:**

1. Check province name in OCR vs. database:
   ```javascript
   // OCR says: "Thành phố Hà Nội"
   // Database has: "Hà Nội"
   // These should still match after normalization
   __addressParserTests.namesMatch("Thành phố Hà Nội", "Hà Nội")  // → true
   ```

2. Check ward filtering:
   ```javascript
   // Wards are filtered by province ID
   // If province not found, wards won't be searched
   const matchedProvince = provinces.find(p => namesMatch(p.name, "your province"));
   console.log("Found province:", matchedProvince);  // Should not be undefined
   ```

---

### ❌ "User selection is being overridden by auto-mapping"

**Problem:** User selected Province = "Hà Nội", then uploaded a Hà Nội address, but form changed to Hà Nội

**Root cause:** `skipAddressMapping` flag not set to true

**Solution:**

1. **Check if handler sets the flag:**
   ```tsx
   // In AddStoreDialogTabbed.tsx, province handler:
   const handleProvinceChange = (value: string) => {
     setSelectedProvince(value);
     setSkipAddressMapping(true);  // ← This line MUST be present
     // ... rest
   };
   ```

2. **Verify in React DevTools:**
   - Open DevTools → Components tab
   - Find `AddStoreDialogTabbed`
   - Check hooks state
   - `skipAddressMapping` should be `true` after user edit

3. **Debug the hook:**
   ```javascript
   // In browser console, add to addressAutoMapper.ts:
   console.log('⏭️ [Address Mapper] Skipping:', {
     skipMapping,
     hasUserEdit: userEditedRef.current,
     provinceSelected: !!formData?.province,
   });
   ```

---

### ❌ "Performance is slow when uploading"

**Typical symptoms:** Form freezes for a second, or takes >500ms to process

**Check:**

1. **Measure auto-mapping time:**
   ```javascript
   // Add timing logs in addressParser.ts
   const start = performance.now();
   const parsed = parseVietnameseAddress(address);
   const match = matchAddressToDatabase(parsed, provinces, wards);
   console.log('Total time:', performance.now() - start, 'ms');
   
   // Should be < 100ms for entire flow
   ```

2. **Check province/ward count:**
   ```javascript
   // In React DevTools, check:
   // apiProvinces.length  → Should be ~100
   // apiWards.length      → Should be ~10,000
   
   // If > 100,000, consider pagination
   ```

3. **Profile with React DevTools:**
   - Open Profiler tab
   - Record upload action
   - Check for re-renders in `AddStoreDialogTabbed`
   - Look for slow operations

**Solution:**
- System is O(n) - proportional to number of wards
- ~10,000 wards = <50ms (normal)
- If slow, profile to find actual bottleneck

---

### ❌ "Tests pass but form doesn't auto-map in real usage"

**Possible causes:**

1. **OCR not extracting address:**
   - Check OCR API response in Network tab
   - Verify `address` field is present
   - Check it's not null/undefined/empty

2. **Form using different address field name:**
   - Hook expects `registeredAddress`
   - Verify form uses this field name
   - Check state key names match

3. **Provinces/wards not loaded yet:**
   - Hook depends on `apiProvinces` and `apiWards`
   - They may be loading asynchronously
   - Check they have data before auto-mapping

   ```javascript
   // In AddStoreDialogTabbed.tsx:
   // loadLocationData() loads provinces
   // loadWardsByProvince() loads wards for selected province
   
   // If they're empty, auto-mapping will fail
   ```

4. **Different data structure:**
   - Mock data: `_id`, `name`
   - Your data: `id`, `displayName`?
   - Update field names in `matchAddressToDatabase()`

---

### ❌ "Hook seems to run multiple times"

**Symptom:** Console shows multiple `[Address Mapper]` logs for single upload

**Root cause:** React's StrictMode or dependencies changing

**Check:**

```javascript
// Add debug logging
// In useAddressAutoMapper.ts:
console.log('Address to process:', ocrData?.address);
console.log('Previous address:', mappedAddressRef.current);
console.log('Should skip?', mappedAddressRef.current === ocrData?.address);
```

**Solution:**

1. **Check ref is working:**
   - Should prevent re-processing same address
   - If not, ref logic might be broken

2. **Check dependencies array:**
   - Make sure all used values are in dependencies
   - `useEffect(..., [ocrData?.address, provinces, wards, ...])`

3. **Verify formData is correct:**
   - Avoid causing re-renders
   - Use `useCallback` if passing callbacks

---

## Network & API Issues

### ❌ "OCR API failing to extract"

**Check in Network tab:**

1. **OCR request:**
   - Status: Should be 200
   - Response: Check for `success: true`
   - Look for `data.address` field

2. **If 401/403:**
   - API key might be expired
   - Check `src/utils/api/ocrApi.ts`
   - Verify API key in headers

3. **If timeout:**
   - File might be too large
   - Max size: 10MB
   - Check file type: JPG, PNG, WEBP, PDF only

### ❌ "Location data not loading"

**Check Network tab:**

1. **Provinces request:**
   ```
   GET /rest/v1/provinces?select=...
   Status: 200
   Body: Array of provinces
   ```

2. **Wards request:**
   ```
   GET /rest/v1/wards?select=...&province_id=eq.XXX
   Status: 200
   Body: Array of wards
   ```

If failing:
- Check Supabase REST API is accessible
- Verify auth headers
- Check table names: `provinces`, `wards`
- Verify column names: `_id`, `name`, `province_id`

---

## Data Format Issues

### ❌ "Parser returns strange results for this address format"

**Diagnosis:**

```javascript
// Your address
const address = "your address here";
const parsed = __addressParserTests.parseVietnameseAddress(address);
console.log(parsed);

// If wrong:
// Current code expects: [street], [ward], [district], [city], [country]
// Separated by commas
```

**Solutions:**

1. **Different component order:**
   ```typescript
   // Edit parseVietnameseAddress():
   // Adjust part[0], part[1], part[2] assignments
   // Match your OCR output order
   ```

2. **Different separator:**
   ```typescript
   // Current: split by ','
   // If using different separator:
   const parts = address.split(';');  // Or '|', '\n', etc.
   ```

3. **Missing components:**
   ```typescript
   // Some addresses might not have all parts
   // That's okay, parser handles null values
   // Check logic handles missing parts
   ```

---

## Database Schema Issues

### ❌ "Matching not finding any provinces/wards"

**Check field names:**

```javascript
// Expected structure:
{
  _id: "unique-id",
  name: "Province/Ward Name",
  province_id: "parent-province-id"  // For wards only
}

// If your structure is different:
// Update matchAddressToDatabase() to use correct field names
```

**Verify in React DevTools:**

```javascript
// Log actual data structure
apiProvinces[0]  // Should show: { _id: "...", name: "...", ... }
apiWards[0]      // Should show: { _id: "...", name: "...", province_id: "..." }
```

**If structure different:**
- Edit `matchAddressToDatabase()` function
- Change field access: `p._id` → `p.id`, `p.name` → `p.label`, etc.

---

## Testing & Validation

### ✅ "Tests pass but I'm still unsure"

**Run comprehensive validation:**

```bash
# Step 1: Run all tests
__addressParserTests.runAllTests()
# All should show ✅

# Step 2: Test with your real address
__addressParserTests.parseVietnameseAddress("YOUR REAL ADDRESS")
# Should show all components

# Step 3: Check name matching
__addressParserTests.namesMatch("OCR name", "DB name")
# Should return true/false correctly

# Step 4: Test with your data
const parsed = __addressParserTests.parseVietnameseAddress("YOUR ADDRESS");
const result = __addressParserTests.matchAddressToDatabase(
  parsed,
  yourProvinces,  // Your actual data
  yourWards       // Your actual data
);
console.table(result);
# Should show confidence and matches
```

---

## Advanced Debugging

### Add detailed logging

**In `addressParser.ts`:**

```typescript
const DEBUG = true;

export function matchAddressToDatabase(parsed, provinces, wards) {
  if (DEBUG) {
    console.group('🔍 Address Matching');
    console.log('Parsed:', parsed);
    console.log('Provinces to search:', provinces.length);
    console.log('Wards to search:', wards.length);
    
    // Log matching process
    const matchedProvince = provinces.find(p => {
      const matches = namesMatch(p.name, parsed.provinceName);
      if (DEBUG) console.log(`Checking: "${p.name}" vs "${parsed.provinceName}" = ${matches}`);
      return matches;
    });
    
    console.log('Matched Province:', matchedProvince);
    console.groupEnd();
  }
  
  // ... rest of function
}
```

### Monitor React state changes

**In React DevTools:**

1. Open Components tab
2. Find `AddStoreDialogTabbed`
3. Click on Hooks
4. Watch these states change:
   - `selectedProvince` → Should change on auto-map
   - `selectedWard` → Should change after wards load
   - `skipAddressMapping` → Should become true after user edit
   - `lastOcrAddress` → Should be set after OCR

### Chrome DevTools Network Profiling

```
1. Open DevTools → Performance tab
2. Record while uploading document
3. Look for:
   - OCR API call (should be <3s)
   - Province/Ward loading
   - Auto-mapping execution (should be <100ms)
4. Check for unexpected delays
```

---

## When All Else Fails

1. **Check the source files:**
   - Read comments in `addressParser.ts`
   - Read comments in `useAddressAutoMapper.ts`
   - They have detailed explanations

2. **Review the documentation:**
   - `docs/OCR_ADDRESS_AUTOMAP.md` - Complete reference
   - `docs/OCR_ADDRESS_QUICK_START.md` - Quick guide
   - `docs/OCR_ADDRESS_GETTING_STARTED.md` - Full walkthrough

3. **Verify implementation:**
   - Check form imports the hook
   - Check hook is called with correct props
   - Check callbacks are defined

4. **Test in isolation:**
   - Create a simple test component
   - Test just the parser
   - Test just the hook
   - Test just the form integration

5. **Check browser console:**
   - No JavaScript errors?
   - Any warnings?
   - Check `[Address Mapper]` logs

---

## Success Indicators

✅ **Working correctly if you see:**
- `[Address Mapper] Starting auto-mapping...` in console
- `[Address Mapper] Parsed address:` with correct components
- `[AddStoreDialogTabbed] Address auto-mapped successfully`
- Form fields auto-filled: province, ward, address
- No error messages

✅ **Fallback working correctly if:**
- Full OCR address appears in "Địa chỉ" field
- Dropdowns remain empty
- No error toast appears
- User can manually select

✅ **Protection working correctly if:**
- User selects something manually
- Next upload doesn't override it
- Flag `skipAddressMapping=true` in state

---

**Need more help?** Check the main documentation files listed at the top of each guide.
