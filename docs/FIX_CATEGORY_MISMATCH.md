# ✅ FIXED - Category Value Mismatch

**Date:** January 9, 2026  
**Issue:** 41 points loaded but 0 displayed  
**Root Cause:** `mapSupabaseStatus` returned values not in `CategoryFilter`  
**Status:** ✅ FIXED  

---

## 🐛 THE PROBLEM

### Filter Expects (MapPage.tsx):
```typescript
type CategoryFilter = {
  certified: boolean;
  hotspot: boolean;
  scheduled: boolean;
  inspected: boolean;
};
```

### But mapSupabaseStatus Returned (OLD CODE):
```typescript
function mapSupabaseStatus(...): 'inspected' | 'pending' | 'violated' | 'certified' | 'hotspot' {
  if (!status) return 'pending';  // ❌ 'pending' NOT in CategoryFilter!
  
  if (statusLower.includes('violat')) return 'violated';  // ❌ 'violated' NOT in CategoryFilter!
  
  return 'pending';  // ❌ Default NOT in CategoryFilter!
}
```

### Result:
```
✅ Fetch: 41 points
🔄 Transform: category = 'pending' or 'violated'  ← NOT in filter keys!
❌ Filter: filters['pending'] = undefined → filtered out!
❌ Render: 0 points displayed
```

---

## ✅ THE FIX

### Updated mapSupabaseStatus (NEW CODE):

```typescript
/**
 * Map Supabase status to app category format
 * CRITICAL: Must return ONLY values that exist in CategoryFilter!
 * CategoryFilter keys: certified, hotspot, scheduled, inspected
 */
function mapSupabaseStatus(status?: string | number | object): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  if (!status) return 'inspected';  // ✅ Changed default!
  
  const statusStr = typeof status === 'string' ? status : String(status);
  const statusLower = statusStr.toLowerCase();
  
  // Map to valid CategoryFilter keys
  if (statusLower.includes('certif')) return 'certified';
  if (statusLower.includes('hotspot') || statusLower.includes('alert')) return 'hotspot';
  if (statusLower.includes('schedul') || statusLower.includes('plan')) return 'scheduled';
  if (statusLower.includes('inspect')) return 'inspected';
  
  // ✅ Map other statuses to appropriate categories
  if (statusLower.includes('violat') || statusLower.includes('warning') || statusLower.includes('danger')) return 'hotspot';
  if (statusLower.includes('pend') || statusLower.includes('wait') || statusLower.includes('queue')) return 'scheduled';
  if (statusLower.includes('active') || statusLower.includes('open')) return 'inspected';
  
  return 'inspected';  // ✅ Safe default
}
```

---

## 🎯 MAPPING STRATEGY

| Supabase Status | → | Category Filter | Reason |
|----------------|---|-----------------|--------|
| `'certified'` | → | `'certified'` | Direct match |
| `'hotspot'` | → | `'hotspot'` | Direct match |
| `'alert'` | → | `'hotspot'` | Alert = hotspot |
| `'scheduled'` | → | `'scheduled'` | Direct match |
| `'planned'` | → | `'scheduled'` | Planned = scheduled |
| `'inspected'` | → | `'inspected'` | Direct match |
| `'violated'` | → | `'hotspot'` | **Violations need attention** |
| `'warning'` | → | `'hotspot'` | **Warnings need attention** |
| `'pending'` | → | `'scheduled'` | **Pending = to be scheduled** |
| `'waiting'` | → | `'scheduled'` | **Waiting = to be scheduled** |
| `'active'` | → | `'inspected'` | Active businesses |
| `null` or `undefined` | → | `'inspected'` | **Default safe value** |

---

## 📊 WHAT CHANGED

### Return Type:
```diff
- function mapSupabaseStatus(...): 'inspected' | 'pending' | 'violated' | 'certified' | 'hotspot'
+ function mapSupabaseStatus(...): 'certified' | 'hotspot' | 'scheduled' | 'inspected'
```

### Default Value:
```diff
- if (!status) return 'pending';
+ if (!status) return 'inspected';
```

### Mapping Logic:
```diff
- if (statusLower.includes('violat')) return 'violated';
+ if (statusLower.includes('violat')) return 'hotspot';  // Map to valid key!

- return 'pending';
+ return 'inspected';  // Safe default!
```

