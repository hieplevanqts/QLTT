# Implementation Checklist - Provinces & Wards API Integration

## 📋 Pre-Implementation Review

- [ ] Read `IMPLEMENTATION_SUMMARY.md` (5 min)
- [ ] Review `REGISTRY_API_INTEGRATION_PLAN.md` (10 min)
- [ ] Open `LocationsTab.tsx` as reference (working example)
- [ ] Understand data structure differences
- [ ] Have `locationsApi.ts` open for reference

---

## 🔧 Phase 1: AddStoreDialogTabbed.tsx

### Setup
- [ ] Open `src/ui-kit/AddStoreDialogTabbed.tsx`
- [ ] Keep `src/pages/LocationsTab.tsx` open as reference
- [ ] Keep `src/utils/api/locationsApi.ts` open for API functions

### Code Changes
- [ ] Remove import: `import { provinces, getWardsByProvince } from '../data/vietnamLocations';`
- [ ] Add import: `import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';`
- [ ] Add import: `import { useEffect } from 'react';` (if not present)
- [ ] Add import: `import { toast } from 'sonner';` (if not present)

### State Management
- [ ] Change `const [selectedProvince, setSelectedProvince] = useState('');` line
- [ ] Add after it:
  ```typescript
  const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
  const [allWards, setAllWards] = useState<WardApiData[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  ```

### Fetch Logic
- [ ] Find where component initializes (after state declarations)
- [ ] Add useEffect:
  ```typescript
  useEffect(() => {
    loadInitialData();
  }, []);
  ```
- [ ] Add function:
  ```typescript
  const loadInitialData = async () => {
    try {
      setLoadingProvinces(true);
      const prov = await fetchProvinces();
      setProvinces(prov);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingProvinces(false);
    }

    try {
      setLoadingWards(true);
      const w = await fetchAllWards();
      setAllWards(w);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingWards(false);
    }
  };
  ```

### Ward Filtering Logic
- [ ] Find the `const wards = useMemo(...)` around line 160
- [ ] Replace with:
  ```typescript
  const wards = useMemo(() => {
    if (!selectedProvince || !allWards.length) return [];
    
    const provinceData = provinces.find(p => p.name === selectedProvince);
    if (!provinceData) return [];
    
    return allWards.filter(w => w.province_id === provinceData.id);
  }, [selectedProvince, allWards, provinces]);
  ```

### UI Rendering
- [ ] Find province select/dropdown rendering (around line 932)
- [ ] Replace `Object.values(provinces).map(...)` with `provinces.map(...)`
- [ ] Ensure key is `prov.id` instead of `prov.name`
- [ ] Ensure value is `prov.name`
- [ ] Find ward select/dropdown rendering
- [ ] Ensure it maps over `wards` variable

### Add Loading States (Optional but Recommended)
- [ ] Add loading indicator while fetching provinces
- [ ] Add loading indicator while fetching wards
- [ ] Example: `{loadingProvinces && <Spinner />}`

---

## ✅ Testing - AddStoreDialogTabbed

### Before Saving
- [ ] Run TypeScript check: `npm run build` or check for errors
- [ ] No red squiggly lines in editor
- [ ] No missing imports

### After Saving - Manual Testing
- [ ] Open browser DevTools (F12)
- [ ] Go to Stores List page
- [ ] Click "+ Thêm mới" button
- [ ] Dialog opens without errors
- [ ] Province dropdown shows data (should show ~63 items)
- [ ] Console has no error messages
- [ ] Select a province from dropdown
- [ ] Ward dropdown populates with matching wards
- [ ] Can enter other form fields
- [ ] Can submit form
- [ ] New store appears in list
- [ ] Refresh page - new store still there

### If Errors Occur
- [ ] Check browser console (F12) for error messages
- [ ] Check if `fetchProvinces()` or `fetchAllWards()` throws error
- [ ] Verify Supabase connection works
- [ ] Check `LocationsTab.tsx` for comparison

---

## 🔧 Phase 2: FullEditRegistryPage.tsx

### Setup
- [ ] Open `src/pages/FullEditRegistryPage.tsx`
- [ ] Keep `src/pages/LocationsTab.tsx` open as reference
- [ ] Keep `src/utils/api/locationsApi.ts` open

### Code Changes - Step 1: Imports
- [ ] Find line 20: `import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';`
- [ ] Replace with: `import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';`
- [ ] Remove unused imports: `getDistrictsByProvince`, `getWardsByDistrict` (if not used elsewhere)

### Code Changes - Step 2: Remove Mock Transform
- [ ] Find lines 27-30:
  ```typescript
  const provinceList = Object.values(provinces).map(p => ({
    ...p,
    code: p.name
  }));
  ```
- [ ] Delete these lines (no longer needed)

### State Management
- [ ] Find: `const [wards, setWards] = useState<any[]>([]);`
- [ ] Add before or after it:
  ```typescript
  const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
  const [allWards, setAllWards] = useState<WardApiData[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  ```

### Load Initial Data
- [ ] Find useEffect for loading store data (around line 130)
- [ ] Add new useEffect:
  ```typescript
  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      setLoadingProvinces(true);
      const prov = await fetchProvinces();
      setProvinces(prov);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingProvinces(false);
    }

    try {
      setLoadingWards(true);
      const w = await fetchAllWards();
      setAllWards(w);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingWards(false);
    }
  };
  ```

### Handle Province Change
- [ ] Find the handler for province change
- [ ] Replace old logic with:
  ```typescript
  const handleProvinceChange = (provinceName: string) => {
    setFormData(prev => ({
      ...prev,
      province: provinceName,
      ward: '',
    }));

    const provinceData = provinces.find(p => p.name === provinceName);
    if (!provinceData) {
      setWards([]);
      return;
    }

    const filteredWards = allWards.filter(w => w.province_id === provinceData.id);
    setWards(filteredWards);
  };
  ```

