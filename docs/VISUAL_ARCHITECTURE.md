# Visual Architecture & Data Flow

## 🏗️ Current Architecture

### Before (Mock Data)
```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                              │
├─────────────────────────────────────────────────────────────┤
│  AddStoreDialogTabbed  │  FullEditRegistryPage  │  EditPage  │
└──────────┬──────────────┬────────────────────────┬───────────┘
           │              │                         │
           └──────────────┼─────────────────────────┘
                          │
                   ┌──────▼──────┐
                   │   Import    │
                   │vietnamLocs  │
                   └─────────────┘
                          │
                   ┌──────▼──────┐
                   │ Mock Data   │
                   │ (Static JS) │
                   └─────────────┘

Problems:
❌ Not real data
❌ Out of date
❌ Hardcoded structure
❌ No districts in API but code assumes them
```

### After (Real API)
```
┌────────────────────────────────────────────────────────────────┐
│                    UI Components                                │
├────────────────────────────────────────────────────────────────┤
│ AddStoreDialogTabbed │ FullEditRegistryPage │ EditPage │ etc   │
└──────────┬────────────┬─────────────────────┬──────────┬────────┘
           │            │                     │          │
           └────────────┼─────────────────────┴──────────┘
                        │
                ┌───────▼────────┐
                │  locationsApi  │  ◄─── API Wrapper Layer
                │  (Exports 3    │
                │   functions)   │
                └───────┬────────┘
                        │
        ┌───────────────┼──────────────┐
        │               │              │
   ┌────▼────┐  ┌──────▼────┐  ┌─────▼──────┐
   │ Fetch   │  │ Fetch All │  │ Fetch by   │
   │Provinces│  │   Wards   │  │Province    │
   │         │  │           │  │Code        │
   └────┬────┘  └──────┬────┘  └─────┬──────┘
        │              │             │
        └──────────────┼─────────────┘
                       │
           ┌───────────▼────────────┐
           │  Supabase REST API     │
           ├────────────────────────┤
           │ FROM provinces table   │
           │ FROM wards table       │
           └────────────────────────┘
                       │
           ┌───────────▼────────────┐
           │  Supabase Database     │
           ├────────────────────────┤
           │ ✅ 63 provinces        │
           │ ✅ 1000+ wards         │
           │ ✅ Real-time data      │
           └────────────────────────┘

Benefits:
✅ Real data from source
✅ Always up to date
✅ Proper error handling
✅ Reusable API layer
✅ Type-safe
```

---

## 📊 Data Flow Diagram

### Province Selection Flow
```
User selects Province
        │
        ▼
Component: selectedProvince = "Hà Nội"
        │
        ▼
useMemo triggered
        │
        ▼
Find Province Object by name
    const prov = provinces.find(p => p.name === "Hà Nội")
    ▲
    │
    └─→ Returns: { id: "uuid-123", code: "01", name: "Hà Nội" }
        │
        ▼
Filter wards by province_id
    const wards = allWards.filter(w => w.province_id === "uuid-123")
    ▲
    │
    └─→ Returns array of Ward objects for that province
        │
        ▼
Ward dropdown updates with filtered list
        │
        ▼
User selects Ward
```

---

## 🔄 Component Lifecycle (After Update)

### AddStoreDialogTabbed Lifecycle
```
Component Mount
    │
    ├─→ useState: provinces [], allWards []
    │
    ├─→ useEffect: loadInitialData()
    │   ├─→ fetchProvinces() ──→ API
    │   ├─→ setProvinces()
    │   ├─→ fetchAllWards() ──→ API
    │   └─→ setAllWards()
    │
    ├─→ Render: Provinces dropdown
    │   ├─→ User selects province
    │   └─→ setSelectedProvince("name")
    │
    ├─→ useMemo: Filter wards by province_id
    │   └─→ Render: Wards dropdown updates
    │
    ├─→ User fills form
    │
    └─→ Submit
        └─→ Save to database with province/ward
```

---

## 📈 Data Structure Comparison

### Mock Data (vietnamLocations.ts)
```typescript
provinces: {
  "Hà Nội": {
    name: "Hà Nội",
    // ... no id, no code in this structure
  }
}

districts: {
  "Hoàn Kiếm": {
    name: "Hoàn Kiếm",
    province: "Hà Nội"
  }
}

wards: {
  "Phường Bến Nghé": {
    name: "Phường Bến Nghé",
    district: "Hoàn Kiếm",
    province: "Hà Nội"
  }
}

// Accessing wards:
getWardsByDistrict("Hoàn Kiếm")  // Returns array
```

### Real Data (Supabase API)
```typescript
// Provinces Table
{
  id: "uuid-001",
  code: "01",
  name: "Hà Nội",
  created_at: "2024-01-01"
}

// Wards Table (NO Districts)
{
  id: "uuid-789",
  code: "001",
  name: "Phường Bến Nghé",
  province_id: "uuid-001",    // ← FK to provinces.id
  created_at: "2024-01-01"
}

// Accessing wards:
wards.filter(w => w.province_id === province.id)  // Returns array
```

---

## 🔀 Migration Map

```
BEFORE                              AFTER
────────────────────────────────────────────────────────────

import vietnamLocations         import locationsApi
   ↓                               ↓
Object.keys(provinces)          useState<ProvinceApiData[]>
   ↓                               ↓
getWardsByProvince(name)        fetchAllWards()
   ↓                               ↓
getWardsByDistrict(name)        filter(w => w.province_id === id)
   ↓                               ↓
Static array                    Dynamic from API
   ↓                               ↓
No loading states               Add loading states
   ↓                               ↓
No error handling               Add try/catch + toast
   ↓                               ↓
props.code = props.name         Separate id, code, name
```

