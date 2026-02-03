# License Field Routing - Complete Field Map Reference

## Master Field Mapping Table

This table shows the complete mapping from UI form field → database column → RPC parameter for each document type.

### CCCD / CMND (Identity Card)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số CCCD/CMND | `idNumber` | `license_number` | `p_license_number` | TEXT | YES | 12 digits |
| Họ và tên | `fullName` | `holder_name` | `p_holder_name` | TEXT | YES | Full name |
| Ngày sinh | `dateOfBirth` | (stored in notes) | (p_notes) | DATE | NO | Not in core schema |
| Ngày cấp | `issueDate` | `issued_date` | `p_issued_date` | DATE | YES | Format: YYYY-MM-DD |
| Nơi cấp | `issuePlace` | `issued_by_name` | `p_issued_by_name` | TEXT | YES | Authority name |
| Giới tính | `sex` | `sex` | `p_sex` | TEXT | NO | Nam/Nữ |
| Quốc tịch | `nationality` | `nationality` | `p_nationality` | TEXT | NO | Country name |
| Quê quán | `placeOfOrigin` | `place_of_origin` | `p_place_of_origin` | TEXT | NO | Origin location |
| Địa chỉ thường trú | `address` | `permanent_address` | `p_permanent_address` | TEXT | NO | Residence |
| Mặt trước | (frontFile) | `file_url` | `p_file_url` | TEXT | YES | Image URL |
| Mặt sau | (backFile) | `file_url_2` | `p_file_url_2` | TEXT | YES | Image URL |

### Business License (Giấy phép kinh doanh)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số giấy phép | `licenseNumber` | `license_number` | `p_license_number` | TEXT | YES | GPKD-XXXXXXX |
| Ngày cấp | `issueDate` | `issued_date` | `p_issued_date` | DATE | YES | Format: YYYY-MM-DD |
| Ngày hết hạn | `expiryDate` | `expiry_date` | `p_expiry_date` | DATE | NO | Format: YYYY-MM-DD |
| Cơ quan cấp | `issuingAuthority` | `issued_by_name` | `p_issued_by_name` | TEXT | YES | Authority name |
| Ngành nghề kinh doanh | `businessScope` | `business_field` | `p_business_field` | TEXT | NO | Type of business |
| Tên doanh nghiệp | `businessName` | `business_name` | `p_business_name` | TEXT | NO | Company name |
| Người đại diện | `ownerName` | `owner_name` | `p_owner_name` | TEXT | NO | Representative |
| Địa chỉ kinh doanh | `address` | `permanent_address` | `p_permanent_address` | TEXT | NO | Business location |
| Giấy phép ảnh | (file) | `file_url` | `p_file_url` | TEXT | YES | Image URL |

### Rental Contract (Hợp đồng thuê mặt bằng)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số hợp đồng | `contractNumber` | `license_number` | `p_license_number` | TEXT | YES | HĐ-XXXX-XXX |
| Bên cho thuê | `lessor` | `lessor_name` | `p_lessor_name` | TEXT | YES | Landlord name |
| Bên thuê | `lessee` | `lessee_name` | `p_lessee_name` | TEXT | YES | Tenant name |
| Ngày bắt đầu | `startDate` | `rent_start_date` | `p_rent_start_date` | DATE | YES | Format: YYYY-MM-DD |
| Ngày kết thúc | `endDate` | `rent_end_date` | `p_rent_end_date` | DATE | YES | Format: YYYY-MM-DD |
| Tiền thuê hàng tháng (VNĐ) | `monthlyRent` | `rent_price_monthly` | `p_rent_price_monthly` | BIGINT | NO | Converted to number |
| Địa chỉ mặt bằng | `address` | `property_address` | `p_property_address` | TEXT | YES | Property location |
| Hợp đồng ảnh | (file) | `file_url` | `p_file_url` | TEXT | YES | Image URL |

### Food Safety (Giấy chứng nhận ATTP)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số giấy chứng nhận | `certificateNumber` | `license_number` | `p_license_number` | TEXT | YES | ATTP-XXXX-XXX |
| Ngày cấp | `issueDate` | `issued_date` | `p_issued_date` | DATE | YES | Format: YYYY-MM-DD |
| Ngày hết hạn | `expiryDate` | `expiry_date` | `p_expiry_date` | DATE | YES | Format: YYYY-MM-DD |
| Cơ quan cấp | `issuingAuthority` | `issued_by_name` | `p_issued_by_name` | TEXT | YES | Authority name |
| Phạm vi hoạt động | `scope` | `activity_scope` | `p_activity_scope` | TEXT | YES | Activity scope |
| Giấy chứng nhận ảnh | (file) | `file_url` | `p_file_url` | TEXT | YES | Image URL |

