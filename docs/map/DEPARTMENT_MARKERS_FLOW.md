# Luồng Lấy Dữ Liệu và Hiển thị Các Điểm Department

Tài liệu này mô tả chi tiết luồng từ khi component mount đến khi markers được hiển thị trên map.

---

## 📋 Tổng quan Flow

```
1. LeafletMap Component Mount
   ↓
2. useDepartmentAreas Hook → Fetch Data từ API
   ↓
3. Transform Data → departmentMapData
   ↓
4. DepartmentMarkersLayer Component → Render Markers
   ↓
5. Markers hiển thị trên Map
```

---

## 🔄 Chi tiết từng bước

### Bước 1: LeafletMap Component Mount

**File:** `src/app/components/map/LeafletMap.tsx`

**Location:** Dòng 39-73

```typescript
export function LeafletMap({ 
  showWardBoundaries = false,  // 🔥 Flag để hiển thị department markers
  showMerchants = false,
  selectedTeamId,
  ...
}: LeafletMapProps) {
  
  // 🔥 Bước 1.1: Lấy divisionId/teamId từ Redux store
  const reduxQLTTScope = useAppSelector((state) => state.qlttScope);
  const divisionId = reduxQLTTScope?.scope?.divisionId;
  const teamId = reduxQLTTScope?.scope?.teamId;
  
  // 🔥 Bước 1.2: Xác định targetDepartmentId (priority: selectedTeamId > teamId > divisionId)
  const targetDepartmentId = selectedTeamId || teamId || divisionId;
  
  // 🔥 Bước 1.3: Gọi hook để fetch department areas
  const { 
    departmentAreas,           // Raw data từ API
    isLoading,                 // Loading state
    error,                     // Error state
    currentDepartmentId        // ID đang được fetch
  } = useDepartmentAreas(
    targetDepartmentId || null,
    true  // Always enabled - fetch data whenever we have a department ID
  );
}
```

**Điều kiện trigger:**
- Component mount
- `targetDepartmentId` thay đổi
- `selectedTeamId` thay đổi (từ filter)

---

### Bước 2: useDepartmentAreas Hook - Fetch Data

**File:** `src/app/components/map/hooks/useDepartmentAreas.ts`

**Location:** Dòng 11-161

#### 2.1. Xác định Department ID cần fetch

```typescript
// Priority: selectedDepartmentId (from filter) > departmentId (prop) > null
const targetDepartmentId = selectedDepartmentId && selectedDepartmentId !== '' 
  ? selectedDepartmentId 
  : departmentId || null;
```

#### 2.2. useEffect Trigger Fetch

```typescript
useEffect(() => {
  if (!enabled) return;
  
  // Check if already loading → skip
  if (departmentAreas.isLoading) return;
  
  // Check if needs fetch (different department or no data)
  const currentId = targetDepartmentId;
  const needsFetch = departmentAreas.currentDepartmentId !== currentId;
  
  if (!needsFetch) return; // Already fetched
  
  async function loadDepartmentAreas() {
    dispatch(setLoading(true));
    
    // 🔥 Bước 2.3: Gọi RPC function
    const wardCoordinates = await getWardCoordinatesByDepartment(targetDepartmentId);
    
    // 🔥 Bước 2.4: Transform data
    const transformedAreas = wardCoordinates.map(coord => ({
      province_id: coord.province_id,
      ward_id: coord.ward_id,
      wards_with_coordinates: {
        center_lat: coord.center_lat,
        center_lng: coord.center_lng,
        bounds: coord.bounds,
        area: coord.area,
        officer: coord.officer,
      }
    }));
    
    // 🔥 Bước 2.5: Dispatch data vào Redux store
    dispatch(setDepartmentAreas({
      areas: transformedAreas
    }));
  }
  
  loadDepartmentAreas();
}, [enabled, targetDepartmentId, ...]);
```

**API Call:**
- **Function:** `getWardCoordinatesByDepartment(departmentId)`
- **Location:** `src/utils/api/departmentAreasApi.ts`
- **RPC Function:** `get_ward_coordinates_by_department`
- **Parameters:** `{ department_id: string }`
- **Returns:** `Array<WardCoordinate>` với:
  - `ward_id`
  - `province_id`
  - `center_lat`, `center_lng`
  - `bounds`
  - `area`
  - `officer`

