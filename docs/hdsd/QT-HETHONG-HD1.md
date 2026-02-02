# HƯỚNG DẪN SUPER ADMIN — QUẢN TRỊ HỆ THỐNG (IAM)
Áp dụng cho MAPPA_CMS (Web Portal).  
Vai trò: **Super Admin** (toàn quyền cấu hình hệ thống).

---

## 1) Mục tiêu
Super Admin dùng phân hệ Quản trị hệ thống để:
- Khai báo/chuẩn hoá **phân hệ (Modules)**.
- Khai báo và quản lý **quyền (Permissions)**.
- Quản trị **menu** và gán quyền hiển thị menu.
- Gán quyền cho **vai trò (Roles)**.
- Kiểm tra **vai trò sẽ nhìn thấy menu nào** (Preview).
- Đảm bảo hệ thống phân quyền hoạt động đúng: thấy menu đúng, vào trang đúng, nút thao tác đúng.

---

## 2) Nguyên tắc vận hành (cần nhớ)
### 2.1 Menu chỉ gắn với quyền loại PAGE (truy cập trang)
- Muốn một menu hiển thị: menu phải gán **PAGE permission** tương ứng route.
- Quyền loại FEATURE (thêm/sửa/xoá/xuất…) **không gán vào menu**.

### 2.2 Vai trò quyết định người dùng có làm được gì
- Người dùng được gán **vai trò**.
- Vai trò được gán **quyền**.
- Người dùng có quyền → mới thấy menu/được vào trang/được thao tác.

---

## 3) Truy cập các màn hình quản trị IAM
Menu điều hướng:
**Quản trị hệ thống → IAM**
- **Phân hệ (Modules)**
- **Danh mục quyền (Permissions)**
- **Menu**
- **Phân quyền theo vai trò (Role Permissions)**

---

## 4) Quy trình cấu hình chuẩn (khuyến nghị)
> Thực hiện theo đúng thứ tự để tránh “có menu nhưng không vào được trang” hoặc “có quyền nhưng không thấy menu”.

### Bước 1 — Khai báo phân hệ (Modules)
Vào: **IAM → Phân hệ**

Mục tiêu:
- Tạo/điều chỉnh phân hệ cấp 1 (ví dụ: system-admin, reports, registry…)

Thao tác:
1) Bấm **Thêm phân hệ**
2) Nhập:
   - **Key**: mã phân hệ (kebab-case, ví dụ `reports`, `tv-wallboard`)
   - **Tên**
   - **Nhóm** (SYSTEM/OPS/DMS/IAM)
   - **Source** (nếu có): đường dẫn code (ví dụ `src/modules/reports`)
   - **Trạng thái**: Hoạt động
3) Lưu

Gợi ý:
- Nếu phân hệ chưa có quyền, cột thống kê sẽ hiện `PAGE 0 / FEATURE 0 / TOTAL 0` và nhãn “Chưa khai báo quyền”.

---

### Bước 2 — Khai báo quyền (Permissions)
Vào: **IAM → Danh mục quyền**

Mục tiêu:
- Tạo các quyền PAGE để truy cập trang.
- Tạo các quyền FEATURE để thao tác (CRUD/EXPORT/ASSIGN…)

Khuyến nghị tối thiểu:
- Mỗi phân hệ cần ít nhất 1 quyền **landing**: `<module>.page.read`
- Mỗi trang con cần: `<module>.page.<routeKey>.read`

Ví dụ:
- `reports.page.read`
- `system-admin.page.iam.users.read`
- `system-admin.masterdata.catalog.create` (FEATURE)

Lưu ý:
- PAGE luôn READ.
- FEATURE tuỳ hành động: CREATE/UPDATE/DELETE/EXPORT…

---

### Bước 3 — Khai báo Menu
Vào: **IAM → Menu**

Mục tiêu:
- Xây cây menu điều hướng.
- Mỗi menu có route/path rõ ràng.

Thao tác:
1) Bên trái: cây menu
2) Bấm **Thêm menu** (hoặc click phải menu để thêm con/sửa/xoá)
3) Nhập:
   - **Tên hiển thị**
   - **Route/path** (ví dụ `/reports`, `/system-admin/iam/users`)
   - **Phân hệ** (bắt buộc)
   - **Icon** (tuỳ chọn)
4) Lưu

---

### Bước 4 — Gán quyền hiển thị cho Menu (menu_permissions)
Ngay tại màn Menu, chọn tab: **Quyền hiển thị**