### Professional License (Giấy phép chuyên ngành)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số giấy phép | `licenseNumber` | `license_number` | `p_license_number` | TEXT | YES | GPCN-XXXX-XXX |
| Ngày cấp | `issueDate` | `issued_date` | `p_issued_date` | DATE | YES | Format: YYYY-MM-DD |
| Ngày hết hạn | `expiryDate` | `expiry_date` | `p_expiry_date` | DATE | YES | Format: YYYY-MM-DD |
| Cơ quan cấp | `issuingAuthority` | `issued_by_name` | `p_issued_by_name` | TEXT | YES | Authority name |
| Phạm vi hoạt động | `scope` | `activity_scope` | `p_activity_scope` | TEXT | YES | Activity scope |
| Giấy phép ảnh | (file) | `file_url` | `p_file_url` | TEXT | YES | Image URL |

### Fire Prevention (Giấy phép PCCC)

| UI Field Name | Form Key | DB Field Name | RPC Parameter | Type | Required | Notes |
|---|---|---|---|---|---|---|
| Số giấy chứng nhận | `certificateNumber` | `license_number` | `p_license_number` | TEXT | YES | PCCC-XXXX-XXX |
| Ngày cấp | `issueDate` | `issued_date` | `p_issued_date` | DATE | YES | Format: YYYY-MM-DD |
| Ngày hết hạn | `expiryDate` | `expiry_date` | `p_expiry_date` | DATE | YES | Format: YYYY-MM-DD |
| Cơ quan cấp | `issuingAuthority` | `issued_by_name` | `p_issued_by_name` | TEXT | YES | Authority name |
| Kết quả kiểm tra | `inspectionResult` | `inspection_result` | `p_inspection_result` | TEXT | NO | Inspection results |
| Giấy chứng nhận ảnh | (file) | `file_url` | `p_file_url` | TEXT | YES | Image URL |

## Reverse Lookup: Database Column → Form Keys

If you know the database column name, here are the possible form keys:

```typescript
// license_number (Primary identifier - used by all types)
↓ map from
['licenseNumber', 'certificateNumber', 'contractNumber', 'idNumber']

// issued_date (Issue/creation date)
↓ map from
['issueDate']

// expiry_date (Expiration date)
↓ map from
['expiryDate']

// issued_by_name (Issuing authority)
↓ map from
['issuingAuthority', 'issuePlace']

// issued_by (Alternative issuing place field)
↓ map from
['issuePlace']

// holder_name (Identity card holder)
↓ map from
['fullName']

// permanent_address (Various address fields)
↓ map from
['address']

// business_field (Type of business)
↓ map from
['businessScope']

// activity_scope (Activity scope/coverage)
↓ map from
['scope']

// inspection_result (Inspection results)
↓ map from
['inspectionResult']

// lessor_name (Landlord/property owner)
↓ map from
['lessor']

// lessee_name (Tenant/renter)
↓ map from
['lessee']

// rent_price_monthly (Monthly rent amount)
↓ map from
['monthlyRent']

// rent_start_date (Lease start date)
↓ map from
['startDate']

// rent_end_date (Lease end date)
↓ map from
['endDate']

// property_address (Rental property location)
↓ map from
['address']

// sex (Gender)
↓ map from
['sex']

// nationality (Country/nationality)
↓ map from
['nationality']

// place_of_origin (Hometown/origin)
↓ map from
['placeOfOrigin']

// business_name (Company/business name)
↓ map from
['businessName']

// owner_name (Business owner/representative)
↓ map from
['ownerName']

// file_url (Primary document image)
↓ map from
(automatic, set in buildLicensePayload)

// file_url_2 (Secondary document image - CCCD back)
↓ map from
(automatic, set in buildLicensePayload)
```

## Data Type Definitions

```typescript
// License type keys (for DOCUMENT_TYPE_TO_KEY mapping)
type LicenseTypeKey = 
  | 'CCCD' 
  | 'BUSINESS_LICENSE' 
  | 'FOOD_SAFETY' 
  | 'RENT_CONTRACT' 
  | 'PROFESSIONAL_LICENSE' 
  | 'FIRE_PREVENTION';

// Document ID to type mapping
type DocumentID = 
  | 'cccd'
  | 'business-license'
  | 'food-safety'
  | 'lease-contract'
  | 'specialized-license'
  | 'fire-safety';

// Form data object (what comes from DocumentUploadDialog)
interface FormData {
  // CCCD Fields
  idNumber?: string;
  fullName?: string;
  dateOfBirth?: string;
  issueDate?: string;
  issuePlace?: string;
  sex?: string;
  nationality?: string;
  placeOfOrigin?: string;
  address?: string;
  
  // Business License Fields
  licenseNumber?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  businessScope?: string;
  businessName?: string;
  ownerName?: string;
  
  // Rental Contract Fields
  contractNumber?: string;
  lessor?: string;
  lessee?: string;
  startDate?: string;
  endDate?: string;
  monthlyRent?: string | number;
  
  // Food Safety Fields
  certificateNumber?: string;
  scope?: string;
  
  // Fire Prevention Fields
  inspectionResult?: string;
  
  // Common Fields
  notes?: string;
}

// RPC payload (what gets sent to PostgreSQL)
interface RpcPayload {
  p_id?: string | null;
  p_merchant_id: string;
  p_license_type: string;
  p_status?: string;
  p_approval_status?: number;
  p_notes?: string;
  
  // CCCD Parameters
  p_license_number?: string;
  p_holder_name?: string;
  p_issued_date?: string;
  p_issued_by_name?: string;
  p_issued_by?: string;
  p_permanent_address?: string;
  p_sex?: string;
  p_nationality?: string;
  p_place_of_origin?: string;
  p_file_url?: string;
  p_file_url_2?: string;
  
  // Business License Parameters
  p_expiry_date?: string;
  p_business_field?: string;
  p_business_name?: string;
  p_owner_name?: string;
  
  // Rental Contract Parameters
  p_lessor_name?: string;
  p_lessee_name?: string;
  p_rent_price_monthly?: number;
  p_rent_start_date?: string;
  p_rent_end_date?: string;
  p_property_address?: string;
  
  // Food Safety Parameters
  p_activity_scope?: string;
  
  // Fire Prevention Parameters
  p_inspection_result?: string;
}
```

