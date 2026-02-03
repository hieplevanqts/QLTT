# License Field Routing - Developer Quick Reference

## What Changed?

### 1. Enhanced licenseHelper.ts
Added 4 new validation functions to ensure data quality before RPC calls:

```typescript
// Check if all required fields present for document type
validateRequiredFields(typeKey, dataFields) → string[]

// Validate field formats (dates, numbers)
validateFieldTypes(typeKey, dataFields) → { isValid, errors? }

// Clean data before API call
sanitizeLicenseData(typeKey, dataFields) → Record<string, any>

// Get Vietnamese field labels for error messages
getFieldLabel(dbField) → string
```

### 2. Improved buildLicensePayload
Now **only includes fields with actual values**, instead of empty strings:
- Before: `p_holder_name: ''` (wasted database column)
- After: field not included (PostgreSQL uses DEFAULT NULL)

### 3. Updated DocumentUploadDialog
Enhanced handleSave() with:
- Type-specific required field validation
- Field format validation (YYYY-MM-DD dates, numeric amounts)
- Better error messages showing exactly which fields are missing
- Data sanitization before API call

## Usage Examples

### Example 1: Validate CCCD Fields
```typescript
import { validateRequiredFields, getFieldLabel } from '@/utils/licenseHelper';

const formData = {
  idNumber: '001234567890',
  fullName: 'Nguyễn Văn A',
  // issueDate is missing!
};

const missing = validateRequiredFields('CCCD', formData);
// Result: ['issued_date']

const friendlyName = getFieldLabel('issued_date');
// Result: 'Ngày cấp'

// Error message: "Thiếu thông tin bắt buộc: Ngày cấp"
```

### Example 2: Validate Business License Fields
```typescript
const formData = {
  licenseNumber: 'GPKD-123456',
  issueDate: '2024-01-15',
  issuingAuthority: 'Sở Kế hoạch và Đầu tư',
  // All required fields present
};

const missing = validateRequiredFields('BUSINESS_LICENSE', formData);
// Result: [] (valid!)
```

### Example 3: Validate Field Types
```typescript
const typeValidation = validateFieldTypes('BUSINESS_LICENSE', {
  issueDate: '15/01/2024',  // Wrong format (dd/mm/yyyy instead of yyyy-mm-dd)
  expiryDate: 'invalid',     // Not a date
  monthlyRent: '15000000',   // Valid number
});

// Result:
// {
//   isValid: false,
//   errors: [
//     "issueDate phải có định dạng YYYY-MM-DD (nhận: 15/01/2024)",
//     "expiryDate phải có định dạng YYYY-MM-DD (nhận: invalid)"
//   ]
// }
```

### Example 4: Sanitize Data
```typescript
const sanitized = sanitizeLicenseData('RENT_CONTRACT', {
  contractNumber: '  HĐ-2024-001  ',  // Will be trimmed
  lessor: '',                          // Will be removed (empty)
  lessee: 'Nguyễn Văn B',             // Kept
  monthlyRent: '15000000',            // Converted to number
});

// Result:
// {
//   contractNumber: 'HĐ-2024-001',
//   lessee: 'Nguyễn Văn B',
//   monthlyRent: 15000000
// }
```

## Required Fields by Type

| Type | Required Fields |
|------|-----------------|
| CCCD | license_number, holder_name, issued_date, issued_by_name |
| BUSINESS_LICENSE | license_number, issued_date, issued_by_name |
| FOOD_SAFETY | license_number, issued_date, expiry_date, issued_by_name, activity_scope |
| RENT_CONTRACT | license_number, lessor_name, lessee_name, rent_start_date, rent_end_date, property_address |
| PROFESSIONAL_LICENSE | license_number, issued_date, expiry_date, issued_by_name, activity_scope |
| FIRE_PREVENTION | license_number, issued_date, expiry_date, issued_by_name |

## Field Mapping Reference

