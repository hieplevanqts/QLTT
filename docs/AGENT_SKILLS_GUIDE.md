# Hướng dẫn viết Agent Skills cho AI Assistant

## Tổng quan

File này hướng dẫn cách viết documentation và skills để AI assistant có thể làm việc hiệu quả hơn với codebase của bạn.

## 1. Cấu trúc thư mục và Architecture

### Ví dụ:
```markdown
## Project Structure

- `src/app/components/map/` - Map components (LeafletMap, markers, layers)
- `src/utils/api/` - API functions (authApi, departmentAreasApi, etc.)
- `src/store/` - Redux store (slices, sagas)
- `src/app/components/auth/` - Authentication components

## Key Patterns

- **Map Layers**: Tách thành components riêng trong `layers/` folder
  - `DepartmentMarkersLayer.tsx` - Render department markers
  - `MerchantsLayer.tsx` - Render merchant markers
  
- **API Calls**: Sử dụng axios, có axiosInstance với interceptors
- **State Management**: Redux Toolkit với sagas
```

## 2. Coding Conventions

### Ví dụ:
```markdown
## Naming Conventions

- Components: PascalCase (`DepartmentDetailModal.tsx`)
- Functions: camelCase (`getUsersByDepartment`)
- Constants: UPPER_SNAKE_CASE (`SUPABASE_REST_URL`)
- Files: 
  - Components: `ComponentName.tsx`
  - Utils: `utilityName.ts`
  - Types: `types.ts` hoặc inline trong file

## Code Style

- Sử dụng TypeScript strict mode
- Prefer functional components với hooks
- Use `useCallback` và `useMemo` cho performance
- Comment bằng tiếng Việt cho business logic quan trọng
```

## 3. API Documentation

### Ví dụ:
```markdown
## API Functions

### `getUsersByDepartment(departmentId: string)`

Lấy danh sách users theo department_id.

**Parameters:**
- `departmentId`: ID của department (string)

**Returns:**
- `Promise<DepartmentUser[]>`: Array các users

**Usage:**
```typescript
const users = await getUsersByDepartment('dept_123');
```

**Errors:**
- Trả về empty array nếu không có users
- Log error nhưng không throw exception
```

## 4. Component Usage Guides

### Ví dụ:
```markdown
## DepartmentDetailModal

Modal hiển thị thông tin chi tiết của department.

**Props:**
- `isOpen: boolean` - Modal mở/đóng
- `onClose: () => void` - Callback khi đóng
- `departmentId: string` - ID của department
- `departmentData?: any` - Optional initial data từ map

**Behavior:**
- Khi `departmentId` thay đổi, tự động fetch lại users
- Fetch users theo `departmentId` khi modal mở
- Hiển thị loading state khi đang fetch

**Example:**
```typescript
<DepartmentDetailModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  departmentId="dept_123"
  departmentData={dataFromMap}
/>
```
```

## 5. Common Tasks và Workflows

### Ví dụ:
```markdown
## Common Tasks

### Thêm một layer mới cho map

1. Tạo component trong `src/app/components/map/layers/`
2. Component nhận props: `mapInstance`, `leafletRef`, `markersRef`
3. Sử dụng `useEffect` và `useCallback` để render markers
4. Return `null` (component không render JSX)
5. Import và sử dụng trong `LeafletMap.tsx`

### Fetch và hiển thị users

1. Sử dụng `getUsersByDepartment(departmentId)` từ `departmentAreasApi`
2. Lưu vào state `users: DepartmentUser[]`
3. Render bằng `DepartmentOfficersList` component
4. Handle loading và error states
```

## 6. Data Flow và State Management

### Ví dụ:
```markdown
## Data Flow

### Department Markers Flow

1. `useDepartmentAreas` hook fetch data từ API
2. `transformDepartmentAreasToMapData` transform data
3. `DepartmentMarkersLayer` nhận `departmentMapData`
4. Render markers với click handler
5. Click marker → `openDepartmentDetail(departmentId)`
6. `MapPage` set `selectedDepartmentId`
7. `DepartmentDetailModal` fetch users theo `departmentId`

### Authentication Flow

1. User login → `loginRequest` action
2. `authSaga` handle → call `loginApi`
3. Store token → `storeToken(token, expiresIn)`
4. `ProtectedRoute` check authentication
5. Redirect to login nếu không authenticated
```

## 7. Troubleshooting Guides

