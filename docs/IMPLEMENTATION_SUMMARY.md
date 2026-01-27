# Summary: Provinces & Wards API Integration

## 📌 Executive Summary

You have two Supabase REST APIs available for provinces and wards:
- **Provinces API**: Returns ~63 provinces with `id`, `code`, `name`
- **Wards API**: Returns ~1000+ wards with `id`, `code`, `name`, `province_id`

**Current Status**: 
- ✅ APIs exist and are working
- ✅ Wrapper functions already built (`locationsApi.ts`)
- ✅ Many admin pages already use the real APIs
- 🔴 **Registry add/edit pages still use mock data** (vietnamLocations.ts)

---

## 🎯 What Needs to be Done

### HIGH PRIORITY - Critical User Flows
1. **AddStoreDialogTabbed.tsx** (Add new store dialog)
   - Replace mock `provinces` and `getWardsByProvince()` with API calls
   - Add loading states and error handling
   - Estimated time: **30-45 minutes**

2. **FullEditRegistryPage.tsx** (Full edit page `/registry/full-edit/:id`)
   - Replace mock provinces and districts with API calls
   - Simplify logic (no districts in API)
   - Estimated time: **45-60 minutes**

### MEDIUM PRIORITY - Secondary Flows
3. **EditRegistryPage.tsx** (Quick edit)
   - Same pattern as above
   - Estimated time: **20-30 minutes**

### LOW PRIORITY - Display Components
4. **Step4AddressMap.tsx**, **Step5Confirmation.tsx**, etc.
   - These receive data as props, just need parent components updated
   - Estimated time: **5-10 minutes each**

---

## 📊 Files to Modify

### DIRECT MODIFICATIONS NEEDED

| File | Location | Changes | Time |
|------|----------|---------|------|
| AddStoreDialogTabbed.tsx | `src/ui-kit/` | Import API, fetch data, update logic | 30-45 min |
| FullEditRegistryPage.tsx | `src/pages/` | Import API, fetch data, update logic | 45-60 min |
| EditRegistryPage.tsx | `src/pages/` | Import API, update references | 20-30 min |

### NO CHANGES NEEDED (Already working)

| File | Location | Status |
|------|----------|--------|
| locationsApi.ts | `src/utils/api/` | ✅ API wrapper ready |
| LocationsTab.tsx | `src/pages/` | ✅ Full implementation example |
| WardsTab.tsx | `src/pages/` | ✅ Full implementation example |

---

## 🔧 Quick Implementation Template

Copy this pattern for each component:

```typescript
// 1. IMPORT
import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';

// 2. STATE
const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
const [allWards, setAllWards] = useState<WardApiData[]>([]);
const [loadingProvinces, setLoadingProvinces] = useState(false);
const [loadingWards, setLoadingWards] = useState(false);

// 3. FETCH ON MOUNT
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const prov = await fetchProvinces();
    setProvinces(prov);
  } catch (error) {
    toast.error('Không thể tải tỉnh/thành phố');
  }
  
  try {
    const wards = await fetchAllWards();
    setAllWards(wards);
  } catch (error) {
    toast.error('Không thể tải phường/xã');
  }
};

// 4. FILTER WARDS BY PROVINCE
const filteredWards = useMemo(() => {
  if (!selectedProvince || !allWards.length) return [];
  
  const prov = provinces.find(p => p.name === selectedProvince);
  if (!prov) return [];
  
  return allWards.filter(w => w.province_id === prov.id);
}, [selectedProvince, allWards, provinces]);

// 5. RENDER DROPDOWNS
{provinces.map(prov => (
  <option key={prov.id} value={prov.name}>{prov.name}</option>
))}

{filteredWards.map(ward => (
  <option key={ward.id} value={ward.name}>{ward.name}</option>
))}
```

---

## 📚 Reference Documentation

I've created comprehensive guides:

1. **REGISTRY_API_INTEGRATION_PLAN.md** ← START HERE
   - Overview of what needs to be done
   - Data structure differences
   - Implementation steps

2. **CURRENT_API_USAGE_REFERENCE.md**
   - Where each component currently gets data
   - Which pages already use real APIs
   - Quick reference table

