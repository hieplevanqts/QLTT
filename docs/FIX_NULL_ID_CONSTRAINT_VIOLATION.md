# Fix: NULL _id Constraint Violation (PostgreSQL Error 23502)

**Date**: 2026-02-03  
**Error Code**: 23502  
**Error Message**: `null value in column "_id_old" of relation "merchant_licenses" violates not-null constraint`

## Problem

When saving a new license document, PostgreSQL was throwing a NOT NULL constraint violation on the `_id` column (shown as `_id_old` in error). This occurred because:

1. The frontend's `buildLicensePayload()` function did NOT include `p_id` in the payload
2. When calling `upsertMerchantLicense()`, `p_id` was `undefined`
3. The RPC function received `null` instead of a valid UUID
4. PostgreSQL tried to insert `NULL` into the `_id` column, violating the NOT NULL constraint

### Failing Row Example
```
Failing row contains (null, aa434796-3b8a-49e7-9dd9-64cf5147123e, BUSINESS_LICENSE, ...)
                       ↑ This was NULL instead of a UUID
                       _id column cannot be NULL!
```

## Solution

### 1. Generate UUID on Frontend (licenseHelper.ts)

Added a UUID v4 generator function:
```typescript
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
```

### 2. Updated buildLicensePayload() Function

**Before**:
```typescript
export const buildLicensePayload = (
    typeKey: string,
    dataFields: Record<string, any>,
    merchantId: string,
    fileUrl: string | undefined,
    fileUrl2?: string
) => {
    const payload: any = {
        p_merchant_id: merchantId,  // NO p_id!
        p_license_type: typeKey,
        p_status: 'valid',
        p_approval_status: 0,
    };
```

**After**:
```typescript
export const buildLicensePayload = (
    typeKey: string,
    dataFields: Record<string, any>,
    merchantId: string,
    fileUrl: string | undefined,
    fileUrl2?: string,
    existingId?: string  // NEW: accept existing ID for edits
) => {
    const allowedFields = LICENSE_FIELDS[typeKey] || [];
    
    // Generate new ID if not provided (for new licenses)
    // or use existing ID (for edits)
    const licenseId = existingId || generateUUID();
    
    const payload: any = {
        p_id: licenseId,  // ALWAYS include ID!
        p_merchant_id: merchantId,
        p_license_type: typeKey,
        p_status: 'valid',
        p_approval_status: 0,
    };
```

**Changes**:
- ✅ Added `existingId` parameter to accept existing ID when editing
- ✅ Generate new UUID if no `existingId` provided (new document)
- ✅ **Always include `p_id`** in payload to prevent NULL constraint violation

### 3. Updated StoreDetailPage.tsx

**handleSaveDocument() - Before**:
```typescript
const rpcPayload = buildLicensePayload(
    typeKey,
    data.fields,
    store.merchantId,
    fileUrl,
    '' // fileUrl_2
);

// Add p_id if editing (AFTER the fact)
if (editingDocument) {
    rpcPayload.p_id = editingDocument.id;
    rpcPayload.p_approval_status = 0;
}
```

**handleSaveDocument() - After**:
```typescript
const rpcPayload = buildLicensePayload(
    typeKey,
    data.fields,
    store.merchantId,
    fileUrl,
    '', // fileUrl_2
    editingDocument?.id  // Pass ID upfront to buildLicensePayload
);

// Just reset approval status if editing
if (editingDocument) {
    rpcPayload.p_approval_status = 0;
}
```

**Changes**:
- ✅ Pass `editingDocument?.id` directly to `buildLicensePayload()`
- ✅ Function now ensures `p_id` is always set (either new or existing)
- ✅ Cleaner logic - no need to manually set p_id after the fact

**handleSaveIDCard() - Similar changes**:
```typescript
const rpcPayload = buildLicensePayload(
    'CCCD',
    data.fields,
    store.merchantId,
    frontUrl,
    backUrl,
    editingDocument?.id  // Pass ID upfront
);
```

## Result

### ✅ What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **p_id in payload** | ❌ Missing | ✅ Always present |
| **New documents** | NULL → Error | UUID generated |
| **Editing documents** | Set after payload creation | Included in payload |
| **Database inserts** | Failed (NULL constraint) | Succeed |

### ✅ Before & After Flow

**Before** (Broken):
```
User fills form & clicks Save
    ↓
buildLicensePayload() → { p_merchant_id, p_license_type, ... } (NO p_id!)
    ↓
upsertMerchantLicense(payload) → p_id = undefined → null
    ↓
PostgreSQL RPC → INSERT with _id = NULL
    ↓
❌ NOT NULL constraint violation
```

**After** (Fixed):
```
User fills form & clicks Save
    ↓
buildLicensePayload(typeKey, fields, merchantId, fileUrl, fileUrl2, editingId)
    ├─ If editing: use editingId
    └─ If new: generateUUID()
    ↓
{ p_id: "uuid-here", p_merchant_id, p_license_type, ... }
    ↓
upsertMerchantLicense(payload) → p_id = "uuid-here"
    ↓
PostgreSQL RPC → INSERT with _id = "uuid-here"
    ↓
✅ INSERT succeeds
```

## Testing

### Test Case 1: New CCCD Document
1. Open DocumentUploadDialog with CCCD type
2. Fill form (all required fields)
3. Upload front & back images
4. Click Save
5. **Expected**: ✅ Document saved, no error

### Test Case 2: New Business License
1. Open DocumentUploadDialog with Business License type
2. Fill form (all required fields)
3. Upload image
4. Click Save
5. **Expected**: ✅ Document saved, no error

### Test Case 3: Edit Existing License
1. Click edit on existing license
2. Modify some fields
3. Click Save
4. **Expected**: ✅ Document updated, uses same _id

### Test Case 4: All Document Types
- CCCD ✅
- Business License ✅
- Rental Contract ✅
- Food Safety ✅
- Professional License ✅
- Fire Prevention ✅

## Files Modified

1. **src/utils/licenseHelper.ts**
   - Added: `generateUUID()` function
   - Updated: `buildLicensePayload()` signature and logic
   - Always includes `p_id` (generated or provided)

2. **src/modules/registry/pages/StoreDetailPage.tsx**
   - Updated: `handleSaveDocument()` - pass `editingDocument?.id` to buildLicensePayload
   - Updated: `handleSaveIDCard()` - pass `editingDocument?.id` to buildLicensePayload
   - Simplified: No manual `p_id` assignment after payload creation

## Verification

✅ TypeScript compilation: No errors  
✅ All logic paths tested:
- New document: generates UUID
- Edit document: uses existing ID
- All 6 document types: supported

## Migration Note

No database migration needed - this is a frontend fix that ensures `p_id` is always provided to the RPC function.

## Summary

The issue was that `buildLicensePayload()` was not including `p_id` in the payload. This caused NULL values to be sent to the database, violating the NOT NULL constraint on `_id`. 

**The fix**: Generate a UUID on the frontend (if creating new) or use the existing ID (if editing), and always include `p_id` in the RPC payload before sending to PostgreSQL.

This ensures the database never receives NULL for `_id`, eliminating the constraint violation error.
