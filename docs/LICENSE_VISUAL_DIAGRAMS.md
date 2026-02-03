# License Field Routing - Visual Diagrams & Flowcharts

## 1. Document Type Field Requirements Pyramid

```
                    ┌─ FIRE_PREVENTION ─┐
                    │ 4 Required Fields  │
                    └────────────────────┘
                           ▲
                           │
                    ┌──────┴──────┐
                    │             │
          ┌─────────┴────┐   ┌────┴─────────┐
          │  FOOD_SAFETY │   │  PROFESSIONAL│
          │ 5 Required   │   │  5 Required  │
          └──────────────┘   └──────────────┘
                    │             │
                    └──────┬──────┘
                           ▲
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        │         ┌────────┴────────┐         │
        │         │   CCCD          │         │
        │         │  4 Required     │         │
        │         │  2 Files Needed │         │
        │         └─────────────────┘         │
        │                  ▲                  │
        │         ┌────────┴────────┐         │
        │         │ BUSINESS_LICENSE│         │
        │         │  3 Required     │         │
        │         └─────────────────┘         │
        │                                     │
        └─────────────┬──────────────────────┘
                      ▼
              ┌───────────────────┐
              │  RENT_CONTRACT    │
              │  6 Required Fields│
              │  (Most Strict)    │
              └───────────────────┘
```

## 2. Form Validation Flow

```
┌────────────────────────────────────┐
│  User fills DocumentUploadDialog   │
│  - Selects document type           │
│  - Fills form fields               │
│  - Uploads image file(s)           │
└──────────────┬─────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Clicks Save Button  │
    └──────────────┬───────┘
                   │
                   ▼
    ┌────────────────────────────────────────┐
    │  Step 1: validateRequiredFields()       │
    │  ✓ Check all required fields present    │
    │  ✓ Type-specific requirements           │
    └────────┬─────────────────────────────────┘
             │
          ┌─ NO ─→ toast.error("Thiếu thông tin: ...")
          │        └─ STOP ─ User must fix
          │
          YES (All required fields present)
          │
          ▼
    ┌────────────────────────────────────────┐
    │  Step 2: validateFieldTypes()           │
    │  ✓ Check date formats (YYYY-MM-DD)      │
    │  ✓ Check numeric fields                 │
    │  ✓ Check field constraints              │
    └────────┬─────────────────────────────────┘
             │
          ┌─ NO ─→ toast.error("Lỗi định dạng: ...")
          │        └─ STOP ─ User must fix
          │
          YES (All formats valid)
          │
          ▼
    ┌────────────────────────────────────────┐
    │  Step 3: sanitizeLicenseData()          │
    │  ✓ Trim whitespace from text            │
    │  ✓ Remove empty values                  │
    │  ✓ Convert to proper types              │
    │  ✓ Return clean data object             │
    └────────┬─────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │  buildLicensePayload()                  │
    │  ✓ Map UI fields to RPC parameters      │
    │  ✓ Only include non-empty fields        │
    │  ✓ Generate RPC payload                 │
    └────────┬─────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │  upsertMerchantLicense(payload)         │
    │  ✓ Send RPC call to PostgreSQL          │
    │  ✓ Wait for response                    │
    └────────┬─────────────────────────────────┘
             │
          ┌─ ERROR ─→ toast.error("Database error: ...")
          │
          SUCCESS
          │
          ▼
    ┌────────────────────────────────────────┐
    │  ✓ Data saved to database               │
    │  ✓ Close dialog                         │
    │  ✓ Refresh license list                 │
    │  ✓ Show success message                 │
    └────────────────────────────────────────┘
```

## 3. Field Mapping Flow by Type

### CCCD (Identity Card)
```
┌─────────────────────────────────────────┐
│          UI Form Fields                 │
├─────────────────────────────────────────┤
│ idNumber          ─────────┐            │
│ fullName          ─────────┤            │
│ dateOfBirth       ──────┐  │            │
│ issueDate         ──────┼──┤            │
│ issuePlace        ──────┼──┤            │
│ sex               ──────┼──┤            │
│ nationality       ──────┼──┤            │
│ placeOfOrigin     ──────┼──┤            │
│ address           ──────┼──┤            │
│ frontFile         ──────┼──┤            │
│ backFile          ──────┘  │            │
└─────────────────┬──────────┼───────────┘
                  │          │
                  ▼          ▼
        ┌────────────────┐   ├─→ p_notes (JSON)
        │ Database Fields│   │
        ├────────────────┤   │
        │ license_number ◄───┘
        │ holder_name
        │ issued_date
        │ issued_by_name
        │ permanent_address
        │ sex
        │ nationality
        │ place_of_origin
        │ file_url
        │ file_url_2
        └────────────────┘
```

