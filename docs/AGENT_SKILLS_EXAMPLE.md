# Ví dụ Agent Skills cho QLTT2 Project

Đây là file ví dụ về cách viết agent skills/documentation cho các components và features trong project.

---

## 1. DepartmentDetailModal Component

### Mục đích
Modal hiển thị thông tin chi tiết của department, bao gồm:
- Thông tin department
- Danh sách cán bộ (users)
- Các phòng ban quản lý theo địa bàn
- Thống kê và metrics

### Location
`src/app/components/map/DepartmentDetailModal.tsx`

### Props Interface
```typescript
interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;  // ID của department (có thể là division_id hoặc department_id từ marker)
  departmentData?: any;   // Optional: Data từ map marker (có ward_id chính xác)
}
```

### Key State Variables
- `users: DepartmentUser[]` - Danh sách users của department chính
- `departmentsByWard: Map<string, DepartmentByWard[]>` - Departments theo từng ward
- `usersByDepartment: Map<string, DepartmentUser[]>` - Users theo từng department (cho departmentsByWard)

### Data Flow

#### Khi modal mở:
1. `useEffect([isOpen, departmentId])` → Fetch department info và areas
2. `useEffect([isOpen, departmentId])` → Fetch users theo `departmentId`
3. `useEffect([areas])` → Fetch departments by ward từ areas
4. `useEffect([departmentsByWard])` → Fetch users cho từng department

#### Khi click marker từ map:
- Marker truyền `departmentId` cụ thể (từ `wardData.departmentIds[0]`)
- Modal nhận `departmentId` mới → Trigger fetch users mới
- Users được fetch theo `departmentId` của marker, không phải division_id ban đầu

### Important Logic

#### Fetch Users
```typescript
// Fetch users cho department chính
useEffect(() => {
  if (!isOpen || !departmentId) return;
  
  // Reset và fetch users mới khi departmentId thay đổi
  setUsers([]);
  setIsLoadingUsers(true);
  
  getUsersByDepartment(departmentId).then(users => {
    setUsers(users);
  });
}, [isOpen, departmentId]);
```

#### Display Users
- Component `DepartmentOfficersList` render list users
- Props: `displayOfficers` và `isLoadingUsers`
- `displayOfficers` được tính từ `users` state

### Common Issues

**Issue:** Users không load khi click marker
- **Check:** `departmentId` có được truyền đúng từ marker không?
- **Check:** `useEffect` có dependency `[isOpen, departmentId]` không?
- **Solution:** Đảm bảo marker click truyền `departmentId` cụ thể, không phải division_id

**Issue:** Users hiển thị của division thay vì department
- **Check:** Modal có đang dùng `departmentId` từ props không?
- **Solution:** Khi click marker, phải truyền `departmentId` từ marker, không dùng division_id

---

## 2. DepartmentMarkersLayer Component

### Mục đích
Render markers cho các departments trên map khi ở chế độ "lớp cán bộ" (`showWardBoundaries = true`).

### Location
`src/app/components/map/layers/DepartmentMarkersLayer.tsx`

### Props
```typescript
interface DepartmentMarkersLayerProps {
  mapInstance: any;                    // Leaflet map instance
  leafletRef: any;                     // Leaflet library reference
  departmentMapData: DepartmentMapData | null;  // Data từ API
  isLoading: boolean;
  error: any;
  markersRef: React.MutableRefObject<any[]>;  // Ref để lưu department markers
  wardBoundariesLayerRef: React.MutableRefObject<any[]>;  // Ref cho polygons
}
```

### Key Logic

#### Group Areas by WardId
```typescript
// Group areas để tránh duplicate markers cho cùng một ward
const wardMarkersMap = new Map<string, {
  center: [number, number];
  wardId: string;
  provinceId: string;
  departmentIds: string[];  // 🔥 Track tất cả department IDs
  areas: Array<{...}>;
}>();
```