### Form → Database Mapping
```
UI Field Name     →  Database Field      →  RPC Parameter
================================================================
CCCD / CMND
idNumber          →  license_number      →  p_license_number
fullName          →  holder_name         →  p_holder_name
issueDate         →  issued_date         →  p_issued_date
issuePlace        →  issued_by_name      →  p_issued_by_name
sex               →  sex                 →  p_sex
nationality       →  nationality         →  p_nationality
placeOfOrigin     →  place_of_origin     →  p_place_of_origin
address           →  permanent_address   →  p_permanent_address
(frontFile)       →  file_url            →  p_file_url
(backFile)        →  file_url_2          →  p_file_url_2

Business License
licenseNumber     →  license_number      →  p_license_number
issueDate         →  issued_date         →  p_issued_date
expiryDate        →  expiry_date         →  p_expiry_date
issuingAuthority  →  issued_by_name      →  p_issued_by_name
businessScope     →  business_field      →  p_business_field
businessName      →  business_name       →  p_business_name
ownerName         →  owner_name          →  p_owner_name
address           →  permanent_address   →  p_permanent_address

Rental Contract
contractNumber    →  license_number      →  p_license_number
lessor            →  lessor_name         →  p_lessor_name
lessee            →  lessee_name         →  p_lessee_name
startDate         →  rent_start_date     →  p_rent_start_date
endDate           →  rent_end_date       →  p_rent_end_date
monthlyRent       →  rent_price_monthly  →  p_rent_price_monthly
address           →  property_address    →  p_property_address
```

## Testing Checklist

### For Each Document Type:
- [ ] Open DocumentUploadDialog with correct type
- [ ] Leave one required field empty, try to save
  - Verify: Shows "Thiếu thông tin bắt buộc: [field name]"
- [ ] Enter date in wrong format (e.g., 01/15/2024 instead of 2024-01-15)
  - Verify: Shows format error
- [ ] Enter non-numeric value in numeric field (e.g., "abc" in monthlyRent)
  - Verify: Shows "phải là số hợp lệ" error
- [ ] Fill all required fields correctly with whitespace
  - Verify: Saved successfully, fields trimmed in database
- [ ] Save with file and verify RPC receives correct p_file_url
  - Verify: Document accessible after save

## Troubleshooting

### Issue: "Thiếu thông tin bắt buộc" error even when field filled
**Cause**: Field name mismatch between UI and mapping
**Solution**: Check FIELD_SOURCE_MAPPING for correct UI field key name

### Issue: Empty strings in database
**Cause**: Old buildLicensePayload was setting p_field = ''
**Solution**: Update to latest buildLicensePayload (uses sanitizeLicenseData)

### Issue: Date format errors
**Cause**: UI date format different from YYYY-MM-DD
**Solution**: Ensure <input type="date"> produces YYYY-MM-DD format (standard HTML5)

### Issue: Number fields saved as strings
**Cause**: buildLicensePayload not converting to Number
**Solution**: Added Number() conversion for rent_price_monthly field

## Type System

### Type Definitions (licenseHelper.ts)
```typescript
// License type keys
type LicenseTypeKey = 'CCCD' | 'BUSINESS_LICENSE' | 'FOOD_SAFETY' | 'RENT_CONTRACT' | 'PROFESSIONAL_LICENSE' | 'FIRE_PREVENTION'

// License fields configuration
LICENSE_FIELDS: Record<LicenseTypeKey, string[]>

// Required fields per type
REQUIRED_FIELDS_BY_TYPE: Record<LicenseTypeKey, string[]>

// Field source mapping
FIELD_SOURCE_MAPPING: Record<string, string[]>
```

## Next Steps for Enhancement

1. **Auto-mapping from OCR** (Medium Priority)
   - OCR already extracts data, validate before auto-fill
   - Use validateFieldTypes to check extracted data format

2. **Field Dependencies** (Low Priority)
   - Hide fields not relevant for current document type
   - Show/hide based on user selections (e.g., business has multiple owners)

3. **Multi-language** (Low Priority)
   - Move Vietnamese labels to i18n config
   - Support English, Chinese, etc.

4. **Audit Trail** (Low Priority)
   - Track which fields were modified in history
   - Store original vs updated values