## Configuration Constants

### REQUIRED_FIELDS_BY_TYPE
Defines which fields MUST be present for each document type:

```typescript
REQUIRED_FIELDS_BY_TYPE = {
  CCCD: [
    'license_number',      // From idNumber
    'holder_name',         // From fullName
    'issued_date',         // From issueDate
    'issued_by_name'       // From issuePlace
  ],
  
  BUSINESS_LICENSE: [
    'license_number',      // From licenseNumber
    'issued_date',         // From issueDate
    'issued_by_name'       // From issuingAuthority
  ],
  
  FOOD_SAFETY: [
    'license_number',      // From certificateNumber
    'issued_date',         // From issueDate
    'expiry_date',         // From expiryDate
    'issued_by_name',      // From issuingAuthority
    'activity_scope'       // From scope
  ],
  
  RENT_CONTRACT: [
    'license_number',      // From contractNumber
    'lessor_name',         // From lessor
    'lessee_name',         // From lessee
    'rent_start_date',     // From startDate
    'rent_end_date',       // From endDate
    'property_address'     // From address
  ],
  
  PROFESSIONAL_LICENSE: [
    'license_number',      // From licenseNumber
    'issued_date',         // From issueDate
    'expiry_date',         // From expiryDate
    'issued_by_name',      // From issuingAuthority
    'activity_scope'       // From scope
  ],
  
  FIRE_PREVENTION: [
    'license_number',      // From certificateNumber
    'issued_date',         // From issueDate
    'expiry_date',         // From expiryDate
    'issued_by_name'       // From issuingAuthority
  ]
}
```

### LICENSE_FIELDS
Defines ALL fields (required + optional) for each document type:

```typescript
LICENSE_FIELDS = {
  CCCD: [
    'license_number', 'holder_name', 'issued_date', 'issued_by_name',
    'issued_by', 'permanent_address', 'sex', 'nationality',
    'place_of_origin', 'file_url', 'file_url_2'
  ],
  
  BUSINESS_LICENSE: [
    'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
    'business_field', 'business_name', 'owner_name',
    'permanent_address', 'file_url'
  ],
  
  FOOD_SAFETY: [
    'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
    'activity_scope', 'file_url'
  ],
  
  RENT_CONTRACT: [
    'license_number', 'lessor_name', 'lessee_name', 'rent_price_monthly',
    'rent_start_date', 'rent_end_date', 'property_address', 'file_url'
  ],
  
  PROFESSIONAL_LICENSE: [
    'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
    'activity_scope', 'file_url'
  ],
  
  FIRE_PREVENTION: [
    'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
    'inspection_result', 'file_url'
  ]
}
```

## Common Queries

### Q: How do I add a new required field to CCCD?
A: Edit `REQUIRED_FIELDS_BY_TYPE['CCCD']` to add the field name, then add mapping in `FIELD_SOURCE_MAPPING` if needed.

### Q: How do I add a new document type?
A: 
1. Add to `DOCUMENT_TYPES` in documentTypes.ts with fields
2. Add `LICENSE_FIELDS` entry in licenseHelper.ts
3. Add to `REQUIRED_FIELDS_BY_TYPE` in licenseHelper.ts
4. Add source mappings in `FIELD_SOURCE_MAPPING`
5. Add to `DOCUMENT_TYPE_TO_KEY` mapping
6. Update PostgreSQL schema if new database columns needed

### Q: What if form has field that doesn't match any mapping?
A: It gets stored in `p_notes` as JSON by buildLicensePayload (future-proofing).

### Q: Can I have the same field in multiple types?
A: Yes, `address` maps to `permanent_address` for CCCD/Business License but `property_address` for Rental Contract.

### Q: What happens to extra fields not in LICENSE_FIELDS?
A: They're currently ignored. Future: could store in p_notes JSON.
