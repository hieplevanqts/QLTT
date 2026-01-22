# Code Migration Guide - From Mock to Real API

## 🎯 AddStoreDialogTabbed.tsx Migration

### BEFORE (Current - Mock Data)
```typescript
import { provinces, getWardsByProvince } from '../data/vietnamLocations';

export function AddStoreDialogTabbed({ open, onOpenChange, onSubmit }: AddStoreDialogTabbedProps) {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Get wards directly from province (no district)
  const wards = useMemo(() => {
    return selectedProvince ? getWardsByProvince(selectedProvince) : [];
  }, [selectedProvince]);

  // ... render
  {Object.values(provinces).map((prov) => (
    <SelectItem key={prov.name} value={prov.name}>
      {prov.name}
    </SelectItem>
  ))}
}
```

### AFTER (New - Real API)
```typescript
import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';

export function AddStoreDialogTabbed({ open, onOpenChange, onSubmit }: AddStoreDialogTabbedProps) {
  // API Data
  const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
  const [allWards, setAllWards] = useState<WardApiData[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Selected values
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Fetch provinces and wards on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingProvinces(true);
      const provincesData = await fetchProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingProvinces(false);
    }

    try {
      setLoadingWards(true);
      const wardsData = await fetchAllWards();
      setAllWards(wardsData);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingWards(false);
    }
  };

  // Get wards for selected province
  const wards = useMemo(() => {
    if (!selectedProvince || !allWards.length) return [];
    
    // Find province by name
    const provinceData = provinces.find(p => p.name === selectedProvince);
    if (!provinceData) return [];
    
    // Filter wards by province_id
    return allWards.filter(w => w.province_id === provinceData.id);
  }, [selectedProvince, allWards, provinces]);

  // ... render
  {provinces.map((prov) => (
    <SelectItem key={prov.id} value={prov.name}>
      {prov.name}
    </SelectItem>
  ))}
}
```

---

## 🎯 FullEditRegistryPage.tsx Migration

### BEFORE (Current - Mock Data)
```typescript
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';

export default function FullEditRegistryPage() {
  const [wards, setWards] = useState<any[]>([]);

  // Transform provinces object to array for usage in component
  const provinceList = Object.values(provinces).map(p => ({
    ...p,
    code: p.name
  }));

  useEffect(() => {
    if (store) {
      // Load wards by district (mock)
      const wardList = getWardsByDistrict(store.jurisdictionCode);
      setWards(wardList.map(w => ({ ...w, code: w.name })));
    }
  }, [store?.id, selectedProvince]);

  const handleProvinceChange = (provinceName: string) => {
    setFormData(prev => ({
      ...prev,
      province: provinceName,
      ward: '',
    }));

    // Get all wards from all districts in this province
    const allWards: any[] = [];
    const provinceDistricts = getDistrictsByProvince(provinceName);
    provinceDistricts.forEach(district => {
      const wardList = getWardsByDistrict(district.name);
      allWards.push(...wardList);
    });
    setWards(allWards.map(w => ({ ...w, code: w.name })));
  };
}
```

### AFTER (New - Real API)
```typescript
import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';

export default function FullEditRegistryPage() {
  // API Data
  const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
  const [allWards, setAllWards] = useState<WardApiData[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Selected values
  const [wards, setWards] = useState<WardApiData[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingProvinces(true);
      const provincesData = await fetchProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingProvinces(false);
    }

    try {
      setLoadingWards(true);
      const wardsData = await fetchAllWards();
      setAllWards(wardsData);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingWards(false);
    }
  };

  // Load wards when store or province changes
  useEffect(() => {
    if (store?.province) {
      handleProvinceChange(store.province);
    }
  }, [store?.id]);

  const handleProvinceChange = (provinceName: string) => {
    setFormData(prev => ({
      ...prev,
      province: provinceName,
      ward: '',
    }));

    // Find province by name
    const provinceData = provinces.find(p => p.name === provinceName);
    if (!provinceData) {
      setWards([]);
      return;
    }

    // Filter wards by province_id
    const filteredWards = allWards.filter(w => w.province_id === provinceData.id);
    setWards(filteredWards);
  };

  // Use provinces directly now (already array)
  {provinces.map((province) => (
    <SelectItem key={province.id} value={province.name}>
      {province.name}
    </SelectItem>
  ))}
}
```

