# Hướng dẫn Tạo Trang Mới Tương Tự - Step by Step

Hướng dẫn này sẽ giúp bạn tạo một trang mới tương tự như MapPage, với khả năng lấy dữ liệu và hiển thị department markers.

---

## 📋 Tổng quan các bước

1. Tạo Page Component mới
2. Tạo Route mới
3. Setup Redux state (nếu cần)
4. Tạo Map Component wrapper
5. Setup API calls
6. Setup Modal components
7. Test và verify

---

## Bước 1: Tạo Page Component Mới

### 1.1. Tạo file Page Component

**Location:** `src/pages/YourNewPage.tsx` (hoặc `src/app/pages/YourNewPage.tsx`)

**Cần làm:**
- Import React hooks cần thiết (useState, useEffect, useRef, etc.)
- Import LeafletMap component
- Import các modal components (DepartmentDetailModal, etc.)
- Tạo component function với props (nếu cần)
- Setup state cho:
  - Modal open/close
  - Selected department
  - Department data
  - Loading states
  - Error states

**Tham khảo:** `src/pages/MapPage.tsx` (dòng 1-150)

---

## Bước 2: Setup Map Component

### 2.1. Import LeafletMap

**Cần làm:**
- Import `LeafletMap` từ `../app/components/map/LeafletMap`
- Import các types cần thiết (Restaurant, etc.)

### 2.2. Setup Map Props

**Cần làm:**
- Tạo state cho `showWardBoundaries` (mặc định: true hoặc false tùy nhu cầu)
- Tạo state cho `showMerchants` (mặc định: false nếu chỉ hiển thị departments)
- Tạo state cho `selectedTeamId` (nếu cần filter theo team)
- Pass props vào LeafletMap:
  - `showWardBoundaries={showWardBoundaries}`
  - `showMerchants={showMerchants}`
  - `selectedTeamId={selectedTeamId}`
  - `restaurants={[]}` (empty nếu không cần merchants)

**Tham khảo:** `src/pages/MapPage.tsx` (dòng 270-290)

---

## Bước 3: Setup Department Detail Modal

### 3.1. Tạo State cho Modal

**Cần làm:**
- `isDepartmentModalOpen: boolean` - Modal mở/đóng
- `selectedDepartmentId: string | null` - ID của department được chọn
- `selectedDepartmentData: any | null` - Data từ marker click

### 3.2. Setup Global Function

**Cần làm:**
- Trong `useEffect`, setup function `window.openDepartmentDetail`
- Function này nhận 2 params:
  - `departmentId: string` - ID của department
  - `departmentData?: any` - Optional data từ marker
- Function sẽ:
  - Set `selectedDepartmentId = departmentId`
  - Set `selectedDepartmentData = departmentData`
  - Set `isDepartmentModalOpen = true`
- Cleanup: Delete function khi component unmount

**Tham khảo:** `src/pages/MapPage.tsx` (dòng 559-570)

### 3.3. Render Modal Component

**Cần làm:**
- Import `DepartmentDetailModal` component
- Render modal với props:
  - `isOpen={isDepartmentModalOpen}`
  - `onClose={() => setIsDepartmentModalOpen(false)}`
  - `departmentId={selectedDepartmentId || ''}`
  - `departmentData={selectedDepartmentData}`

**Tham khảo:** `src/pages/MapPage.tsx` (dòng 1180-1186)

---

## Bước 4: Setup Redux Store (nếu cần)

### 4.1. Check Redux Store

**Cần làm:**
- Kiểm tra xem có cần `divisionId` hoặc `teamId` từ Redux không
- Nếu cần, import `useAppSelector` từ `../app/hooks`
- Get data từ store:
  - `state.qlttScope.scope.divisionId`
  - `state.qlttScope.scope.teamId`
  - `state.officerFilter.selectedDepartmentId` (nếu có filter)

**Tham khảo:** `src/app/components/map/LeafletMap.tsx` (dòng 60-63)

### 4.2. Pass to LeafletMap