### Update Province Select
- [ ] Find province select/dropdown rendering
- [ ] Remove: `Object.values(provinces).map(...)`
- [ ] Replace with: `provinces.map(prov => (...))`
- [ ] Update key: `prov.id`
- [ ] Update value: `prov.name`

### Load Initial Ward
- [ ] Find where wards are loaded initially (around line 158-159)
- [ ] Replace old logic:
  ```typescript
  // OLD
  const wardList = getWardsByDistrict(store.jurisdictionCode);
  setWards(wardList.map(w => ({ ...w, code: w.name })));
  
  // NEW
  if (store?.province) {
    handleProvinceChange(store.province);
  }
  ```

### Delete Old Logic
- [ ] Remove: `getDistrictsByProvince` calls (around line 225-231)
- [ ] Remove: `getWardsByDistrict` calls
- [ ] Remove: Any district-related state or logic

### Update Ward Dropdown
- [ ] Find ward rendering in JSX
- [ ] Verify it maps over `wards`
- [ ] Verify it uses correct properties from ward object

---

## ✅ Testing - FullEditRegistryPage

### Before Saving
- [ ] Run TypeScript check
- [ ] No console errors in IDE

### After Saving - Manual Testing
- [ ] Go to a store that has province/ward set
- [ ] Click to edit it (or go to `/registry/full-edit/123`)
- [ ] Page loads without errors
- [ ] Existing province shows in dropdown
- [ ] Existing ward shows in dropdown
- [ ] Can change province
- [ ] Ward dropdown updates when province changes
- [ ] Can select new ward
- [ ] Can save changes
- [ ] Changes persist after refresh

### If Errors Occur
- [ ] Check if `handleProvinceChange` is called correctly
- [ ] Verify wards have correct `province_id` matching province `id`
- [ ] Check console for specific error messages

---

## 🔧 Phase 3: EditRegistryPage.tsx

### Quick Changes
- [ ] Open `src/pages/EditRegistryPage.tsx`
- [ ] Similar changes to FullEditRegistryPage.tsx
- [ ] Update imports (line 20)
- [ ] Add state management
- [ ] Add fetch logic
- [ ] Update select rendering

### Testing
- [ ] Quick edit a store
- [ ] Verify provinces load
- [ ] Verify can change province/ward
- [ ] Save successfully

---

## ✅ Final Verification Checklist

### All Components Working
- [ ] AddStoreDialogTabbed: Can add new store with province/ward
- [ ] FullEditRegistryPage: Can edit store with province/ward
- [ ] EditRegistryPage: Quick edit works
- [ ] No console errors
- [ ] Data persists after refresh

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No freezing when selecting province
- [ ] Wards load smoothly

### Error Handling
- [ ] If API fails, shows error toast
- [ ] Gracefully handles network errors
- [ ] UI doesn't crash on error

### Data Quality
- [ ] Provinces show correct ~63 items
- [ ] Wards filter correctly by province
- [ ] No duplicate data
- [ ] No missing wards

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Verify import path is correct:
```typescript
import { fetchProvinces } from '../utils/api/locationsApi';
```

### Issue: Wards dropdown empty
**Solution**: Debug in browser console:
```javascript
console.log('Selected province:', selectedProvince);
console.log('Province data:', provinces.find(p => p.name === selectedProvince));
console.log('All wards:', allWards.length);
console.log('Filtered wards:', wards);
```

### Issue: TypeScript errors about props
**Solution**: Add type annotations:
```typescript
const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
```

### Issue: API call hangs or times out
**Solution**: Check Supabase connection:
- Verify `.env` has correct SUPABASE_URL and SUPABASE_ANON_KEY
- Test API call in separate file
- Check browser network tab (F12 → Network)

### Issue: Old mock data still showing
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Verify import was removed completely
- Search file for "vietnamLocations" to find any remaining uses

---

## 📊 Progress Tracking

Use this to track your progress:

- [ ] **Day 1 Morning**: Read documentation (30 min)
- [ ] **Day 1 Morning**: Implement AddStoreDialogTabbed (45 min)
- [ ] **Day 1 Afternoon**: Test AddStoreDialogTabbed (30 min)
- [ ] **Day 1 Afternoon**: Implement FullEditRegistryPage (60 min)
- [ ] **Day 2 Morning**: Test FullEditRegistryPage (30 min)
- [ ] **Day 2 Morning**: Implement EditRegistryPage (30 min)
- [ ] **Day 2 Afternoon**: Final testing all components (60 min)
- [ ] **Day 2 Afternoon**: Deploy and verify

**Total Time: ~5-6 hours**

---

## 📞 When to Check Reference

- **See working example**: Open `LocationsTab.tsx` lines 69-103
- **Check API functions**: Open `locationsApi.ts` lines 1-50
- **See type definitions**: Open `locationsApi.ts` lines 6-16
- **Check error handling**: Open `LocationsTab.tsx` lines 90-106
- **Check ward filtering**: Open `WardsTab.tsx` lines 155-165

---

## ✨ After Completion

Once all components are updated:

1. ✅ Create test account
2. ✅ Test full workflow: Add → Edit → Delete
3. ✅ Verify data in Supabase
4. ✅ Check performance metrics
5. ✅ Update project documentation
6. ✅ Brief team on changes
7. ✅ Monitor for issues in production

---

**Estimated Total Time**: 2-3 hours  
**Difficulty Level**: Medium  
**Risk Level**: Low (changes are isolated to 3 components)