3. **CODE_MIGRATION_GUIDE.md**
   - Before/after code examples
   - Step-by-step migration instructions
   - Common issues & solutions
   - Testing checklist

4. **COMPLETE_LOCATIONS_AUDIT.md**
   - File-by-file breakdown with line numbers
   - Exactly what needs to change where
   - Implementation strategy
   - Testing plan

All files are in: `/docs/`

---

## 🚀 Quick Start (10 minutes to understand)

### Step 1: Look at a working example
Open: `src/pages/LocationsTab.tsx`
- Lines 69-103: How to fetch provinces
- Lines 111-168: How to fetch wards
- This is your reference implementation

### Step 2: Check the API wrapper
Open: `src/utils/api/locationsApi.ts`
- `fetchProvinces()` - Ready to use ✅
- `fetchAllWards()` - Ready to use ✅
- Already handles pagination and error handling

### Step 3: See what needs updating
Open: `src/ui-kit/AddStoreDialogTabbed.tsx`
- Line 59-60: Old import to replace
- Line 160-162: Ward logic to update
- Line 932: Province loop to update

---

## ❓ Key Differences (Mock vs Real)

| Aspect | Mock (vietnamLocations.ts) | Real (Supabase API) |
|--------|----------|---------|
| **Structure** | Object with nested keys | Array of objects |
| **Province ID** | String (name) | UUID string |
| **Province Name** | `.name` property | `.name` property |
| **Ward filtering** | By district name | By `province_id` (UUID) |
| **Hierarchy** | 3-level (province→district→ward) | 2-level (province→ward) |
| **Data Loading** | Instant (imported) | Async (API call) |
| **Size** | ~300+ lines | Can fetch all at once |

---

## ✅ Success Criteria

After implementation, you should be able to:

1. ✅ Open "Add Store" dialog
2. ✅ See 63 provinces from database (not mock)
3. ✅ Select a province
4. ✅ See wards matching that province from database
5. ✅ Submit form and create new store
6. ✅ Edit existing stores with same flow
7. ✅ No console errors about missing fields
8. ✅ Performance is good (< 2 seconds to load)

---

## 🆘 Getting Help

If you get stuck:

1. **See live examples**: Look at `LocationsTab.tsx` or `WardsTab.tsx`
2. **Check detailed guide**: Read `CODE_MIGRATION_GUIDE.md` 
3. **Reference exact changes**: See `COMPLETE_LOCATIONS_AUDIT.md`
4. **Check API types**: Look at `locationsApi.ts` interfaces

---

## 📈 Implementation Order Recommendation

**Total estimated time: 2-3 hours**

1. **AddStoreDialogTabbed.tsx** (45 min)
   - Highest impact: affects all new store additions
   - Start here to get familiar with pattern

2. **FullEditRegistryPage.tsx** (60 min)
   - Critical for registry management
   - Most complex due to district logic removal

3. **EditRegistryPage.tsx** (30 min)
   - Quick win after previous two

4. **Optional: Step components** (15 min)
   - Low priority, can do later

5. **Test everything** (30 min)
   - Verify each flow works
   - Check loading states
   - Error handling

---

## 📞 Quick Reference

**API Functions**:
```typescript
import { fetchProvinces, fetchAllWards } from '../utils/api/locationsApi';

const provinces = await fetchProvinces();        // Array of 63 provinces
const wards = await fetchAllWards();            // Array of 1000+ wards
```

**Types**:
```typescript
type ProvinceApiData = { id: string; code: string; name: string; }
type WardApiData = { id: string; code: string; name: string; province_id: string; }
```

**Find matching wards**:
```typescript
const matchingWards = wards.filter(w => w.province_id === province.id);
```

---

## 🎓 Key Learnings

1. **API already works**: Supabase REST APIs are accessible and returning data correctly
2. **Wrapper exists**: `locationsApi.ts` handles all the complexity (pagination, error handling)
3. **Examples exist**: Multiple pages already use the pattern correctly
4. **Just need migration**: Swap mock data for real API calls in 3 main components
5. **No breaking changes**: Can do this gradually without affecting other parts

---

**Last Updated**: January 22, 2026
**Status**: Ready for implementation
**Difficulty**: Medium (requires understanding data structure changes)

