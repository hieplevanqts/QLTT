# Registry API Integration Plan - Provinces & Wards

## 📋 Current Situation

### APIs Available
- **Provinces**: `https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/provinces?select=_id%2Ccode%2Cname`
- **Wards**: `https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/wards?select=_id%2Ccode%2Cname%2Cprovince_id`

### Existing Implementation
Currently using **mock data** from `/src/data/vietnamLocations.ts`:
```typescript
// Mock hierarchical structure:
provinces -> districts -> wards
```

### API Wrapper Already Exists
File: `/src/utils/api/locationsApi.ts`
- ✅ `fetchProvinces()` - Fetches from Supabase provinces table
- ✅ `fetchAllWards()` - Fetches all wards with pagination
- ✅ `fetchWardsByProvinceCode(provinceCode)` - Fetches wards by province code

## 🎯 Pages That Need Integration

### 1. **FullEditRegistryPage.tsx** ⭐ HIGH PRIORITY
**Current Status**: Using mock data
```typescript
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';
```

**Issues**:
- Mock data structure has districts (not needed by API)
- No API calls to Supabase
- Hard-coded province/ward handling

**Changes Needed**:
- Replace mock provinces with `fetchProvinces()`
- Replace ward loading with `fetchAllWards()` or province-specific fetch
- Update state management for real data
- Remove district-based logic (API uses province_id directly)

---

### 2. **AddStoreDialogTabbed.tsx** ⭐ HIGH PRIORITY
**Current Status**: Using mock data
```typescript
import { provinces, getWardsByProvince } from '../data/vietnamLocations';
```

**Key Logic**:
```typescript
const [selectedProvince, setSelectedProvince] = useState('');
const wards = useMemo(() => {
  return selectedProvince ? getWardsByProvince(selectedProvince) : [];
}, [selectedProvince]);
```

**Issues**:
- Line 160-162: Uses mock `getWardsByProvince()`
- Line 932: Maps over mock provinces
- No API calls

**Changes Needed**:
- Fetch provinces on component mount
- Fetch wards based on selected province
- Handle loading/error states

---

### 3. **StoresListPage.tsx** - Uses AddStoreDialogTabbed
No direct changes needed (inherits from dialog component)

---

### 4. **Other Pages Already Using API** ✅
These pages already have proper implementations:
- ✅ `LocationsTab.tsx` - Full Supabase integration
- ✅ `WardsTab.tsx` - Full Supabase integration  
- ✅ `ProvincesTab.tsx` - Full Supabase integration
- ✅ `TerritoryTabNew.tsx` - Partial Supabase integration

---

## 🔄 Data Structure Mapping

### Current Mock Structure (vietnamLocations.ts)
```typescript
{
  name: string;           // "Hà Nội"
  code?: string;          // Optional
  province?: string;      // For wards
  district?: string;      // Intermediate level
}
```

### API Structure (Supabase)
```typescript
// Provinces
{
  id: string;             // UUID
  code: string;           // "01"
  name: string;           // "Hà Nội"
}

// Wards
{
  id: string;             // UUID
  code: string;           // "002"
  name: string;           // "Phường Bến Nghé"
  province_id: string;    // UUID (FK to provinces.id)
}
```

---

## 🛠️ Implementation Steps

### Step 1: Update AddStoreDialogTabbed.tsx
```typescript
// OLD (Mock)
import { provinces, getWardsByProvince } from '../data/vietnamLocations';

// NEW (API)
import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';
```

**Changes**:
1. Add state for API data:
   ```typescript
   const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
   const [allWards, setAllWards] = useState<WardApiData[]>([]);
   const [loadingProvinces, setLoadingProvinces] = useState(false);
   const [loadingWards, setLoadingWards] = useState(false);
   ```

