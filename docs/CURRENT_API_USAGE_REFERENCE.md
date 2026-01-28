# Current API Usage - Quick Reference

## 📊 Existing Implementation Matrix

### Pages Currently Using Mock Data (vietnamLocations.ts)
```typescript
import { provinces, getDistrictsByProvince, getWardsByDistrict, getWardsByProvince } from '../data/vietnamLocations';
```

**Files**:
- ✅ `EditRegistryPage.tsx` (line 20)
- ✅ `FullEditRegistryPage.tsx` (line 20)
- ✅ `StoresListPage.tsx` (line 47)
- ✅ `AddStoreDialogTabbed.tsx` (line 59)
- ✅ `Step4AddressMap.tsx` (impl)
- ✅ `Step5Confirmation.tsx` (impl)
- ✅ `Step4MapGeocoding.tsx` (impl)
- ✅ `AddStoreDialogTabbed.tsx` (line 59)

---

### Pages Currently Using Supabase API
```typescript
import { supabase } from '../lib/supabase';
// .from('provinces').select(...)
// .from('wards').select(...)
```

**Files with Full Implementation**:
- ✅ `LocationsTab.tsx` - **BEST REFERENCE** for Supabase integration
- ✅ `WardsTab.tsx` - Provinces + Wards
- ✅ `ProvincesTab.tsx` - Provinces only
- ✅ `TerritoryTabNew.tsx` - Partial implementation
- ✅ `AdminModal.tsx` - Provinces + Wards

**Files with Wrapper Functions**:
- ✅ `locationsApi.ts` - API wrapper layer
- ✅ `usernameValidator.ts` - Validates against Supabase

---

## 🔍 Detailed Location of Usages

### AddStoreDialogTabbed.tsx
**Mock usage**:
```typescript
// Line 59-60
import { provinces, getWardsByProvince } from '../data/vietnamLocations';

// Line 160-162: Ward computation
const wards = useMemo(() => {
  return selectedProvince ? getWardsByProvince(selectedProvince) : [];
}, [selectedProvince]);

// Line 932: Province dropdown rendering
{Object.values(provinces).map((prov) => (
  <SelectItem key={prov.name} value={prov.name}>
    {prov.name}
  </SelectItem>
))}
```

---

### FullEditRegistryPage.tsx
**Mock usage**:
```typescript
// Line 20: Mock import
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';

// Line 28: Transform to array
const provinceList = Object.values(provinces).map(p => ({
  ...p,
  code: p.name
}));

// Line 130: Ward state
const [wards, setWards] = useState<any[]>([]);

// Line 158-159: Load wards on store change
const wardList = getWardsByDistrict(store.jurisdictionCode);
setWards(wardList.map(w => ({ ...w, code: w.name })));

// Line 225-231: Get all wards from districts
const allWards: any[] = [];
const provinceDistricts = getDistrictsByProvince(store.province);
provinceDistricts.forEach(district => {
  const wardList = getWardsByDistrict(district.name);
  allWards.push(...wardList);
});
setWards(allWards.map(w => ({ ...w, code: w.name })));
```

---

### LocationsTab.tsx (✅ BEST REFERENCE)
**API usage** - Already has working implementation:
```typescript
// Fetch provinces
const { data, error } = await supabase
  .from('provinces')
  .select('*')
  .order('code', { ascending: true });

// Fetch wards with pagination
const { data: wardsData, error: wardsError } = await supabase
  .from('wards')
  .select(`
    *,
    provinces (
      id,
      code,
      name
    )
  `)
  .eq('provinceId', provinceId)
  .order('code', { ascending: true })
  .range(start, end);
```

---

### Step4AddressMap.tsx
**Mock usage** (similar pattern):
```typescript
// Receives as props:
interface Props {
  districts: any[];
  wards: any[];
  provinces: any[];
}

// Used to populate dropdowns
{provinces.map((province: any) => (...))}
{wards.map((ward: any) => (...))}
```

---

## 🎯 Summary Table

| Component | Current Source | Type | Needs Update |
|-----------|---|---|---|
| AddStoreDialogTabbed | vietnamLocations.ts | Mock | ⭐ HIGH |
| FullEditRegistryPage | vietnamLocations.ts | Mock | ⭐ HIGH |
| EditRegistryPage | vietnamLocations.ts | Mock | ⭐ MEDIUM |
| Step4AddressMap | vietnamLocations.ts (props) | Mock | ⭐ MEDIUM |
| LocationsTab | supabase direct | API | ✅ DONE |
| WardsTab | supabase direct | API | ✅ DONE |
| ProvincesTab | supabase direct | API | ✅ DONE |
| locationsApi.ts | wrapper | API | ✅ READY |

---

## 🚀 Quick Implementation Order

1. **First**: Update `AddStoreDialogTabbed.tsx` (affects all store additions)
2. **Second**: Update `FullEditRegistryPage.tsx` (affects full edit page)
3. **Third**: Update `EditRegistryPage.tsx` (affects quick edit)
4. **Fourth**: Update step components if needed (Step4AddressMap, etc.)

---

## 📋 Checklist for Each Component

When updating each component, verify:

- [ ] Import `locationsApi` instead of `vietnamLocations`
- [ ] Add loading states during API calls
- [ ] Add error handling with toast notifications
- [ ] Initialize data in `useEffect` on component mount
- [ ] Filter wards by `province_id` (not by district)
- [ ] Handle case where data is loading
- [ ] Test with actual Supabase data
- [ ] Maintain form state consistency
- [ ] Remove unused district handling

