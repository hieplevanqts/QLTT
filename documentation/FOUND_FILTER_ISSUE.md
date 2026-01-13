# 🎯 FOUND THE ISSUE - Filter Mismatch!

**Date:** January 9, 2026  
**Issue:** 41 points loaded but 0 displayed  
**Root Cause:** Category value mismatch between data and filters  
**Status:** 🔍 DEBUGGING  

---

## 🔍 WHAT WE FOUND

```
✅ MapPage: Successfully loaded 41 map points
🗺️ LeafletMap: Updating markers...
📊 Total restaurants to render: 0  ← ALL FILTERED OUT!
✅ Valid restaurants with coordinates: 0
```

**Diagnosis:** Data is loaded but filtered out by category mismatch!

---

## 🐛 THE PROBLEM

### Filter Logic (MapPage.tsx Line 253-260):

```typescript
const filteredRestaurants = useMemo(() => {
  if (!restaurants || restaurants.length === 0) return [];
  
  return restaurants.filter((restaurant) => {
    // Filter by category
    const categoryMatch = filters[restaurant.category];  // ← PROBLEM HERE!
    
    if (!categoryMatch) return false;  // ← FILTERS OUT EVERYTHING!
    // ...
  });
}, [restaurants, filters, ...]);
```

### Filter Object (MapPage.tsx Line 32-37):

```typescript
const [filters, setFilters] = useState<CategoryFilter>({
  certified: true,   // ✅ All enabled by default
  hotspot: true,
  scheduled: true,
  inspected: true,
});
```

### Type Definition (MapPage.tsx Line 19-24):

```typescript
type CategoryFilter = {
  certified: boolean;
  hotspot: boolean;
  scheduled: boolean;
  inspected: boolean;
};
```

---

## ❌ WHY IT FAILS

The filter expects `restaurant.category` to be one of:
- `'certified'`
- `'hotspot'`
- `'scheduled'`
- `'inspected'`

**But the actual data might have different values!**

Possible actual values:
- `'pending'` ← Not in filters!
- `'violated'` ← Not in filters!
- `'other'` ← Not in filters!
- `null` or `undefined` ← Not in filters!
- Different string format ← Not in filters!

---

## 🔍 WHAT WE NEED TO CHECK

After **hard refresh (Ctrl+Shift+R 3x)**, look for these logs:

### **GROUP 1: Data Loading**
```
📦 MapPage: Raw data from fetchMapPoints: 41 points
📍 MapPage: First point after fetch: {
  id: "...",
  name: "...",
  category: "???",  ← CRITICAL - What is this value?
  type: "...",
  lat: 21.xxx,
  lng: 105.xxx
}
✅ MapPage: Successfully loaded 41 map points
```

### **GROUP 2: Filtering**
```
🔍 MapPage: Filtering restaurants...
📊 restaurants.length: 41
🎯 filters: { certified: true, hotspot: true, scheduled: true, inspected: true }
📍 First restaurant for filtering: {
  id: "...",
  name: "...",
  category: "???",  ← CRITICAL - What is this value?
  categoryType: "string"
}
🎯 filters[first.category]: true or false or undefined  ← CRITICAL!
📋 Unique categories in data: ["???", "???", ...]  ← CRITICAL!
📋 Filter keys: ["certified", "hotspot", "scheduled", "inspected"]
❌ First restaurant filtered out! category='???' not in filters  ← If this shows, we found it!
```

### **GROUP 3: Map Rendering**
```
🔍 Filtering restaurants...
📊 Total restaurants: 41
🎯 Active filters: { certified: true, hotspot: true, scheduled: true, inspected: true }
📍 First restaurant category: "???"  ← CRITICAL!
🎯 filters[category]: undefined or false  ← CRITICAL!
```

---

## 🎯 EXPECTED SCENARIOS

### **Scenario A: Category is NULL/Undefined**
```
📍 First restaurant category: undefined
🎯 filters[undefined]: undefined  ← FAILS!
```

**Fix:**
```typescript
const category = restaurant.category || 'inspected';  // Default value
const categoryMatch = filters[category];
```

---

### **Scenario B: Category is "pending" or "violated"**
```
📋 Unique categories in data: ["pending", "violated"]
📋 Filter keys: ["certified", "hotspot", "scheduled", "inspected"]
```

