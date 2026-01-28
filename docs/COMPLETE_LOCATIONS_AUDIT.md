# Complete Locations Audit - All Provinces & Wards Usage

## 📍 File-by-File Breakdown

### 1. ✅ AddStoreDialogTabbed.tsx
**Path**: `src/ui-kit/AddStoreDialogTabbed.tsx`
**Priority**: ⭐⭐⭐ CRITICAL
**Lines**: 59-60, 160-162, 932

**Current Code**:
```typescript
// Line 59-60
import { provinces, getWardsByProvince } from '../data/vietnamLocations';

// Line 160-162
const wards = useMemo(() => {
  return selectedProvince ? getWardsByProvince(selectedProvince) : [];
}, [selectedProvince]);

// Line 932
{Object.values(provinces).map((prov) => (
  <SelectItem key={prov.name} value={prov.name}>
    {prov.name}
  </SelectItem>
))}
```

**Status**: 🔴 Mock data only
**Impact**: Used in ALL store additions via Add button

---

### 2. ✅ FullEditRegistryPage.tsx
**Path**: `src/pages/FullEditRegistryPage.tsx`
**Priority**: ⭐⭐⭐ CRITICAL
**Lines**: 20, 28-30, 130, 158-159, 225-231, 243, 687

**Current Code**:
```typescript
// Line 20
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';

// Line 27-30 - Transform to array
const provinceList = Object.values(provinces).map(p => ({
  ...p,
  code: p.name
}));

// Line 130 - Ward state
const [wards, setWards] = useState<any[]>([]);

// Line 158-159 - Load wards initially
const wardList = getWardsByDistrict(store.jurisdictionCode);
setWards(wardList.map(w => ({ ...w, code: w.name })));

// Line 225-231 - Load all wards on province change
const allWards: any[] = [];
const provinceDistricts = getDistrictsByProvince(store.province);
provinceDistricts.forEach(district => {
  const wardList = getWardsByDistrict(district.name);
  allWards.push(...wardList);
});
setWards(allWards.map(w => ({ ...w, code: w.name })));

// Line 243 - Find ward
const ward = wards.find((w) => w.code === wardCode);

// Line 687 - Map wards
{wards.map((ward) => (...))}
```

**Status**: 🔴 Mock data, complex logic
**Impact**: Used in full edit page (`/registry/full-edit/:id`)

---

### 3. ✅ EditRegistryPage.tsx
**Path**: `src/pages/EditRegistryPage.tsx`
**Priority**: ⭐⭐ HIGH
**Lines**: 20

**Current Code**:
```typescript
// Line 20
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';
```

**Status**: 🟡 Uses mock, but secondary page
**Impact**: Quick edit page

---

### 4. ✅ Step4AddressMap.tsx
**Path**: `src/ui-kit/Step4AddressMap.tsx`
**Priority**: ⭐⭐ HIGH
**Lines**: 37-51, 124, 150, 255, 259, 384

**Current Code**:
```typescript
// Line 37-51 - Props interface
interface Step4Props {
  formData: any;
  setFormData: any;
  districts: any[];
  wards: any[];
  provinces: any[];
}

export function Step4AddressMap({
  formData,
  setFormData,
  districts,
  wards,
  provinces,
}: Step4Props) {
  
  // Line 124 - Render provinces
  {provinces.map((province: any) => (...))}
  
  // Line 150 - Render wards
  {wards.map((ward: any) => (...))}
  
  // Line 255 - Find ward name
  const wardName = wards.find((w: any) => w.code === formData.ward)?.name;
  
  // Line 259 - Find province name
  const provinceName = provinces.find((p: any) => p.code === formData.province)?.name;
  
  // Line 384 - Find ward name
  const wardName = wards.find((w: any) => w.code === formData.ward)?.name;
}
```

**Status**: 🟡 Receives as props, needs parent update
**Impact**: Address map component

---

### 5. ✅ Step5Confirmation.tsx
**Path**: `src/ui-kit/Step5Confirmation.tsx`
**Priority**: ⭐⭐ MEDIUM
**Lines**: 27-37

**Current Code**:
```typescript
// Line 27-37
interface Step5Props {
  formData: any;
  setFormData: any;
  wards: any[];
  districts: any[];
  provinces: any[];
}

export function Step5Confirmation({ formData, setFormData, wards, districts, provinces }: Step5Props) {
  const provinceName = provinces.find((p: any) => p.code === formData.province)?.name || '';
  const wardName = wards.find((w: any) => w.code === formData.ward)?.name || '';
}
```

**Status**: 🟡 Receives as props, read-only
**Impact**: Confirmation display

---

### 6. ✅ Step4MapGeocoding.tsx
**Path**: `src/ui-kit/Step4MapGeocoding.tsx`
**Priority**: ⭐⭐ MEDIUM
**Lines**: 35, 45, 70

**Current Code**:
```typescript
// Line 35, 45
wards: any[];
...
wards,

// Line 70
const wardName = wards.find((w: any) => w.code === formData.ward)?.name;
```

**Status**: 🟡 Receives as props
**Impact**: Map geocoding step

---

### 7. ✅ AddStoreDialog.tsx
**Path**: `src/ui-kit/AddStoreDialog.tsx`
**Priority**: ⭐⭐ MEDIUM (Older version)
**Status**: 🟡 Legacy, replaced by AddStoreDialogTabbed

---

## 📊 Pages Using Locations Data - Use Case Map

### Registry/Store Management Flow
```
StoresListPage
  ↓
  ├─→ AddStoreDialogTabbed (Add new store)
  │   └─ Uses: provinces, wards
  │
  ├─→ FullEditRegistryPage (Full edit /registry/full-edit/:id)
  │   └─ Uses: provinces, districts, wards
  │
  └─→ EditRegistryPage (Quick edit)
      └─ Uses: provinces, districts, wards
```

