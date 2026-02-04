# License Field Routing Implementation Guide

## Overview
This document explains how the application handles conditional field validation and saving based on license document type (CCCD, Business License, Rental Contract, Food Safety, Professional License, Fire Prevention).

## Current Architecture

### 1. Data Flow: Form → API → Database
```
DocumentUploadDialog (UI Form)
    ↓ formData: { idNumber, fullName, issueDate, ... }
    ↓
handleSaveDocument() (StoreDetailPage.tsx)
    ↓
buildLicensePayload() (licenseHelper.ts) ← Type-specific field routing
    ↓ rpcPayload: { p_merchant_id, p_license_type, p_holder_name, ... }
    ↓
upsertMerchantLicense() (storesApi.ts) ← RPC call
    ↓
PostgreSQL Function (upsert_merchant_license)
    ↓
Database (merchant_licenses table)
```

### 2. Component Mapping

#### Document Types & Fields (documentTypes.ts)
- **CCCD/CMND**: idNumber, fullName, dateOfBirth, issueDate, issuePlace, sex, nationality, placeOfOrigin, address
- **Business License**: licenseNumber, issueDate, expiryDate, issuingAuthority, businessScope, businessName, ownerName, address
- **Lease Contract**: contractNumber, lessor, lessee, startDate, endDate, monthlyRent, address
- **Food Safety**: certificateNumber, issueDate, expiryDate, issuingAuthority, scope
- **Professional License**: licenseNumber, issueDate, expiryDate, issuingAuthority, scope
- **Fire Prevention**: certificateNumber, issueDate, expiryDate, issuingAuthority, inspectionResult

#### Field Mapping (licenseHelper.ts)

**LICENSE_FIELDS**: Maps document type keys to database field names
```typescript
CCCD: ['license_number', 'holder_name', 'issued_date', 'issued_by_name', 'issued_by', 
       'permanent_address', 'sex', 'nationality', 'place_of_origin', 'file_url', 'file_url_2']

BUSINESS_LICENSE: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 
                   'business_field', 'business_name', 'owner_name', 'permanent_address', 'file_url']

RENT_CONTRACT: ['license_number', 'lessor_name', 'lessee_name', 'rent_price_monthly', 
                'rent_start_date', 'rent_end_date', 'property_address', 'file_url']

FOOD_SAFETY: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 
              'activity_scope', 'file_url']

PROFESSIONAL_LICENSE: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 
                       'activity_scope', 'file_url']

FIRE_PREVENTION: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 
                  'inspection_result', 'file_url']
```

**FIELD_SOURCE_MAPPING**: Maps database field names to UI form field keys
```typescript
license_number: ['licenseNumber', 'certificateNumber', 'contractNumber', 'idNumber']
issued_date: ['issueDate']
expiry_date: ['expiryDate']
issued_by_name: ['issuingAuthority', 'issuePlace']
holder_name: ['fullName']
permanent_address: ['address']
business_field: ['businessScope']
lessor_name: ['lessor']
lessee_name: ['lessee']
rent_price_monthly: ['monthlyRent']
// ... and more
```

**DOCUMENT_TYPE_TO_KEY**: Maps UI document type IDs to LICENSE_FIELDS keys
```typescript
'cccd': 'CCCD'
'business-license': 'BUSINESS_LICENSE'
'lease-contract': 'RENT_CONTRACT'
'food-safety': 'FOOD_SAFETY'
'specialized-license': 'PROFESSIONAL_LICENSE'
'fire-safety': 'FIRE_PREVENTION'
```

### 3. buildLicensePayload Function

**Input**: 
- `typeKey`: 'CCCD', 'BUSINESS_LICENSE', etc.
- `dataFields`: Form data from DocumentUploadDialog
- `merchantId`: Store's merchant ID
- `fileUrl`: Primary document image URL
- `fileUrl2`: Secondary document image URL (for CCCD back side)

**Output**: 
RPC payload with only type-specific fields set, others remain undefined/null

**Process**:
1. Get allowed fields from `LICENSE_FIELDS[typeKey]`
2. For each allowed field:
   - Map database field name to possible UI form keys
   - Look up value from `dataFields` using `FIELD_SOURCE_MAPPING`
   - Add to payload as `p_${fieldName}`
3. Persist extra fields not in allowed list as JSON in `p_notes`