**Data Structure từ API:**
```typescript
[
  {
    ward_id: "ward_123",
    province_id: "province_01",
    center_lat: 10.123,
    center_lng: 106.456,
    bounds: [[...], [...]],
    area: 1234.56,
    officer: "Nguyễn Văn A"
  },
  ...
]
```

---

### Bước 3: Transform Data → departmentMapData

**File:** `src/app/components/map/LeafletMap.tsx`

**Location:** Dòng 75-100

```typescript
// 🔥 Bước 3.1: useMemo để transform data
const departmentMapData = useMemo(() => {
  // Check loading/error states
  if (isLoadingDepartmentAreas && !departmentAreas) return null;
  if (isLoadingDepartmentAreas) return null;
  if (departmentAreasError) return null;
  if (!departmentAreas) return null;
  
  // 🔥 Bước 3.2: Transform data
  const transformed = transformDepartmentAreasToMapData(
    departmentAreas,           // Raw data từ API
    targetDepartmentId || 'all',
    departments                // Optional: departments info
  );
  
  return transformed;
}, [departmentAreas, targetDepartmentId, ...]);
```

**Transform Function:** `transformDepartmentAreasToMapData()`

**File:** `src/app/components/map/utils/departmentAreasUtils.ts`

**Location:** Dòng 29-175

#### 3.1. Parse Areas Array

```typescript
// Handle different data structures (array, object, JSONB)
let areasArray: Area[] = [];

if (Array.isArray(data.areas)) {
  areasArray = data.areas;
} else if (typeof data.areas === 'object') {
  // Convert object to array (handle JSONB)
  areasArray = extractAreasFromObject(data.areas);
}
```

#### 3.2. Transform Each Area

```typescript
const transformedAreas = areasArray
  .map((area: any) => {
    const coords = area.wards_with_coordinates;
    
    // Check valid coordinates
    const hasValidCoords = 
      coords.center_lat !== null && 
      coords.center_lng !== null &&
      !isNaN(coords.center_lat) &&
      !isNaN(coords.center_lng);
    
    const center: [number, number] | null = hasValidCoords
      ? [coords.center_lat, coords.center_lng]
      : null;
    
    return {
      provinceId: area.province_id || '',
      wardId: area.ward_id || '',
      departmentId: area.department_id || undefined, // 🔥 NEW: Include department_id
      coordinates: {
        center,
        bounds: coords?.bounds || null,
        area: coords?.area || null,
        officer: coords?.officer || null,
      },
    };
  })
  .filter(area => area !== null && area.coordinates.center !== null);
```

**Output Structure:**
```typescript
{
  departmentId: "dept_123",
  areas: [
    {
      provinceId: "province_01",
      wardId: "ward_123",
      departmentId: "dept_123",  // 🔥 Department ID cho area này
      coordinates: {
        center: [10.123, 106.456],
        bounds: [[...], [...]],
        area: 1234.56,
        officer: "Nguyễn Văn A"
      }
    },
    ...
  ]
}
```

---

### Bước 4: DepartmentMarkersLayer Component - Render Markers

**File:** `src/app/components/map/layers/DepartmentMarkersLayer.tsx`

**Location:** Dòng 23-233

#### 4.1. Component Render (JSX)

**File:** `src/app/components/map/LeafletMap.tsx`

**Location:** Dòng 756-767

```typescript
return (
  <>
    <div ref={mapRef} className={styles.map} />
    
    {/* 🔥 Bước 4.1: Render DepartmentMarkersLayer khi showWardBoundaries = true */}
    {showWardBoundaries && !showMerchants && (
      <DepartmentMarkersLayer
        mapInstance={mapInstanceRef.current}
        leafletRef={leafletRef.current}
        departmentMapData={departmentMapData}  // 🔥 Transformed data
        isLoading={isLoadingDepartmentAreas}
        error={departmentAreasError}
        markersRef={departmentMarkersRef}      // 🔥 Separate ref cho department markers
        wardBoundariesLayerRef={wardBoundariesLayerRef}
      />
    )}
  </>
);
```

**Điều kiện render:**
- `showWardBoundaries === true`
- `showMerchants === false`
- `departmentMapData !== null`

#### 4.2. updateMarkers Function