#### Click Handler
```typescript
wardMarker.on('click', () => {
  // Lấy department_id đầu tiên từ wardData
  const departmentId = wardData.departmentIds.length > 0 
    ? wardData.departmentIds[0] 
    : departmentMapData.departmentId;
  
  // Mở modal với department_id cụ thể
  openDepartmentDetail(departmentId, {
    departmentId: departmentId,
    wardId: wardData.wardId,
    areas: wardData.areas
  });
});
```

### Data Source
- API: `fetchDepartmentAreas(departmentId)` từ `departmentAreasApi`
- Transform: `transformDepartmentAreasToMapData()` từ `departmentAreasUtils`
- API response có `department_id` trong mỗi record → được lưu vào `area.departmentId`

### Common Issues

**Issue:** Click marker không mở modal
- **Check:** `openDepartmentDetail` function có được setup trong `MapPage` không?
- **Check:** `window.openDepartmentDetail` có tồn tại không?
- **Solution:** Đảm bảo `MapPage` setup function trong `useEffect`

**Issue:** Không lấy được department_id từ marker
- **Check:** API query có select `department_id` không?
- **Check:** Transform function có lưu `departmentId` vào area không?
- **Solution:** Đảm bảo API query include `department_id` và transform lưu vào area

---

## 3. LeafletMap Component

### Mục đích
Component chính render map với Leaflet, quản lý các layers (merchants, departments).

### Location
`src/app/components/map/LeafletMap.tsx`

### Key Props
- `showWardBoundaries: boolean` - Hiển thị department markers
- `showMerchants: boolean` - Hiển thị merchant markers
- `restaurants: Restaurant[]` - Data cho merchant markers

### Marker Management

#### Separate Refs
```typescript
const markersRef = useRef<any[]>([]);              // Merchant markers
const departmentMarkersRef = useRef<any[]>([]);    // Department markers (riêng biệt)
```

#### Logic Switch Layers
```typescript
// Khi chuyển sang department layer
if (showWardBoundaries && !showMerchants) {
  // Xóa merchant markers
  markersRef.current.forEach(marker => marker.remove());
  markersRef.current = [];
  // DepartmentMarkersLayer tự quản lý departmentMarkersRef
  return;
}

// Khi chuyển sang merchant layer
if (showMerchants && !showWardBoundaries) {
  // Xóa department markers
  departmentMarkersRef.current.forEach(marker => marker.remove());
  departmentMarkersRef.current = [];
}
```

### Layer Components
- `DepartmentMarkersLayer` - Render khi `showWardBoundaries && !showMerchants`
- `MerchantsLayer` - Render khi `showMerchants` (nếu có)

### Common Issues

**Issue:** Markers của layer này hiển thị ở layer kia
- **Check:** Logic switch layers có đúng không?
- **Check:** Refs có được tách riêng không?
- **Solution:** Đảm bảo mỗi layer dùng ref riêng và xóa markers của layer cũ khi switch

---

## 4. API Functions

### getUsersByDepartment

**Location:** `src/utils/api/departmentAreasApi.ts`

**Signature:**
```typescript
export async function getUsersByDepartment(
  departmentId: string
): Promise<DepartmentUser[]>
```

**Behavior:**
- Gọi RPC function `get_users_by_department` với `department_id`
- Trả về array users, empty array nếu không có
- Log errors nhưng không throw (users là optional)

**Usage:**
```typescript
const users = await getUsersByDepartment('dept_123');
```

**Important:**
- `departmentId` phải là ID cụ thể của department, không phải division_id
- Function này được dùng trong `DepartmentDetailModal` để fetch users

---

## 5. Authentication & Redirect

### ProtectedRoute

**Location:** `src/app/components/auth/ProtectedRoute.tsx`

**Behavior:**
- Check authentication từ Redux store
- Redirect to `/auth/login` nếu không authenticated
- Check token expiry định kỳ (mỗi 30 giây)
- Auto logout và redirect nếu token expired

### Axios Interceptor

**Location:** `src/utils/api/axiosInstance.ts`

**Behavior:**
- Intercept 401 responses
- Check token expiry
- Auto logout và redirect to login nếu expired
- Sử dụng `window.location.replace()` để redirect