**Example CCCD**:
```typescript
Input:  { idNumber: '001234567890', fullName: 'Nguyễn Văn A', dateOfBirth: '1990-01-15', ... }
Output: { 
  p_merchant_id: '550e8400-e29b-41d4-a716-446655440000',
  p_license_type: 'CCCD',
  p_license_number: '001234567890',
  p_holder_name: 'Nguyễn Văn A',
  p_issued_date: '1990-01-15',
  p_sex: 'Nam',
  p_nationality: 'Việt Nam',
  p_place_of_origin: '...',
  p_permanent_address: '...',
  p_file_url: 'https://...',
  p_file_url_2: 'https://...' (back side)
}
```

## Database Schema Alignment

The PostgreSQL function `upsert_merchant_license` accepts these parameters:
- p_id, p_merchant_id, p_license_type, p_status, p_approval_status, p_notes
- **CCCD fields**: p_license_number, p_holder_name, p_issued_date, p_issued_by_name, p_issued_by, p_permanent_address, p_sex, p_nationality, p_place_of_origin, p_file_url, p_file_url_2
- **Business License fields**: p_business_field, p_business_name, p_owner_name, p_expiry_date
- **Rental Contract fields**: p_lessor_name, p_lessee_name, p_rent_price_monthly, p_rent_start_date, p_rent_end_date, p_property_address
- **Food Safety fields**: p_activity_scope
- **Fire Prevention fields**: p_inspection_result

All parameters have `DEFAULT NULL`, so missing fields won't cause errors.

## Current Implementation Status

### ✅ Working
1. **Field mapping logic**: `buildLicensePayload()` correctly routes fields by type
2. **Form structure**: DocumentUploadDialog shows correct fields per document type
3. **Database schema**: merchant_licenses table has all required columns
4. **RPC function**: unified `upsert_merchant_license()` with proper parameter names

### ⚠️ Improvements Needed

#### 1. **Type-Safe Field Validation on Frontend**
Current: Form only validates required fields marked in documentTypes.ts
Needed: Add type-specific required field validation logic

```typescript
// Add to licenseHelper.ts
export const getRequiredFieldsForType = (typeKey: string): string[] => {
  const type = DOCUMENT_TYPES[typeKey];
  if (!type) return [];
  return type.fields
    .filter(f => f.required)
    .map(f => f.key);
};

// In DocumentUploadDialog.handleSave():
const requiredFields = getRequiredFieldsForType(typeKey);
const missingRequired = requiredFields.filter(field => !formData[field]);
if (missingRequired.length > 0) {
  // Show validation error
}
```

#### 2. **Null Field Handling in buildLicensePayload**
Current: All fields in allowedFields are always included (may be empty strings)
Better: Only include fields with actual values to reduce NULL columns in database

```typescript
// Before (current)
payload[pField] = value; // Could be empty string ''

// After (improved)
if (value && value !== '') {
  payload[pField] = value;
}
// If not set, remains undefined → PostgreSQL uses DEFAULT NULL
```

#### 3. **Better Error Messages for Type-Specific Fields**
Current: Generic "vui lòng điền đầy đủ thông tin bắt buộc"
Better: List which specific fields are required for this license type

```typescript
// Example for Rental Contract
const errors = [];
if (!formData.lessor) errors.push('Bên cho thuê (lessor)');
if (!formData.lessee) errors.push('Bên thuê (lessee)');
if (!formData.startDate) errors.push('Ngày bắt đầu (startDate)');
if (!formData.endDate) errors.push('Ngày kết thúc (endDate)');
if (!formData.address) errors.push('Địa chỉ mặt bằng (address)');

if (errors.length > 0) {
  toast.error(`Thiếu thông tin: ${errors.join(', ')}`);
}
```

#### 4. **Data Type Validation Before RPC Call**
Current: No validation of field data types (dates, numbers)
Needed: Validate dates are valid, rent amounts are numbers, etc.

```typescript
const validateFieldTypes = (typeKey: string, data: Record<string, any>): boolean => {
  const docType = DOCUMENT_TYPES[typeKey];
  for (const field of docType.fields) {
    if (field.type === 'date' && data[field.key]) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data[field.key])) {
        return false; // Invalid date format
      }
    }
    if (field.type === 'number' && data[field.key]) {
      if (isNaN(Number(data[field.key]))) {
        return false; // Not a number
      }
    }
  }
  return true;
};
```

## Implementation Checklist

### Phase 1: Field Validation (Priority: HIGH)
- [ ] Add `getRequiredFieldsForType()` to licenseHelper.ts
- [ ] Update DocumentUploadDialog to validate type-specific required fields
- [ ] Show specific error messages listing missing required fields
- [ ] Add data type validation (dates, numbers)

### Phase 2: Data Quality (Priority: MEDIUM)
- [ ] Update `buildLicensePayload()` to skip empty values
- [ ] Add field sanitization (trim strings, parse dates)
- [ ] Add logging for debugging field mapping issues