**File:** `src/app/components/map/layers/DepartmentMarkersLayer.tsx`

**Location:** Dòng 23-223

```typescript
const updateMarkers = useCallback(() => {
  if (!mapInstance || !leafletRef) return;
  
  const L = leafletRef;
  
  // 🔥 Bước 4.2.1: Remove old markers
  wardBoundariesLayerRef.current.forEach(polygon => polygon.remove());
  wardBoundariesLayerRef.current = [];
  
  // Check loading/error states
  if (isLoading) return;
  if (error) return;
  if (!departmentMapData) return;
  
  // 🔥 Bước 4.2.2: Create department icon
  const departmentIcon = L.divIcon({
    html: `<div>...</div>`,  // SVG icon
    className: 'department-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  
  // 🔥 Bước 4.2.3: Group areas by wardId
  const wardMarkersMap = new Map<string, {
    center: [number, number];
    wardId: string;
    provinceId: string;
    departmentIds: string[];  // 🔥 Track all department IDs
    areas: Array<{...}>;
  }>();
  
  departmentMapData.areas.forEach((area) => {
    if (area.coordinates.center) {
      const key = area.wardId || area.provinceId || '';
      
      if (key && !wardMarkersMap.has(key)) {
        // 🔥 Bước 4.2.4: Create new ward marker entry
        const departmentIds = area.departmentId ? [area.departmentId] : [];
        wardMarkersMap.set(key, {
          center: area.coordinates.center,
          wardId: area.wardId,
          provinceId: area.provinceId,
          departmentIds: departmentIds,
          areas: [area]
        });
      } else if (key && wardMarkersMap.has(key)) {
        // 🔥 Bước 4.2.5: Add area to existing ward marker
        const wardData = wardMarkersMap.get(key)!;
        wardData.areas.push(area);
        if (area.departmentId && !wardData.departmentIds.includes(area.departmentId)) {
          wardData.departmentIds.push(area.departmentId);
        }
      }
    }
  });
  
  // 🔥 Bước 4.2.6: Render markers
  wardMarkersMap.forEach((wardData) => {
    // Create marker
    const wardMarker = L.marker(wardData.center, { icon: departmentIcon });
    
    // Create tooltip
    const tooltipContent = `...`;  // HTML content
    wardMarker.bindTooltip(tooltipContent, {...});
    
    // 🔥 Bước 4.2.7: Add click handler
    wardMarker.on('click', () => {
      // Lấy department_id đầu tiên từ wardData
      const departmentId = wardData.departmentIds.length > 0 
        ? wardData.departmentIds[0] 
        : departmentMapData.departmentId;
      
      // Mở modal
      if (typeof (window as any).openDepartmentDetail === 'function') {
        (window as any).openDepartmentDetail(departmentId, {
          departmentId: departmentId,
          wardId: wardData.wardId,
          areas: wardData.areas,
          departmentIds: wardData.departmentIds
        });
      }
    });
    
    // Add to map
    wardMarker.addTo(mapInstance);
    markersRef.current.push(wardMarker);
  });
}, [mapInstance, leafletRef, departmentMapData, ...]);
```

#### 4.3. useEffect Trigger Render

```typescript
useEffect(() => {
  if (!mapInstance || !leafletRef) return;
  updateMarkers();  // 🔥 Trigger render khi dependencies thay đổi
}, [updateMarkers, mapInstance, leafletRef]);
```

**Dependencies trigger re-render:**
- `departmentMapData` thay đổi
- `isLoading` thay đổi
- `error` thay đổi
- `mapInstance` thay đổi

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    LeafletMap Component                      │
│  - Get divisionId/teamId from Redux                         │
│  - Determine targetDepartmentId                             │
│  - Call useDepartmentAreas hook                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              useDepartmentAreas Hook                         │
│  - Check if needs fetch                                     │
│  - Call getWardCoordinatesByDepartment()                    │
│  - Transform ward coordinates to areas format               │
│  - Dispatch to Redux store                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         getWardCoordinatesByDepartment()                    │
│  - Call RPC: get_ward_coordinates_by_department            │
│  - Returns: Array<WardCoordinate>                          │
│  - Each coordinate has: ward_id, center_lat, center_lng    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│        transformDepartmentAreasToMapData()                   │
│  - Parse areas array/object                                 │
│  - Validate coordinates                                    │
│  - Transform to DepartmentMapData format                   │
│  - Include departmentId in each area                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         DepartmentMarkersLayer Component                     │
│  - Group areas by wardId                                   │
│  - Create markers for each unique ward                      │
│  - Add click handlers                                      │
│  - Render markers on map                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Points

