# MAPPA Portal - Migration Guide

## 🚀 From Mock Data to Supabase KV Store

This guide explains the migration from hardcoded mock data to Supabase-backed persistent storage.

---

## 📋 Table of Contents

1. [Why Migrate?](#why-migrate)
2. [Architecture Changes](#architecture-changes)
3. [What Changed](#what-changed)
4. [How to Use](#how-to-use)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Why Migrate?

### Before (Mock Data)
```typescript
// ❌ Hardcoded in code
import { restaurants } from '../data/restaurantData';

// Problems:
// - Data resets on every page refresh
// - No persistence across sessions
// - Cannot add/edit/delete dynamically
// - Not scalable for production
```

### After (Supabase KV Store)
```typescript
// ✅ Fetch from database
const restaurants = await fetchRestaurants();

// Benefits:
// ✅ Data persists across refreshes
// ✅ Can update without code changes
// ✅ Real-time updates possible
// ✅ Production-ready architecture
```

---

## 🏗️ Architecture Changes

### Old Architecture
```
┌─────────────────────┐
│   MapPage.tsx       │
│                     │
│   const data =      │
│   restaurants       │ ← Hardcoded import
│   (from file)       │
└─────────────────────┘
```

### New Architecture
```
┌─────────────────────┐
│   MapPage.tsx       │
│                     │
│   useEffect(() => { │
│     fetchData()     │ ← Async fetch
│   })                │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  restaurantApi.ts    │
│  fetchRestaurants()  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Supabase Server    │
│   (Edge Function)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   KV Store Table     │
│   restaurant:{id}    │
└──────────────────────┘
```

---

## 🔄 What Changed

### 1. MapPage.tsx

**Before:**
```typescript
import { restaurants } from '../data/restaurantData';

export default function MapPage() {
  // restaurants available immediately
  const filteredRestaurants = restaurants.filter(...);
}
```

**After:**
```typescript
import { fetchRestaurants } from '../utils/api/restaurantApi';

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRestaurants();
      setRestaurants(data);
      setIsLoadingData(false);
    };
    fetchData();
  }, []);
  
  const filteredRestaurants = restaurants.filter(...);
}
```

### 2. MapFilterPanel.tsx

**Before:**
```typescript
import { restaurants } from '../data/restaurantData';

// Hardcoded count
const count = restaurants.filter(r => r.type === 'Nhà hàng').length;
```

**After:**
```typescript
interface MapFilterPanelProps {
  restaurants: Restaurant[];  // ← Passed from parent
  ...
}

// Dynamic count
const count = restaurants.filter(r => r.type === 'Nhà hàng').length;
```

### 3. New Files Created

**API Client** (`/src/utils/api/restaurantApi.ts`)
```typescript
export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
    headers: { 'Authorization': `Bearer ${publicAnonKey}` }
  });
  const result = await response.json();
  return result.data;
}
```

**Server Endpoints** (`/supabase/functions/server/index.tsx`)
```typescript
app.get("/make-server-e4fdfce9/restaurants", async (c) => {
  const entries = await kv.getByPrefix('restaurant:');
  const restaurants = entries.map(e => JSON.parse(e.value));
  return c.json({ data: restaurants });
});
```

**DataSeeder Component** (`/src/app/components/dev/DataSeeder.tsx`)
```typescript
// Development tool for seeding data
<Button onClick={handleSeed}>Seed Data</Button>
```

---

## 📖 How to Use

### First Time Setup (Seeding Data)

1. **Start the application**
   - Navigate to Map page (`/map`)
   - Map will be empty (0 businesses)

2. **Open DataSeeder tool**
   - Look for floating widget at bottom-right corner
   - Title: "🔧 Data Seeder (Development)"

3. **Seed the data**
   - Click "📤 Seed Data" button
   - Wait 2-3 seconds for upload
   - You'll see success message

4. **Refresh the page**
   - Press F5 or refresh browser
   - Map now shows 1000 businesses! 🎉

### Normal Usage (After Seeding)

1. **Load page**
   - Data automatically fetches from Supabase
   - Shows loading state briefly
   - Then displays all 1000 businesses

2. **Filter data**
   - All filters work as before
   - Location filters (Province/District/Ward)
   - Business type filters
   - Category filters
   - Search functionality

3. **Data persists**
   - Refresh page → Data still there ✅
   - Close browser → Data still there ✅
   - Clear cache → Data still there ✅

### Re-seeding (If Needed)

If you need to reset the data:

1. **Delete existing data**
   - Click "🗑️ Xóa tất cả" button
   - Confirm deletion
   - Database is now empty

2. **Seed again**
   - Click "📤 Seed Data" button
   - Fresh data uploaded

3. **Refresh**
   - F5 to see new data

---

## 🛠️ Technical Details

### Data Storage Format

**KV Store Entry:**
```
Key: "restaurant:1"
Value (JSON string):
'{
  "id": "1",
  "name": "Nhà hàng Phở Hà Nội",
  "address": "123 Hoàn Kiếm",
  "lat": 21.0285,
  "lng": 105.8542,
  "type": "Nhà hàng",
  "businessType": "Nhà hàng",
  "category": "certified",
  "province": "Hà Nội",
  "district": "Hoàn Kiếm",
  "ward": "Phường Hàng Bạc",
  "nearbyPopulation": 15420
}'
```

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "count": 1000,
  "data": [
    { "id": "1", "name": "...", ... },
    { "id": "2", "name": "...", ... },
    ...
  ]
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch restaurants",
  "details": "Network error: ..."
}
```

### State Management

**Loading States:**
```typescript
const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
const [isLoadingData, setIsLoadingData] = useState(true);
const [dataError, setDataError] = useState<string | null>(null);
```

**Flow:**
```
1. Initial: isLoadingData = true, restaurants = []
2. Fetching: API call in progress
3. Success: isLoadingData = false, restaurants = [1000 items]
4. Error: isLoadingData = false, dataError = "error message"
```

---

## 🔍 Troubleshooting

### Issue: Map is Empty After Page Load

**Symptoms:**
- Page loads but no businesses appear
- Filter shows "0 điểm" for all categories

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. If you see "0 restaurants fetched" → Database is empty
4. Click "Seed Data" button
5. Refresh page

---

### Issue: "Failed to fetch restaurants" Error

**Symptoms:**
- Error message in console
- Map stays empty

**Possible Causes:**
1. **Network issue** - Check internet connection
2. **API endpoint down** - Wait and retry
3. **Authorization error** - Check publicAnonKey in `/utils/supabase/info`

**Solution:**
```typescript
// Check browser console for detailed error
console.error("Error fetching restaurants:", error);

// Retry fetch
const retry = async () => {
  const data = await fetchRestaurants();
  setRestaurants(data);
};
```

---

### Issue: Seed Button Not Working

**Symptoms:**
- Click "Seed Data" but nothing happens
- Or shows error message

**Solution:**
1. **Check browser console** for errors
2. **Verify data format** - Mock data must match Restaurant interface
3. **Check API endpoint** - Server must be running
4. **Try "Xóa tất cả" first** - Then re-seed

---

### Issue: Data Shows But Filters Don't Work

**Symptoms:**
- 1000 businesses visible
- But filters don't reduce count

**Cause:**
- Filtering logic not updated for async data

**Check:**
```typescript
// Make sure filteredRestaurants uses state, not import
const filteredRestaurants = useMemo(() => {
  return restaurants.filter(...);  // ← Should use state 'restaurants'
}, [restaurants, filters, ...]);   // ← Dependencies must include 'restaurants'
```

---

## 📊 Data Validation

### Verify Seeding Success

**Check in Browser Console:**
```typescript
// After seeding, check:
fetchRestaurants().then(data => {
  console.log('Total restaurants:', data.length);
  console.log('First restaurant:', data[0]);
  console.log('Categories:', {
    certified: data.filter(r => r.category === 'certified').length,
    hotspot: data.filter(r => r.category === 'hotspot').length,
    scheduled: data.filter(r => r.category === 'scheduled').length,
    inspected: data.filter(r => r.category === 'inspected').length
  });
});
```

**Expected Output:**
```
Total restaurants: 1000
First restaurant: { id: "1", name: "...", ... }
Categories: {
  certified: ~250,
  hotspot: ~200,
  scheduled: ~250,
  inspected: ~300
}
```

---

## ⚡ Performance Considerations

### Current Approach (Load All)
```typescript
// Fetch all 1000 records at once
const restaurants = await fetchRestaurants();  // ~500KB JSON
```

**Pros:**
- ✅ Simple implementation
- ✅ Fast filtering (client-side)
- ✅ No network delay during filtering

**Cons:**
- ⚠️ Initial load takes 1-2 seconds
- ⚠️ Not scalable for 100,000+ records

### Future Optimization (If Needed)
```typescript
// Paginated fetching
const restaurants = await fetchRestaurants({
  page: 1,
  limit: 100,
  filters: { district: 'Hoàn Kiếm' }
});
```

**When to optimize:**
- Dataset grows beyond 10,000 records
- Initial load time > 5 seconds
- Users complain about performance

---

## 🎯 Migration Checklist

- [x] Create API client (`restaurantApi.ts`)
- [x] Create server endpoints (GET, POST, DELETE)
- [x] Update MapPage to fetch from API
- [x] Add loading states
- [x] Pass restaurants to child components
- [x] Create DataSeeder development tool
- [x] Remove hardcoded imports (where applicable)
- [x] Test all filters with real data
- [x] Verify persistence across refreshes
- [x] Document schema and structure

---

## 📚 Related Documentation

- [Database Schema (SQL Reference)](/docs/database-schema.sql)
- [KV Store Structure](/docs/kv-store-structure.md)
- [TypeScript Interfaces](/docs/typescript-interfaces.md)
- [Main Documentation](/docs/README.md)

---

## ✅ Success Criteria

Migration is successful when:

1. ✅ Page loads with 1000 businesses from Supabase
2. ✅ All filters work correctly
3. ✅ Data persists across refreshes
4. ✅ No hardcoded restaurant imports in MapPage
5. ✅ DataSeeder tool works for re-seeding
6. ✅ No console errors
7. ✅ Performance is acceptable (<3s initial load)

---

**Migration Completed:** ✅ January 9, 2026
**Environment:** Figma Make (Supabase KV Store)
**Data Records:** 1000 businesses across Hà Nội