### Ví dụ:
```markdown
## Common Issues

### Markers không hiển thị

**Symptoms:** Markers không xuất hiện trên map

**Check:**
1. `mapInstance` và `leafletRef` có null không?
2. `departmentMapData` có data không?
3. Coordinates có valid không?
4. Console có errors không?

**Solution:**
- Check `updateMarkers` function có được gọi không
- Verify data structure từ API
- Check Leaflet map instance đã init chưa

### Users không load khi click marker

**Symptoms:** Click marker nhưng users không hiển thị

**Check:**
1. `departmentId` có được truyền đúng không?
2. `useEffect` có dependency `[isOpen, departmentId]` không?
3. API call có thành công không?

**Solution:**
- Check console logs
- Verify `departmentId` từ marker click
- Ensure `getUsersByDepartment` được gọi với đúng `departmentId`
```

## 8. Best Practices

### Ví dụ:
```markdown
## Best Practices

### Performance
- Sử dụng `React.memo` cho components lớn
- `useCallback` cho event handlers
- `useMemo` cho computed values
- Tách layers thành components riêng

### Error Handling
- Luôn có try-catch cho async operations
- Log errors với context (departmentId, userId, etc.)
- Không throw errors cho optional data (users, areas)

### Code Organization
- Tách logic phức tạp thành custom hooks
- Utils functions trong `utils/` folder
- Types/interfaces trong `types/` hoặc cùng file
- Components nhỏ, focused, reusable
```

## 9. Testing và Debugging

### Ví dụ:
```markdown
## Debugging Tips

### Console Logs
- Sử dụng emoji để dễ identify: 🔥, ✅, ❌, ⚠️
- Log với context: `console.log('🔄 Fetching users for:', departmentId)`
- Log data structure: `console.log('Data:', { departmentId, usersCount })`

### Common Debug Points
- API calls: Check request/response
- State updates: Check Redux DevTools
- Component re-renders: Check React DevTools
- Map markers: Check Leaflet map instance
```

## 10. Template cho Agent Skills

### Template cơ bản:
```markdown
# [Component/Feature Name]

## Mục đích
Mô tả ngắn gọn component/feature này làm gì.

## Cấu trúc
- File location: `src/path/to/file.tsx`
- Dependencies: List các dependencies quan trọng
- Related files: List các files liên quan

## Props/Parameters
- `prop1: type` - Description
- `prop2?: type` - Optional description

## Behavior
- Khi nào component render
- Khi nào data được fetch
- Khi nào state được update

## Usage Example
```typescript
// Code example
```

## Common Issues
- Issue 1: Solution
- Issue 2: Solution
```

## 11. Ví dụ thực tế cho project này

### Department Markers Layer
```markdown
# DepartmentMarkersLayer

## Mục đích
Render markers cho các departments trên map khi `showWardBoundaries = true`.

## Location
`src/app/components/map/layers/DepartmentMarkersLayer.tsx`

## Props
- `mapInstance: any` - Leaflet map instance
- `leafletRef: any` - Leaflet library reference
- `departmentMapData: DepartmentMapData | null` - Data từ API
- `isLoading: boolean` - Loading state
- `error: any` - Error state
- `markersRef: React.MutableRefObject<any[]>` - Ref để lưu markers
- `wardBoundariesLayerRef: React.MutableRefObject<any[]>` - Ref cho polygons

## Behavior
1. Component tự quản lý markers qua `useEffect` và `useCallback`
2. Group areas theo `wardId` để tránh duplicate markers
3. Mỗi marker có click handler gọi `openDepartmentDetail(departmentId)`
4. `departmentId` được lấy từ `wardData.departmentIds[0]`

## Key Logic
- Group areas by wardId: `wardMarkersMap`
- Render 1 marker per unique ward
- Click marker → pass `departmentId` to modal

## Dependencies
- `departmentAreasApi` - API functions
- `departmentAreasUtils` - Transform functions
- Leaflet library

## Common Issues
- Markers không hiển thị: Check `departmentMapData` có data không
- Click không mở modal: Check `openDepartmentDetail` function có được setup không
```

## Tips để viết tốt

1. **Be Specific**: Mô tả rõ ràng, không mơ hồ
2. **Include Examples**: Luôn có code examples
3. **Document Edge Cases**: Ghi rõ các trường hợp đặc biệt
4. **Keep Updated**: Cập nhật khi code thay đổi
5. **Use Structure**: Sử dụng format nhất quán
6. **Add Context**: Giải thích "why" không chỉ "what"
7. **Link Related**: Link đến các files/components liên quan

## Nơi lưu trữ

- Documentation: `docs/` folder
- Code comments: Inline trong code
- README: `README.md` cho từng module lớn
- Type definitions: Trong `types/` folder