### 1. Data Source
- **API:** RPC function `get_ward_coordinates_by_department`
- **Input:** `department_id` (có thể là division_id, team_id, hoặc department_id cụ thể)
- **Output:** Array ward coordinates với `center_lat`, `center_lng`

### 2. Data Transformation
- **Step 1:** API response → `DepartmentAreasResponse`
- **Step 2:** Transform → `DepartmentMapData` (map-friendly format)
- **Step 3:** Group by `wardId` → `wardMarkersMap` (tránh duplicate markers)

### 3. Marker Creation
- **1 marker = 1 unique ward**
- Nếu nhiều departments quản lý cùng ward → 1 marker với nhiều `departmentIds`
- Marker position = `center` từ `ward_coordinates` table

### 4. Click Handler
- Click marker → Lấy `departmentId` đầu tiên từ `wardData.departmentIds`
- Gọi `openDepartmentDetail(departmentId, departmentData)`
- Modal fetch users theo `departmentId` này

---

## 🐛 Debugging Checklist

### Markers không hiển thị

1. **Check Redux store:**
   ```typescript
   // Check departmentAreas state
   const departmentAreas = useAppSelector(state => state.departmentAreas);
   console.log('Department Areas:', departmentAreas);
   ```

2. **Check departmentMapData:**
   ```typescript
   console.log('Department Map Data:', departmentMapData);
   console.log('Areas count:', departmentMapData?.areas?.length);
   ```

3. **Check coordinates:**
   ```typescript
   departmentMapData?.areas?.forEach(area => {
     console.log('Area:', {
       wardId: area.wardId,
       hasCenter: !!area.coordinates.center,
       center: area.coordinates.center
     });
   });
   ```

4. **Check map instance:**
   ```typescript
   console.log('Map instance:', mapInstanceRef.current);
   console.log('Leaflet ref:', leafletRef.current);
   ```

5. **Check render condition:**
   ```typescript
   console.log('Render conditions:', {
     showWardBoundaries,
     showMerchants,
     hasMapData: !!departmentMapData,
     shouldRender: showWardBoundaries && !showMerchants && !!departmentMapData
   });
   ```

### Click marker không mở modal

1. **Check openDepartmentDetail function:**
   ```typescript
   console.log('openDepartmentDetail exists:', typeof window.openDepartmentDetail);
   ```

2. **Check departmentId:**
   ```typescript
   console.log('Clicked marker departmentId:', departmentId);
   console.log('WardData departmentIds:', wardData.departmentIds);
   ```

3. **Check MapPage setup:**
   ```typescript
   // In MapPage.tsx
   useEffect(() => {
     (window as any).openDepartmentDetail = (departmentId, data) => {
       console.log('Opening department detail:', departmentId);
       setSelectedDepartmentId(departmentId);
       setIsDepartmentModalOpen(true);
     };
   }, []);
   ```

---

## 📝 Summary

### Flow Summary

1. **Trigger:** Component mount hoặc `targetDepartmentId` thay đổi
2. **Fetch:** `useDepartmentAreas` → `getWardCoordinatesByDepartment` → RPC API
3. **Transform:** `transformDepartmentAreasToMapData` → `DepartmentMapData`
4. **Group:** Group areas by `wardId` → `wardMarkersMap`
5. **Render:** Create markers → Add to map → Display

### Key Files

- `LeafletMap.tsx` - Main component, orchestrate flow
- `useDepartmentAreas.ts` - Custom hook, fetch data
- `departmentAreasApi.ts` - API functions
- `departmentAreasUtils.ts` - Transform functions
- `DepartmentMarkersLayer.tsx` - Render markers

### Key Data Structures

- **API Response:** `Array<WardCoordinate>`
- **Transformed:** `DepartmentMapData` với `areas[]`
- **Grouped:** `Map<wardId, WardData>` với `departmentIds[]`
- **Markers:** Leaflet markers với click handlers