**Fix:** Add more filter keys or map values:
```typescript
// Option 1: Add to filters
const [filters, setFilters] = useState({
  certified: true,
  hotspot: true,
  scheduled: true,
  inspected: true,
  pending: true,    // ← Add
  violated: true,   // ← Add
});

// Option 2: Map status to filter keys
function mapCategoryToFilter(category: string): keyof CategoryFilter {
  if (category === 'pending') return 'inspected';
  if (category === 'violated') return 'hotspot';
  return category as keyof CategoryFilter;
}
```

---

### **Scenario C: Category is different case**
```
📍 First restaurant category: "Certified"  ← Capital C!
📋 Filter keys: ["certified", ...]  ← lowercase!
```

**Fix:**
```typescript
const categoryMatch = filters[restaurant.category.toLowerCase()];
```

---

### **Scenario D: Category from mapSupabaseStatus is wrong**
```typescript
// In mapPointsApi.ts
function mapSupabaseStatus(status?: string | number): string {
  // ...returns 'pending', 'violated', etc.
}

// But we assign it to category:
category: mapSupabaseStatus(point.status) as 'certified' | 'hotspot' | 'scheduled' | 'inspected'
```

**Issue:** Type assertion doesn't change the value! If `mapSupabaseStatus` returns `'pending'`, the category IS `'pending'`, not one of the 4 expected values!

**Fix:**
```typescript
function mapSupabaseStatus(status?: string | number): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  // Must return ONLY these 4 values!
  const statusStr = String(status || '').toLowerCase();
  
  if (statusStr.includes('certif')) return 'certified';
  if (statusStr.includes('hotspot') || statusStr.includes('alert')) return 'hotspot';
  if (statusStr.includes('schedule') || statusStr.includes('plan')) return 'scheduled';
  
  return 'inspected';  // ← DEFAULT to one of the 4 valid values!
}
```

---

## 🚀 ACTION REQUIRED

1. **Hard Refresh:** Ctrl+Shift+R (3 times)
2. **Open Console:** F12
3. **Find Logs:** Look for the 3 groups above
4. **Copy These Values:**

```
📍 First point after fetch - category: [PASTE VALUE HERE]

📋 Unique categories in data: [PASTE ARRAY HERE]

🎯 filters[first.category]: [PASTE VALUE HERE]
```

---

## 🔧 MOST LIKELY FIX

Based on the code, the issue is in `/src/utils/api/mapPointsApi.ts`:

### Current Code (Line ~220):
```typescript
category: mapSupabaseStatus(point.status) as 'certified' | 'hotspot' | 'scheduled' | 'inspected',
```

### Current mapSupabaseStatus (Line ~300):
```typescript
function mapSupabaseStatus(status?: string | number | object): 'inspected' | 'pending' | 'violated' | 'certified' | 'hotspot' {
  // ...
  return 'pending';  // ← Returns 'pending' which is NOT in filter keys!
}
```

**Problem:** Function returns `'pending'` or `'violated'` which are NOT in `CategoryFilter`!

**Fix:**
```typescript
function mapSupabaseStatus(status?: string | number | object): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  if (!status) return 'inspected';  // ← Changed default!
  
  const statusStr = String(status).toLowerCase();
  
  if (statusStr.includes('certif')) return 'certified';
  if (statusStr.includes('hotspot') || statusStr.includes('alert')) return 'hotspot';
  if (statusStr.includes('schedul') || statusStr.includes('plan')) return 'scheduled';
  if (statusStr.includes('inspect')) return 'inspected';
  if (statusStr.includes('violat') || statusStr.includes('warning')) return 'hotspot';  // ← Map violated → hotspot
  if (statusStr.includes('pend')) return 'scheduled';  // ← Map pending → scheduled
  
  return 'inspected';  // ← Safe default
}
```

---

## 📁 Files to Check/Fix

| File | Line | Issue |
|------|------|-------|
| `/src/utils/api/mapPointsApi.ts` | ~300 | `mapSupabaseStatus` return type mismatch |
| `/src/pages/MapPage.tsx` | 32-37 | Filter object missing keys |
| `/src/pages/MapPage.tsx` | 253-260 | Filter logic too strict |

---

## ✅ VERIFICATION

After fix, you should see:
```
🔍 MapPage: Filtering restaurants...
📊 restaurants.length: 41
📋 Unique categories in data: ["certified", "hotspot", "scheduled", "inspected"]  ← Only these 4!
✅ Valid restaurants with coordinates: 41  ← All pass filter!
🗺️ LeafletMap: Updating markers...
📊 Total restaurants to render: 41  ← All rendered!
```

---

**Next Step:** Hard refresh and share the console logs! 🎯