Mục tiêu:
- Mỗi menu gắn với **1 quyền PAGE/READ** tương ứng route.

Thao tác nhanh (khuyến nghị):
1) Chọn menu ở cây bên trái
2) Tab **Quyền hiển thị**
3) Bấm **Tự gán quyền theo route** (hoặc “Gợi ý theo route” tuỳ phiên bản)
4) Hệ thống sẽ:
   - tìm PAGE permission tương ứng route
   - gán vào menu
5) Kết quả:
   - menu chuyển trạng thái **“Đã gán quyền”** (badge màu xanh)

Nếu báo “Chưa chọn phân hệ”:
- Quay lại tab **Thông tin**, chọn **Phân hệ**, lưu lại rồi gán quyền.

Nếu báo “Chưa có permission PAGE cho route”:
- Quay lại màn Permissions để tạo PAGE permission cho route đó, sau đó quay lại menu và gán.

---

### Bước 5 — Gán quyền cho Vai trò (role_permissions)
Vào: **IAM → Phân quyền theo vai trò**

Mục tiêu:
- Vai trò có quyền nào thì user thuộc vai trò đó sẽ có quyền đó.

Thao tác:
1) Chọn **Vai trò** (bên trái)
2) Chọn **Phân hệ** và tab:
   - **PAGE**: quyền truy cập trang (READ)
   - **FEATURE**: quyền thao tác (CREATE/UPDATE/DELETE/EXPORT…)
3) Tích chọn các quyền cần cấp
4) Bấm **Lưu thay đổi**

Gợi ý:
- Để user nhìn thấy menu, vai trò phải có PAGE permission tương ứng.
- Để user thao tác được nút (thêm/sửa/xoá), vai trò phải có FEATURE permission.

---

### Bước 6 — Kiểm tra “Vai trò thấy menu nào”
Trong màn Menu, tab: **Xem menu theo vai trò**

Mục tiêu:
- Mô phỏng menu mà vai trò được nhìn thấy.
- Phát hiện menu chưa gán quyền hoặc role thiếu quyền.

Thao tác:
1) Chọn vai trò cần preview
2) Hệ thống hiển thị:
   - ✅ Thấy (tag xanh)
   - ❌ Ẩn (tag đỏ)
   - ⚠️ Chưa gán quyền menu (tag cam) → mặc định **ẩn**
3) Click vào menu bị ẩn để thực hiện nhanh:
   - gán quyền cho menu
   - hoặc gán quyền cho vai trò

---

## 5) Checklist vận hành nhanh (Super Admin)
- [ ] Menu đã chọn **Phân hệ** (module) chưa?
- [ ] Menu đã gán **PAGE permission** đúng route chưa?
- [ ] Vai trò đã có **PAGE permission** tương ứng chưa?
- [ ] Vai trò đã có **FEATURE permissions** để thao tác chưa?
- [ ] Tab “Xem menu theo vai trò” đã preview thấy đúng chưa?

---

## 6) Các lỗi thường gặp & cách xử lý
### 6.1 Menu “Chưa gán quyền”
Nguyên nhân:
- menu_permissions chưa có mapping
Cách xử lý:
- Menu → tab Quyền hiển thị → “Tự gán quyền theo route”

### 6.2 Không gợi ý được quyền theo route
Nguyên nhân:
- chưa chọn phân hệ cho menu
- permission PAGE chưa tồn tại
Cách xử lý:
- chọn phân hệ → lưu
- tạo PAGE permission tương ứng route → quay lại gán

### 6.3 Vai trò đã có FEATURE nhưng vẫn không thấy menu
Nguyên nhân:
- thiếu PAGE permission
Cách xử lý:
- gán PAGE permission cho role trong tab PAGE

### 6.4 Menu thấy nhưng bấm vào lỗi/không có trang
Nguyên nhân:
- route chưa được triển khai (chưa có page thật)
Cách xử lý:
- tạm tắt menu (is_active=false) hoặc chưa gán quyền, chỉ bật khi page sẵn sàng

---

## 7) Mô hình “chuẩn” nên nhớ (tóm tắt)
- **Modules**: phân hệ cấp 1
- **Permissions**:
  - PAGE = vào trang (READ)
  - FEATURE = thao tác (CREATE/UPDATE/DELETE/EXPORT/…)
- **Menu**:
  - gắn module
  - gắn PAGE permission theo route
- **Roles**:
  - gán PAGE để thấy menu
  - gán FEATURE để thao tác
- **Preview**:
  - xem vai trò thấy menu gì, phát hiện thiếu cấu hình

---