**Cần làm:**
- Nếu có `selectedTeamId` từ filter, pass vào LeafletMap
- LeafletMap sẽ tự động fetch data dựa trên:
  - Priority: `selectedTeamId` > `teamId` > `divisionId`

---

## Bước 5: Setup Layout và Styling

### 5.1. Tạo CSS Module (nếu cần)

**Location:** `src/pages/YourNewPage.module.css`

**Cần làm:**
- Tạo styles cho:
  - Container
  - Map wrapper
  - Header (nếu có)
  - Filters panel (nếu có)
  - Loading states
  - Error states

**Tham khảo:** `src/pages/MapPage.module.css`

### 5.2. Import và Apply Styles

**Cần làm:**
- Import CSS module: `import styles from './YourNewPage.module.css'`
- Apply classes vào JSX elements

---

## Bước 6: Setup Error Handling

### 6.1. Error States

**Cần làm:**
- Tạo state: `error: string | null`
- Handle errors từ:
  - API calls
  - Map initialization
  - Modal operations
- Display error messages cho user

### 6.2. Loading States

**Cần làm:**
- Tạo state: `isLoading: boolean`
- Show loading indicator khi:
  - Fetching data
  - Initializing map
  - Opening modal

---

## Bước 7: Setup Filter/Controls (nếu cần)

### 7.1. Team/Department Filter

**Cần làm:**
- Tạo state: `selectedTeamId: string | null`
- Tạo UI để select team/department
- Update state khi user chọn
- Pass `selectedTeamId` vào LeafletMap

### 7.2. Layer Toggle

**Cần làm:**
- Tạo buttons/toggles để switch giữa:
  - Department layer (`showWardBoundaries`)
  - Merchant layer (`showMerchants`)
- Update states khi user toggle

---

## Bước 8: Test và Verify

### 8.1. Checklist Test

**Cần verify:**
- [ ] Page load được không?
- [ ] Map hiển thị được không?
- [ ] Department markers hiển thị được không?
- [ ] Click marker có mở modal không?
- [ ] Modal fetch users đúng không?
- [ ] Filter/controls hoạt động không?
- [ ] Error handling có hoạt động không?
- [ ] Loading states có hiển thị không?

### 8.2. Debug Steps

**Nếu markers không hiển thị:**
1. Check console logs từ `useDepartmentAreas`
2. Check `departmentMapData` có data không
3. Check `showWardBoundaries` có true không
4. Check `showMerchants` có false không
5. Check map instance có được init không

**Nếu click không mở modal:**
1. Check `window.openDepartmentDetail` có được setup không
2. Check `selectedDepartmentId` có được set không
3. Check modal component có được render không
4. Check console logs từ click handler

---

## Bước 9: Tạo Route (nếu cần)

### 9.1. Add Route

**Location:** `src/routes/routes.tsx` hoặc router config file

**Cần làm:**
- Import page component
- Add route với path và component
- Setup protected route nếu cần authentication

**Tham khảo:** `src/routes/routes.tsx`

---

## 📝 Template Checklist

### Files cần tạo:

- [ ] `src/pages/YourNewPage.tsx` - Main page component
- [ ] `src/pages/YourNewPage.module.css` - Styles (optional)
- [ ] Route config update (nếu cần route mới)

### Dependencies cần import:

- [ ] React hooks (useState, useEffect, useRef)
- [ ] LeafletMap component
- [ ] DepartmentDetailModal component
- [ ] Redux hooks (useAppSelector, useAppDispatch) - nếu cần
- [ ] CSS module

### States cần tạo:

- [ ] `isDepartmentModalOpen: boolean`
- [ ] `selectedDepartmentId: string | null`
- [ ] `selectedDepartmentData: any | null`
- [ ] `showWardBoundaries: boolean`
- [ ] `showMerchants: boolean`
- [ ] `selectedTeamId: string | null` (nếu cần)
- [ ] `isLoading: boolean` (nếu cần)
- [ ] `error: string | null` (nếu cần)