**Usage:**
- Import `axiosInstance` thay vì `axios` trực tiếp
- Interceptor tự động handle 401 errors

---

## 6. Common Patterns

### Tách Component cho Reusability

**Pattern:**
1. Tạo component trong `components/` hoặc `layers/` folder
2. Component nhận props cần thiết
3. Component tự quản lý logic và state
4. Return `null` nếu không render JSX (cho layer components)

**Example:**
- `DepartmentOfficersList` - Tách từ `DepartmentDetailModal`
- `DepartmentMarkersLayer` - Tách từ `LeafletMap`

### Map State Management

**Pattern:**
- Sử dụng `useRef` để lưu markers (không trigger re-render)
- Tách refs riêng cho từng layer
- Xóa markers cũ trước khi render mới
- Component layer tự quản lý markers của nó

### Fetch Data Pattern

**Pattern:**
```typescript
useEffect(() => {
  if (!isOpen || !departmentId) return;
  
  // Reset state
  setData([]);
  setIsLoading(true);
  
  // Fetch
  async function fetch() {
    try {
      const data = await apiCall(departmentId);
      setData(data);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }
  
  fetch();
}, [isOpen, departmentId]); // Dependencies
```

---

## 7. Debugging Tips

### Console Logs Format
```typescript
// Use emojis for easy identification
console.log('🔄 Fetching users for:', departmentId);
console.log('✅ Loaded', users.length, 'users');
console.error('❌ Error:', error);
console.warn('⚠️ Warning:', message);
```

### Check Points
1. **API Calls:** Check network tab, request/response
2. **State Updates:** Check Redux DevTools
3. **Component Re-renders:** Check React DevTools
4. **Map Markers:** Check Leaflet map instance, markers array
5. **Props Flow:** Check props từ parent → child

---

## 8. File Structure Reference

```
src/
├── app/
│   ├── components/
│   │   ├── map/
│   │   │   ├── layers/          # Map layer components
│   │   │   │   ├── DepartmentMarkersLayer.tsx
│   │   │   │   └── MerchantsLayer.tsx
│   │   │   ├── components/      # Sub-components
│   │   │   │   ├── DepartmentOfficersList.tsx
│   │   │   │   └── DepartmentOfficerItem.tsx
│   │   │   ├── LeafletMap.tsx
│   │   │   └── DepartmentDetailModal.tsx
│   │   └── auth/
│   │       └── ProtectedRoute.tsx
│   └── pages/
├── utils/
│   ├── api/
│   │   ├── axiosInstance.ts    # Axios với interceptors
│   │   ├── authApi.ts
│   │   └── departmentAreasApi.ts
│   └── storage/
└── store/
    ├── slices/
    └── sagas/
```

---

## 9. Quick Reference

### Key Functions
- `getUsersByDepartment(departmentId)` - Fetch users
- `getDepartmentsByWard(wardId)` - Fetch departments by ward
- `fetchDepartmentAreas(departmentId)` - Fetch department areas
- `transformDepartmentAreasToMapData()` - Transform API data

### Key Components
- `DepartmentDetailModal` - Modal hiển thị department info
- `DepartmentMarkersLayer` - Render department markers
- `DepartmentOfficersList` - Render list users
- `ProtectedRoute` - Route protection với auth check

### Key State
- `users: DepartmentUser[]` - Users của department chính
- `usersByDepartment: Map<string, DepartmentUser[]>` - Users theo department
- `departmentsByWard: Map<string, DepartmentByWard[]>` - Departments theo ward

---

## 10. Best Practices cho Project này

1. **Always check dependencies** trong `useEffect`
2. **Reset state** khi `departmentId` thay đổi
3. **Use separate refs** cho markers của các layers khác nhau
4. **Log với context** (departmentId, wardId, etc.)
5. **Handle loading và error states** cho tất cả API calls
6. **Tách components** khi logic phức tạp
7. **Use TypeScript interfaces** cho type safety
8. **Comment bằng tiếng Việt** cho business logic