2. Fetch on mount:
   ```typescript
   useEffect(() => {
     fetchProvincesData();
   }, []);

   const fetchProvincesData = async () => {
     try {
       setLoadingProvinces(true);
       const data = await fetchProvinces();
       setProvinces(data);
     } catch (error) {
       console.error('Error fetching provinces:', error);
       toast.error('Không thể tải danh sách tỉnh/thành phố');
     } finally {
       setLoadingProvinces(false);
     }
   };
   ```

3. Update ward filtering:
   ```typescript
   const wards = useMemo(() => {
     if (!selectedProvince || !allWards.length) return [];
     // Find province by name (since selectedProvince is province name)
     const provinceData = provinces.find(p => p.name === selectedProvince);
     if (!provinceData) return [];
     // Filter wards by province_id
     return allWards.filter(w => w.province_id === provinceData.id);
   }, [selectedProvince, allWards, provinces]);
   ```

4. Fetch all wards on mount:
   ```typescript
   useEffect(() => {
     fetchWardsData();
   }, []);

   const fetchWardsData = async () => {
     try {
       setLoadingWards(true);
       const data = await fetchAllWards();
       setAllWards(data);
     } catch (error) {
       console.error('Error fetching wards:', error);
       // Fallback to mock data or show error
     } finally {
       setLoadingWards(false);
     }
   };
   ```

---

### Step 2: Update FullEditRegistryPage.tsx
**Similar changes** to AddStoreDialogTabbed.tsx:
1. Replace mock provinces import
2. Add state for API data
3. Fetch on component mount
4. Update ward filtering logic
5. Handle initial data loading

---

### Step 3: Optional - Update Other Components
- `Step4AddressMap.tsx` - Uses same pattern
- `Step5Confirmation.tsx` - Uses same pattern
- Other address-related components

---

## ⚠️ Important Considerations

### Field Name Mismatches
- **Mock**: Uses `province` (name)
- **API**: Returns `id` (UUID) and requires `province_id` (UUID)
- **Solution**: Always match by ID, display by name

### Performance
- **All wards at once**: Simpler, but ~63 provinces × ~1000+ wards
- **Alternative**: Lazy-load wards per province
  ```typescript
  const fetchWardsByProvince = async (provinceId: string) => {
    // Fetch only wards for this province
    const filtered = allWards.filter(w => w.province_id === provinceId);
  };
  ```

### Backward Compatibility
The `locationsApi.ts` already handles both:
- `province_id` (snake_case - database field)
- `provinceId` (camelCase - if Supabase transforms)

---

## ✅ Testing Checklist

- [ ] Provinces load on component mount
- [ ] Province dropdown shows real data
- [ ] Ward dropdown populates after selecting province
- [ ] Can submit form with selected province/ward
- [ ] Edit existing store preserves province/ward
- [ ] Loading states show during API calls
- [ ] Error handling works properly
- [ ] Fallback to mock data if API fails (optional)

---

## 📝 Summary of Files to Modify

| File | Status | Priority | Changes |
|------|--------|----------|---------|
| `AddStoreDialogTabbed.tsx` | 🔴 Mock | HIGH | Import API, fetch data, update logic |
| `FullEditRegistryPage.tsx` | 🔴 Mock | HIGH | Import API, fetch data, update logic |
| `Step4AddressMap.tsx` | 🔴 Mock | MEDIUM | Update if used in registry |
| `Step5Confirmation.tsx` | 🟡 Mixed | MEDIUM | Verify compatibility |
| `locationsApi.ts` | ✅ Ready | - | No changes needed |
| `vietnamLocations.ts` | 🟡 Fallback | LOW | Keep as fallback |

---

## 🎓 Learning Resources

### How the API works
1. `fetchProvinces()` returns all ~63 provinces with `id` and `code`
2. `fetchAllWards()` returns all wards with `province_id` reference
3. To get wards for a province:
   - Either pre-fetch all and filter by `province_id`
   - Or call API with `.eq('province_id', provinceId)`

### Why remove districts?
- The REST API structure is: `provinces → wards` (2-level)
- Vietnam's administrative structure has: provinces → districts → wards (3-level)
- The API only provides 2-level mapping
- UI can show province → ward directly