---

## 📊 Key Differences

| Aspect | Before (Mock) | After (API) |
|--------|--------------|-----------|
| **Data Type** | Object with hierarchy | Array of objects |
| **Province** | `.name` as key | `.id` (UUID) and `.name` |
| **Ward Filter** | By district name | By `province_id` |
| **Hierarchy** | Province → District → Ward | Province → Ward |
| **Loading** | Instant | Async with loading states |
| **Real Data** | ❌ Mock only | ✅ Actual Supabase data |

---

## 🔧 Implementation Steps

### Step 1: Update Imports
```typescript
// Remove
- import { provinces, getWardsByProvince, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';

// Add
+ import { fetchProvinces, fetchAllWards, type ProvinceApiData, type WardApiData } from '../utils/api/locationsApi';
+ import { toast } from 'sonner';
```

### Step 2: Add State Variables
```typescript
const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
const [allWards, setAllWards] = useState<WardApiData[]>([]);
const [loadingProvinces, setLoadingProvinces] = useState(false);
const [loadingWards, setLoadingWards] = useState(false);
```

### Step 3: Add useEffect for Data Fetching
```typescript
useEffect(() => {
  loadInitialData();
}, []);

const loadInitialData = async () => {
  // Fetch provinces
  // Fetch wards
};
```

### Step 4: Update Ward Filtering
```typescript
const wards = useMemo(() => {
  if (!selectedProvince || !allWards.length) return [];
  
  const provinceData = provinces.find(p => p.name === selectedProvince);
  if (!provinceData) return [];
  
  return allWards.filter(w => w.province_id === provinceData.id);
}, [selectedProvince, allWards, provinces]);
```

### Step 5: Update Select Rendering
```typescript
// Before
{Object.values(provinces).map((prov) => (...))}

// After
{provinces.map((prov) => (...))}
```

---

## ✅ Testing Checklist After Migration

For **AddStoreDialogTabbed.tsx**:
- [ ] Modal opens and provinces load without districts
- [ ] Province dropdown shows real province names from API
- [ ] Selecting a province loads correct wards
- [ ] Ward dropdown filters by selected province
- [ ] Form submission with selected province/ward works
- [ ] Error toast shows if API fails
- [ ] Loading states display correctly

For **FullEditRegistryPage.tsx**:
- [ ] Page loads and fetches provinces
- [ ] Existing store's province/ward loads correctly
- [ ] Changing province updates ward dropdown
- [ ] Can save with new province/ward
- [ ] All fields remain correct after API call

---

## 🐛 Common Issues & Solutions

### Issue: `property does not exist on type '{}'`
**Cause**: TypeScript doesn't know shape of API data
**Solution**: Add type annotations:
```typescript
const [provinces, setProvinces] = useState<ProvinceApiData[]>([]);
```

### Issue: Ward dropdown empty after selecting province
**Cause**: `province_id` mismatch or incorrect filtering
**Solution**: Debug:
```typescript
console.log('Selected Province:', selectedProvince);
console.log('Province Data:', provinces.find(p => p.name === selectedProvince));
console.log('All Wards Count:', allWards.length);
console.log('Filtered Wards:', wards);
```

### Issue: Form submission fails with province/ward
**Cause**: API returns UUID, form expects name
**Solution**: Store both in formData:
```typescript
const formData = {
  province: selectedProvince,        // Name for display
  province_id: provinceData?.id,    // ID for API
  ward: selectedWard,                // Name
  ward_id: wardData?.id,            // ID
}
```

---

## 📚 Reference Files

**Real Implementation Examples**:
- `LocationsTab.tsx` - ✅ Full working example
- `WardsTab.tsx` - ✅ Full working example
- `locationsApi.ts` - ✅ API wrapper functions

**Old Mock Data** (for fallback):
- `vietnamLocations.ts` - Keep for fallback
- `mockStores.ts` - References provinces

