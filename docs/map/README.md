# Map Documentation

Thư mục này chứa tất cả các tài liệu hướng dẫn liên quan đến Map components và features.

---

## 📚 Danh sách tài liệu

### 🗺️ Flow và Architecture

#### [DEPARTMENT_MARKERS_FLOW.md](./DEPARTMENT_MARKERS_FLOW.md)
**Luồng lấy dữ liệu và hiển thị các điểm department**

- Chi tiết từng bước từ API call đến render markers
- Data flow diagram
- Key points và debugging checklist
- Reference cho developers

**Khi nào đọc:**
- Cần hiểu cách department markers hoạt động
- Debug issues với markers không hiển thị
- Onboard developer mới vào map features

---

### 🛠️ Hướng dẫn Tạo Trang Mới

#### [CREATE_NEW_PAGE_GUIDE.md](./CREATE_NEW_PAGE_GUIDE.md)
**Hướng dẫn chi tiết tạo trang mới tương tự MapPage**

- 9 bước chi tiết với giải thích
- Template checklist
- Common issues và solutions
- Reference files

**Khi nào đọc:**
- Cần tạo trang mới với map features
- Muốn hiểu cách setup map component
- Cần reference khi implement

#### [CREATE_NEW_PAGE_CHECKLIST.md](./CREATE_NEW_PAGE_CHECKLIST.md)
**Checklist ngắn gọn để tạo trang mới**

- 11 bước với checkbox
- Quick reference (imports, states, templates)
- Thứ tự thực hiện và thời gian ước tính

**Khi nào đọc:**
- Đang implement và cần checklist nhanh
- Muốn verify đã làm đủ các bước
- Cần quick reference

---

### 🐛 Debug và Troubleshooting

#### [DEBUG_NO_MARKERS.md](./DEBUG_NO_MARKERS.md)
**Debug khi markers không hiển thị**

- Checklist debug
- Common issues
- Solutions

**Khi nào đọc:**
- Markers không hiển thị trên map
- Cần debug map rendering issues

---

### 📊 Data Setup

#### [DEPARTMENT_AREAS_DATA_SETUP.md](./DEPARTMENT_AREAS_DATA_SETUP.md)
**Hướng dẫn setup dữ liệu department areas**

- Cấu trúc database
- Cách setup data
- API structure

**Khi nào đọc:**
- Cần setup data cho department areas
- Hiểu cấu trúc database
- Debug data issues

---

## 🎯 Quick Navigation

### Tôi muốn...

**...hiểu cách department markers hoạt động**
→ Đọc [DEPARTMENT_MARKERS_FLOW.md](./DEPARTMENT_MARKERS_FLOW.md)

**...tạo trang mới với map**
→ Đọc [CREATE_NEW_PAGE_GUIDE.md](./CREATE_NEW_PAGE_GUIDE.md) hoặc [CREATE_NEW_PAGE_CHECKLIST.md](./CREATE_NEW_PAGE_CHECKLIST.md)

**...debug markers không hiển thị**
→ Đọc [DEBUG_NO_MARKERS.md](./DEBUG_NO_MARKERS.md)

**...setup data cho department areas**
→ Đọc [DEPARTMENT_AREAS_DATA_SETUP.md](./DEPARTMENT_AREAS_DATA_SETUP.md)

---

## 📁 Related Documentation

### Trong `docs/` root:
- [AGENT_SKILLS_GUIDE.md](../AGENT_SKILLS_GUIDE.md) - Hướng dẫn viết agent skills
- [AGENT_SKILLS_EXAMPLE.md](../AGENT_SKILLS_EXAMPLE.md) - Ví dụ agent skills cho project

### Code References:
- `src/app/components/map/LeafletMap.tsx` - Main map component
- `src/app/components/map/layers/DepartmentMarkersLayer.tsx` - Department markers layer
- `src/app/components/map/DepartmentDetailModal.tsx` - Department detail modal
- `src/pages/MapPage.tsx` - Reference implementation

---

## 🔄 Cập nhật

Khi thêm tài liệu mới liên quan đến map, vui lòng:
1. Thêm file vào thư mục `docs/map/`
2. Cập nhật danh sách trong file README.md này
3. Thêm mô tả ngắn gọn và "Khi nào đọc"

---

Last updated: 2024