### Functions cần setup:

- [ ] `window.openDepartmentDetail` function
- [ ] Modal close handler
- [ ] Filter handlers (nếu có)

### Components cần render:

- [ ] LeafletMap component
- [ ] DepartmentDetailModal component
- [ ] Loading indicator (nếu cần)
- [ ] Error message (nếu cần)
- [ ] Filters/Controls (nếu có)

---

## 🔄 Flow Summary

### Khi page load:

1. Component mount
2. Get divisionId/teamId từ Redux (nếu cần)
3. Setup `window.openDepartmentDetail` function
4. LeafletMap component mount
5. LeafletMap gọi `useDepartmentAreas` hook
6. Hook fetch data từ API
7. Data được transform
8. DepartmentMarkersLayer render markers
9. Markers hiển thị trên map

### Khi click marker:

1. User click marker
2. Click handler gọi `window.openDepartmentDetail(departmentId, data)`
3. Page component set states:
   - `selectedDepartmentId = departmentId`
   - `selectedDepartmentData = data`
   - `isDepartmentModalOpen = true`
4. DepartmentDetailModal mở
5. Modal fetch users theo `departmentId`
6. Users hiển thị trong modal

---

## 💡 Tips

1. **Start Simple:** Bắt đầu với page đơn giản, chỉ hiển thị map và markers
2. **Add Features Gradually:** Thêm filters, controls, modals từng bước
3. **Test Each Step:** Test sau mỗi bước để đảm bảo hoạt động
4. **Use Console Logs:** Log data ở mỗi bước để debug
5. **Reference Existing Code:** Tham khảo MapPage.tsx để hiểu pattern
6. **Check Dependencies:** Đảm bảo tất cả dependencies đã được import
7. **Verify Redux Store:** Check Redux store có data cần thiết không

---

## 🐛 Common Issues và Solutions

### Issue 1: Markers không hiển thị

**Check:**
- `showWardBoundaries` có true không?
- `showMerchants` có false không?
- `departmentMapData` có data không?
- Map instance có được init không?

**Solution:**
- Verify props truyền vào LeafletMap
- Check console logs từ useDepartmentAreas
- Check Redux store có divisionId/teamId không

### Issue 2: Click marker không mở modal

**Check:**
- `window.openDepartmentDetail` có được setup không?
- Function có được gọi không?
- States có được update không?

**Solution:**
- Verify useEffect setup function
- Check console logs từ click handler
- Verify modal component có được render không

### Issue 3: Modal không fetch users

**Check:**
- `departmentId` có được truyền đúng không?
- Modal có nhận `departmentId` từ props không?
- API call có được trigger không?

**Solution:**
- Check props truyền vào DepartmentDetailModal
- Check console logs từ modal
- Verify `getUsersByDepartment` được gọi

---

## 📚 Reference Files

### Main Files:
- `src/pages/MapPage.tsx` - Reference implementation
- `src/app/components/map/LeafletMap.tsx` - Map component
- `src/app/components/map/DepartmentDetailModal.tsx` - Modal component
- `src/app/components/map/layers/DepartmentMarkersLayer.tsx` - Markers layer

### Hooks:
- `src/app/components/map/hooks/useDepartmentAreas.ts` - Data fetching hook

### API:
- `src/utils/api/departmentAreasApi.ts` - API functions

### Utils:
- `src/app/components/map/utils/departmentAreasUtils.ts` - Transform functions

---

## ✅ Final Checklist

Trước khi hoàn thành, đảm bảo:

- [ ] Page component được tạo và import đúng
- [ ] LeafletMap được render với đúng props
- [ ] DepartmentDetailModal được setup
- [ ] `window.openDepartmentDetail` function được setup
- [ ] States được quản lý đúng
- [ ] Error handling có sẵn
- [ ] Loading states có sẵn
- [ ] Route được config (nếu cần)
- [ ] Styles được apply (nếu có)
- [ ] Test và verify hoạt động

---

Chúc bạn thành công! 🎉