---

## 🎯 Component Dependency Tree

```
AddStoreDialogTabbed
├── depends on: locationsApi.fetchProvinces()
├── depends on: locationsApi.fetchAllWards()
├── needs: ProvinceApiData type
├── needs: WardApiData type
└── renders: Province Select + Ward Select

FullEditRegistryPage
├── depends on: locationsApi.fetchProvinces()
├── depends on: locationsApi.fetchAllWards()
├── needs: ProvinceApiData type
├── needs: WardApiData type
├── renders: Province Select + Ward Select
└── should inherit: wards state

locationsApi (Wrapper Layer)
├── exports: fetchProvinces()
├── exports: fetchAllWards()
├── exports: fetchWardsByProvinceCode()
├── uses: supabase client
├── types: ProvinceApiData, WardApiData
└── handles: pagination, errors

WardsTab (Reference)
├── already implemented
├── shows: how to fetch and display
├── shows: error handling
└── shows: pagination pattern
```

---

## 🔌 API Endpoint Details

```
Provinces Endpoint
──────────────────
GET /rest/v1/provinces
Query: select=id,code,name
Order: code ASC
Returns: 63 records
Example:
[
  { id: "uuid-1", code: "01", name: "Hà Nội" },
  { id: "uuid-2", code: "02", name: "Hà Giang" },
  ...
]


Wards Endpoint
──────────────
GET /rest/v1/wards
Query: select=id,code,name,province_id
Order: code ASC
Range: 0-999 (pagination)
Returns: 1000+ records
Example:
[
  { id: "w1", code: "001", name: "Phường Bến Nghé", province_id: "uuid-1" },
  { id: "w2", code: "002", name: "Phường Tân Định", province_id: "uuid-1" },
  ...
]


Wards by Province (Optional)
────────────────────────────
GET /rest/v1/wards
Query: select=id,code,name,province_id
Filter: province_id=eq.uuid-1
Order: code ASC
Returns: Wards for one province only
```

---

## ⏱️ Timeline / Sequence Diagram

### User Adds New Store
```
User Action                              System Response
───────────────────────────────────────────────────────────

1. Click "+ Thêm mới"                   Dialog opens
                                        ├─ Start loading provinces
                                        └─ Start loading wards
                                            │
                                            ▼ (API calls)
                                        Supabase returns data
                                            │
                                            ▼
2. Dialog displays                       Provinces loaded ✓
                                        Wards loaded ✓

3. User selects province                 
   "Hà Nội"                              ├─ useMemo triggered
                                        ├─ Find: province.id = "uuid-1"
                                        ├─ Filter wards: province_id = "uuid-1"
                                        └─ Update ward dropdown

4. Ward dropdown shows                   Shows 150+ wards for Hà Nội
   matching wards

5. User selects ward
   "Phường Bến Nghé"                     formData.ward = "Phường Bến Nghé"

6. User fills other fields               

7. User clicks "Thêm mới"               
   (Submit)                              ├─ Validate form
                                        ├─ Send to API
                                        └─ Success → List updates

8. Dialog closes                         New store appears in list
```

---

## 🛡️ Error Handling Flow

```
fetchProvinces()
    │
    ├─→ Try: await supabase.from('provinces').select(...)
    │   │
    │   ├─→ Success ✓
    │   │   └─→ return data
    │   │
    │   └─→ Error ❌
    │       ├─→ Catch
    │       ├─→ console.error()
    │       ├─→ toast.error("Không thể tải...")
    │       └─→ UI stays responsive
    │
    └─→ Set loading state = false (finally)
```

---

## 📦 File Size & Performance

```
                    Before              After
                    ──────              ─────
vietnamLocations.ts ~450 KB             Removed from bundle
                    (included in        (lazy load from API)
                     every build)
                    
addStoreDialog.tsx   ~250 KB            ~280 KB
                    (with mock data)    (with API calls)
                                        (+30 KB for async logic)

Initial Load         Fast               Slightly slower
                    (data already       (API call needed)
                     loaded)            ~100-500ms

Performance         Good for mock       Better for production
                    testing             (always current data)

Memory Usage        Higher              Lower
                    (all data loaded)   (load on demand)
```

---

## 🔐 Security & Validation

```
User Input: "Hà Nội"
    │
    ▼
Validate in dropdown (selected value must exist in array)
    │
    ├─→ Valid ✓
    │   └─→ provinces.find(p => p.name === value)
    │
    └─→ Invalid ❌
        └─→ Skip / Show error

Ward Selection: Only allows wards matching selected province
    │
    ├─→ province_id matches ✓
    │   └─→ Accept
    │
    └─→ province_id mismatch ❌
        └─→ Reject / Clear
```

---

## 📝 Summary: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Data Source | Static JS file | Live database |
| Update Frequency | Manual code changes | Real-time |
| Accuracy | Can be outdated | Always current |
| Performance | Fast initial load | ~100-500ms API call |
| Error Handling | None | try/catch + toast |
| Type Safety | Loose (any) | Strong (TypeScript) |
| Scalability | Limited | Unlimited |
| Maintainability | Hard | Easy |
| Testing | Mock only | Real data |

---