### Wizard Flow (Less used in Registry)
```
Step1BusinessInfo
  ↓
Step2OwnerInfo
  ↓
Step3Documents
  ↓
Step4AddressMap (Uses provinces, wards)
  ↓
Step5Confirmation (Uses provinces, wards)
```

---

## 🔍 API Integration Readiness

### Already Using Real API ✅
| Component | File | Status |
|-----------|------|--------|
| Provinces | `LocationsTab.tsx` | ✅ Complete |
| Wards | `LocationsTab.tsx` | ✅ Complete |
| Provinces | `WardsTab.tsx` | ✅ Complete |
| Wards | `WardsTab.tsx` | ✅ Complete |
| Provinces | `ProvincesTab.tsx` | ✅ Complete |
| Provinces | `TerritoryTabNew.tsx` | ✅ Partial |
| Wards | `TerritoryTabNew.tsx` | ✅ Partial |
| Provinces | `AdminModal.tsx` | ✅ Complete |
| Wards | `AdminModal.tsx` | ✅ Complete |
| WardModal | `components/WardModal.tsx` | ✅ Complete |
| LocalityModal | `components/LocalityModal.tsx` | ✅ Complete |

### Wrapper Functions Available ✅
| Function | File | Status |
|----------|------|--------|
| `fetchProvinces()` | `utils/api/locationsApi.ts` | ✅ Ready |
| `fetchAllWards()` | `utils/api/locationsApi.ts` | ✅ Ready |
| `fetchWardsByProvinceCode()` | `utils/api/locationsApi.ts` | ✅ Ready |

### Still Using Mock Data 🔴
| Component | File | Status | Priority |
|-----------|------|--------|----------|
| AddStoreDialogTabbed | `ui-kit/AddStoreDialogTabbed.tsx` | 🔴 Mock | ⭐⭐⭐ |
| FullEditRegistryPage | `pages/FullEditRegistryPage.tsx` | 🔴 Mock | ⭐⭐⭐ |
| EditRegistryPage | `pages/EditRegistryPage.tsx` | 🔴 Mock | ⭐⭐ |
| Step4AddressMap | `ui-kit/Step4AddressMap.tsx` | 🟡 Props | ⭐⭐ |
| Step5Confirmation | `ui-kit/Step5Confirmation.tsx` | 🟡 Props | ⭐ |
| Step4MapGeocoding | `ui-kit/Step4MapGeocoding.tsx` | 🟡 Props | ⭐ |

---

## 🎯 Implementation Strategy

### Phase 1: High Impact (1-2 hours)
1. **AddStoreDialogTabbed.tsx** - Affects all store additions
   - Replace mock imports with API wrapper
   - Add loading states
   - Update ward filtering logic

2. **FullEditRegistryPage.tsx** - Affects full edit page
   - Same changes as AddStoreDialogTabbed
   - Remove district logic
   - Handle initial province/ward load

### Phase 2: Medium Impact (30-60 mins)
3. **EditRegistryPage.tsx** - Quick edit page
   - Pass API data from parent if needed
   - Or apply same changes as FullEditRegistryPage

4. **Step4AddressMap.tsx** - Update data flow
   - Parent should provide real API data
   - Component stays as is (reads props)

### Phase 3: Low Impact (30 mins)
5. **Step5Confirmation.tsx** - Just display
6. **Step4MapGeocoding.tsx** - Just display

---

## 📋 Testing Plan

### Manual Testing Checklist

**After updating AddStoreDialogTabbed.tsx**:
- [ ] Click "+ Thêm mới" in Stores list
- [ ] Dialog opens without loading issues
- [ ] Provinces dropdown shows 63 provinces
- [ ] Select a province
- [ ] Wards dropdown loads (should filter by province_id)
- [ ] Enter other details
- [ ] Submit form
- [ ] New store appears in list

**After updating FullEditRegistryPage.tsx**:
- [ ] Go to `/registry/full-edit/123`
- [ ] Page loads existing data
- [ ] Provinces show correctly
- [ ] Wards match selected province
- [ ] Can change province/ward
- [ ] Save successfully

**After updating EditRegistryPage.tsx**:
- [ ] Click quick edit on a store
- [ ] Dialog shows with API data
- [ ] Changes work correctly

---

## 🔗 Reference Links

| Component | Location | Reference |
|-----------|----------|-----------|
| Working Example | `LocationsTab.tsx` | Lines 69-103 (fetchProvinces), 111-168 (fetchWardsByProvince) |
| API Wrapper | `locationsApi.ts` | Lines 1-168 (complete file) |
| Type Definitions | `locationsApi.ts` | Lines 6-16 (ProvinceApiData, WardApiData) |
| Usage Example | `WardsTab.tsx` | Lines 61-79 (fetchData function) |

---

## 📝 Notes

1. **Vietnam Administrative Structure**:
   - Database only has: Provinces → Wards (2-level)
   - Frontend mock has: Provinces → Districts → Wards (3-level)
   - Solution: Ignore districts, use province_id for filtering

2. **Field Name Mapping**:
   - Mock: `ward.code`, `province.name`
   - API: `ward.id`, `province.id`, both have `.name`
   - Keep using `.name` for display, use `.id` for relationships

3. **Performance**:
   - ~63 provinces × ~1000+ wards = pre-fetching all wards is fine
   - Alternative: lazy-load wards per province (more complex)

4. **Backward Compatibility**:
   - Keep `vietnamLocations.ts` as fallback
   - Current code won't break if we update carefully