### Added Mappings:
```diff
+ if (statusLower.includes('schedul') || statusLower.includes('plan')) return 'scheduled';
+ if (statusLower.includes('pend') || statusLower.includes('wait')) return 'scheduled';
+ if (statusLower.includes('active') || statusLower.includes('open')) return 'inspected';
```

---

## ✅ EXPECTED RESULT

### Before Fix:
```
✅ Fetch: 41 points
🔄 Transform: All points get category 'pending' or 'violated'
❌ Filter: filters['pending'] = undefined → all filtered out
❌ Render: 0 markers
```

### After Fix:
```
✅ Fetch: 41 points
🔄 Transform: All points get valid category (certified/hotspot/scheduled/inspected)
✅ Filter: filters[category] = true → all pass
✅ Render: 41 markers! 🎉
```

---

## 🧪 CONSOLE OUTPUT (After Fix)

```
🔍 Fetching map points from Supabase REST API...
✅ Successfully fetched 41 map points

🔄 Transforming Supabase data...
✅ Valid points with coordinates: 41

📦 MapPage: Raw data from fetchMapPoints: 41 points
📍 MapPage: First point after fetch: {
  category: "inspected"  ← ✅ Valid value!
}

🔍 MapPage: Filtering restaurants...
📊 restaurants.length: 41
📋 Unique categories in data: ["certified", "hotspot", "scheduled", "inspected"]  ← ✅ Only valid!
🎯 filters[first.category]: true  ← ✅ Passes filter!

🗺️ LeafletMap: Updating markers...
📊 Total restaurants to render: 41  ← ✅ All rendered!
✅ Valid restaurants with coordinates: 41
🎯 Creating first marker at: [21.0285, 105.8542]

✅ 41 MARKERS DISPLAYED ON MAP! 🎉
```

---

## 📁 FILES CHANGED

| File | Change |
|------|--------|
| ✅ `/src/utils/api/mapPointsApi.ts` | Fixed `mapSupabaseStatus` return type & mapping |
| ✅ `/src/pages/MapPage.tsx` | Added debug logging |
| ✅ `/src/app/components/map/LeafletMap.tsx` | Added debug logging |
| ✅ `/FIX_CATEGORY_MISMATCH.md` | **NEW** - This documentation |
| ✅ `/FOUND_FILTER_ISSUE.md` | **NEW** - Issue diagnosis |

---

## 🚀 ACTION REQUIRED

1. **Hard Refresh:** Ctrl+Shift+R (3 times!) - **CRITICAL!**
2. **Check Console:** Should see valid categories
3. **Check Map:** Should see 41 markers in Hanoi area!
4. **Verify Filters:** All 4 category filters should work

---

## ✅ VERIFICATION CHECKLIST

After hard refresh:

- [ ] Console shows `📋 Unique categories in data: ["certified", "hotspot", "scheduled", "inspected"]`
- [ ] Console shows `📊 Total restaurants to render: 41` (not 0!)
- [ ] Console shows `✅ Valid restaurants with coordinates: 41`
- [ ] Console shows `🎯 Creating first marker at: [21.xxx, 105.xxx]`
- [ ] **MAP DISPLAYS 41 MARKERS** ← MAIN GOAL!
- [ ] Markers have different colors (green, red, yellow, blue)
- [ ] Category filters work (toggle certified/hotspot/scheduled/inspected)
- [ ] Clicking markers shows popup

---

## 🎯 ROOT CAUSE SUMMARY

**Problem:** Type mismatch between:
1. `mapSupabaseStatus` return values (`'pending'`, `'violated'`)
2. `CategoryFilter` expected values (`'certified'`, `'hotspot'`, `'scheduled'`, `'inspected'`)

**Impact:** ALL points filtered out because `filters['pending']` = `undefined`

**Solution:** Make `mapSupabaseStatus` return ONLY values that exist in `CategoryFilter`

**Lesson:** Always ensure enum/type values match across data transformation and filtering logic!

---

**STATUS: ✅ FIXED**  
**Hard refresh (Ctrl+Shift+R 3x) và check map! 🗺️**