### Phase 3: Frontend UX (Priority: MEDIUM)
- [ ] Show field descriptions tooltip explaining what each field means
- [ ] Add field dependencies (e.g., if no lease contract, hide lessor_name)
- [ ] Add field auto-fill from OCR results
- [ ] Show preview of which fields will be saved

### Phase 4: Database Optimization (Priority: LOW)
- [ ] Consider storing extra fields in p_notes as JSON instead of NULL columns
- [ ] Add audit log for which fields were updated
- [ ] Add field change tracking in history table

## Testing Scenarios

### Scenario 1: CCCD Upload
1. Open DocumentUploadDialog with type='CCCD / CMND chủ hộ'
2. Upload front side image → OCR extracts: idNumber, fullName, issueDate, issuePlace
3. Upload back side image → OCR extracts: sex, nationality, address
4. Form shows fields: idNumber, fullName, dateOfBirth, issueDate, issuePlace, sex, nationality, placeOfOrigin, address
5. buildLicensePayload() generates:
   - p_license_number ← idNumber
   - p_holder_name ← fullName
   - p_issued_date ← issueDate
   - p_file_url ← front URL
   - p_file_url_2 ← back URL
6. Other fields (business_field, lessor_name, etc.) NOT included in payload

### Scenario 2: Business License Upload
1. DocumentUploadDialog type='business-license'
2. Upload image → OCR extracts: licenseNumber, issuingAuthority, businessScope
3. Form shows: licenseNumber, issueDate, expiryDate, issuingAuthority, businessScope, businessName, ownerName, address
4. buildLicensePayload() generates:
   - p_license_number ← licenseNumber
   - p_issued_date ← issueDate
   - p_business_field ← businessScope
   - p_file_url ← image URL
5. Other fields (holder_name, lessor_name, etc.) NOT included

### Scenario 3: Rental Contract Upload
1. DocumentUploadDialog type='lease-contract'
2. User enters: lessor='Công ty A', lessee='Nguyễn Văn B', startDate='2024-01-01', endDate='2025-12-31', monthlyRent=15000000, address='123 Đường ABC'
3. Validation checks all required fields present
4. buildLicensePayload() generates:
   - p_license_number ← contractNumber
   - p_lessor_name ← lessor
   - p_lessee_name ← lessee
   - p_rent_start_date ← startDate
   - p_rent_end_date ← endDate
   - p_rent_price_monthly ← 15000000 (as number)
   - p_property_address ← address
   - p_file_url ← document URL

## Migration Path

### Step 1: Apply SQL Migration (CRITICAL)
Execute this before any license saves work:
```bash
# File: supabase/patches/202602030001_fix_upsert_merchant_license_type_mismatch.sql
# Run in Supabase SQL Editor
```

### Step 2: Deploy Frontend Improvements
- Update licenseHelper.ts with validation functions
- Update DocumentUploadDialog error messages
- Add field type validation
- Test all 6 document types

### Step 3: Monitor and Debug
- Check logs for mapping errors
- Verify all fields save correctly to database
- Test editing existing documents

## FAQ

**Q: Why use DEFAULT NULL instead of removing function overloads?**
A: PostgreSQL function resolution needs exact parameter type matching. If you have multiple overloads with similar signatures (CCCD vs BUSINESS_LICENSE versions), the database can't determine which to call. DEFAULT NULL allows one function to handle all cases.

**Q: Why are some fields stored in p_notes as JSON?**
A: The database schema has fixed columns for common fields. Extra fields not in the schema get JSON-serialized in p_notes for flexibility and future extensibility.

**Q: How to add a new document type?**
A: 
1. Add entry to DOCUMENT_TYPES in documentTypes.ts
2. Add LICENSE_FIELDS entry in licenseHelper.ts
3. Map field names in FIELD_SOURCE_MAPPING
4. Add to DOCUMENT_TYPE_TO_KEY mapping
5. Add database columns if needed for new fields

**Q: What if a user saves a document with missing optional fields?**
A: Those fields remain NULL in database. When editing, they'll be empty in the form. This is by design for flexibility.

**Q: Why validate on frontend if database has constraints?**
A: Frontend validation provides immediate user feedback and prevents unnecessary API calls. Database validation is last-line-of-defense.

## References
- [Database Schema](../docs/database-schema.sql)
- [Store API](./storesApi.ts)
- [License Helper](./licenseHelper.ts)
- [Document Upload Dialog](../components/ui-kit/DocumentUploadDialog.tsx)
- [PostgreSQL Migration](../supabase/patches/202602030001_fix_upsert_merchant_license_type_mismatch.sql)