### Rental Contract
```
┌─────────────────────────────────────────┐
│          UI Form Fields                 │
├─────────────────────────────────────────┤
│ contractNumber    ─────────┐            │
│ lessor            ─────────┤            │
│ lessee            ─────────┤            │
│ startDate         ─────────┤            │
│ endDate           ─────────┤            │
│ monthlyRent       ─────────┤            │
│ address           ─────────┤            │
│ file              ─────────┤            │
└─────────────────┬──────────┼───────────┘
                  │          │
                  ▼          ▼
        ┌────────────────┐
        │ Database Fields│
        ├────────────────┤
        │ license_number ◄─ contractNumber
        │ lessor_name    ◄─ lessor
        │ lessee_name    ◄─ lessee
        │ rent_start_date◄─ startDate (YYYY-MM-DD)
        │ rent_end_date  ◄─ endDate (YYYY-MM-DD)
        │ rent_price_    ◄─ monthlyRent (converted to number)
        │ monthly        │
        │ property_      ◄─ address
        │ address        │
        │ file_url       ◄─ file
        └────────────────┘
```

## 4. Error Message Decision Tree

```
                    ┌─────────────────────────┐
                    │  Save Document Button   │
                    └──────────────┬──────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │ validateRequiredFields() │
                    └──────────┬───────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
             FAIL                         PASS
                │                             │
                ▼                             ▼
    ┌─────────────────────────┐  ┌──────────────────────────┐
    │ Missing fields: [...]   │  │ validateFieldTypes()     │
    │                         │  └────┬──────────────────────┘
    │ toast.error(            │       │
    │  "Thiếu thông tin: "+   │       │
    │   missingLabels)        │       ├──────────┬──────────┐
    │                         │    FAIL        PASS
    │ STOP                    │       │           │
    └─────────────────────────┘       │           ▼
                                      │  ┌──────────────────┐
                                      │  │ sanitizeLicenseData()
                                      │  │ buildLicensePayload()
                                      │  │ upsertMerchantLicense()
                                      │  │                  │
                                      │  │ SUCCESS → Save ✓ │
                                      │  └──────────────────┘
                                      │
                                      ▼
                            ┌─────────────────────────┐
                            │ Invalid format: [...]   │
                            │                         │
                            │ toast.error(            │
                            │  "Lỗi định dạng: "+     │
                            │   errors)               │
                            │                         │
                            │ STOP                    │
                            └─────────────────────────┘
```

## 5. Field Validation Matrix

```
Document Type    │ Required Fields Count │ Optional Fields │ Files
─────────────────┼──────────────────────┼─────────────────┼─────────
CCCD             │        4             │       5         │ 2 (front+back)
Business License │        3             │       5         │ 1
Rental Contract  │        6             │       1         │ 1
Food Safety      │        5             │       0         │ 1
Professional     │        5             │       0         │ 1
Fire Prevention  │        4             │       1         │ 1
─────────────────┴──────────────────────┴─────────────────┴─────────
Complexity:    HIGHEST ─→ ─→ ─→ ─→ ─→ ─→ ─→ ─→ LOWEST
```

## 6. Data Sanitization Pipeline

```
                    ┌────────────────────────────────┐
                    │  Form Data from UI             │
                    │  {                             │
                    │    idNumber: "001234567890",   │
                    │    fullName: "  John Doe  ",   │
                    │    issueDate: "",              │
                    │    monthlyRent: "15000000"     │
                    │  }                             │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Trim Whitespace               │
                    │  fullName: "John Doe"          │
                    │  (extra spaces removed)        │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Remove Empty Values           │
                    │  issueDate: undefined          │
                    │  (won't send empty string)     │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Type Conversion               │
                    │  monthlyRent: 15000000         │
                    │  (string → number)             │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  Clean Data Ready              │
                    │  {                             │
                    │    p_license_number: "...",    │
                    │    p_holder_name: "John Doe",  │
                    │    p_rent_price_monthly: 15M   │
                    │  }                             │
                    │  (no empty/extra fields)       │
                    └────────────────────────────────┘
```

