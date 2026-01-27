# Checklist Tạo Trang Mới - Quick Reference

Checklist ngắn gọn để tạo trang mới tương tự MapPage.

---

## ✅ Bước 1: Tạo File Page Component

**File:** `src/pages/YourNewPage.tsx`

**Làm:**
- [ ] Tạo file mới
- [ ] Import React và hooks cần thiết
- [ ] Import LeafletMap component
- [ ] Import DepartmentDetailModal component
- [ ] Tạo component function

---

## ✅ Bước 2: Setup States

**Trong component, tạo các states:**

- [ ] `const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)`
- [ ] `const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null)`
- [ ] `const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>(null)`
- [ ] `const [showWardBoundaries, setShowWardBoundaries] = useState(true)` (hoặc false)
- [ ] `const [showMerchants, setShowMerchants] = useState(false)`
- [ ] `const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)` (nếu cần filter)

---

## ✅ Bước 3: Setup Redux (nếu cần)

**Lấy data từ Redux store:**

- [ ] Import `useAppSelector` từ `../app/hooks`
- [ ] Get `divisionId` từ `state.qlttScope.scope.divisionId`
- [ ] Get `teamId` từ `state.qlttScope.scope.teamId`
- [ ] Get `selectedDepartmentId` từ `state.officerFilter.selectedDepartmentId` (nếu có filter)

---

## ✅ Bước 4: Setup window.openDepartmentDetail Function

**Trong useEffect:**

- [ ] Tạo useEffect với empty dependencies `[]`
- [ ] Setup function: `(window as any).openDepartmentDetail = (departmentId, departmentData) => { ... }`
- [ ] Trong function:
  - [ ] `setSelectedDepartmentId(departmentId)`
  - [ ] `setSelectedDepartmentData(departmentData)`
  - [ ] `setIsDepartmentModalOpen(true)`
- [ ] Cleanup: `delete (window as any).openDepartmentDetail` trong return

---

## ✅ Bước 5: Render LeafletMap Component

**Trong JSX return:**

- [ ] Import LeafletMap component
- [ ] Render `<LeafletMap ... />` với props:
  - [ ] `showWardBoundaries={showWardBoundaries}`
  - [ ] `showMerchants={showMerchants}`
  - [ ] `selectedTeamId={selectedTeamId}` (nếu có)
  - [ ] `restaurants={[]}` (empty array nếu không cần merchants)
  - [ ] Các props khác nếu cần (onPointClick, etc.)

---

## ✅ Bước 6: Render DepartmentDetailModal

**Trong JSX return:**

- [ ] Import DepartmentDetailModal component
- [ ] Render `<DepartmentDetailModal ... />` với props:
  - [ ] `isOpen={isDepartmentModalOpen}`
  - [ ] `onClose={() => setIsDepartmentModalOpen(false)}`
  - [ ] `departmentId={selectedDepartmentId || ''}`
  - [ ] `departmentData={selectedDepartmentData}`

---

## ✅ Bước 7: Test Basic Flow

**Verify:**

- [ ] Page load được
- [ ] Map hiển thị được
- [ ] Department markers hiển thị được (nếu có data)
- [ ] Click marker → Modal mở được
- [ ] Modal hiển thị thông tin department
- [ ] Modal fetch users được

---

## ✅ Bước 8: Add Filters/Controls (Optional)

**Nếu cần filter:**

- [ ] Tạo UI để select team/department
- [ ] Update `selectedTeamId` state khi user chọn
- [ ] Pass `selectedTeamId` vào LeafletMap

**Nếu cần toggle layers:**

- [ ] Tạo buttons để toggle `showWardBoundaries` và `showMerchants`
- [ ] Update states khi user click

---

## ✅ Bước 9: Add Styling (Optional)

**Nếu cần styles:**

- [ ] Tạo file `YourNewPage.module.css`
- [ ] Import: `import styles from './YourNewPage.module.css'`
- [ ] Apply classes vào JSX elements

---

## ✅ Bước 10: Add Route (nếu cần)

**Nếu cần route mới:**

- [ ] Mở file routes config (`src/routes/routes.tsx`)
- [ ] Import page component
- [ ] Add route với path và component
- [ ] Setup protected route nếu cần

---

## ✅ Bước 11: Final Testing

**Test tất cả:**

- [ ] Page load
- [ ] Map render
- [ ] Markers hiển thị
- [ ] Click marker → Modal mở
- [ ] Modal fetch users
- [ ] Filters hoạt động (nếu có)
- [ ] Error handling (nếu có)
- [ ] Loading states (nếu có)

---

## 📝 Quick Reference

### Import Statements cần có:

```typescript
import { useState, useEffect } from 'react';
import LeafletMap from '../app/components/map/LeafletMap';
import { DepartmentDetailModal } from '../app/components/map/DepartmentDetailModal';
import { useAppSelector } from '../app/hooks'; // Nếu cần Redux
```

### States Template:

```typescript
const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>(null);
const [showWardBoundaries, setShowWardBoundaries] = useState(true);
const [showMerchants, setShowMerchants] = useState(false);
```

### useEffect Template:

```typescript
useEffect(() => {
  (window as any).openDepartmentDetail = (departmentId: string, departmentData?: any) => {
    setSelectedDepartmentId(departmentId);
    setSelectedDepartmentData(departmentData);
    setIsDepartmentModalOpen(true);
  };
  
  return () => {
    delete (window as any).openDepartmentDetail;
  };
}, []);
```

### JSX Template:

```typescript
return (
  <div>
    {/* Map */}
    <LeafletMap
      showWardBoundaries={showWardBoundaries}
      showMerchants={showMerchants}
      selectedTeamId={selectedTeamId}
      restaurants={[]}
    />
    
    {/* Modal */}
    <DepartmentDetailModal
      isOpen={isDepartmentModalOpen}
      onClose={() => setIsDepartmentModalOpen(false)}
      departmentId={selectedDepartmentId || ''}
      departmentData={selectedDepartmentData}
    />
  </div>
);
```

---

## 🎯 Thứ tự thực hiện

1. **Bước 1-2:** Tạo file và setup states (5 phút)
2. **Bước 3:** Setup Redux nếu cần (2 phút)
3. **Bước 4:** Setup window function (3 phút)
4. **Bước 5-6:** Render components (5 phút)
5. **Bước 7:** Test basic flow (5 phút)
6. **Bước 8-10:** Add features tùy chọn (10-20 phút)
7. **Bước 11:** Final testing (5 phút)

**Tổng thời gian ước tính:** 30-45 phút

---

## 💡 Tips

- Bắt đầu với bước 1-7 để có page cơ bản hoạt động
- Test sau mỗi bước để đảm bảo không có lỗi
- Tham khảo `MapPage.tsx` khi gặp vấn đề
- Sử dụng console.log để debug
- Check browser console nếu có lỗi

---

Chúc bạn thành công! 🚀