## 7. Error Message Flow for Rental Contract

```
User Entry              Validation Check         Error Message
──────────────────────  ──────────────────────  ────────────────────────────

lessor: ""              validateRequiredFields()  Thiếu thông tin: Bên cho thuê

startDate: "15/01/2024" validateFieldTypes()     Lỗi định dạng: startDate phải 
                                                  có định dạng YYYY-MM-DD 
                                                  (nhận: 15/01/2024)

monthlyRent: "abc"      validateFieldTypes()     Lỗi định dạng: monthlyRent 
                                                  phải là số hợp lệ (nhận: abc)

All valid              sanitizeLicenseData()     ✓ Saved successfully
lessor: "  ABC Corp  " → "ABC Corp" (trimmed)
                        buildLicensePayload()
                        upsertMerchantLicense()
```

## 8. Database Column Population Comparison

### BEFORE (All fields sent, even empty)
```
merchant_licenses table record:
┌──────────────────┬───────────┐
│ license_number   │ ABC123    │
│ holder_name      │ John Doe  │
│ issued_date      │ 2024-01-15│
│ business_field   │ ""        │ ← Empty (wasted space)
│ lessor_name      │ ""        │ ← Empty (wasted space)
│ lessee_name      │ ""        │ ← Empty (wasted space)
│ rent_price_      │ ""        │ ← Empty (wasted space)
│ monthly          │           │
│ (8 more empty)   │ ""        │ ← Empty (wasted space)
└──────────────────┴───────────┘
Total: ~13KB per record (many empty strings)
```

### AFTER (Only non-empty fields sent)
```
merchant_licenses table record:
┌──────────────────┬───────────┐
│ license_number   │ ABC123    │
│ holder_name      │ John Doe  │
│ issued_date      │ 2024-01-15│
│ business_field   │ NULL      │ ← Not sent (default NULL)
│ lessor_name      │ NULL      │ ← Not sent (default NULL)
│ lessee_name      │ NULL      │ ← Not sent (default NULL)
│ rent_price_      │ NULL      │ ← Not sent (default NULL)
│ monthly          │           │
│ (8 more NULL)    │ NULL      │ ← Not sent (default NULL)
└──────────────────┴───────────┘
Total: ~4KB per record (efficient)
Database savings: ~70% per record!
```

## 9. Implementation Timeline

```
Week 1
├─ Day 1-2: Development (COMPLETE ✓)
│  ├─ Enhance licenseHelper.ts
│  ├─ Update DocumentUploadDialog.tsx
│  └─ Create documentation
│
├─ Day 3: Testing Preparation
│  └─ Create testing checklist
│
├─ Day 4-5: Code Review
│  └─ Team review of changes
│
└─ Day 6-7: SQL Migration + Testing
   ├─ Execute SQL migration
   └─ Manual test all 6 types

Week 2
├─ Production Deployment
│  └─ Deploy to staging
│  └─ Monitor for issues
│  └─ Deploy to production
│
└─ Monitoring
   └─ Check error logs
   └─ Verify database updates
   └─ Gather user feedback
```

## 10. Required vs Optional Fields Summary

```
CCCD (4 Required, 5 Optional)
├─ Required: number, name, issue_date, issue_by ✓ STRICT
├─ Optional: sex, nationality, origin, address, files
└─ Files: 2

Business License (3 Required, 5 Optional)
├─ Required: number, issue_date, issue_by
├─ Optional: expiry, field, business_name, owner, address
└─ Files: 1

Rental Contract (6 Required, 1 Optional)
├─ Required: number, lessor, lessee, start, end, address ✓ STRICTEST
├─ Optional: monthly_rent
└─ Files: 1

Food Safety (5 Required, 0 Optional)
├─ Required: number, issue_date, expiry, issue_by, scope ✓ ALL REQUIRED
├─ Optional: (none)
└─ Files: 1

Professional License (5 Required, 0 Optional)
├─ Required: number, issue_date, expiry, issue_by, scope ✓ ALL REQUIRED
├─ Optional: (none)
└─ Files: 1

Fire Prevention (4 Required, 1 Optional)
├─ Required: number, issue_date, expiry, issue_by
├─ Optional: inspection_result
└─ Files: 1
```

These diagrams help visualize:
- How validation flows through the system
- Where errors can occur and what messages show
- How fields map from UI to database to RPC parameters
- Performance improvements from selective field inclusion
- Requirements complexity for each document type
